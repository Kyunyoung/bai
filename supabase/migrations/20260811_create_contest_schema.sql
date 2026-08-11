-- ==============================================================================
-- Contest Submissions Database Schema & Security Migration
-- Target Platform: Supabase PostgreSQL
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

-- 4. Helper & Security Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins
        WHERE user_id = auth.uid()
    );
$$;

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_submissions_updated_at ON public.submissions;
CREATE TRIGGER trg_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- 5. Row Level Security (RLS)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Submissions Select Policy: Anyone can view visible, non-deleted submissions; admins can view all.
DROP POLICY IF EXISTS "Public view visible non-deleted submissions" ON public.submissions;
CREATE POLICY "Public view visible non-deleted submissions"
    ON public.submissions
    FOR SELECT
    USING (
        (status = 'visible' AND deleted_at IS NULL)
        OR public.is_admin()
    );

-- Admins Policy: Users can check if they are registered as admin
DROP POLICY IF EXISTS "Admins check self record" ON public.admins;
CREATE POLICY "Admins check self record"
    ON public.admins
    FOR SELECT
    USING (user_id = auth.uid());

-- 6. RPC Functions (SECURITY DEFINER)

-- RPC 1: Create Submission
CREATE OR REPLACE FUNCTION public.create_submission(
    p_name TEXT,
    p_dept TEXT,
    p_title TEXT,
    p_description TEXT,
    p_project_url TEXT DEFAULT NULL,
    p_video_url TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_passcode TEXT DEFAULT NULL,
    p_legacy_id TEXT DEFAULT NULL
)
RETURNS SETOF public.submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions, pg_temp
AS $$
DECLARE
    v_sub public.submissions;
    v_clean_passcode TEXT;
    v_clean_project_url TEXT;
    v_clean_video_url TEXT;
    v_clean_image_url TEXT;
BEGIN
    -- Validate Passcode
    v_clean_passcode := trim(coalesce(p_passcode, ''));
    IF char_length(v_clean_passcode) < 4 THEN
        RAISE EXCEPTION 'INVALID_PASSCODE_LENGTH: 비밀번호는 최소 4자리 이상이어야 합니다.'
            USING ERRCODE = '22023';
    END IF;

    -- Validate Protocol for URLs
    v_clean_project_url := trim(coalesce(p_project_url, ''));
    IF v_clean_project_url = '' OR v_clean_project_url = '#' THEN
        v_clean_project_url := NULL;
    ELSIF NOT (v_clean_project_url ~* '^https?://') THEN
        RAISE EXCEPTION 'INVALID_URL_PROTOCOL: project_url은 http:// 또는 https:// 이어야 합니다.'
            USING ERRCODE = '22023';
    END IF;

    v_clean_video_url := trim(coalesce(p_video_url, ''));
    IF v_clean_video_url = '' THEN
        v_clean_video_url := NULL;
    ELSIF NOT (v_clean_video_url ~* '^https?://') THEN
        RAISE EXCEPTION 'INVALID_URL_PROTOCOL: video_url은 http:// 또는 https:// 이어야 합니다.'
            USING ERRCODE = '22023';
    END IF;

    v_clean_image_url := trim(coalesce(p_image_url, ''));
    IF v_clean_image_url = '' THEN
        v_clean_image_url := NULL;
    ELSIF NOT (v_clean_image_url ~* '^https?://' OR v_clean_image_url ~* '^slides_media/') THEN
        RAISE EXCEPTION 'INVALID_URL_PROTOCOL: image_url 형식이 올바르지 않습니다.'
            USING ERRCODE = '22023';
    END IF;

    -- Insert into public.submissions
    INSERT INTO public.submissions (
        legacy_id, name, dept, title, description, project_url, video_url, image_url
    ) VALUES (
        p_legacy_id, trim(p_name), trim(p_dept), trim(p_title), trim(p_description),
        v_clean_project_url, v_clean_video_url, v_clean_image_url
    ) RETURNING * INTO v_sub;

    -- Store passcode hash securely in private table
    INSERT INTO private.submission_secrets (submission_id, passcode_hash)
    VALUES (v_sub.id, crypt(v_clean_passcode, gen_salt('bf')));

    RETURN NEXT v_sub;
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
    v_sub public.submissions;
    v_clean_passcode TEXT;
    v_clean_project_url TEXT;
    v_clean_video_url TEXT;
    v_clean_image_url TEXT;
