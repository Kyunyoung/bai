/* ==========================================
   바이브코딩 사내 교육 포털 - Core JavaScript (ES6+)
   PDF/PPT 59개 슬라이드 이미지 연동 & 3가지 모드(덱/슬라이드쇼/연속보기) 고품질 UI 뷰어
   ========================================== */

// Pre-populated Internal Network Employee Roster with Unique Employee IDs
const INTERNAL_EMPLOYEE_ROSTER = [
  { empId: '20240101', name: 'K-감사관 (김OO 대리)', dept: '디지털감사팀' },
  { empId: '20240102', name: '이OO 과장', dept: '행정기획팀' },
  { empId: '20240103', name: '박OO 매니저', dept: '소프트웨어개발실' },
  { empId: '20240104', name: '최OO 차장', dept: '정보보안팀' },
  { empId: '20240105', name: '정OO 주임', dept: '경영지원부' },
  { empId: '20240106', name: '윤OO 매니저', dept: '감사2실' },
  { empId: '20240107', name: '강OO 행정관', dept: '수사지원과' },
  { empId: '20240108', name: '한OO 조사관', dept: '사이버수사대' },
  { empId: '20240109', name: '임OO 팀장', dept: '기획조정실' },
  { empId: '20240110', name: '서OO 과장', dept: '빅데이터분석팀' }
];

