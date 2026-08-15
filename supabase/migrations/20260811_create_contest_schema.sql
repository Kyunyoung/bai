-- ==============================================================================
-- Contest Submissions & Voters Database Schema & Security Migration
-- Target Platform: Supabase PostgreSQL
-- Date: 2026-08-15
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Schemas
CREATE SCHEMA IF NOT EXISTS private;

-- Revoke default public permissions on private schema
REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON SCHEMA private FROM anon;
REVOKE ALL ON SCHEMA private FROM authenticated;

-- 3. Public Tables

-- Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_id TEXT UNIQUE NULL,
    name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 100),
    dept TEXT NOT NULL CHECK (char_length(trim(dept)) > 0 AND char_length(dept) <= 100),
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 200),
    description TEXT NOT NULL CHECK (char_length(trim(description)) > 0 AND char_length(description) <= 4000),
    project_url TEXT NULL CHECK (project_url IS NULL OR project_url ~* '^https?://'),
    video_url TEXT NULL CHECK (video_url IS NULL OR video_url ~* '^https?://'),
    image_url TEXT NULL CHECK (image_url IS NULL OR image_url ~* '^https?://' OR image_url ~* '^slides_media/'),
    status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden')),
    votes INTEGER NOT NULL DEFAULT 0 CHECK (votes >= 0),
    ratings JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_status_deleted 
    ON public.submissions (status, deleted_at, created_at DESC);

-- Public Voters Table
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

CREATE INDEX IF NOT EXISTS idx_voters_name_birth ON public.voters (name, birthdate);
CREATE INDEX IF NOT EXISTS idx_voters_voted_sub ON public.voters (voted_submission_id);

-- Private Secrets Table for Passcode Hashes
CREATE TABLE IF NOT EXISTS private.submission_secrets (
    submission_id UUID PRIMARY KEY REFERENCES public.submissions(id) ON DELETE CASCADE,
    passcode_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Helper Function: Check Admin Status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE user_id = auth.uid()
    );
$$;

-- 5. Row Level Security (RLS) Policies

