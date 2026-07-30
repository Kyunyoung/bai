/* ==========================================
   바이브코딩 사내 교육 포털 - Core JavaScript (ES6+)
   최신 PDF (59개 슬라이드) 교재 데이터 완벽 반영 단일 메인 뷰어
   ========================================== */

// Exact 59 Slides Dataset from Latest PDF (vibe_coding_55_scenario_offline_install_added.pdf)
const PPT_SLIDES = [
  {
    num: 1,
    part: 'PART 01. 도입부',
    title: '업무 자동화를 위한 바이브 코딩',
    subtitle: '도입부 → 초급 엑셀 취합 → 중급 표도우미',
    image: 'slides_media/슬라이드1.JPG',
    body: '• 경찰서 250여 개 엑셀 자료 취합 사례로 시작합니다.'
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
    body: '• 단순 복사/붙여넣기 업무가 가지는 한계와 문제점 인식\n• K-감사관 만화 캐릭터 사례를 통한 업무 효율화 필요성 체감'
  },
  {
    num: 4,
    part: 'PART 01. 도입부',
    title: 'SCENE 01 전국 경찰서 자료가 도착했습니다',
    subtitle: 'K-감사관의 폴더에 경찰서 엑셀 파일이 빼곡히 들어 있습니다.',
    image: 'slides_media/슬라이드4.JPG',
    body: '• 전국 경찰서 약 250여 개 엑셀 파일 제출\n• 서울중부경찰서.xlsx, 부산중부경찰서.xlsx …\n• 형식은 같지만 파일 수가 많음\n• "형식은 같으니까 금방 끝나겠지?"라는 착각'
  },
  {
    num: 5,
    part: 'PART 01. 도입부',
    title: 'SCENE 02 처음에는 단순해 보였습니다',
    subtitle: '하나씩 열고 복사하고 붙이면 될 것처럼 보입니다.',
    image: 'slides_media/슬라이드5.JPG',
    body: '• 서울중부경찰서 자료 복사 -> 서울종로경찰서 자료 붙여넣기\n• 다음은 서울남대문경찰서...\n• 파일이 10개가 아니라 250개면 이야기가 달라집니다.'
  },
  {
    num: 6,
    part: 'PART 01. 도입부',
    title: 'SCENE 03 3시간 후, 불안이 시작됩니다',
    subtitle: '수작업 취합은 시간보다 정확성이 더 큰 문제입니다.',
    image: 'slides_media/슬라이드6.JPG',
    body: '• "부산중부경찰서 파일을 붙였던가?"\n• "제목 행이 중간에 한 번 더 들어간 것 같은데…"\n• 파일 누락·제목 행 중복·복사 범위 오류 발생 가능\n• 한 번 틀리면 검토 시간까지 다시 늘어납니다.'
  },
  {
    num: 7,
    part: 'PART 01. 도입부',
    title: 'SCENE 04 추가 요구사항이 등장합니다',
    subtitle: '업무는 한 번에 끝나지 않습니다.',
    image: 'slides_media/슬라이드7.JPG',
    body: '• 수석님: "조치계획 항목도 같이 취합해 주세요."\n• 과장님: "원본 파일명도 남겨야 확인하기 좋겠네요."\n• 국장님: "지방청별로 구분할 수 있게 지역 열도 추가합시다."\n• 요구가 바뀌면 250개를 다시 열어야 합니다.'
  },
  {
    num: 8,
    part: 'PART 01. 도입부',
    title: 'REFRAME 질문을 바꾸면 자동화가 시작됩니다',
    subtitle: '바이브 코딩은 이 질문에서 시작됩니다.',
    image: 'slides_media/슬라이드8.JPG',
    body: '• 이 일을 매번 손으로 해야 할까?\n• 규칙이 있다면 컴퓨터가 대신할 수 있지 않을까?\n• 내가 원하는 절차를 AI에게 설명하면 코드로 만들 수 있지 않을까?\n💡 핵심 원칙: 반복 작업은 컴퓨터에게, 판단은 사람에게!'
  },
  {
    num: 9,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'PART 02 초급 과정: 개발환경 세팅',
    subtitle: '초보자가 가장 많이 막히는 부분을 먼저 해결합니다.',
    image: 'slides_media/슬라이드9.JPG',
    body: '• 환경 세팅의 장벽을 낮추고 오프라인/내부망 PC에서 실행 성공 경험 생성'
  },
  {
    num: 10,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'SETUP PRINCIPLE 초급에서는 가상환경을 생략합니다',
    subtitle: '오늘의 목표는 내부망 PC에서 설치부터 코드 실행까지 직접 성공하는 경험입니다.',
    image: 'slides_media/슬라이드10.JPG',
    body: '• Python 설치 확인, VS Code 실행, pip 설치, 코드 실행으로 단순화\n• 가상환경은 중급·배포·장기 유지보수 단계에서 권장\n• 초보자에게는 가상환경 자체가 첫 장벽이 될 수 있으므로 먼저 성공 경험을 생성합니다.'
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
5. Python 확장 (.vsix) 오프라인 설치
6. Python 설치 확인 (python --version)
7. VS Code에서 실습 폴더 열기
8. 오프라인 라이브러리 설치 (pandas, openpyxl)`
  },
  {
    num: 12,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 1 실습 폴더 만들기',
    subtitle: 'D드라이브에 D:\\vibe_excel 폴더 생성',
    image: 'slides_media/슬라이드12.JPG',
    body: '• D드라이브에 D:\\vibe_excel 폴더를 생성합니다.\n• 그 안에 input, output 폴더를 만듭니다.\n• input에는 경찰서 제출 파일을 넣고, output은 결과 보관용입니다.'
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
 └─ packages (pandas, openpyxl)`
  },
  {
    num: 14,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 3 Python 설치하기',
    subtitle: 'Add python.exe to PATH 체크 필수!',
    image: 'slides_media/슬라이드14.JPG',
    body: '• 제공받은 Python 설치 파일을 더블클릭\n• 첫 화면 하단 [Add python.exe to PATH] 체크박스를 반드시 체크\n• [Install Now] 클릭하여 완료'
  },
  {
    num: 15,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 4 VS Code 설치하기',
    subtitle: '사용권 동의 및 기본 설치 진행',
    image: 'slides_media/슬라이드15.JPG',
    body: '• PATH에 추가, Code로 열기 항목을 체크하면 편리합니다.\n• 설치 완료 후 Visual Studio Code 실행'
  },
  {
    num: 16,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 5 Python 확장 오프라인 설치',
    subtitle: 'Extensions -> (...) -> Install from VSIX...',
    image: 'slides_media/슬라이드16.JPG',
    body: '• VS Code 좌측 확장(Extensions) 클릭\n• 우측 상단 (...) 버튼 -> Install from VSIX... 선택\n• 제공받은 python-extension.vsix 파일 선택'
  },
  {
    num: 17,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 6 Python 설치 확인',
    subtitle: '터미널에서 명령어 확인',
    image: 'slides_media/슬라이드17.JPG',
    cmd: 'python --version',
    body: '• 터미널에 python --version 입력하여 Python 3.x.x 표시 확인\n• 안 될 경우 Add to PATH 체크 여부 확인'
  },
  {
    num: 18,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 7 VS Code에서 실습 폴더 열기',
    subtitle: 'File -> Open Folder (D:\\vibe_excel)',
    image: 'slides_media/슬라이드18.JPG',
    body: '• File -> Open Folder 선택\n• D:\\vibe_excel 선택하여 열기\n• 탐색기에 input, output 폴더가 보이면 성공!'
  },
  {
    num: 19,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 8 터미널 열기와 위치 확인',
    subtitle: 'Terminal -> New Terminal',
    image: 'slides_media/슬라이드19.JPG',
    body: '• Terminal -> New Terminal 선택\n• 터미널 경로가 D:\\vibe_excel 인지 확인'
  },
  {
    num: 20,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 9 오프라인 라이브러리 설치',
    subtitle: 'pandas 및 openpyxl 오프라인 설치',
    image: 'slides_media/슬라이드20.JPG',
    cmd: 'py -m pip install --no-index --find-links=D:\\vibe_setup\\packages pandas openpyxl',
    body: '• pandas: 엑셀 자료를 표처럼 읽고 합치기\n• openpyxl: xlsx 파일 저장 엔진'
  },
  {
    num: 21,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'CHECKLIST 개발환경 세팅 체크리스트',
    subtitle: '초급 환경 세팅 완성 점검',
    image: 'slides_media/슬라이드21.JPG',
    body: '1. 설치 파일 폴더 복사 완료\n2. Python 설치 시 PATH 체크 완료\n3. python/py 버전 정상 출력\n4. VS Code 및 확장 설치 완료\n5. D:\\vibe_excel 폴더 열기 완료\n6. pandas·openpyxl 설치 완료\n💡 여기까지 오면 절반은 성공입니다!'
  },
  {
    num: 22,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PART 03 초급 실습: 엑셀 취합 프로그램',
    subtitle: '경찰서 엑셀 파일을 하나로 취합하는 프로그램을 직접 만듭니다.',
    image: 'slides_media/슬라이드22.JPG',
    body: '• pandas를 활용해 input 폴더의 엑셀 파일을 읽고 병합하는 과정입니다.'
  },
  {
    num: 23,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PRACTICE GOAL 오늘 만들 초급 프로그램',
    subtitle: '폴더 안의 여러 xlsx 파일을 찾아 하나로 합칩니다.',
    image: 'slides_media/슬라이드23.JPG',
    body: '• 폴더 선택 창 띄우기\n• 엑셀 파일 자동 찾기\n• 자료를 읽어서 하나로 합치기\n• 결과 파일 저장하기'
  },
  {
    num: 24,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PRACTICE DATA 경찰서 제출 파일 예시',
    subtitle: '실습은 3개 파일로 진행하며 250개 동일 원리 적용',
    image: 'slides_media/슬라이드24.JPG',
    body: '• 서울중부경찰서.xlsx, 부산중부경찰서.xlsx, 대구중부경찰서.xlsx ...\n• 자료가 많아도 형식이 같다면 자동화 대상입니다!'
  },
  {
    num: 25,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PROMPT ChatGPT에게 첫 요청하기',
    subtitle: '엑셀 병합 기본 프롬프트 작성',
    image: 'slides_media/슬라이드25.JPG',
    prompt: `파이썬 pandas를 사용해서 특정 폴더 안의 모든 엑셀 파일을 하나로 합치는 코드를 작성해줘.

조건:
1. input 폴더 안의 모든 .xlsx 파일을 읽을 것
2. 각 파일의 첫 번째 시트 데이터를 취합할 것
3. 결과를 output/combined.xlsx 로 저장할 것
4. 초보자도 이해할 수 있도록 코드에 자세한 주석을 달아줄 것`,
    body: '기본 엑셀 병합 코드 프롬프트 요청'
  },
  {
    num: 26,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CODE 1/3 폴더 선택 코드',
    subtitle: 'tkinter file-dialog 활용',
    image: 'slides_media/슬라이드26.JPG',
    code: `import tkinter as tk
from tkinter import filedialog

root = tk.Tk()
root.withdraw()
folder_selected = filedialog.askdirectory(title="엑셀 폴더 선택")`,
    body: '사용자 폴더 선택창 생성'
  },
  {
    num: 27,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CODE 2/3 엑셀 파일 찾기와 읽기',
    subtitle: 'os.listdir & pd.read_excel',
    image: 'slides_media/슬라이드27.JPG',
    code: `import os
import pandas as pd

all_data = []
for file in os.listdir(folder_selected):
    if file.endswith('.xlsx') and not file.startswith('~$'):
        file_path = os.path.join(folder_selected, file)
        df = pd.read_excel(file_path)
        all_data.append(df)`,
    body: '엑셀 임시 파일 예외 처리 및 데이터 수집'
  },
  {
    num: 28,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CODE 3/3 합치고 저장하기',
    subtitle: 'pd.concat & to_excel',
    image: 'slides_media/슬라이드28.JPG',
    code: `result = pd.concat(all_data, ignore_index=True)
output_file = os.path.join(folder_selected, 'merged_result.xlsx')
result.to_excel(output_file, index=False)
print("취합 완료!")`,
    body: '데이터프레임 병합 및 엑셀 저장'
  },
  {
    num: 29,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'RUN 코드 실행하기',
    subtitle: 'python merge_excel.py',
    image: 'slides_media/슬라이드29.JPG',
    cmd: 'python merge_excel.py',
    body: '• 터미널에서 merge_excel.py 실행\n• input 폴더 선택\n• merged_result.xlsx 저장 확인'
  },
  {
    num: 30,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'RESULT 결과 확인하기',
    subtitle: '250개 파일 일괄 수집 성공',
    image: 'slides_media/슬라이드30.JPG',
    body: '• 250개 파일을 하나씩 여는 수작업이 버튼 한 번으로 자동화되었습니다.'
  },
  {
    num: 31,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'ERROR 01 오류 해결: pandas가 없다고 나올 때',
    subtitle: 'ModuleNotFoundError: No module named pandas',
    image: 'slides_media/슬라이드31.JPG',
    cmd: 'pip install pandas openpyxl',
    body: '• 원인: pandas 라이브러리가 설치되어 있지 않음\n• 해결: pip install 명령어 실행'
  },
  {
    num: 32,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'ERROR 02 오류 해결: 저장이 안 될 때',
    subtitle: 'PermissionError: Permission denied',
    image: 'slides_media/슬라이드32.JPG',
    body: '• 원인: merged_result.xlsx 파일이 엑셀에서 열려 있음\n• 해결: 엑셀 파일 열림을 닫고 다시 실행'
  },
  {
    num: 33,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'ERROR 03 오류 해결: 임시 파일 제외',
    subtitle: '~$ 파일 스킵 처리',
    image: 'slides_media/슬라이드33.JPG',
    code: `if file.endswith('.xlsx') and not file.startswith('~$'):`,
    body: '• ~$A기관.xlsx 임시 파일 읽기 예외 처리'
  },
  {
    num: 34,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CHANGE 01 요구사항 변경: 특정 열만 취합',
    subtitle: '필요한 4개 열 선별',
    image: 'slides_media/슬라이드34.JPG',
    code: `df = df[['기관명', '담당자', '점검결과', '비고']]`,
    body: '• 기관명, 점검결과, 비고 열만 선택 수집'
  },
  {
    num: 35,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CHANGE 02 요구사항 변경: 원본파일명 추가',
    subtitle: '출처 파악용 파일명 기록',
    image: 'slides_media/슬라이드35.JPG',
    code: `df['원본파일명'] = file`,
    body: '• data["원본파일명"] = os.path.basename(file_path)\n• 어느 기관 자료인지 출처 추적 가능'
  },
  {
    num: 36,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'WRAP-UP 초급 과정 정리',
    subtitle: '초급 엑셀 자동 취합 완성',
    image: 'slides_media/슬라이드36.JPG',
    body: `1. 개발환경을 단순하게 세팅했다
2. 경찰서 엑셀 파일을 하나로 취합했다
3. 오류 메시지를 보고 해결했다
4. 요구사항 변경을 코드에 반영했다
5. 반복 업무를 컴퓨터에게 맡기는 경험을 했다`
  },
  {
    num: 37,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PART 04 중급 과정: 한글 보고서 표도우미',
    subtitle: '한글 보고서 표 번호 자동 정리 GUI 도구',
    image: 'slides_media/슬라이드37.JPG',
    body: '• 보고서 표 번호 자동 갱신 GUI 스크립트 작성'
  },
  {
    num: 38,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROBLEM 표도우미는 왜 필요한가?',
    subtitle: '보고서 중간 표 추가 시 번호 꼬임 방지',
    image: 'slides_media/슬라이드38.JPG',
    body: '• [표 1] 감사 개요, [표 2] 제출 현황, [표 3] 지적사항 ...\n• 중간에 표 1개가 추가되면 50개 표 번호를 손으로 하나씩 수정해야 하는 위험 방지'
  },
  {
    num: 39,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'GOAL 표도우미의 최종 목표',
    subtitle: '실제 업무용 표 번호 자동 도구 완성',
    image: 'slides_media/슬라이드39.JPG',
    body: '• 한글 문서에서 [표 숫자] 제목 찾기\n• 찾은 표 제목을 목록으로 표시\n• 특정 번호부터 n+ 또는 n- 실행\n• [표 0] 새 삽입 표 처리'
  },
  {
    num: 40,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'ROADMAP 중급 과정 로드맵',
    subtitle: '7단계로 완성하는 표도우미',
    image: 'slides_media/슬라이드40.JPG',
    body: `1. 텍스트 파일에서 표 제목 찾기
2. 표 번호를 +1, -1 하는 규칙 만들기
3. GUI 화면 만들기 (tkinter)
4. 한글 문서에서 텍스트 가져오기
5. 한글 문서에 수정 결과 반영하기
6. 예외 처리하기
7. 표도우미 형태로 정리하기`
  },
  {
    num: 41,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 1 텍스트에서 표 제목 찾기',
    subtitle: 'sample_report.txt 준비',
    image: 'slides_media/슬라이드41.JPG',
    body: '• 처음부터 한글 문서와 연결하지 않고 텍스트 파일로 기초 로직을 검증합니다.'
  },
  {
    num: 42,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 표 제목 찾기 프롬프트',
    subtitle: '정규식(re) 패턴 추출',
    image: 'slides_media/슬라이드42.JPG',
    prompt: `파이썬으로 sample_report.txt 파일에서 [표 숫자] 제목 형식의 줄을 찾아 목록으로 출력하는 코드를 만들어줘.
1. 정규식(re) 패턴 [표 \\d+] 활용
2. 표 번호와 제목을 분리해서 출력`,
    body: '정규 표현식을 이용한 표 제목 검색'
  },
  {
    num: 43,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'CODE 텍스트에서 표 제목 찾는 코드',
    subtitle: 're.compile(r"^\\[표\\s*(\\d+)\\]\\s*(.+)$")',
    image: 'slides_media/슬라이드43.JPG',
    code: `import re

pattern = re.compile(r"^\\[표\\s*(\\d+)\\]\\s*(.+)$")
with open("sample_report.txt", "r", encoding="utf-8") as f:
    for line in f:
        match = pattern.match(line.strip())
        if match:
            table_no, title = match.groups()
            print(f"표 번호: {table_no}, 제목: {title}")`,
    body: '표 번호 및 제목 정규식 추출 파이썬 코드'
  },
  {
    num: 44,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 2 특정 번호부터 +1 하기',
    subtitle: '시작 번호 오프셋 증가 연산',
    image: 'slides_media/슬라이드44.JPG',
    body: '• [표 3]부터 뒤 번호를 하나씩 증가: [표 3]->[표 4], [표 4]->[표 5]'
  },
  {
    num: 45,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 표 번호 +1 프롬프트',
    subtitle: '표 번호 일괄 수정 프롬프트',
    image: 'slides_media/슬라이드45.JPG',
    prompt: `sample_report.txt에서 시작 번호가 3 이상인 표 번호를 +1로 변경해서 sample_report_updated.txt로 저장하는 파이썬 코드를 만들어줘.`,
    body: '표 번호 조건별 변경 프롬프트'
  },
  {
    num: 46,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'CODE 표 번호 +1 코드',
    subtitle: 'table_no >= start_no',
    image: 'slides_media/슬라이드46.JPG',
    code: `start_no = 3
shift = 1

for line in lines:
    match = pattern.match(line.strip())
    if match:
        no = int(match.group(1))
        if no >= start_no:
            no += shift
        updated_lines.append(f"[표 {no}] {match.group(2)}\\n")`,
    body: '지정 번호 이상 일괄 번호 보정'
  },
  {
    num: 47,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 3 GUI 만들기 (tkinter)',
    subtitle: '입력창 및 버튼 UI 제작',
    image: 'slides_media/슬라이드47.JPG',
    body: '• 시작 번호 입력칸 (Entry)\n• n+ 버튼, n- 버튼\n• 실행 결과 메시지 창'
  },
  {
    num: 48,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT GUI 제작 프롬프트',
    subtitle: 'tkinter 인터페이스 변환 프롬프트',
    image: 'slides_media/슬라이드48.JPG',
    prompt: `방금 만든 표 번호 수정 코드를 tkinter GUI로 바꿔줘.
1. 시작 번호 입력칸 생성
2. n+ 버튼 누르면 해당 번호 이상 +1
3. n- 버튼 누르면 해당 번호 이상 -1`,
    body: 'tkinter GUI 변환 요청 프롬프트'
  },
  {
    num: 49,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'CODE GUI 기본 코드 구조',
    subtitle: 'tk.Tk & Button & Entry',
    image: 'slides_media/슬라이드49.JPG',
    code: `import tkinter as tk

root = tk.Tk()
root.title("표도우미")
entry = tk.Entry(root)
entry.pack()
btn_plus = tk.Button(root, text="n+1 실행", command=run_plus)
btn_plus.pack()
root.mainloop()`,
    body: 'GUI 창 띄우기 기본 구조'
  },
  {
    num: 50,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STEP 4 한글 문서와 연결하기',
    subtitle: 'pywin32 HWP COM 연동',
    image: 'slides_media/슬라이드50.JPG',
    body: '• 한글 문서에서 본문 텍스트 추출 -> [표 숫자] 제목 찾기 -> 목록 표시 -> 반영'
  },
  {
    num: 51,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'HWP AUTOMATION 한글 자동화 주의사항',
    subtitle: '자주 발생하는 예외 상황',
    image: 'slides_media/슬라이드51.JPG',
    body: '• 한글 프로그램이 열려 있지 않음\n• 열려 있는 한글 객체를 못 찾음\n• 문서가 저장되지 않은 상태\n• 같은 표 번호가 여러 개 있음'
  },
  {
    num: 52,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 1 표도우미 요구사항 정리 프롬프트',
    subtitle: 'AI와의 협업 프롬프트 작성 팁',
    image: 'slides_media/슬라이드52.JPG',
    prompt: `한글 문서 내 표 제목을 자동으로 인식하고 번호를 변경하는 파이썬 GUI 도구를 만드려고 합니다. 예외 처리 조건을 포함한 단계별 개발 가이드를 작성해줘.`,
    body: '요구사항 정리 프롬프트'
  },
  {
    num: 53,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 2 오류를 알려주는 법',
    subtitle: '에러 트레이스백 피드백 기법',
    image: 'slides_media/슬라이드53.JPG',
    prompt: `파이썬 코드 실행 시 다음 에러 메시지가 발생했어: [에러 전문 복사]. 어느 줄에서 왜 발생했는지 원인과 수정된 코드를 보여줘.`,
    body: 'AI에게 에러 피드백하는 방법'
  },
  {
    num: 54,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 3 기능 개선 요청하기',
    subtitle: '점진적 기능 확장 프롬프트',
    image: 'slides_media/슬라이드54.JPG',
    prompt: `현재 만든 표도우미 GUI에 [표 0] 새 표 삽입 기능과 [그림 숫자]도 함께 처리하는 탭을 추가해줘.`,
    body: '기능 개선 피드백 예시'
  },
  {
    num: 55,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 4 예외 처리 요청하기',
    subtitle: '방어적 프로그래밍 구현',
    image: 'slides_media/슬라이드55.JPG',
    prompt: `한글 문서가 열려 있지 않거나 문서가 저장되지 않았을 때 프로그램이 튕기지 않고 경고 메세지 창(messagebox)을 띄우도록 예외 처리를 추가해줘.`,
    body: '예외 처리 추가 프롬프트'
  },
  {
    num: 56,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'STRUCTURE 표도우미 중급 과정 핵심 구조',
    subtitle: '중급 과정 종합 구조 정리',
    image: 'slides_media/슬라이드56.JPG',
    body: `1. 텍스트에서 [표 n] 찾기
2. 표 번호 +1, -1 처리하기
3. GUI 만들기
4. 한글 문서 텍스트 추출하기
5. 한글 문서 위치 정보 관리하기
6. 본문 수정 반영하기
7. 오류 메시지 기반으로 개선하기
8. 실제 업무 도구로 정리하기`
  },
  {
    num: 57,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PRINCIPLES 중급 과정에서 강조할 점',
    subtitle: '단계별 접근의 중요성',
    image: 'slides_media/슬라이드57.JPG',
    body: '• 먼저 텍스트 파일로 연습한다\n• 그다음 GUI를 붙인다\n• 마지막에 한글 문서 연결을 붙인다\n• 작동하는 버전을 항상 보관해 둔다'
  },
  {
    num: 58,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'WRAP-UP 전체 교육 마무리',
    subtitle: '바이브 코딩의 핵심 철학',
    image: 'slides_media/슬라이드58.JPG',
    body: '• 초급: 개발환경 세팅, 엑셀 취합, 오류 해결, 요구사항 변경\n• 중급: 표 번호 찾기, GUI, 한글 연결 구조, 예외 처리\n💡 바이브 코딩의 핵심은 코드를 외우는 것이 아니라, 반복 업무를 구조화해서 AI에게 설명하는 것입니다!'
  },
  {
    num: 59,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: '마지막 메시지: 수고하셨습니다!',
    subtitle: '현업 업무 자동화를 응원합니다.',
    image: 'slides_media/슬라이드59.JPG',
    body: '• 바이브코딩 기초 및 중급 교육 과정을 성공적으로 수강하셨습니다.\n• 상단 [📝 자가진단 퀴즈]를 풀어 수료증을 받으세요!'
  }
];