BEGIN
    v_clean_passcode := trim(coalesce(p_passcode, ''));

    -- Fetch passcode hash
    SELECT passcode_hash INTO v_hash
    FROM private.submission_secrets
    WHERE submission_id = p_submission_id;

    IF v_hash IS NULL OR v_hash <> crypt(v_clean_passcode, v_hash) THEN
        RAISE EXCEPTION 'AUTH_FAILED: 본인 확인 비밀번호가 일치하지 않습니다.'
            USING ERRCODE = '28000';
    END IF;

    -- Validate URLs
    v_clean_project_url := trim(coalesce(p_project_url, ''));
    IF v_clean_project_url = '' OR v_clean_project_url = '#' THEN
        v_clean_project_url := NULL;
    ELSIF NOT (v_clean_project_url ~* '^https?://') THEN
        RAISE EXCEPTION 'INVALID_URL_PROTOCOL: project_url은 http:// 또는 https:// 이어야 합니다.'
            USING ERRCODE = '22023';
    END IF;

    v_clean_video_url := trim(coalesce(p_video_url, ''));
    IF v_clean_video_url = '' THEN
        v_clean_video_url := NULL;
    ELSIF NOT (v_clean_video_url ~* '^https?://') THEN
        RAISE EXCEPTION 'INVALID_URL_PROTOCOL: video_url은 http:// 또는 https:// 이어야 합니다.'
            USING ERRCODE = '22023';
    END IF;

    v_clean_image_url := trim(coalesce(p_image_url, ''));
    IF v_clean_image_url = '' THEN
        v_clean_image_url := NULL;
    ELSIF NOT (v_clean_image_url ~* '^https?://' OR v_clean_image_url ~* '^slides_media/') THEN
        RAISE EXCEPTION 'INVALID_URL_PROTOCOL: image_url 형식이 올바르지 않습니다.'
            USING ERRCODE = '22023';
    END IF;

    -- Perform Update
    UPDATE public.submissions
    SET name = trim(p_name),
        dept = trim(p_dept),
        title = trim(p_title),
        description = trim(p_description),
        project_url = v_clean_project_url,
        video_url = v_clean_video_url,
        image_url = v_clean_image_url
    WHERE id = p_submission_id AND deleted_at IS NULL
    RETURNING * INTO v_sub;

    IF v_sub.id IS NULL THEN
        RAISE EXCEPTION 'NOT_FOUND: 작품을 찾을 수 없거나 이미 삭제되었습니다.'
            USING ERRCODE = 'P0002';
    END IF;

    RETURN NEXT v_sub;
END;
$$;

-- RPC 3: Delete Submission With Passcode Verification (Soft Delete)
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

-- RPC 4: Admin Update Submission Status (Visible / Hidden)
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

-- RPC 5: Admin Delete Submission (Soft Delete)
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

-- Grant EXECUTE permissions on RPC functions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.create_submission TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_submission_with_passcode TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_submission_with_passcode TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_submission_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_submission TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- 7. Enable Supabase Realtime Publication for public.submissions
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

-- 8. Create Storage Bucket 'submission-media' and RLS Policies (Idempotent)
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

-- Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Idempotent Policy 1: Allow public/anon/authenticated SELECT on 'submission-media'
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

-- Idempotent Policy 2: Allow public/anon/authenticated INSERT on 'submission-media'
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

-- Idempotent Policy 3: Allow authenticated users to DELETE on 'submission-media'
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