-- Submissions RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public submissions are viewable by everyone" ON public.submissions;
CREATE POLICY "Public submissions are viewable by everyone"
    ON public.submissions
    FOR SELECT
    USING (status = 'visible' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Admins have full access to submissions" ON public.submissions;
CREATE POLICY "Admins have full access to submissions"
    ON public.submissions
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Voters RLS
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct public access to voters" ON public.voters;
CREATE POLICY "No direct public access to voters"
    ON public.voters
    FOR ALL
    TO anon, authenticated
    USING (public.is_admin());

-- 6. SECURITY DEFINER RPC Functions

-- RPC 1: Create Submission
CREATE OR REPLACE FUNCTION public.create_submission(
    p_name TEXT,
    p_dept TEXT,
    p_title TEXT,
    p_description TEXT,
    p_project_url TEXT,
    p_video_url TEXT,
    p_image_url TEXT,
    p_passcode TEXT
)
RETURNS SETOF public.submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
    v_new_sub public.submissions;
    v_clean_pass TEXT;
BEGIN
    v_clean_pass := trim(coalesce(p_passcode, ''));
    IF char_length(v_clean_pass) < 4 OR char_length(v_clean_pass) > 30 THEN
        RAISE EXCEPTION 'INVALID_PASSCODE: 비밀번호는 4자 이상 30자 이하이어야 합니다.'
            USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.submissions (
        name, dept, title, description, project_url, video_url, image_url, status
    ) VALUES (
        trim(p_name), trim(p_dept), trim(p_title), trim(p_description),
        nullif(trim(p_project_url), ''), nullif(trim(p_video_url), ''), nullif(trim(p_image_url), ''),
        'visible'
    )
    RETURNING * INTO v_new_sub;

    INSERT INTO private.submission_secrets (submission_id, passcode_hash)
    VALUES (v_new_sub.id, crypt(v_clean_pass, gen_salt('bf', 10)));

    RETURN NEXT v_new_sub;
END;
$$;

-- RPC 2: Update Submission With Passcode Verification
CREATE OR REPLACE FUNCTION public.update_submission_with_passcode(
    p_submission_id UUID,
    p_passcode TEXT,
    p_name TEXT,
    p_dept TEXT,
    p_title TEXT,
    p_description TEXT,
    p_project_url TEXT DEFAULT NULL,
    p_video_url TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL
)
RETURNS SETOF public.submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
    v_hash TEXT;
    v_updated_sub public.submissions;
BEGIN
    SELECT passcode_hash INTO v_hash
    FROM private.submission_secrets
    WHERE submission_id = p_submission_id;

    IF v_hash IS NULL OR v_hash <> crypt(trim(coalesce(p_passcode, '')), v_hash) THEN
        RAISE EXCEPTION 'AUTH_FAILED: 본인 확인 비밀번호가 일치하지 않습니다.'
            USING ERRCODE = '28000';
    END IF;

    UPDATE public.submissions
    SET name = trim(p_name),
        dept = trim(p_dept),
        title = trim(p_title),
        description = trim(p_description),
        project_url = nullif(trim(p_project_url), ''),
        video_url = CASE WHEN p_video_url IS NULL THEN video_url ELSE nullif(trim(p_video_url), '') END,
        image_url = CASE WHEN p_image_url IS NULL THEN image_url ELSE nullif(trim(p_image_url), '') END,
        updated_at = now()
    WHERE id = p_submission_id AND deleted_at IS NULL
    RETURNING * INTO v_updated_sub;

    IF v_updated_sub.id IS NULL THEN
        RAISE EXCEPTION 'NOT_FOUND: 작품을 찾을 수 없거나 삭제되었습니다.'
            USING ERRCODE = 'P0002';
    END IF;

    RETURN NEXT v_updated_sub;
END;
$$;

-- RPC 3: Delete Submission With Passcode Verification
CREATE OR REPLACE FUNCTION public.delete_submission_with_passcode(
    p_submission_id UUID,
    p_passcode TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
    v_hash TEXT;
BEGIN
    SELECT passcode_hash INTO v_hash
    FROM private.submission_secrets
    WHERE submission_id = p_submission_id;

    IF v_hash IS NULL OR v_hash <> crypt(trim(coalesce(p_passcode, '')), v_hash) THEN
        RAISE EXCEPTION 'AUTH_FAILED: 본인 확인 비밀번호가 일치하지 않습니다.'
            USING ERRCODE = '28000';
    END IF;

    UPDATE public.submissions
    SET deleted_at = now()
    WHERE id = p_submission_id AND deleted_at IS NULL;

    RETURN TRUE;
END;
$$;

-- RPC 4: Admin Update Submission Status
CREATE OR REPLACE FUNCTION public.admin_update_submission_status(
    p_submission_id UUID,
    p_status TEXT
)
RETURNS SETOF public.submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_sub public.submissions;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'FORBIDDEN: 관리자 권한이 필요합니다.'
            USING ERRCODE = '42501';
    END IF;

    IF p_status NOT IN ('visible', 'hidden') THEN
        RAISE EXCEPTION 'INVALID_STATUS: status는 visible 또는 hidden 이어야 합니다.'
            USING ERRCODE = '22023';
    END IF;

    UPDATE public.submissions
    SET status = p_status
    WHERE id = p_submission_id AND deleted_at IS NULL
    RETURNING * INTO v_sub;

    RETURN NEXT v_sub;
END;
$$;

-- RPC 5: Admin Delete Submission
CREATE OR REPLACE FUNCTION public.admin_delete_submission(
    p_submission_id UUID
)
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

    UPDATE public.submissions
    SET deleted_at = now()
    WHERE id = p_submission_id AND deleted_at IS NULL;

    RETURN TRUE;
END;
$$;

-- RPC 6: Increment Vote Count
CREATE OR REPLACE FUNCTION public.increment_submission_vote(p_submission_id UUID)
RETURNS SETOF public.submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_sub public.submissions;
BEGIN
    UPDATE public.submissions
    SET votes = votes + 1,
        updated_at = NOW()
    WHERE id = p_submission_id AND deleted_at IS NULL
    RETURNING * INTO v_sub;

    IF v_sub.id IS NULL THEN
        RAISE EXCEPTION 'NOT_FOUND: 작품을 찾을 수 없거나 삭제되었습니다.'
            USING ERRCODE = 'P0002';
    END IF;

    RETURN NEXT v_sub;
END;
$$;

-- RPC 7: Decrement Vote Count
CREATE OR REPLACE FUNCTION public.decrement_submission_vote(p_submission_id UUID)
RETURNS SETOF public.submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_sub public.submissions;
BEGIN
    UPDATE public.submissions
    SET votes = GREATEST(0, votes - 1),
        updated_at = NOW()
    WHERE id = p_submission_id AND deleted_at IS NULL
    RETURNING * INTO v_sub;

    IF v_sub.id IS NULL THEN
        RAISE EXCEPTION 'NOT_FOUND: 작품을 찾을 수 없거나 삭제되었습니다.'
            USING ERRCODE = 'P0002';
    END IF;

    RETURN NEXT v_sub;
END;
$$;

-- RPC 8: Verify Voter Credentials (SECURITY DEFINER)
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

-- RPC 9: Atomic Cast Voter Vote Transaction (SECURITY DEFINER)
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
    IF v_old_sub_id IS NOT NULL THEN
        UPDATE public.submissions
        SET votes = GREATEST(0, votes - 1),
            updated_at = NOW()
        WHERE id = v_old_sub_id AND deleted_at IS NULL;
    END IF;

    UPDATE public.submissions
    SET votes = votes + 1,
        updated_at = NOW()
    WHERE id = p_submission_id AND deleted_at IS NULL
    RETURNING * INTO v_new_sub;

    IF v_new_sub.id IS NULL THEN
        RAISE EXCEPTION 'SUBMISSION_NOT_FOUND: 투표할 작품을 찾을 수 없거나 삭제되었습니다.'
            USING ERRCODE = 'P0002';
    END IF;

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

-- RPC 10: Admin Batch Upsert Voters (SECURITY DEFINER - Admin Only)
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

-- RPC 11: Admin Fetch All Voters (SECURITY DEFINER - Admin Only)
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

-- RPC 12: Admin Clear All Voters (SECURITY DEFINER - Admin Only)
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

-- 7. Grant EXECUTE permissions on RPC functions
GRANT EXECUTE ON FUNCTION public.create_submission TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_submission_with_passcode TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_submission_with_passcode TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_submission_vote TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_submission_vote TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_voter TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cast_voter_vote TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_upsert_voters TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_fetch_voters TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_clear_voters TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_submission_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_submission TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- 8. Enable Supabase Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
  END IF;
END $$;

-- 9. Create Storage Bucket 'submission-media' and RLS Policies (Idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submission-media',
  'submission-media',
  true,
  104857600, -- 100MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public Access for submission-media bucket'
  ) THEN
    CREATE POLICY "Public Access for submission-media bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'submission-media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public upload to submission-media bucket'
  ) THEN
    CREATE POLICY "Allow public upload to submission-media bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'submission-media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow admin delete from submission-media bucket'
  ) THEN
    CREATE POLICY "Allow admin delete from submission-media bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'submission-media');
  END IF;
END $$;