// Exact 59 Slides Dataset with High-Res Exported Presentation Slide Images (슬라이드1.JPG ~ 슬라이드59.JPG)
const PPT_SLIDES = [
  {
    num: 1,
    part: 'PART 01. 도입부',
    title: '업무 자동화를 위한 바이브 코딩',
    subtitle: '실습 교육 도입부 → 초급 엑셀 취합 → 중급 표도우미',
    image: 'slides_media/슬라이드1.JPG',
    body: `• 전국 250여 개 경찰서 엑셀 자료 취합 실단 사례로 시작합니다.
• 만화형 시나리오 흐름과 오프라인 설치 단계를 포함한 59개 슬라이드 전체 발표자료입니다.`
  },
  {
    num: 2,
    part: 'PART 01. 도입부',
    title: 'COURSE FLOW 전체 교육 구성',
    subtitle: '기존 55장 시나리오와 만화형 흐름은 그대로 유지하고, 내부망 설치 단계만 보강했습니다.',
    image: 'slides_media/슬라이드2.JPG',
    body: `1. 도입부: 250개 경찰서 파일 취합의 고통
2. 초급: 개발환경 세팅과 엑셀 취합 실습
3. 중급: 표도우미 제작 과정을 단계별로 이해

※ 초보자가 가장 어려워하는 개발환경 세팅은 가상환경 없이 천천히 진행합니다.`
  },
  {
    num: 3,
    part: 'PART 01. 도입부',
    title: 'PART 01 도입부: 왜 필요한가?',
    subtitle: '단순 반복 업무의 고통을 먼저 보여주고, 자동화의 필요성을 체감합니다.',
    image: 'slides_media/슬라이드3.JPG',
    body: `• 단순 복사/붙여넣기 업무가 가지는 한계와 문제점 인식
• K-감사관 만화 캐릭터 사례를 통한 업무 효율화 필요성 체감`
  },
  {
    num: 4,
    part: 'PART 01. 도입부',
    title: 'SCENE 01 전국 경찰서 자료가 도착했습니다',
    subtitle: 'K-감사관의 폴더에 경찰서 엑셀 파일이 빼곡히 들어 있습니다.',
    image: 'slides_media/슬라이드4.JPG',
    body: `• 전국 경찰서 약 250여 개 엑셀 파일 제출 (서울중부경찰서.xlsx, 부산중부경찰서.xlsx …)
• 형식은 같지만 파일 수가 너무 많음
• "형식은 같으니까 금방 끝나겠지?"라는 착각`
  },
  {
    num: 5,
    part: 'PART 01. 도입부',
    title: 'SCENE 02 처음에는 단순해 보였습니다',
    subtitle: '하나씩 열고 복사하고 붙이면 될 것처럼 보입니다.',
    image: 'slides_media/슬라이드5.JPG',
    body: `• 서울중부경찰서 자료 복사 → 서울종로경찰서 자료 붙여넣기 → 서울남대문경찰서 ...
• 파일이 10개가 아니라 250개면 이야기가 완전히 달라집니다.`
  },
  {
    num: 6,
    part: 'PART 01. 도입부',
    title: 'SCENE 03 3시간 후, 불안이 시작됩니다',
    subtitle: '수작업 취합은 시간보다 정확성이 더 큰 문제입니다.',
    image: 'slides_media/슬라이드6.JPG',
    body: `• "부산중부경찰서 파일을 붙였던가?"
• "제목 행이 중간에 한 번 더 들어간 것 같은데…"
• 파일 누락·제목 행 중복·복사 범위 오류 발생 가능
• 한 번 틀리면 검토 시간까지 다시 늘어납니다.`
  },
  {
    num: 7,
    part: 'PART 01. 도입부',
    title: 'SCENE 04 추가 요구사항이 등장합니다',
    subtitle: '업무는 한 번에 끝나지 않습니다.',
    image: 'slides_media/슬라이드7.JPG',
    body: `• 수석님: "조치계획 항목도 같이 취합해 주세요."
• 과장님: "원본 파일명도 남겨야 확인하기 좋겠네요."
• 국장님: "지방청별로 구분할 수 있게 지역 열도 추가합시다."
• 요구가 바뀌면 250개 엑셀을 다시 열어야 합니다.`
  },
  {
    num: 8,
    part: 'PART 01. 도입부',
    title: 'REFRAME 질문을 바꾸면 자동화가 시작됩니다',
    subtitle: '바이브 코딩은 이 질문에서 시작됩니다.',
    image: 'slides_media/슬라이드8.JPG',
    body: `• 이 일을 매번 손으로 해야 할까?
• 규칙이 있다면 컴퓨터가 대신할 수 있지 않을까?
• 내가 원하는 절차를 AI에게 설명하면 코드로 만들 수 있지 않을까?
💡 핵심 원칙: 반복 작업은 컴퓨터에게, 판단은 사람에게!`
  },
  {
    num: 9,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'PART 02 초급 과정: 개발환경 세팅',
    subtitle: '초보자가 가장 많이 막히는 부분을 먼저 해결합니다.',
    image: 'slides_media/슬라이드9.JPG',
    body: `• 환경 세팅의 장벽을 낮추고 오프라인/내부망 PC에서 실행 성공 경험 생성`
  },
  {
    num: 10,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'SETUP PRINCIPLE 초급에서는 가상환경을 생략합니다',
    subtitle: '오늘의 목표는 내부망 PC에서 설치부터 코드 실행까지 직접 성공하는 경험입니다.',
    image: 'slides_media/슬라이드10.JPG',
    body: `• Python 설치 확인, VS Code 실행, pip 설치, 코드 실행으로 단순화
• 가상환경은 중급·배포·장기 유지보수 단계에서 권장
• 초보자에게는 가상환경 자체가 첫 장벽이 될 수 있으므로 먼저 성공 경험을 생성합니다.`
  },
  {
    num: 11,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'SETUP ROADMAP 개발환경 세팅 8단계 순서',
    subtitle: '차근차근 순서대로 따라오시면 환경 설정이 완료됩니다.',
    image: 'slides_media/슬라이드11.JPG',
    body: `1. 실습 폴더 만들기 (D:\\vibe_excel)
2. 설치 파일 준비 (D:\\vibe_setup)
3. Python 설치 (Add to PATH 필수)
4. VS Code 설치
5. Python 확장 (.vsix) 설치
6. 설치 확인 및 폴더 열기
7. 오프라인 라이브러리 설치 (pandas, openpyxl)
8. 첫 코드 실행 및 오류 해결`
  },
  {
    num: 12,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 1 실습 폴더 만들기',
    subtitle: 'D드라이브에 D:\\vibe_excel 폴더를 생성합니다.',
    image: 'slides_media/슬라이드12.JPG',
    body: `D:\\vibe_excel
 ├─ input  (경찰서 제출 파일 보관)
 └─ output (취합 결과 파일 저장)`
  },
  {
    num: 13,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 2 내부망 설치 파일 준비',
    subtitle: '강사가 제공한 설치 폴더를 PC에 복사합니다.',
    image: 'slides_media/슬라이드13.JPG',
    body: `D:\\vibe_setup
 ├─ python-installer.exe
 ├─ VSCodeSetup.exe
 ├─ python-extension.vsix
 └─ packages`
  },
  {
    num: 14,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 3 Python 설치하기 (가장 중요!)',
    subtitle: '제공받은 Python 설치 파일을 실행합니다.',
    image: 'slides_media/슬라이드14.JPG',
    body: `⚠️ 가장 중요: 첫 화면에서 【☑ Add python.exe to PATH】를 반드시 체크하세요!
• Install Now를 눌러 기본 설정으로 설치를 진행합니다.`
  },
  {
    num: 15,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 4 VS Code 설치하기',
    subtitle: 'Visual Studio Code 설치를 진행합니다.',
    image: 'slides_media/슬라이드15.JPG',
    body: `권장 체크 항목:
☑ PATH에 추가
☑ Code로 열기
☑ 바탕 화면 바로가기`
  },
  {
    num: 16,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 5 Python 확장 오프라인 설치',
    subtitle: '인터넷이 연결되지 않은 오프라인 환경 설치 방법',
    image: 'slides_media/슬라이드16.JPG',
    body: `VS Code 왼쪽 Extensions 아이콘 클릭 → ... 메뉴 → Install from VSIX... 선택 → python-extension.vsix 파일 지정`
  },
  {
    num: 17,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 6 Python 설치 확인',
    subtitle: '터미널에서 명령어로 설치 상태를 점검합니다.',
    image: 'slides_media/슬라이드17.JPG',
    body: `명령어: python --version 또는 py --version
성공 기준: Python 3.x.x 표시
(안 될 경우 Add to PATH 체크 여부 재확인)`
  },
  {
    num: 18,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 7 VS Code에서 실습 폴더 열기',
    subtitle: 'File → Open Folder → D:\\vibe_excel 선택',
    image: 'slides_media/슬라이드18.JPG',
    body: `체크 포인트: 왼쪽 탐색기에 input, output 폴더가 정상적으로 보여야 합니다.`
  },
  {
    num: 19,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 8 터미널 열기와 위치 확인',
    subtitle: 'VS Code 상단 메뉴: Terminal → New Terminal',
    image: 'slides_media/슬라이드19.JPG',
    body: `터미널 위치 확인: D:\\vibe_excel>
(다른 위치일 경우: cd /d D:\\vibe_excel 입력)`
  },
  {
    num: 20,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 9 오프라인 라이브러리 설치',
    subtitle: 'packages 폴더에서 pandas 및 openpyxl 설치',
    image: 'slides_media/슬라이드20.JPG',
    cmd: `py -m pip install --no-index --find-links=D:\\vibe_setup\\packages pandas openpyxl`,
    body: `• pandas: 엑셀 자료를 표(DataFrame)처럼 읽고 합치는 엔진
• openpyxl: xlsx 파일 저장/읽기 엔진`
  },
  {
    num: 21,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'CHECKLIST 개발환경 세팅 체크리스트',
    subtitle: '여기까지 오면 절반은 성공입니다!',
    image: 'slides_media/슬라이드21.JPG',
    body: `1. 설치 파일 폴더를 PC에 복사했다.
2. Python 설치 시 PATH를 체크했다.
3. python 또는 py 버전이 확인된다.
4. VS Code와 Python 확장을 설치했다.
5. VS Code에서 D:\\vibe_excel을 열었다.
6. 오프라인으로 pandas·openpyxl을 설치했다.`
  },
  {
    num: 22,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PART 03 초급 과정: 엑셀 취합 실습',
    subtitle: '경찰서 엑셀 파일을 하나로 취합하는 프로그램을 직접 만듭니다.',
    image: 'slides_media/슬라이드22.JPG',
    body: `• 실습 데이터 및 요구사항 기반 프로그램 작성`
  },
  {
    num: 23,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PRACTICE GOAL 오늘 만들 초급 프로그램',
    subtitle: '폴더 안의 여러 xlsx 파일을 찾아 하나로 합칩니다.',
    image: 'slides_media/슬라이드23.JPG',
    body: `• 폴더 선택 창을 띄운다.
• 선택한 폴더 안의 엑셀 파일을 자동으로 찾는다.
• 엑셀 파일을 하나씩 읽는다.
• 자료를 하나로 합친다.
• 결과 파일(merged_result.xlsx)로 저장한다.`
  },
  {
    num: 24,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PRACTICE DATA 경찰서 제출 파일 예시',
    subtitle: '실습은 3개 파일로 진행하지만 250개 파일에도 동일 코드가 적용됩니다.',
    image: 'slides_media/슬라이드24.JPG',
    body: `• 서울중부경찰서.xlsx | 기관명: 서울중부 | 담당자: 김하나 | 점검결과: 적정
• 부산중부경찰서.xlsx | 기관명: 부산중부 | 담당자: 이세진 | 점검결과: 보완
• 대구중부경찰서.xlsx | 기관명: 대구중부 | 담당자: 정오름 | 점검결과: 적정`
  },
  {
    num: 25,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PROMPT ChatGPT에게 첫 요청하기 (엑셀 취합)',
    subtitle: 'AI에 전달할 엑셀 자동 취합 프롬프트',
    image: 'slides_media/슬라이드25.JPG',
    prompt: `형식이 동일한 경찰서 엑셀 파일 여러 개를 하나로 취합하는 파이썬 코드를 만들어줘.

조건
1. Windows에서 실행할 거야.
2. 폴더 선택 창을 띄워줘.
3. 선택한 폴더 안의 xlsx 파일을 모두 읽어줘.
4. 엑셀 임시 파일(~$로 시작하는 파일)은 제외해줘.
5. 결과 파일은 merged_result.xlsx로 저장해줘.
6. 초보자도 이해할 수 있게 주석을 달아줘.`,
    body: `위 프롬프트를 AI에 입력하여 파이썬 코드를 생성합니다.`
  },
  {
    num: 26,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CODE 1/3 폴더 선택 코드 (merge_excel.py)',
    subtitle: 'tkinter filedialog를 이용한 폴더 대화상자 선택',
    image: 'slides_media/슬라이드26.JPG',
    code: `import os
import pandas as pd
from tkinter import Tk, filedialog

def select_folder():
    root = Tk()
    root.withdraw()
    folder_path = filedialog.askdirectory(title="취합할 엑셀 파일 폴더 선택")
    return folder_path`,
    body: `폴더 선택 대화상자를 띄우는 함수 작성`
  },
  {
    num: 27,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CODE 2/3 엑셀 파일 찾기와 읽기',
    subtitle: 'os.listdir() 및 임시파일(~$예외) 필터링',
    image: 'slides_media/슬라이드27.JPG',
    code: `def merge_excel_files(folder_path):
    excel_files = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".xlsx") and not file_name.startswith("~$"):
            full_path = os.path.join(folder_path, file_name)
            excel_files.append(full_path)
    if not excel_files:
        print("선택한 폴더에 xlsx 파일이 없습니다.")
        return
    excel_files.sort()
    merged_data = []`,
    body: `~$로 시작하는 엑셀 임시 파일 제외 처리 필수`
  },
  {
    num: 28,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CODE 3/3 합치고 저장하기',
    subtitle: 'pd.concat 및 원본파일명 열 추가',
    image: 'slides_media/슬라이드28.JPG',
    code: `    for file_path in excel_files:
        print(f"읽는 중: {os.path.basename(file_path)}")
        data = pd.read_excel(file_path)
        data["<ctrl42>원본파일명"] = os.path.basename(file_path)
        merged_data.append(data)

    result = pd.concat(merged_data, ignore_index=True)
    output_path = os.path.join(folder_path, "merged_result.xlsx")
    result.to_excel(output_path, index=False)
    print("취합이 완료되었습니다.")`,
    body: `pandas concat으로 데이터 결합 및 to_excel 저장`
  },
  {
    num: 29,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'RUN 코드 실행하기',
    subtitle: 'VS Code 터미널에서 실행',
    image: 'slides_media/슬라이드29.JPG',
    cmd: `python merge_excel.py`,
    body: `1. 터미널에 python merge_excel.py 입력
2. 폴더 선택 창에서 D:\\vibe_excel\\input 선택
3. input 폴더 안에 merged_result.xlsx 생성 확인`
  },
  {
    num: 30,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'RESULT 결과 확인하기',
    subtitle: '취합된 엑셀 파일 열어보기',
    image: 'slides_media/슬라이드30.JPG',
    body: `기관명 | 담당자 | 점검결과 | 비고 | 원본파일명
서울중부 | 김하나 | 적정 | 제출완료 | 서울중부경찰서.xlsx
부산중부 | 이세진 | 보완 | 확인필요 | 부산중부경찰서.xlsx
대구중부 | 정오름 | 적정 | 제출완료 | 대구중부경찰서.xlsx

🎉 250개 파일을 하나씩 여는 작업이 버튼 한 번으로 바뀝니다!`
  },
  {
    num: 31,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'ERROR 01 오류 해결: pandas가 없다고 나올 때',
    subtitle: 'ModuleNotFoundError: No module named pandas',
    image: 'slides_media/슬라이드31.JPG',
    body: `• 원인: pandas 라이브러리가 설치되어 있지 않음
• 해결: py -m pip install pandas openpyxl 실행 후 다시 코드 구동`
  },
  {
    num: 32,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'ERROR 02 오류 해결: 저장이 안 될 때 (PermissionError)',
    subtitle: 'Permission error / 파일 접근 거부',
    image: 'slides_media/슬라이드32.JPG',
    body: `• 원인: merged_result.xlsx 파일이 엑셀 프로그램에서 열려 있음
• 해결: 엑셀에서 결과 파일(merged_result.xlsx)을 닫고 다시 실행`
  },
  {
    num: 33,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'ERROR 03 오류 해결: 임시 파일 제외',
    subtitle: '~$로 시작하는 임시 파일 예외',
    image: 'slides_media/슬라이드33.JPG',
    code: `if file_name.endswith(".xlsx") and not file_name.startswith("~$"):
    full_path = os.path.join(folder_path, file_name)
    excel_files.append(full_path)`,
    body: `~$A기관.xlsx는 실제 파일이 아니므로 읽기 목록에서 제외해야 합니다.`
  },
  {
    num: 34,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CHANGE 01 요구사항 변경: 특정 열만 취합',
    subtitle: '"기관명, 점검결과, 비고 열만 취합해 주세요."',
    image: 'slides_media/슬라이드34.JPG',
    code: `required_columns = ["기관명", "점검결과", "비고"]
missing = [c for c in required_columns if c not in data.columns]
if missing:
    print("없는 열:", missing)
    continue
data = data[required_columns]`,
    body: `필요한 열만 필터링하여 수집하는 코드`
  },
  {
    num: 35,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CHANGE 02 요구사항 변경: 원본파일명 추가',
    subtitle: '"나중에 어느 파일에서 온 자료인지 알아야 합니다."',
    image: 'slides_media/슬라이드35.JPG',
    code: `data["<ctrl42>원본파일명"] = os.path.basename(file_path)`,
    body: `원본파일명 열을 추가하면 추후 추적 및 부서 문의 시 유용합니다.`
  },
  {
    num: 36,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'WRAP-UP 초급 과정 정리',
    subtitle: '초급 과정을 완료하였습니다!',
    image: 'slides_media/슬라이드36.JPG',
    body: `1. 개발환경을 단순하게 세팅했다.
2. 경찰서 엑셀 파일을 하나로 취합했다.
3. 오류 메시지를 보고 해결했다.
4. 요구사항 변경을 코드에 반영했다.
5. 반복 업무를 컴퓨터에게 맡기는 경험을 했다.`
  },
  {
    num: 37,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PART 04 중급 과정: 표도우미 제작',
    subtitle: '한글 보고서 표 번호 정리 도구를 단계별로 만들어 갑니다.',
    image: 'slides_media/슬라이드37.JPG',
    body: `• 보고서 내 표 번호 자동 갱신 GUI 스크립트 작성`
  },
  {
    num: 38,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROBLEM 표도우미는 왜 필요한가?',
    subtitle: '보고서 중간에 표가 추가되면 뒤 번호를 모두 밀어야 합니다.',
    image: 'slides_media/슬라이드38.JPG',
    body: `• [표 1] 감사 개요
• [표 2] 기관별 제출 현황
• [표 3] 주요 지적사항
• [표 4] 조치계획
표가 50개, 100개라면 수작업 수정은 위험하며 번호 꼬임 사고가 발생합니다.`
  },
  {
    num: 39,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'GOAL 표도우미의 최종 목표',
    subtitle: '표 번호 관리를 실제 업무 도구로 바꾸는 것이 목표입니다.',
    image: 'slides_media/슬라이드39.JPG',
    body: `• 문서에서 [표 숫자] 제목 형식 찾기
• 찾은 표 제목을 목록으로 표시
• 특정 번호부터 n+1 또는 n-1 실행
• [표 0] 새 삽입 표 처리`
  },
  {
    num: 40,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'ROADMAP 중급 과정 로드맵',
    subtitle: '7단계로 표도우미를 완성합니다.',
    image: 'slides_media/슬라이드40.JPG',
    body: `1. 텍스트 파일에서 표 제목 찾기
2. 표 번호를 +1, -1 하는 규칙 만들기
3. GUI 화면 만들기 (tkinter)
4. 한글 문서에서 텍스트 가져오기
5. 한글 문서에 수정 결과 반영하기
6. 예외 처리하기
7. 표도우미 형태 프로그램으로 정리하기`
  },
  {
    num: 41,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 1 텍스트에서 표 제목 찾기',
    subtitle: 'sample_report.txt 테스트 파일 준비',
    image: 'slides_media/슬라이드41.JPG',
    body: `[표 1] 감사 개요
[표 2] 기관별 제출 현황
[표 3] 주요 지적사항`
  },
  {
    num: 42,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 표 제목 찾기 프롬프트',
    subtitle: '정규식을 이용해 [표 숫자] 추출하기',
    image: 'slides_media/슬라이드42.JPG',
    prompt: `파이썬으로 텍스트 파일에서 [표 숫자] 제목 형식의 줄을
찾아 목록으로 출력하는 코드를 만들어줘.

조건
1. 파일 이름은 sample_report.txt
2. [표 1] 감사 개요 같은 형식 찾기
3. 표 번호와 제목을 분리해서 출력
4. 정규식(re) 사용
5. 초보자도 이해할 수 있게 주석 추가`,
    body: `정규 표현식(re) 패턴으로 표 번호 추출`
  },
  {
    num: 43,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'CODE 텍스트에서 표 제목 찾는 코드',
    subtitle: 're.compile(r"^\[표\s*(\d+)\]\s*(.+)$")',
    image: 'slides_media/슬라이드43.JPG',
    code: `import re
pattern = re.compile(r"^\[표\s*(\d+)\]\s*(.+)$")

with open("sample_report.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    line = line.strip()
    match = pattern.match(line)
    if match:
        table_no = match.group(1)
        title = match.group(2)
        print(f"표 번호: {table_no}, 제목: {title}")`,
    body: `표 번호와 제목을 깔끔하게 분리 출력`
  },
  {
    num: 44,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 2 특정 번호부터 +1 하기',
    subtitle: '예: [표 3]부터 뒤 번호를 하나씩 증가',
    image: 'slides_media/슬라이드44.JPG',
    body: `수정 전          → 수정 후
[표 1] 감사 개요    [표 1] 감사 개요
[표 2] 제출 현황    [표 2] 제출 현황
[표 3] 지적사항    [표 4] 지적사항
[표 4] 조치계획    [표 5] 조치계획`
  },
  {
    num: 45,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 표 번호 +1 프롬프트',
    subtitle: '표 번호 일괄 변경 프롬프트',
    image: 'slides_media/슬라이드45.JPG',
    prompt: `sample_report.txt에서 [표 숫자] 제목 형식의 표 번호를
수정하는 파이썬 코드를 만들어줘.

조건
1. 시작 번호를 3으로 정한다.
2. 표 번호가 3 이상이면 +1 한다.
3. 수정 결과는 sample_report_updated.txt로 저장한다.
4. 초보자도 이해할 수 있게 주석을 달아준다.`,
    body: `시작 번호 조건문 처리`
  },
  {
    num: 46,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'CODE 표 번호 +1 코드',
    subtitle: 'table_no >= start_no 연산',
    image: 'slides_media/슬라이드46.JPG',
    code: `start_no = 3
shift = 1
updated_lines = []

for line in lines:
    stripped = line.strip()
    match = pattern.match(stripped)
    if match:
        table_no = int(match.group(1))
        title = match.group(2)
        if table_no >= start_no:
            table_no = table_no + shift
        updated_lines.append(f"[표 {table_no}] {title}\n")
    else:
        updated_lines.append(line)`,
    body: `조건 충족 표 번호 오프셋 증가`
  },
  {
    num: 47,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 3 GUI 만들기 (tkinter)',
    subtitle: '매번 코드에서 start_no를 고치지 않도록 화면을 만듭니다.',
    image: 'slides_media/슬라이드47.JPG',
    body: `• 시작 번호 입력칸 (Entry)
• n+ 버튼
• n- 버튼
• 실행 결과 메시지 창`
  },
  {
    num: 48,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT GUI 제작 프롬프트',
    subtitle: 'tkinter GUI 변환 프롬프트',
    image: 'slides_media/슬라이드48.JPG',
    prompt: `방금 만든 표 번호 수정 코드를 tkinter GUI로 바꿔줘.

조건
1. 시작 번호를 입력할 수 있게 해줘.
2. n+ 버튼을 누르면 해당 번호 이상 +1 해줘.
3. n- 버튼을 누르면 해당 번호 이상 -1 해줘.
4. 수정 결과는 sample_report_updated.txt로 저장해줘.
5. 초보자도 이해할 수 있게 주석을 달아줘.`,
    body: `GUI 인터페이스 연결`
  },
  {
    num: 49,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'CODE GUI 기본 코드 (Tkinter)',
    subtitle: '표도우미 GUI 구동 코드',
    image: 'slides_media/슬라이드49.JPG',
    code: `import tkinter as tk
from tkinter import messagebox

def update_table_numbers(shift):
    start_no = int(entry_start_no.get())
    messagebox.showinfo("완료", "표 번호 변경 완료")

root = tk.Tk()
root.title("한글 보고서 표도우미")
entry_start_no = tk.Entry(root)
entry_start_no.pack()
tk.Button(root, text="n+ (번호 +1)", command=lambda: update_table_numbers(1)).pack()
tk.Button(root, text="n- (번호 -1)", command=lambda: update_table_numbers(-1)).pack()
root.mainloop()`,
    body: `버튼 클릭 이벤트 함수 연결`
  },
  {
    num: 50,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 4 한글(HWP) 연동하기',
    subtitle: '실제 한글 문서 COM 객체 연동 개요',
    image: 'slides_media/슬라이드50.JPG',
    body: `• 한글 프로그램 실행 및 문서 로드
• 문서 내 [표 n] 위치 검색 및 번호 교체`
  },
  {
    num: 51,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'HWP AUTOMATION 한글 자동화 단계',
    subtitle: 'Win32com을 활용한 한글 제어',
    image: 'slides_media/슬라이드51.JPG',
    body: `1. 한글 프로그램 연결 (win32com.client)
2. 오픈된 한글 문서 텍스트 스캔
3. [표 n] 번호 오프셋 변경 반영`
  },
  {
    num: 52,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 한글 자동화 요구사항 프롬프트',
    subtitle: 'Windows Python 한글 자동화 프롬프트',
    image: 'slides_media/슬라이드52.JPG',
    prompt: `Windows에서 Python으로 한글 문서의 표 번호를 변경하는 스크립트를 작성해줘.

목표:
1. 열려 있는 한글 문서 텍스트 가져오기
2. [표 n] 위치 찾기
3. GUI로 선택한 시작 번호 이상 표 번호 변경`,
    body: `한글 문서 자동화 연동`
  },
  {
    num: 53,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 오류 대응 (RPC 서버 오류 해결)',
    subtitle: 'RPC 서버 이용 불가능 오류 처리',
    image: 'slides_media/슬라이드53.JPG',
    body: `• 오류 메시지: -2147023174 RPC 서버를 이용할 수 없습니다.
• 해결: 한글 프로세스가 비정상 종료된 경우 재연결 유틸리티 작성`
  },
  {
    num: 54,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 사용성 개선 프롬프트',
    subtitle: 'GUI 창 닫힘 방지 및 레이아웃 개선',
    image: 'slides_media/슬라이드54.JPG',
    prompt: `표도우미 프로그램 n+ 실행 후 GUI 창이 닫히지 않게 유지하고, 닫기 버튼과 n+, n- 버튼 레이아웃을 개선해줘.`,
    body: `사용자 경험 개선`
  },
  {
    num: 55,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 예외 처리 (표 0 처리)',
    subtitle: '새로 삽입된 [표 0] 임시 번호 처리',
    image: 'slides_media/슬라이드55.JPG',
    body: `• 새 표 추가 시 [표 0]으로 임시 지정 후 n+ 실행 시 자동 순번 부여`
  },
  {
    num: 56,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STRUCTURE 표도우미 전체 구조',
    subtitle: '8단계 모듈 구조 요약',
    image: 'slides_media/슬라이드56.JPG',
    body: `1. 텍스트에서 [표 n] 찾기
2. 표 번호 +1/-1 연산
3. GUI 제작
4. 한글 문서 연결
5. 위치 지정 및 수정
6. 결과 반영
7. 에러 처리
8. 최종 배포`
  },
  {
    num: 57,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PRINCIPLES 바이브코딩 핵심 원칙',
    subtitle: '성공적인 사내 자동화를 위한 수칙',
    image: 'slides_media/슬라이드57.JPG',
    body: `• 먼저 텍스트 파일로 작게 성공한다.
• 바로 GUI를 씌운다.
• 한글 연동을 붙인다.
• 에러 메시지는 그대로 AI에게 질문한다.
• 동작하는 코드를 다듬어간다.`
  },
  {
    num: 58,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'WRAP-UP 전체 교육 요약 및 시상 안내',
    subtitle: '바이브코딩 기초/중급 교육을 완수하셨습니다!',
    image: 'slides_media/슬라이드58.JPG',
    body: `AI와 함께하는 업무 자동화는 코드를 외우는 것이 아니라, 반복 업무를 발견하고 AI와 소통하며 해결하는 과정입니다.
🎁 이제 본인이 만든 자동화 프롬프트를 제출하고 사내 집합교육 시상 투표에 참여하세요!`
  },
  {
    num: 59,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'END 반복 업무 자동화로 업무 효율 300% 달성!',
    subtitle: '수고하셨습니다! 사내 교육 포털에서 실습물을 제출하세요.',
    image: 'slides_media/슬라이드59.JPG',
    body: `컴퓨터에게 반복 작업을 맡기고 더 창의적인 업무에 집중하세요! 🚀`
  }
];

