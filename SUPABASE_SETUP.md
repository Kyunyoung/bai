# 🚀 Supabase 중앙 데이터베이스 연동 설정 가이드

본 가이드는 바이브코딩 콘테스트 포털 웹 앱을 Supabase 중앙 데이터베이스와 연동하여, **모든 기기(PC, 핸드폰, 태블릿)에서 100% 실시간 동기화**되도록 설정하는 가이드입니다.

---

## 1. Supabase 프로젝트 생성

1. [Supabase 공식 사이트](https://supabase.com)에 로그인 후 **New Project**를 클릭합니다.
2. 프로젝트 이름과 데이터베이스 비밀번호를 입력하고 지역(Region)을 **Seoul (ap-northeast-2)**로 선택합니다.
3. 프로젝트 생성이 완료될 때까지 약 1~2분 기다립니다.

---

## 2. 데이터베이스 스키마 및 마이그레이션 적용

1. Supabase 좌측 메뉴에서 **SQL Editor**를 클릭합니다.
2. **New Query** 버튼을 누릅니다.
3. 프로젝트 내 `supabase/migrations/20260811_create_contest_schema.sql` 파일의 전 내용을 복사하여 SQL Editor 붙여넣습니다.
4. 우측 하단 **Run** 버튼을 클릭하여 실행합니다. (`Success. No rows returned` 메시지가 나오면 성공)

---

## 3. 미디어 스토리지 (Storage Bucket) 확인

위 2번 단계에서 `20260811_create_contest_schema.sql` 마이그레이션 SQL을 실행하면 **`submission-media` 퍼블릭 버킷과 읽기/업로드 RLS 정책이 자동으로 생성**됩니다.

필요 시 Supabase 좌측 메뉴 **Storage**에서 다음 사항을 확인하십시오:
- Bucket name: `submission-media` (대소문자/하이픈 100% 일치)
- Public bucket: **ON (공개)**
- Storage Policies: Public Access(SELECT) 및 Public Upload(INSERT) 정책 활성화 여부
- Allowed MIME types: `image/jpeg, image/png, image/webp, video/mp4, video/webm, video/quicktime` (최대 100MB)

---

## 4. 관리자 계정 생성 (Admin Auth)

1. Supabase 좌측 메뉴에서 **Authentication -> Users**로 이동합니다.
2. **Add User -> Create User**를 눌러 관리자 이메일과 비밀번호를 등록합니다.
3. 생성된 관리자 유저의 **User UID** (UUID 형태)를 복사합니다.
4. **SQL Editor**로 이동하여 아래 SQL을 실행하여 해당 유저에게 관리자 권한을 부여합니다:
   ```sql
   INSERT INTO public.admins (user_id) 
   VALUES ('복사한-USER-UID-여기에-붙여넣기');
   ```

---

## 5. 웹 프론트엔드 연동 (`config.js` 작성)

1. 리포지토리 루트 디렉토리의 `config.example.js`를 복사하여 `config.js` 파일을 만듭니다.
2. Supabase 좌측 메뉴 **Project Settings -> API Keys**로 이동합니다.
3. `Project URL`과 `Publishable Key` (또는 `anon key`)를 복사하여 `config.js`에 작성합니다:
   ```javascript
   window.BAI_CONFIG = {
     SUPABASE_URL: 'https://your-project-ref.supabase.co',
     SUPABASE_PUBLISHABLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   };
   ```

> ⚠️ **주의사항**: `service_role key` 또는 `secret key`는 절대로 프론트엔드 코드나 GitHub 저장소에 노출해서는 안 됩니다! 오직 `Publishable Key`만 사용하세요.