// App Core State Manager
class VibePortalApp {
  constructor() {
    this.slides = PPT_SLIDES;
    this.currentSlideIndex = 0;
    this.theme = this.loadFromStorage('vibecoding_theme', 'light');
    this.viewedSlides = new Set(this.loadFromStorage('vibecoding_viewed_slides', []));
  }

  loadFromStorage(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveViewedSlides() {
    try {
      localStorage.setItem('vibecoding_viewed_slides', JSON.stringify(Array.from(this.viewedSlides)));
    } catch (e) {
      console.error(e);
    }
  }

  saveTheme(theme) {
    this.theme = theme;
    try {
      localStorage.setItem('vibecoding_theme', JSON.stringify(theme));
    } catch (e) {
      console.error(e);
    }
  }

  markSlideViewed(slideNum) {
    this.viewedSlides.add(slideNum);
    this.saveViewedSlides();
  }

  markAllSlidesViewed() {
    this.slides.forEach(s => this.viewedSlides.add(s.num));
    this.saveViewedSlides();
    showToast('🎉 전체 59개 슬라이드 완강 처리가 되었습니다!', 'success');
    renderHeaderAndProgress();
    renderMainView();
  }

  getProgressPercent() {
    return Math.round((this.viewedSlides.size / this.slides.length) * 100);
  }
}

const app = new VibePortalApp();

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderHeaderAndProgress();
  setupPartTabs();
  setupModalEvents();
  setupKeyboardSlideNav();
  renderMainView();
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

function renderHeaderAndProgress() {
  const percent = app.getProgressPercent();
  const count = app.viewedSlides.size;

  const statOverall = document.getElementById('statOverallProgress');
  if (statOverall) statOverall.textContent = `${percent}%`;

  const statCount = document.getElementById('statSlideCountDisplay');
  if (statCount) statCount.textContent = `(${count} / ${app.slides.length} 완료)`;
}

function setupPartTabs() {
  const tabsContainer = document.getElementById('partTabs');
  if (!tabsContainer) return;

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const partKeyword = btn.dataset.part;
    if (partKeyword === 'all') {
      app.currentSlideIndex = 0;
    } else {
      const targetIdx = app.slides.findIndex(s => s.part.includes(partKeyword));
      if (targetIdx !== -1) {
        app.currentSlideIndex = targetIdx;
      }
    }
    renderMainView();
  });
}