// Pre-populated Sample Submissions
const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-01',
    title: '📊 [PPT 실습1] 전국 250개 경찰서 엑셀 자동 취합 프롬프트',
    desc: 'PPT 25슬라이드 기반: 폴더 내 250개 경찰서 점검 엑셀을 임시파일(~$예외) 제외 후 하나로 병합하고 원본파일명 열을 추가하는 프롬프트입니다.',
    content: `형식이 동일한 경찰서 엑셀 파일 여러 개를 하나로 취합하는 파이썬 코드를 만들어줘.\n\n조건:\n1. Windows 환경 폴더 선택 창(filedialog) 사용\n2. xlsx 파일 모두 읽기 (~$ 임시 파일 제외)\n3. data['원본파일명'] = os.path.basename(file_path) 추가\n4. merged_result.xlsx 로 저장`,
    authorEmpId: '20240101',
    author: 'K-감사관 (김OO 대리)',
    dept: '디지털감사팀',
    rank1Votes: 4,
    rank2Votes: 1,
    rank3Votes: 0,
    date: '2026.07.26'
  },
  {
    id: 'sub-02',
    title: '📝 [PPT 실습2] 한글 보고서 표 번호 자동 변경 (표도우미 GUI) 프롬프트',
    desc: 'PPT 48슬라이드 기반: 보고서 중간에 표가 추가될 때 뒤쪽 [표 3], [표 4] 번호를 tkinter GUI 버튼 클릭으로 n+1, n-1 자동 밀기 해주는 스크립트입니다.',
    content: `파이썬으로 텍스트/보고서에서 [표 숫자] 제목 형식의 표 번호를 수정하는 tkinter GUI 코드를 만들어줘.\n\n조건:\n1. 시작 번호를 입력할 수 있게 해줘.\n2. n+ 버튼을 누르면 해당 번호 이상부터 표 번호를 +1 해줘.\n3. n- 버튼을 누르면 해당 번호 이상부터 표 번호를 -1 해줘.\n4. 수정 결과는 sample_report_updated.txt로 저장해줘.`,
    authorEmpId: '20240102',
    author: '이OO 과장',
    dept: '행정기획팀',
    rank1Votes: 2,
    rank2Votes: 3,
    rank3Votes: 1,
    date: '2026.07.27'
  },
  {
    id: 'sub-03',
    title: '🔍 [PPT 실습3] 엑셀 특정 열(기관명, 점검결과, 비고)만 추출 검증 스크립트',
    desc: 'PPT 34슬라이드 기반: 250개 파일 중 기관명, 점검결과, 비고 열만 선별 수집하고 누락된 필수 열이 있을 때 경고를 출력하는 코드입니다.',
    content: `required_columns = ["기관명", "점검결과", "비고"]\nmissing = [c for c in required_columns if c not in data.columns]\nif missing:\n    print("없는 열:", missing)\n    continue\ndata = data[required_columns]`,
    authorEmpId: '20240103',
    author: '박OO 매니저',
    dept: '소프트웨어개발실',
    rank1Votes: 1,
    rank2Votes: 1,
    rank3Votes: 2,
    date: '2026.07.27'
  }
];

