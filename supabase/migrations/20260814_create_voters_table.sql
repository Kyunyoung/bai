-- =================================================================
-- Migration: Create public.voters Table and Security DEFINER RPCs
-- Date: 2026-08-14
-- Project: Bai VibeCoding Contest
-- =================================================================

-- 1. Create public.voters Table
CREATE TABLE IF NOT EXISTS public.voters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    dept TEXT NOT NULL,
    birthdate TEXT NOT NULL,
    voted_submission_id UUID NULL REFERENCES public.submissions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT voters_unique_identity UNIQUE (name, dept, birthdate)
);

-- Index for fast lookup and verify_voter RPC
CREATE INDEX IF NOT EXISTS idx_voters_name_birth ON public.voters (name, birthdate);
CREATE INDEX IF NOT EXISTS idx_voters_voted_sub ON public.voters (voted_submission_id);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;

-- Deny all direct SELECT/INSERT/UPDATE/DELETE to public/anon (protect birthdate & voter personal info)
-- All operations are safely proxied through SECURITY DEFINER functions.

DROP POLICY IF EXISTS "No direct public access to voters" ON public.voters;
CREATE POLICY "No direct public access to voters"
    ON public.voters
    FOR ALL
    TO anon, authenticated
    USING (public.is_admin());

-- 3. RPC 1: Verify Voter Login Credentials (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.verify_voter(
    p_name TEXT,
    p_birthdate TEXT,
    p_dept TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    dept TEXT,
    birthdate TEXT,
    voted_submission_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_clean_name TEXT;
    v_clean_birth TEXT;
    v_clean_dept TEXT;
BEGIN
    v_clean_name := trim(coalesce(p_name, ''));
    v_clean_birth := regexp_replace(trim(coalesce(p_birthdate, '')), '[^0-9]', '', 'g');
    v_clean_dept := trim(coalesce(p_dept, ''));

    IF v_clean_name = '' OR v_clean_birth = '' THEN
        RAISE EXCEPTION 'INVALID_INPUT: 성명과 생년월일을 입력해주세요.'
            USING ERRCODE = '22023';
    END IF;

    IF v_clean_dept <> '' THEN
        RETURN QUERY
        SELECT v.id, v.name, v.dept, v.birthdate, v.voted_submission_id
        FROM public.voters v
        WHERE v.name = v_clean_name
          AND regexp_replace(v.birthdate, '[^0-9]', '', 'g') = v_clean_birth
          AND v.dept = v_clean_dept;
    ELSE
        RETURN QUERY
        SELECT v.id, v.name, v.dept, v.birthdate, v.voted_submission_id
        FROM public.voters v
        WHERE v.name = v_clean_name
          AND (
            regexp_replace(v.birthdate, '[^0-9]', '', 'g') = v_clean_birth
            OR (length(v_clean_birth) >= 6 AND right(regexp_replace(v.birthdate, '[^0-9]', '', 'g'), 6) = right(v_clean_birth, 6))
          );
    END IF;
END;
$$;

-- 4. RPC 2: Atomic Cast Vote Transaction (SECURITY DEFINER)
-- Atomically updates voter's voted_submission_id and increments/decrements submissions.votes in a single transaction
CREATE OR REPLACE FUNCTION public.cast_voter_vote(
    p_voter_id UUID,
    p_submission_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_voter public.voters;
    v_old_sub_id UUID;
    v_new_sub public.submissions;
    v_old_sub public.submissions;
BEGIN
    -- Lock voter row for update
    SELECT * INTO v_voter
    FROM public.voters
    WHERE id = p_voter_id
    FOR UPDATE;

    IF v_voter.id IS NULL THEN
        RAISE EXCEPTION 'VOTER_NOT_FOUND: 등록되지 않은 투표자입니다.'
            USING ERRCODE = 'P0002';
    END IF;

    v_old_sub_id := v_voter.voted_submission_id;

    -- Case 1: Clicking the same submission (Cancel Vote)
    IF p_submission_id IS NULL OR v_old_sub_id = p_submission_id THEN
        IF v_old_sub_id IS NOT NULL THEN
            UPDATE public.submissions
            SET votes = GREATEST(0, votes - 1),
                updated_at = NOW()
            WHERE id = v_old_sub_id AND deleted_at IS NULL
            RETURNING * INTO v_old_sub;
        END IF;

        UPDATE public.voters
        SET voted_submission_id = NULL,
            updated_at = NOW()
        WHERE id = p_voter_id
        RETURNING * INTO v_voter;

        RETURN jsonb_build_object(
            'action', 'cancel',
            'voter_id', v_voter.id,
            'voted_submission_id', NULL,
            'submission_votes', COALESCE(v_old_sub.votes, 0)
        );
    END IF;

    -- Case 2: Changing vote or new vote
    -- Decrement previous voted submission if exists
    IF v_old_sub_id IS NOT NULL THEN
        UPDATE public.submissions
        SET votes = GREATEST(0, votes - 1),
            updated_at = NOW()
        WHERE id = v_old_sub_id AND deleted_at IS NULL;
    END IF;

    -- Increment new voted submission
    UPDATE public.submissions
    SET votes = votes + 1,
        updated_at = NOW()
    WHERE id = p_submission_id AND deleted_at IS NULL
    RETURNING * INTO v_new_sub;

    IF v_new_sub.id IS NULL THEN
        RAISE EXCEPTION 'SUBMISSION_NOT_FOUND: 투표할 작품을 찾을 수 없거나 삭제되었습니다.'
            USING ERRCODE = 'P0002';
    END IF;

    -- Update voter's record
    UPDATE public.voters
    SET voted_submission_id = p_submission_id,
        updated_at = NOW()
    WHERE id = p_voter_id
    RETURNING * INTO v_voter;

    RETURN jsonb_build_object(
        'action', 'vote',
        'voter_id', v_voter.id,
        'voted_submission_id', v_voter.voted_submission_id,
        'submission_votes', v_new_sub.votes
    );
END;
$$;

-- 5. RPC 3: Admin Batch Upsert Voters (SECURITY DEFINER - Admin Only)
CREATE OR REPLACE FUNCTION public.admin_upsert_voters(
    p_voters JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_item JSONB;
    v_inserted INT := 0;
    v_updated INT := 0;
    v_name TEXT;
    v_dept TEXT;
    v_birth TEXT;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'FORBIDDEN: 관리자 권한이 필요합니다.'
            USING ERRCODE = '42501';
    END IF;

    IF p_voters IS NULL OR jsonb_array_length(p_voters) = 0 THEN
        RETURN jsonb_build_object('inserted', 0, 'total', 0);
    END IF;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_voters)
    LOOP
        v_name := trim(coalesce(v_item->>'name', ''));
        v_dept := trim(coalesce(v_item->>'dept', '소속미지정'));
        v_birth := regexp_replace(trim(coalesce(v_item->>'birthdate', '')), '[^0-9]', '', 'g');

        IF v_name <> '' THEN
            INSERT INTO public.voters (name, dept, birthdate)
            VALUES (v_name, v_dept, coalesce(nullif(v_birth, ''), '19900101'))
            ON CONFLICT (name, dept, birthdate) 
            DO UPDATE SET updated_at = NOW();

            v_inserted := v_inserted + 1;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'inserted', v_inserted,
        'total', jsonb_array_length(p_voters)
    );
END;
$$;

-- 6. RPC 4: Admin Fetch All Voters (SECURITY DEFINER - Admin Only)
CREATE OR REPLACE FUNCTION public.admin_fetch_voters(
    p_search TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    dept TEXT,
    birthdate TEXT,
    voted_submission_id UUID,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'FORBIDDEN: 관리자 권한이 필요합니다.'
            USING ERRCODE = '42501';
    END IF;

    IF p_search IS NOT NULL AND trim(p_search) <> '' THEN
        RETURN QUERY
        SELECT v.id, v.name, v.dept, v.birthdate, v.voted_submission_id, v.created_at
        FROM public.voters v
        WHERE v.name ILIKE '%' || trim(p_search) || '%'
           OR v.dept ILIKE '%' || trim(p_search) || '%'
        ORDER BY v.created_at DESC;
    ELSE
        RETURN QUERY
        SELECT v.id, v.name, v.dept, v.birthdate, v.voted_submission_id, v.created_at
        FROM public.voters v
        ORDER BY v.created_at DESC;
    END IF;
END;
$$;

-- 7. RPC 5: Admin Clear All Voters (SECURITY DEFINER - Admin Only)
CREATE OR REPLACE FUNCTION public.admin_clear_voters()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'FORBIDDEN: 관리자 권한이 필요합니다.'
            USING ERRCODE = '42501';
    END IF;

    DELETE FROM public.voters;
    RETURN TRUE;
END;
$$;

-- 8. Grant Permissions
GRANT EXECUTE ON FUNCTION public.verify_voter TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cast_voter_vote TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_voters TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_fetch_voters TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_clear_voters TO authenticated;