function renderMainView() {
  const stage = document.getElementById('mainViewerStage');
  if (!stage) return;

  const slide = app.slides[app.currentSlideIndex];
  app.markSlideViewed(slide.num);
  renderHeaderAndProgress();

  let selectOptions = '';
  app.slides.forEach((s, idx) => {
    const viewedTag = app.viewedSlides.has(s.num) ? '✔ ' : '';
    selectOptions += `<option value="${idx}" ${idx === app.currentSlideIndex ? 'selected' : ''}>${viewedTag}[Slide ${s.num}] ${s.title.substring(0, 32)}</option>`;
  });

  const progressPercent = Math.round((slide.num / app.slides.length) * 100);

  stage.innerHTML = `
    <!-- MAIN SINGLE STAGE CONTAINER -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:20px; box-shadow:var(--shadow-lg);">
      
      <!-- Slide Part Tag & Title Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <div>
          <span class="category-tag" style="font-size:0.8rem;">${slide.part}</span>
          <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-main); margin-top:4px;">
            ${slide.title}
          </h2>
          <p style="font-size:0.875rem; color:var(--text-muted); margin-top:2px;">${slide.subtitle || ''}</p>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn btn-outline" style="padding:4px 10px; font-size:0.775rem;" onclick="app.markAllSlidesViewed()">
            ✔ 전체 완강 처리
          </button>
        </div>
      </div>

      <!-- Top Progress Bar -->
      <div class="slide-top-progress" title="슬라이드 위치 ${progressPercent}%">
        <div class="slide-top-progress-fill" style="width: ${progressPercent}%"></div>
      </div>

      <!-- Control Bar -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-main); padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-color); flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn btn-outline" style="padding:6px 14px; font-size:0.875rem;" onclick="changeSlide(-1)" title="이전 슬라이드 (◀)">
            ◀ 이전
          </button>
          <button class="btn btn-primary" style="padding:6px 18px; font-size:0.875rem;" onclick="changeSlide(1)" title="다음 슬라이드 (▶) / 클릭">
            다음 ▶
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:0.9rem; font-weight:800; color:var(--primary-600);">
            SLIDE ${slide.num} / ${app.slides.length}
          </span>
          <select onchange="jumpToSlide(parseInt(this.value, 10))" class="filter-select" style="max-width:240px; padding:4px 10px; font-size:0.825rem;">
            ${selectOptions}
          </select>
        </div>
      </div>

      <!-- ANYWHERE-CLICKABLE SLIDE STAGE -->
      <div class="slide-clickable-stage" onclick="changeSlide(1)" title="화면 어디든 클릭 시 다음 슬라이드로 이동합니다">
        <div class="anywhere-click-badge">
          <span>화면 클릭 = 다음 슬라이드 ▶</span>
        </div>

        <div style="text-align:center;">
          <img src="${slide.image}" class="slide-comic-img" style="max-height:580px;" alt="Slide ${slide.num}" onError="this.style.display='none';">
        </div>

        <!-- Slide Body Description Text -->
        ${slide.body ? `
          <div style="margin-top:14px; background:var(--bg-main); padding:12px 16px; border-radius:var(--radius-md); font-size:0.875rem; color:var(--text-main); line-height:1.6;" onclick="event.stopPropagation();">
            <div style="font-weight:700; color:var(--primary-600); margin-bottom:4px;">📌 주요 학습 포인트</div>
            <div style="white-space:pre-wrap;">${slide.body}</div>
          </div>
        ` : ''}

        <!-- AI Prompt Copy Chip if Present -->
        ${slide.prompt ? `
          <div style="margin-top: 14px;" onclick="event.stopPropagation();">
            <div style="font-size: 0.8rem; font-weight:700; color:var(--primary-600); margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
              <span>📋 AI 프롬프트 (클릭 시 1초 복사)</span>
              <button class="btn btn-outline" style="padding:2px 8px; font-size:0.75rem;" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">복사하기</button>
            </div>
            <div class="prompt-copy-box" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">${escapeHTML(slide.prompt)}</div>
          </div>
        ` : ''}

        ${slide.code ? `
          <div style="margin-top: 14px;" onclick="event.stopPropagation();">
            <div style="font-size: 0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:4px;">💻 파이썬 코드 예시</div>
            <div class="code-box" style="font-size:0.8rem; margin:0;"><pre><code>${escapeHTML(slide.code)}</code></pre></div>
          </div>
        ` : ''}

        ${slide.cmd ? `
          <div style="margin-top: 14px;" onclick="event.stopPropagation();">
            <div style="font-size: 0.8rem; font-weight:700; color:var(--accent-emerald); margin-bottom:4px;">⚡ 실행 명령어</div>
            <div class="code-box" style="font-size:0.8rem; background:#047857; color:white;"><code>${escapeHTML(slide.cmd)}</code></div>
          </div>
        ` : ''}
      </div>

      <!-- Bottom Keyboard & Touch Navigation Info -->
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-muted); margin-top:12px; padding:0 4px;">
        <span>💡 화면 어디든 클릭 또는 키보드 방향키(➔), Space, Enter로 다음 슬라이드로 이동합니다.</span>
        <span>${app.viewedSlides.has(slide.num) ? '✔ 수강완료' : '학습중'}</span>
      </div>
    </div>
  `;
}

function setupKeyboardSlideNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      changeSlide(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      changeSlide(-1);
    }
  });
}

function changeSlide(direction) {
  app.currentSlideIndex = (app.currentSlideIndex + direction + app.slides.length) % app.slides.length;
  renderMainView();
}

function jumpToSlide(index) {
  if (index >= 0 && index < app.slides.length) {
    app.currentSlideIndex = index;
    renderMainView();
  }
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

  document.getElementById('printCertBtn')?.addEventListener('click', () => {
    window.print();
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

function escapeHTML(str) {
  return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text);
  showToast('프롬프트 텍스트가 클립보드에 복사되었습니다!', 'success');
}

function openQuizModal() {
  document.getElementById('quizCourseTitle').textContent = '🚀 PPT 기초 자가진단 퀴즈';
  renderQuizContent();
  openModal('quizModal');
}

const BASIC_QUIZ = [
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
];

function renderQuizContent() {
  const container = document.getElementById('quizBodyContent');
  if (!container) return;

  let html = `
    <div style="background-color: var(--primary-50); padding: 14px 18px; border-radius: var(--radius-md); font-size: 0.875rem;">
      💡 59개 슬라이드 핵심 내용 자가진단 퀴즈입니다. <strong>80점 이상</strong> 획득 시 수료증이 발급됩니다.
    </div>
    <form id="quizForm" style="display:flex; flex-direction:column; gap:16px;">
  `;

  BASIC_QUIZ.forEach((qItem, qIdx) => {
    html += `
      <div class="quiz-card" style="background:var(--bg-card); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <div style="font-weight:700; color:var(--primary-600); margin-bottom:4px;">문제 0${qIdx + 1}</div>
        <div style="font-weight:700; font-size:0.95rem; margin-bottom:10px;">${qItem.q}</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
    `;

    qItem.options.forEach((optText, oIdx) => {
      html += `
        <label style="display:flex; align-items:center; gap:8px; font-size:0.875rem; cursor:pointer;">
          <input type="radio" name="q_${qIdx}" value="${oIdx}" required>
          <span>${optText}</span>
        </label>
      `;
    });

    html += `
        </div>
        <div id="explanation_${qIdx}" style="margin-top:10px; font-size:0.85rem;"></div>
      </div>
    `;
  });

  html += `
      <button type="submit" class="btn btn-primary" style="padding: 12px; font-size: 0.95rem; font-weight:700;">
        📝 정답 제출 및 채점
      </button>
    </form>
  `;

  container.innerHTML = html;

  document.getElementById('quizForm').onsubmit = (e) => {
    e.preventDefault();
    gradeQuiz();
  };
}

function gradeQuiz() {
  const form = document.getElementById('quizForm');
  let correctCount = 0;

  BASIC_QUIZ.forEach((qItem, qIdx) => {
    const selected = form.querySelector(`input[name="q_${qIdx}"]:checked`);
    const expDiv = document.getElementById(`explanation_${qIdx}`);

    if (selected && parseInt(selected.value, 10) === qItem.answer) {
      correctCount++;
      expDiv.style.color = 'var(--accent-emerald)';
      expDiv.textContent = `⭕ 정답입니다! ${qItem.explanation}`;
    } else {
      expDiv.style.color = '#ef4444';
      expDiv.textContent = `❌ 오답입니다. - ${qItem.explanation}`;
    }
  });

  const score = Math.round((correctCount / BASIC_QUIZ.length) * 100);
  const isPassed = score >= 80;

  if (isPassed) {
    showToast('🎉 축하합니다! 자가진단 퀴즈에 합격하셨습니다!', 'success');
  }

  const container = document.getElementById('quizBodyContent');
  const resultBanner = document.createElement('div');
  resultBanner.style.cssText = 'background:var(--primary-50); padding:16px; border-radius:var(--radius-md); text-align:center; margin-bottom:16px; border:1px solid var(--primary-100);';
  resultBanner.innerHTML = `
    <div style="font-size: 1.1rem; font-weight: 800; color:var(--primary-700);">
      ${isPassed ? '🎉 합격! 수료증을 확인해보세요.' : '💪 다시 한번 슬라이드를 정독해 보세요!'}
    </div>
    <div style="font-size:1.5rem; font-weight:800; color:var(--primary-600); margin:8px 0;">${score}점</div>
    ${isPassed ? `
      <button class="btn btn-primary" onclick="closeModal('quizModal'); openCertificateModal();">
        🏆 수료증 발급 확인
      </button>
    ` : ''}
  `;

  container.insertBefore(resultBanner, container.firstChild);
}

function openCertificateModal() {
  document.getElementById('certCourseTitle').textContent = '업무 자동화를 위한 바이브 코딩 (PPT 59개 슬라이드 수강)';
  document.getElementById('certUserName').textContent = '사내 수강생';
  document.getElementById('certDeptName').textContent = '디지털 혁신 교육과정';

  const now = new Date();
  const dateStr = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}`;
  document.getElementById('certIssueDate').textContent = dateStr;
  document.getElementById('certId').textContent = `VIBE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  openModal('certificateModal');
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
  }, 3000);
}