// App State Manager
class VibePortalApp {
  constructor() {
    this.slides = PPT_SLIDES;
    this.currentSlideIndex = 0;
    this.viewMode = 'deck'; // 'deck' (기본 카드 뷰), 'presentation' (대형 슬라이드 뷰), 'continuous' (59개 전체 연속 뷰)

    this.progress = this.loadFromStorage('vibecoding_user_progress', {
      completedCourses: [],
      completedChapters: {},
      quizScores: {}
    });

    this.userInfo = this.loadFromStorage('vibecoding_user_info', {
      empId: '20240101',
      name: 'K-감사관 (김OO 대리)',
      dept: '디지털감사팀'
    });

    this.submissions = this.loadFromStorage('vibecoding_submissions', INITIAL_SUBMISSIONS);
    this.allRankVotes = this.loadFromStorage('vibecoding_all_rank_votes', {
      '20240101': { rank1: 'sub-01', rank2: 'sub-02', rank3: 'sub-03' }
    });

    this.theme = this.loadFromStorage('vibecoding_theme', 'light');

    this.activeTab = 'course';
    this.searchQuery = '';
    this.sortBy = 'votes';
  }

  loadFromStorage(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.warn(`LocalStorage read error for key "${key}":`, e);
      return fallback;
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('vibecoding_user_progress', JSON.stringify(this.progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  saveSubmissions() {
    try {
      localStorage.setItem('vibecoding_submissions', JSON.stringify(this.submissions));
      localStorage.setItem('vibecoding_all_rank_votes', JSON.stringify(this.allRankVotes));
    } catch (e) {
      console.error('Failed to save submissions:', e);
    }
  }

  saveUserInfo() {
    try {
      localStorage.setItem('vibecoding_user_info', JSON.stringify(this.userInfo));
    } catch (e) {
      console.error('Failed to save user info:', e);
    }
  }

  saveTheme(theme) {
    this.theme = theme;
    try {
      localStorage.setItem('vibecoding_theme', JSON.stringify(theme));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }

  getUserRankVote() {
    const empId = this.userInfo.empId || 'GUEST';
    return this.allRankVotes[empId] || { rank1: '', rank2: '', rank3: '' };
  }

  getCourseProgress() {
    if (this.progress.completedCourses.includes('vibe-basic-101')) {
      return 100;
    }
    const viewedCount = (this.progress.completedChapters['vibe-basic-101'] || []).length;
    return Math.min(100, Math.round((viewedCount / 59) * 100));
  }

  markSlideViewed(slideNum) {
    if (!this.progress.completedChapters['vibe-basic-101']) {
      this.progress.completedChapters['vibe-basic-101'] = [];
    }
    const list = this.progress.completedChapters['vibe-basic-101'];
    if (!list.includes(slideNum)) {
      list.push(slideNum);
    }
    if (list.length >= 45) {
      if (!this.progress.completedCourses.includes('vibe-basic-101')) {
        this.progress.completedCourses.push('vibe-basic-101');
        showToast('🎉 축하합니다! PDF/PPT 슬라이드 교재를 성공적으로 수강하셨습니다!', 'success');
        triggerConfetti();
      }
    }
    this.saveProgress();
  }

  calculateSubmissionPoints(sub) {
    const r1 = sub.rank1Votes || 0;
    const r2 = sub.rank2Votes || 0;
    const r3 = sub.rank3Votes || 0;
    return (r1 * 3) + (r2 * 2) + (r3 * 1);
  }

  saveUserRankVote(rank1Id, rank2Id, rank3Id) {
    const empId = this.userInfo.empId;
    if (!empId) {
      showToast('⚠️ 사번(직원 고유번호)이 등록되어야 투표할 수 있습니다.', 'warning');
      openProfileModal();
      return false;
    }

    if (rank1Id === rank2Id || rank1Id === rank3Id || rank2Id === rank3Id) {
      showToast('⚠️ 1위, 2위, 3위 선택 시 동일한 작품을 중복 투표할 수 없습니다.', 'warning');
      return false;
    }

    const prev = this.getUserRankVote();
    if (prev.rank1) {
      const s = this.submissions.find(sub => sub.id === prev.rank1);
      if (s) s.rank1Votes = Math.max(0, (s.rank1Votes || 0) - 1);
    }
    if (prev.rank2) {
      const s = this.submissions.find(sub => sub.id === prev.rank2);
      if (s) s.rank2Votes = Math.max(0, (s.rank2Votes || 0) - 1);
    }
    if (prev.rank3) {
      const s = this.submissions.find(sub => sub.id === prev.rank3);
      if (s) s.rank3Votes = Math.max(0, (s.rank3Votes || 0) - 1);
    }

    this.allRankVotes[empId] = { rank1: rank1Id, rank2: rank2Id, rank3: rank3Id };

    if (rank1Id) {
      const s = this.submissions.find(sub => sub.id === rank1Id);
      if (s) s.rank1Votes = (s.rank1Votes || 0) + 1;
    }
    if (rank2Id) {
      const s = this.submissions.find(sub => sub.id === rank2Id);
      if (s) s.rank2Votes = (s.rank2Votes || 0) + 1;
    }
    if (rank3Id) {
      const s = this.submissions.find(sub => sub.id === rank3Id);
      if (s) s.rank3Votes = (s.rank3Votes || 0) + 1;
    }

    this.saveSubmissions();
    showToast(`🏆 사번 [${empId}] 1위(3점), 2위(2점), 3위(1점) 투표 저장이 완료되었습니다!`, 'success');
    triggerConfetti();
    return true;
  }

  addSubmission(authorEmpId, authorName, authorDept, title, desc, content) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

    if (authorEmpId) this.userInfo.empId = authorEmpId;
    if (authorName) this.userInfo.name = authorName;
    if (authorDept) this.userInfo.dept = authorDept;
    this.saveUserInfo();

    const newSub = {
      id: 'sub-' + Date.now(),
      title,
      desc,
      content,
      authorEmpId: authorEmpId || '20240999',
      author: authorName || '익명 직원',
      dept: authorDept || '사내 부서',
      rank1Votes: 0,
      rank2Votes: 0,
      rank3Votes: 0,
      date: dateStr
    };

    this.submissions.unshift(newSub);
    this.saveSubmissions();
    showToast('🚀 실습물이 제출되어 집합교육 시상 후보에 등록되었습니다!', 'success');
    triggerConfetti();
  }
}

// Instantiate App
const app = new VibePortalApp();

// DOM Init
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderHeaderAndBanner();
  renderTabBadges();
  renderMainView();

  setupSearchAndFilters();
  setupModalEvents();
  setupSubmissionForm();
  setupProfileForm();
  setupRankVoteForm();
});

function initTheme() {
  document.documentElement.setAttribute('data-theme', app.theme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = app.theme === 'dark' ? '☀️' : '🌙';

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const newTheme = app.theme === 'light' ? 'dark' : 'light';
      app.saveTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      showToast(`${newTheme === 'dark' ? '다크' : '라이트'} 모드로 전환되었습니다.`, 'info');
    });
  }
}

function renderHeaderAndBanner() {
  const empId = app.userInfo.empId;
  const name = app.userInfo.name;
  const dept = app.userInfo.dept;

  const nameDisplay = name ? `${name} (${empId || '사번미등록'})` : '사번 미등록 (클릭)';
  document.getElementById('headerUserName').textContent = nameDisplay;
  document.getElementById('headerUserDept').textContent = dept ? dept : '소속 부서 미설정';
  document.getElementById('headerAvatar').textContent = name ? name.charAt(0) : '👤';

  const progress = app.getCourseProgress();
  document.getElementById('statOverallProgress').textContent = progress;
  document.getElementById('bannerProgressFill').style.width = `${progress}%`;

  document.getElementById('statSubmissionCount').textContent = app.submissions.length;

  const currentVote = app.getUserRankVote();
  const hasVoted = currentVote.rank1 && currentVote.rank2 && currentVote.rank3;
  document.getElementById('statMyVotesCount').textContent = hasVoted ? '인증완료' : '미인증';
}

function renderTabBadges() {
  document.getElementById('galleryCountBadge').textContent = app.submissions.length;
  const myCount = app.userInfo.empId ? app.submissions.filter(s => s.authorEmpId === app.userInfo.empId || s.author === app.userInfo.name).length : 0;
  document.getElementById('mySubCountBadge').textContent = myCount;
}

function setupSearchAndFilters() {
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  searchInput.addEventListener('input', (e) => {
    app.searchQuery = e.target.value.trim().toLowerCase();
    searchClearBtn.style.display = app.searchQuery ? 'block' : 'none';
    renderMainView();
  });

  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    app.searchQuery = '';
    searchClearBtn.style.display = 'none';
    renderMainView();
  });

  const categoryTabs = document.getElementById('categoryTabs');
  categoryTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    app.activeTab = btn.dataset.category;
    renderMainView();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    app.sortBy = e.target.value;
    renderMainView();
  });
}

function renderMainView() {
  const grid = document.getElementById('mainGrid');
  grid.innerHTML = '';

  const sortSelect = document.getElementById('sortSelect');

  if (app.activeTab === 'course') {
    sortSelect.style.display = 'none';
    document.getElementById('resultsCount').textContent = 'PDF/PPT 59개 슬라이드 정독 교재';
    renderSingleCourseCard(grid);
  } else if (app.activeTab === 'gallery') {
    sortSelect.style.display = 'inline-block';
    renderSubmissionsGallery(grid, false);
  } else if (app.activeTab === 'my_sub') {
    sortSelect.style.display = 'inline-block';
    renderSubmissionsGallery(grid, true);
  }
}

function renderSingleCourseCard(container) {
  const isCompleted = app.progress.completedCourses.includes('vibe-basic-101');
  const progressPercent = app.getCourseProgress();
  const hasPassedQuiz = (app.progress.quizScores['vibe-basic-101'] || 0) >= 80;

  const card = document.createElement('article');
  card.className = `course-card ${isCompleted ? 'completed' : ''}`;
  card.style.gridColumn = '1 / -1';
  card.style.maxWidth = '920px';
  card.style.margin = '0 auto';

  card.innerHTML = `
    <div class="card-banner" style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)">
      <div class="card-banner-overlay"></div>
      <div class="card-banner-top">
        <span class="category-tag">PDF/PPT 슬라이드 뷰어</span>
        <span style="color:#fff; font-size:0.85rem; font-weight:700;">★ 고화질 슬라이드 59장 수록</span>
      </div>
      <div class="card-banner-bottom">
        <span class="level-badge beginner">● K-감사관 만화 시나리오 + 오프라인 세팅</span>
        <span>⏱ 45분</span>
      </div>
    </div>

    <div class="card-body">
      <h2 class="course-title" style="font-size: 1.4rem;">📊 [최신 PDF 연동] 업무 자동화를 위한 바이브 코딩 (59개 슬라이드 전체)</h2>
      <p class="course-desc" style="font-size: 0.95rem;">업데이트된 PDF/PPT 발표자료 원본 슬라이드 59장을 고화질 뷰어로 자유롭게 정독하고 학습하세요. (카드 뷰, 대형 뷰어, 59장 연속 스크롤 뷰 지원)</p>

      <div style="background-color: var(--primary-50); padding: 16px 20px; border-radius: var(--radius-md); border-left: 4px solid var(--primary-600); margin: 8px 0;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-800); margin-bottom: 6px;">🎁 PDF 슬라이드 교재 읽기 & 1·2·3위 투표 가이드</h4>
        <ol style="padding-left: 18px; font-size: 0.875rem; color: var(--text-main); display:flex; flex-direction:column; gap:6px;">
          <li><strong>'📊 PDF/PPT 슬라이드 교재 열기'</strong> 버튼을 눌러 원하는 뷰어 모드로 슬라이드를 정독합니다.</li>
          <li>Slide 25(엑셀 취합) 및 Slide 48(표도우미) 프롬프트를 복사하여 나만의 <strong>실습물</strong>을 만들어 제출합니다.</li>
          <li>상단 <strong>'🏆 순위 투표'</strong> 버튼을 클릭하고 사번 인증 후 1위(3점), 2위(2점), 3위(1점) 투표에 참여하세요!</li>
        </ol>
      </div>

      <div class="card-footer">
        <div class="progress-header">
          <span>${isCompleted ? '✔ PDF 슬라이드 교재 수강 완료' : '슬라이드 학습 진도율'}</span>
          <span class="progress-percent">${progressPercent}%</span>
        </div>

        <div class="card-progress-bar">
          <div class="card-progress-fill" style="width: ${progressPercent}%"></div>
        </div>

        <div class="card-actions">
          <button class="btn btn-primary" style="flex: 1; padding: 12px 20px; font-size:1rem;" onclick="openCourseDetailModal()">
            📊 PDF/PPT 슬라이드 교재 열기 (${progressPercent > 0 ? '이어서 학습' : '1페이지부터 열기'})
          </button>

          <button class="btn btn-accent" onclick="openSubmitModal()">
            ✨ 실습물 제출하기
          </button>

          ${hasPassedQuiz ? `
            <button class="btn btn-outline" onclick="openCertificateModal()" title="이수증 보기">
              🏆 이수증
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  container.appendChild(card);
}

function renderSubmissionsGallery(container, myOnly = false) {
  let list = [...app.submissions];

  if (myOnly) {
    if (app.userInfo.empId) {
      list = list.filter(s => s.authorEmpId === app.userInfo.empId || s.author === app.userInfo.name);
    } else {
      list = [];
    }
  }

  if (app.searchQuery) {
    const q = app.searchQuery;
    list = list.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.author.toLowerCase().includes(q) ||
      (s.authorEmpId && s.authorEmpId.toLowerCase().includes(q)) ||
      s.content.toLowerCase().includes(q)
    );
  }

  if (app.sortBy === 'votes') {
    list.sort((a, b) => app.calculateSubmissionPoints(b) - app.calculateSubmissionPoints(a));
  } else if (app.sortBy === 'latest') {
    list.sort((a, b) => b.id.localeCompare(a.id));
  } else if (app.sortBy === 'title') {
    list.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  }

  document.getElementById('resultsCount').textContent = `총 ${list.length}개의 실습 제출작`;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎨</div>
        <h3>${myOnly ? '아직 제출한 실습물이 없습니다.' : '등록된 실습물이 없습니다.'}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          ${myOnly ? '상단의 [실습물 제출하기] 버튼을 눌러 이름과 작품을 등록해보세요!' : '첫 번째 시상 후보 작품을 작성해 보세요.'}
        </p>
        <button class="btn btn-accent" onclick="openSubmitModal()">✨ 실습물 제출하기</button>
      </div>
    `;
    return;
  }

  const sortedByPointsList = [...app.submissions].sort((a, b) => app.calculateSubmissionPoints(b) - app.calculateSubmissionPoints(a));

  list.forEach(sub => {
    const points = app.calculateSubmissionPoints(sub);
    const rankIndex = sortedByPointsList.findIndex(s => s.id === sub.id);

    let rankBadgeText = '';
    if (rankIndex === 0 && points > 0) rankBadgeText = '🥇 종합 1위 선두';
    else if (rankIndex === 1 && points > 0) rankBadgeText = '🥈 종합 2위';
    else if (rankIndex === 2 && points > 0) rankBadgeText = '🥉 종합 3위';
    else if (points > 0) rankBadgeText = `${rankIndex + 1}위 (${points}점)`;

    const r1 = sub.rank1Votes || 0;
    const r2 = sub.rank2Votes || 0;
    const r3 = sub.rank3Votes || 0;

    const card = document.createElement('article');
    card.className = 'submission-card';
    card.innerHTML = `
      <div class="submission-card-header">
        <div class="author-badge">
          <div class="author-avatar">${sub.author ? sub.author.charAt(0) : '👤'}</div>
          <div>
            <div style="font-weight:700; font-size:0.95rem;">
              ${sub.author || '익명 직원'} <span style="font-size:0.8rem; color:var(--primary-600); font-weight:600;">(사번: ${sub.authorEmpId || '미등록'})</span>
            </div>
            <div style="font-size:0.775rem; color:var(--text-muted);">${sub.dept || '사내 부서'} · ${sub.date}</div>
          </div>
        </div>
        ${rankBadgeText ? `<span class="rank-badge">${rankBadgeText}</span>` : ''}
      </div>

      <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">${sub.title}</h3>
      <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${sub.desc}</p>

      <div>
        <div style="font-size: 0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">실습 프롬프트 / 코드 내용</div>
        <div class="code-box" style="font-size: 0.8rem; max-height: 110px;">
          <pre><code>${escapeHTML(sub.content)}</code></pre>
        </div>
      </div>

      <!-- Rank Vote Score Breakdown -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); flex-wrap:wrap; gap:8px;">
        <div style="font-size:0.8rem; color:var(--text-muted);">
          <span>🥇 1위(${r1})</span> · <span>🥈 2위(${r2})</span> · <span>🥉 3위(${r3})</span>
          <span style="margin-left:6px; font-weight:800; color:var(--primary-600); font-size:0.95rem;">= 총 ${points}점</span>
        </div>

        <button class="vote-btn" onclick="openRankVoteModal('${sub.id}')">
          🏆 1·2·3위 투표하기
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function escapeHTML(str) {
  return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}

function setupModalEvents() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.closeModal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  document.getElementById('openSubmitModalBtn').addEventListener('click', openSubmitModal);
  document.getElementById('openSubmitFromDetailBtn').addEventListener('click', () => {
    closeModal('courseDetailModal');
    openSubmitModal();
  });

  document.getElementById('startQuizBtn').addEventListener('click', () => {
    closeModal('courseDetailModal');
    openQuizModal();
  });

  document.getElementById('userProfileBtn').addEventListener('click', openProfileModal);

  document.getElementById('printCertBtn').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('resetAllDataBtn').addEventListener('click', () => {
    if (confirm('모든 진도율, 제출한 실습물 및 투표 기록을 초기화하시겠습니까?')) {
      localStorage.clear();
      location.reload();
    }
  });
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('active');
    m.setAttribute('aria-hidden', 'false');
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove('active');
    m.setAttribute('aria-hidden', 'true');
  }
}

function openSubmitModal() {
  if (app.userInfo.empId) document.getElementById('subAuthorEmpId').value = app.userInfo.empId;
  if (app.userInfo.name) document.getElementById('subAuthorName').value = app.userInfo.name;
  if (app.userInfo.dept) document.getElementById('subAuthorDept').value = app.userInfo.dept;
  openModal('submitProjectModal');
}

function openProfileModal() {
  const select = document.getElementById('rosterSelect');
  select.innerHTML = '<option value="">-- 내부망 임직원 명단에서 선택 (사번/성명/부서) --</option>';

  INTERNAL_EMPLOYEE_ROSTER.forEach((emp, i) => {
    const isSel = app.userInfo.empId === emp.empId;
    select.innerHTML += `<option value="${i}" ${isSel ? 'selected' : ''}>[사번: ${emp.empId}] ${emp.dept} - ${emp.name}</option>`;
  });

  document.getElementById('inputUserEmpId').value = app.userInfo.empId || '';
  document.getElementById('inputUserName').value = app.userInfo.name || '';
  document.getElementById('inputUserDept').value = app.userInfo.dept || '';
  openModal('profileModal');
}

function onRosterSelectChange(selectEl) {
  const val = selectEl.value;
  if (val !== '') {
    const emp = INTERNAL_EMPLOYEE_ROSTER[parseInt(val, 10)];
    if (emp) {
      document.getElementById('inputUserEmpId').value = emp.empId;
      document.getElementById('inputUserName').value = emp.name;
      document.getElementById('inputUserDept').value = emp.dept;
    }
  }
}

function openRankVoteModal(defaultSubId = '') {
  if (!app.userInfo.empId) {
    showToast('⚠️ 먼저 본인의 사번(직원 고유번호)을 등록해야 투표에 참여할 수 있습니다.', 'warning');
    openProfileModal();
    return;
  }

  document.getElementById('voteModalEmpIdDisplay').textContent = `${app.userInfo.name} (사번: ${app.userInfo.empId} / ${app.userInfo.dept})`;

  const r1Select = document.getElementById('voteRank1Select');
  const r2Select = document.getElementById('voteRank2Select');
  const r3Select = document.getElementById('voteRank3Select');

  let opts = '<option value="">-- 작품 선택 --</option>';
  app.submissions.forEach(sub => {
    opts += `<option value="${sub.id}">[사번 ${sub.authorEmpId || '미등록'} | ${sub.author}] ${sub.title}</option>`;
  });

  r1Select.innerHTML = opts;
  r2Select.innerHTML = opts;
  r3Select.innerHTML = opts;

  const userVote = app.getUserRankVote();
  r1Select.value = userVote.rank1 || defaultSubId || (app.submissions[0] ? app.submissions[0].id : '');
  r2Select.value = userVote.rank2 || (app.submissions[1] ? app.submissions[1].id : '');
  r3Select.value = userVote.rank3 || (app.submissions[2] ? app.submissions[2].id : '');

  openModal('rankVoteModal');
}

function setupRankVoteForm() {
  const form = document.getElementById('rankVoteForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const r1 = document.getElementById('voteRank1Select').value;
    const r2 = document.getElementById('voteRank2Select').value;
    const r3 = document.getElementById('voteRank3Select').value;

    if (!r1 || !r2 || !r3) {
      showToast('⚠️ 1위, 2위, 3위 선택지를 모두 지정해 주세요.', 'warning');
      return;
    }

    if (app.saveUserRankVote(r1, r2, r3)) {
      closeModal('rankVoteModal');
      renderHeaderAndBanner();
      renderTabBadges();
      renderMainView();
    }
  };
}

// Open Course Modal & Render PDF/PPT Slide Reader
function openCourseDetailModal() {
  renderPPTSlidePlayer();
  openModal('courseDetailModal');
}

// Set Slide View Mode: 'deck' (카드 뷰), 'presentation' (대형 뷰어), 'continuous' (59장 연속 스크롤)
function setSlideViewMode(mode) {
  app.viewMode = mode;
  renderPPTSlidePlayer();
}

// Render High-Quality Interactive PDF/PPT Presentation Reader
function renderPPTSlidePlayer() {
  const slide = app.slides[app.currentSlideIndex];
  app.markSlideViewed(slide.num);

  const chaptersContainer = document.getElementById('detailChaptersList');
  document.getElementById('detailTitle').textContent = `📊 [PDF/PPT 발표교재] ${slide.part}`;
  document.getElementById('detailDesc').textContent = `슬라이드 ${slide.num} / ${app.slides.length}: ${slide.title}`;

  let selectOptions = '';
  app.slides.forEach((s, idx) => {
    selectOptions += `<option value="${idx}" ${idx === app.currentSlideIndex ? 'selected' : ''}>[Slide ${s.num}] ${s.title.substring(0, 35)}...</option>`;
  });

  // View Mode Selector Toolbar HTML
  const viewModeToolbar = `
    <div style="background:var(--bg-main); border:1px solid var(--border-color); padding:12px 18px; border-radius:var(--radius-lg); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
      <!-- Slide Traversal Controls -->
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="btn btn-outline" onclick="changeSlide(-1)" title="이전 슬라이드">
          ◀ 이전
        </button>
        <button class="btn btn-primary" onclick="changeSlide(1)" title="언제라도 누를 수 있는 다음 슬라이드">
          다음 슬라이드 ▶
        </button>
      </div>

      <!-- Quick Jump Selector Dropdown -->
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:0.85rem; font-weight:700; color:var(--text-main);">슬라이드 이동:</span>
        <select onchange="jumpToSlide(parseInt(this.value, 10))" class="filter-select" style="max-width:240px; padding:6px 12px; font-size:0.85rem;">
          ${selectOptions}
        </select>
      </div>

      <!-- View Mode Switches -->
      <div style="display:flex; align-items:center; gap:6px; background:var(--bg-card); padding:4px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <button class="btn ${app.viewMode === 'deck' ? 'btn-primary' : 'btn-outline'}" style="padding:4px 10px; font-size:0.75rem;" onclick="setSlideViewMode('deck')">
          📱 카드 뷰
        </button>
        <button class="btn ${app.viewMode === 'presentation' ? 'btn-primary' : 'btn-outline'}" style="padding:4px 10px; font-size:0.75rem;" onclick="setSlideViewMode('presentation')">
          🖼️ 대형 뷰어
        </button>
        <button class="btn ${app.viewMode === 'continuous' ? 'btn-primary' : 'btn-outline'}" style="padding:4px 10px; font-size:0.75rem;" onclick="setSlideViewMode('continuous')">
          📜 59장 연속 스크롤
        </button>
      </div>
    </div>
  `;

  // MODE 1: Continuous All 59 Slides Scroll View (59장 연속 스크롤 뷰)
  if (app.viewMode === 'continuous') {
    let allSlidesHTML = '';
    app.slides.forEach(s => {
      allSlidesHTML += `
        <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="category-tag">${s.part}</span>
            <span style="font-weight:900; color:var(--primary-600);">SLIDE ${s.num} / 59</span>
          </div>
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:8px;">${escapeHTML(s.title)}</h3>
          <div style="text-align:center; margin:12px 0;">
            <img src="${s.image}" class="slide-comic-img" style="max-height:480px;" alt="Slide ${s.num}" onError="this.style.display='none';">
          </div>
          <div style="background:var(--bg-main); padding:14px; border-radius:var(--radius-md); font-size:0.875rem; line-height:1.6; white-space:pre-line;">
            ${escapeHTML(s.body)}
          </div>
          ${s.prompt ? `
            <div style="margin-top:10px;">
              <div style="font-size:0.775rem; font-weight:700; color:var(--primary-600); margin-bottom:4px;">📋 AI 프롬프트 (클릭 시 복사)</div>
              <div class="prompt-copy-box" onclick="copyTextToClipboard(\`${escapeHTML(s.prompt)}\`)">${escapeHTML(s.prompt)}</div>
            </div>
          ` : ''}
          ${s.code ? `
            <div style="margin-top:10px;">
              <div style="font-size:0.775rem; font-weight:700; color:var(--text-muted); margin-bottom:4px;">💻 예시 코드</div>
              <div class="code-box" style="font-size:0.8rem; margin:0;"><pre><code>${escapeHTML(s.code)}</code></pre></div>
            </div>
          ` : ''}
        </div>
      `;
    });

    chaptersContainer.innerHTML = viewModeToolbar + `<div style="max-height:600px; overflow-y:auto; padding-right:8px; margin-top:12px;">${allSlidesHTML}</div>`;
    return;
  }

  // MODE 2: Presentation Full-width View (대형 슬라이드 뷰어)
  if (app.viewMode === 'presentation') {
    chaptersContainer.innerHTML = viewModeToolbar + `
      <div style="background:#0f172a; border-radius:var(--radius-xl); padding:24px; text-align:center; box-shadow:var(--shadow-lg); margin-top:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; color:#94a3b8; font-size:0.85rem; margin-bottom:12px;">
          <span>${slide.part}</span>
          <span style="color:#38bdf8; font-weight:900;">SLIDE ${slide.num} / 59</span>
        </div>
        <img src="${slide.image}" class="slide-comic-img" style="max-height:580px; width:100%; object-fit:contain; border-radius:var(--radius-md); box-shadow:0 10px 25px rgba(0,0,0,0.5);" alt="Slide ${slide.num}">
        <div style="color:#ffffff; margin-top:14px; font-size:1.1rem; font-weight:700; text-align:left; background:rgba(255,255,255,0.08); padding:14px 20px; border-radius:var(--radius-md);">
          ${escapeHTML(slide.title)}
          <div style="font-size:0.875rem; color:#94a3b8; font-weight:normal; margin-top:4px; white-space:pre-line;">${escapeHTML(slide.body)}</div>
        </div>
      </div>
    `;
    return;
  }

  // MODE 3: Default Deck Card View (기본 슬라이드 카드 뷰)
  chaptersContainer.innerHTML = viewModeToolbar + `
    <!-- Active PPT Slide Canvas Frame -->
    <div style="background:var(--bg-card); border:2px solid var(--primary-500); border-radius:var(--radius-xl); padding:28px; box-shadow:var(--shadow-md); display:flex; flex-direction:column; gap:16px; position:relative; min-height: 380px; margin-top:12px;">
      
      <!-- Top Slide Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed var(--border-color); padding-bottom:12px;">
        <span class="category-tag" style="background:var(--primary-600); color:white; font-size:0.8rem;">
          ${slide.part}
        </span>
        <span style="font-size:1.1rem; font-weight:900; color:var(--primary-700);">
          SLIDE ${slide.num} / ${app.slides.length}
        </span>
      </div>

      <!-- Slide Title & Subtitle -->
      <div>
        <div class="comic-badge-banner">📊 PDF/PPT 발표자료 고화질 원본 슬라이드</div>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; line-height:1.3;">
          ${escapeHTML(slide.title)}
        </h2>
        ${slide.subtitle ? `<p style="font-size: 0.95rem; color: var(--primary-600); font-weight:600;">${escapeHTML(slide.subtitle)}</p>` : ''}
      </div>

      <!-- High-Res Presentation Slide Image -->
      ${slide.image ? `
        <div style="text-align:center;">
          <img src="${slide.image}" class="slide-comic-img" style="max-height:420px; width:100%; border:1px solid var(--border-color);" alt="Slide ${slide.num} 원본 슬라이드" onError="this.style.display='none';">
        </div>
      ` : ''}

      <!-- Slide Body Text -->
      <div style="background:var(--bg-main); padding:18px 20px; border-radius:var(--radius-lg); border:1px solid var(--border-color); font-size:0.925rem; line-height:1.7; color:var(--text-main); white-space:pre-line;">
        ${escapeHTML(slide.body)}
      </div>

      <!-- AI Prompt Box if Slide contains Prompt -->
      ${slide.prompt ? `
        <div style="margin-top: 4px;">
          <div style="font-size: 0.8rem; font-weight:700; color:var(--primary-600); margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
            <span>📋 슬라이드 ${slide.num} AI 프롬프트 템플릿 (클릭 시 1초 복사)</span>
            <button class="btn btn-outline" style="padding:3px 10px; font-size:0.775rem;" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">복사하기</button>
          </div>
          <div class="prompt-copy-box" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">${escapeHTML(slide.prompt)}</div>
        </div>
      ` : ''}

      <!-- Command or Code Box if Slide contains Code -->
      ${slide.code ? `
        <div style="margin-top: 4px;">
          <div style="font-size: 0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:6px;">💻 슬라이드 ${slide.num} 코드 스니펫</div>
          <div class="code-box" style="font-size:0.85rem; margin:0;">
            <pre><code>${escapeHTML(slide.code)}</code></pre>
          </div>
        </div>
      ` : ''}

      ${slide.cmd ? `
        <div style="margin-top: 4px;">
          <div style="font-size: 0.8rem; font-weight:700; color:var(--accent-emerald); margin-bottom:6px;">⚡ 실행 명령어</div>
          <div class="code-box" style="font-size:0.85rem; background:#047857; color:white;">
            <code>${escapeHTML(slide.cmd)}</code>
          </div>
        </div>
      ` : ''}

      <!-- Bottom Progress Indicator Bar -->
      <div style="margin-top:auto; padding-top:12px; display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-muted);">
        <span>학습한 슬라이드: ${(app.progress.completedChapters['vibe-basic-101'] || []).length} / 59</span>
        <button class="btn btn-outline" style="padding:6px 12px; font-size:0.8rem;" onclick="app.markSlideViewed(${slide.num}); renderHeaderAndBanner(); renderPPTSlidePlayer();">
          ✔ 이 슬라이드 출석 체크
        </button>
      </div>
    </div>
  `;
}

function changeSlide(direction) {
  app.currentSlideIndex = (app.currentSlideIndex + direction + app.slides.length) % app.slides.length;
  renderPPTSlidePlayer();
}

function jumpToSlide(index) {
  if (index >= 0 && index < app.slides.length) {
    app.currentSlideIndex = index;
    renderPPTSlidePlayer();
  }
}

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text);
  showToast('프롬프트 텍스트가 클립보드에 복사되었습니다!', 'success');
}

function setupSubmissionForm() {
  const form = document.getElementById('submissionForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const authorEmpId = document.getElementById('subAuthorEmpId').value.trim();
    const authorName = document.getElementById('subAuthorName').value.trim();
    const authorDept = document.getElementById('subAuthorDept').value.trim();
    const title = document.getElementById('subTitle').value.trim();
    const desc = document.getElementById('subDesc').value.trim();
    const content = document.getElementById('subContent').value.trim();

    if (authorEmpId && title && desc && content) {
      app.addSubmission(authorEmpId, authorName, authorDept, title, desc, content);
      form.reset();
      closeModal('submitProjectModal');

      app.activeTab = 'gallery';
      document.querySelectorAll('#categoryTabs .tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.category === 'gallery');
      });

      renderHeaderAndBanner();
      renderTabBadges();
      renderMainView();
    }
  };
}

function openQuizModal() {
  document.getElementById('quizCourseTitle').textContent = '🚀 PDF/PPT 기초 자가진단 퀴즈';
  renderQuizContent();
  openModal('quizModal');
}

function renderQuizContent() {
  const container = document.getElementById('quizBodyContent');
  container.innerHTML = '';

  let html = `
    <div style="background-color: var(--primary-50); padding: 16px 20px; border-radius: var(--radius-md); font-size: 0.9rem;">
      💡 PDF 59개 슬라이드 핵심 내용에 관한 자가진단 퀴즈입니다. <strong>80점 이상</strong> 획득 시 수료증이 발급됩니다.
    </div>
    <form id="quizForm" style="display:flex; flex-direction:column; gap:20px;">
  `;

  if (BASIC_COURSE && BASIC_COURSE.quiz) {
    BASIC_COURSE.quiz.forEach((qItem, qIdx) => {
      html += `
        <div class="quiz-card">
          <div class="quiz-question-num">문제 0${qIdx + 1}</div>
          <div class="quiz-question-text">${qItem.q}</div>
          <div class="quiz-options-list">
      `;

      qItem.options.forEach((optText, oIdx) => {
        html += `
          <label class="quiz-option-label">
            <input type="radio" name="q_${qIdx}" value="${oIdx}" required>
            <span>${optText}</span>
          </label>
        `;
      });

      html += `
          </div>
          <div id="explanation_${qIdx}" class="quiz-explanation"></div>
        </div>
      `;
    });
  }

  html += `
      <button type="submit" class="btn btn-primary" style="padding: 12px; font-size: 1rem;">
        📝 퀴즈 정답 제출 및 채점
      </button>
    </form>
  `;

  container.innerHTML = html;

  document.getElementById('quizForm').onsubmit = (e) => {
    e.preventDefault();
    gradeQuiz();
  };
}

const BASIC_COURSE = {
  quiz: [
    {
      q: 'Python 설치 시 가장 중요한 첫 번째 설정 항목은 무엇인가요?',
      options: [
        '첫 화면 하단의 [Add python.exe to PATH] 체크박스를 반드시 체크한다.',
        '설치 경로를 무조건 C드라이브 루트로 바꾼다.',
        '인터넷 연결을 끊고 설치한다.',
        '파이썬 설치를 취소한다.'
      ],
      answer: 0,
      explanation: '정답입니다! [Add python.exe to PATH]를 체크해야 VS Code 및 터미널에서 python 명령어를 정상 인식합니다.'
    },
    {
      q: '엑셀 취합 시 ~$A경찰서.xlsx 같은 파일을 읽기 목록에서 제외해야 하는 이유는 무엇인가요?',
      options: [
        '엑셀이 열려 있을 때 생성되는 임시 파일이므로 실제 데이터 파일이 아니기 때문이다.',
        '파일 크기가 너무 크기 때문이다.',
        '암호가 걸려 있기 때문이다.',
        '확장자가 다르기 때문이다.'
      ],
      answer: 0,
      explanation: '정답입니다! ~$로 시작하는 파일은 엑셀의 임시 파일이므로 제외(not startswith("~$"))해야 오류를 방지할 수 있습니다.'
    }
  ]
};

function gradeQuiz() {
  const form = document.getElementById('quizForm');
  let correctCount = 0;

  BASIC_COURSE.quiz.forEach((qItem, qIdx) => {
    const selected = form.querySelector(`input[name="q_${qIdx}"]:checked`);
    const expDiv = document.getElementById(`explanation_${qIdx}`);

    if (selected && parseInt(selected.value, 10) === qItem.answer) {
      correctCount++;
      expDiv.className = 'quiz-explanation correct';
      expDiv.textContent = `⭕ 정답입니다! ${qItem.explanation}`;
    } else {
      expDiv.className = 'quiz-explanation incorrect';
      expDiv.textContent = `❌ 오답입니다. - ${qItem.explanation}`;
    }
  });

  const score = Math.round((correctCount / BASIC_COURSE.quiz.length) * 100);
  app.progress.quizScores['vibe-basic-101'] = score;
  app.saveProgress();

  renderHeaderAndBanner();
  renderMainView();

  const isPassed = score >= 80;
  if (isPassed) triggerConfetti();

  const container = document.getElementById('quizBodyContent');
  const resultBanner = document.createElement('div');
  resultBanner.className = 'quiz-result-banner';
  resultBanner.innerHTML = `
    <div style="font-size: 1.2rem; font-weight: 800;">
      ${isPassed ? '🎉 축하합니다! 기초 퀴즈에 합격하셨습니다!' : '💪 다시 도전해보세요!'}
    </div>
    <div class="quiz-score-badge">${score}점</div>
    ${isPassed ? `
      <button class="btn btn-primary" onclick="closeModal('quizModal'); openCertificateModal();">
        🏆 기초교육 수료증 확인
      </button>
    ` : ''}
  `;

  container.insertBefore(resultBanner, container.firstChild);
}

function openCertificateModal() {
  document.getElementById('certCourseTitle').textContent = '업무 자동화를 위한 바이브 코딩 (PDF 59개 슬라이드 수강)';
  document.getElementById('certEmpId').textContent = app.userInfo.empId || '20240101';
  document.getElementById('certUserName').textContent = app.userInfo.name || '사내 임직원';
  document.getElementById('certDeptName').textContent = app.userInfo.dept || '소속 부서';

  const now = new Date();
  const dateStr = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}`;
  document.getElementById('certIssueDate').textContent = dateStr;
  document.getElementById('certId').textContent = `VIBE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  openModal('certificateModal');
}

function setupProfileForm() {
  const form = document.getElementById('profileForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const empId = document.getElementById('inputUserEmpId').value.trim();
    const name = document.getElementById('inputUserName').value.trim();
    const dept = document.getElementById('inputUserDept').value.trim();

    if (empId && name && dept) {
      app.userInfo.empId = empId;
      app.userInfo.name = name;
      app.userInfo.dept = dept;
      app.saveUserInfo();

      renderHeaderAndBanner();
      renderTabBadges();
      renderMainView();
      closeModal('profileModal');
      showToast(`'${name}' 님 (사번: ${empId}) 사번 식별 정보가 저장되었습니다.`, 'success');
    }
  };
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function triggerConfetti() {
  const colors = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = '-20px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    particle.style.animationDuration = `${1.5 + Math.random() * 2}s`;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 3500);
  }
}
