/* ==========================================
   바이브코딩 사내 교육 포털 - Core JavaScript (ES6+)
   100% 교육 교재 시청 전용 포털 (59개 PPT 슬라이드 메인 뷰어 & 슬라이드 목차)
   ========================================== */

// Exact 59 Slides Dataset
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
    subtitle: '인터넷 연결이 제한된 내부망 환경 준비',
    image: 'slides_media/슬라이드13.JPG',
    body: `D:\\vibe_setup
 ├─ python-3.11.x.exe
 ├─ VSCodeUserSetup.exe
 ├─ ms-python.python.vsix
 └─ wheels (pandas, openpyxl 오프라인패키지)`
  },
  {
    num: 14,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 3 Python 설치 핵심 주의사항',
    subtitle: '[Add python.exe to PATH] 체크 필수!',
    image: 'slides_media/슬라이드14.JPG',
    body: `⚠️ 가장 흔한 실패 원인: Add to PATH 체크 누락
• 이 항목을 체크하지 않으면 터미널에서 python 명령어가 동작하지 않습니다.`
  },
  {
    num: 15,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 4 VS Code 설치 및 한국어 팩',
    subtitle: '개발 에디터 설치 및 기본 설정',
    image: 'slides_media/슬라이드15.JPG',
    body: `• VSCodeUserSetup.exe 실행 후 [다음] 클릭
• Korean Language Pack 확장 설치 후 재시작`
  },
  {
    num: 16,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 5 Python 확장(.vsix) 수동 설치',
    subtitle: '내부망에서 VSIX 확장 오프라인 설치 방법',
    image: 'slides_media/슬라이드16.JPG',
    body: `1. VS Code 좌측 Extensions(Ctrl+Shift+X) 클릭
2. 우측 상단 (...) 아이콘 클릭
3. [Install from VSIX...] 선택
4. D:\\vibe_setup\\ms-python.python.vsix 파일 선택`
  },
  {
    num: 17,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 6 폴더 열기 (Open Folder)',
    subtitle: 'D:\\vibe_excel 폴더를 VS Code 작업 영역으로 엽니다.',
    image: 'slides_media/슬라이드17.JPG',
    body: `• File -> Open Folder (Ctrl+K Ctrl+O) -> D:\\vibe_excel 선택
• "Do you trust the authors?" 창에서 [Yes, I trust the authors] 클릭`
  },
  {
    num: 18,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 7 오프라인 패키지 설치 (pip)',
    subtitle: 'pandas 및 openpyxl 오프라인 wheel 설치',
    image: 'slides_media/슬라이드18.JPG',
    cmd: `pip install --no-index --find-links=D:\\vibe_setup\\wheels pandas openpyxl`,
    body: `터미널(Ctrl+\`)에 위 명령어를 입력합니다.`
  },
  {
    num: 19,
    part: 'PART 02. 초급 - 개발환경 세팅',
    title: 'STEP 8 첫 코드 실행 (Hello Vibe!)',
    subtitle: 'main.py 파일 생성 및 실행 테스트',
    image: 'slides_media/슬라이드19.JPG',
    code: `print("Hello, Vibe Coding!")`,
    body: `우측 상단 [▶] 버튼을 누르거나 터미널에 python main.py 입력`
  },
  {
    num: 20,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PART 03 초급 실습: 250개 엑셀 취합',
    subtitle: '실제 경찰서 엑셀 파일을 파이썬으로 자동 통합합니다.',
    image: 'slides_media/슬라이드20.JPG',
    body: `• pandas 라이브러리를 활용한 다중 엑셀 파일 병합 실습`
  },
  {
    num: 21,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'TASK GOAL 엑셀 취합 자동화 목표',
    subtitle: 'input 폴더의 모든 엑셀을 모아 output/combined.xlsx 생성',
    image: 'slides_media/슬라이드21.JPG',
    body: `• input/ 폴더에 들어 있는 모든 .xlsx 파일을 순회
• 각 파일의 첫 번째 시트 데이터를 읽어서 1개의 큰 데이터프레임으로 결합
• output/combined.xlsx 파일로 내보내기`
  },
  {
    num: 22,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PROMPT 01 엑셀 취합 기본 프롬프트',
    subtitle: 'ChatGPT에 전달할 엑셀 병합 요청 프롬프트',
    image: 'slides_media/슬라이드22.JPG',
    prompt: `파이썬 pandas를 사용해서 특정 폴더 안의 모든 엑셀 파일을 하나로 합치는 코드를 작성해줘.

조건:
1. input 폴더 안의 모든 .xlsx 파일을 읽을 것
2. 각 파일의 첫 번째 시트 데이터를 취합할 것
3. 결과를 output/combined.xlsx 로 저장할 것
4. 초보자도 이해할 수 있도록 코드에 자세한 주석을 달아줄 것`,
    body: `기본 엑셀 병합 코드 생성 요청`
  },
  {
    num: 23,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CODE 01 엑셀 취합 기본 코드',
    subtitle: 'pandas.concat()을 사용한 엑셀 취합 파이썬 코드',
    image: 'slides_media/슬라이드23.JPG',
    code: `import os
import pandas as pd

input_dir = "input"
output_path = "output/combined.xlsx"
all_data = []

for file in os.listdir(input_dir):
    if file.endswith(".xlsx") and not file.startswith("~$"):
        file_path = os.path.join(input_dir, file)
        df = pd.read_excel(file_path)
        all_data.append(df)

result = pd.concat(all_data, ignore_index=True)
os.makedirs("output", exist_ok=True)
result.to_excel(output_path, index=False)
print("취합 완료!")`,
    body: `os.listdir() 및 pd.concat() 사용 예시`
  },
  {
    num: 24,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'TROUBLESHOOTING 01 임시 파일 오류 (~$)',
    subtitle: '엑셀이 열려 있을 때 생기는 임시 파일 처리',
    image: 'slides_media/슬라이드24.JPG',
    body: `• 엑셀을 연 상태에서 실행하면 ~$서울중부경찰서.xlsx 임시 파일이 생성됨
• 해결: not file.startswith("~$") 조건문 추가로 임시 파일 스킵`
  },
  {
    num: 25,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CHANGE 01 요구사항 변경: 특정 열만 선택',
    subtitle: '"필요한 4개 열만 골라서 합쳐주세요."',
    image: 'slides_media/슬라이드25.JPG',
    code: `required_columns = ["경찰서명", "점검항목", "지적사항", "조치계획"]
df = df[required_columns]`,
    body: `필요한 열만 필터링하여 수집하는 코드`
  },
  {
    num: 26,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'CHANGE 02 요구사항 변경: 원본파일명 추가',
    subtitle: '"나중에 어느 파일에서 온 자료인지 알아야 합니다."',
    image: 'slides_media/슬라이드26.JPG',
    code: `df["원본파일명"] = file`,
    body: `원본파일명 열을 추가하여 추적 가능하도록 개선`
  },
  {
    num: 27,
    part: 'PART 03. 초급 - 엑셀 취합 실습',
    title: 'PART 03 정리: 엑셀 취합의 핵심',
    subtitle: '초급 엑셀 취합 과정 완성',
    image: 'slides_media/슬라이드27.JPG',
    body: `1. input 폴더 읽기 -> 2. 임시 파일 제외 -> 3. 필요 열 필터링 -> 4. 원본파일명 추가 -> 5. output 저장`
  },
  {
    num: 28,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PART 04 중급 과정: 한글 보고서 표도우미',
    subtitle: '한글 보고서 표 번호 자동 정리 GUI 도구 제작',
    image: 'slides_media/슬라이드28.JPG',
    body: `• 보고서 내 표 번호 자동 갱신 GUI 스크립트 작성`
  },
  {
    num: 29,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROBLEM 표도우미는 왜 필요한가?',
    subtitle: '보고서 중간에 표가 추가되면 뒤 번호를 모두 밀어야 합니다.',
    image: 'slides_media/슬라이드29.JPG',
    body: `• [표 1] 감사 개요, [표 2] 제출 현황, [표 3] 지적사항 ...
• 중간에 표 1개가 추가되면 50개 표 번호를 손으로 하나씩 수정해야 하는 문제 발생`
  },
  {
    num: 30,
    part: 'PART 04. 중급 - 한글 보고서 표도우미',
    title: 'PROMPT 표 번호 추출 및 자동 수정',
    subtitle: '정규식을 이용해 [표 숫자] 추출 및 번호 조정',
    image: 'slides_media/슬라이드30.JPG',
    prompt: `파이썬 tkinter를 사용하여 한글 보고서용 [표 숫자] 번호 자동 조정 GUI 프로그램을 만들어줘.
1. 시작 표 번호 선택
2. n+1 또는 n-1 일괄 조정
3. 정규식(re) 패턴 [표 \\d+] 활용`,
    body: `표도우미 프로그램 핵심 로직`
  }
];

// Add remaining dummy slide metadata for Slides 31 ~ 59 if missing
for (let i = 31; i <= 59; i++) {
  if (!PPT_SLIDES.find(s => s.num === i)) {
    let part = 'PART 04. 중급 - 한글 보고서 표도우미';
    if (i > 50) part = 'PART 05. 실습 종합 & 마무리';
    PPT_SLIDES.push({
      num: i,
      part: part,
      title: `SLIDE ${i} 과정 가이드`,
      subtitle: `슬라이드 ${i} 핵심 내용 및 코드 실행 팁`,
      image: `slides_media/슬라이드${i}.JPG`,
      body: `• 슬라이드 ${i}번 발표자료입니다.\n• 화면을 클릭하거나 키보드(➔)로 다음 슬라이드로 넘어갑니다.`
    });
  }
}

// App Core State Manager
class VibePortalApp {
  constructor() {
    this.slides = PPT_SLIDES;
    this.currentSlideIndex = 0;
    this.selectedPart = 'all';
    this.searchQuery = '';
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
    renderHeaderAndBanner();
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
  renderHeaderAndBanner();
  setupCategoryTabs();
  setupSearch();
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

function renderHeaderAndBanner() {
  const percent = app.getProgressPercent();
  const count = app.viewedSlides.size;

  const statOverall = document.getElementById('statOverallProgress');
  if (statOverall) statOverall.textContent = percent;

  const statCount = document.getElementById('statSlideCountDisplay');
  if (statCount) statCount.textContent = `(${count} / ${app.slides.length} 완료)`;

  const fill = document.getElementById('bannerProgressFill');
  if (fill) fill.style.width = `${percent}%`;
}

function setupCategoryTabs() {
  const tabsContainer = document.getElementById('categoryTabs');
  if (!tabsContainer) return;

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    app.selectedPart = btn.dataset.part || 'all';
    renderMainView();
  });
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      app.searchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) searchClearBtn.style.display = app.searchQuery ? 'block' : 'none';
      renderMainView();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      app.searchQuery = '';
      searchClearBtn.style.display = 'none';
      renderMainView();
    });
  }
}

function renderMainView() {
  const grid = document.getElementById('mainGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let list = [...app.slides];

  if (app.selectedPart !== 'all') {
    list = list.filter(s => s.part.includes(app.selectedPart));
  }

  if (app.searchQuery) {
    const q = app.searchQuery;
    list = list.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q) ||
      s.part.toLowerCase().includes(q) ||
      (s.prompt && s.prompt.toLowerCase().includes(q)) ||
      (s.code && s.code.toLowerCase().includes(q))
    );
  }

  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = `총 ${list.length}개의 교육 슬라이드`;
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align:center; padding:48px 24px;">
        <div style="font-size:2.5rem; margin-bottom:12px;">🔍</div>
        <h3>검색 조건에 해당되는 슬라이드가 없습니다.</h3>
        <p style="color:var(--text-muted); font-size:0.9rem;">검색어를 확인하거나 전체 슬라이드 탭을 선택해 보세요.</p>
      </div>
    `;
    return;
  }

  list.forEach((slide) => {
    const isViewed = app.viewedSlides.has(slide.num);
    const card = document.createElement('article');
    card.className = `submission-card slide-card-thumb ${isViewed ? 'viewed' : ''}`;
    card.style.cursor = 'pointer';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.position = 'relative';

    const globalIdx = app.slides.findIndex(s => s.num === slide.num);

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="category-tag" style="font-size:0.75rem;">${slide.part}</span>
        <span style="font-size:0.8rem; font-weight:800; color:var(--primary-600);">SLIDE ${slide.num}</span>
      </div>

      <div style="text-align:center; margin:8px 0; overflow:hidden; border-radius:var(--radius-md); background:var(--bg-main);">
        <img src="${slide.image}" style="width:100%; height:160px; object-fit:cover; border-radius:var(--radius-md); transition:transform 0.2s ease;" alt="Slide ${slide.num}" onError="this.src='https://via.placeholder.com/400x225?text=Slide+${slide.num}';">
      </div>

      <h3 style="font-size: 0.975rem; font-weight: 700; color: var(--text-main); margin-bottom:4px; line-height:1.4;">${slide.title}</h3>
      <p style="font-size: 0.825rem; color: var(--text-muted); line-height: 1.4; margin-bottom:12px;">${slide.subtitle}</p>

      <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid var(--border-color);">
        ${isViewed ? `
          <span style="font-size:0.775rem; color:var(--accent-emerald); font-weight:700;">✔ 수강 완료</span>
        ` : `
          <span style="font-size:0.775rem; color:var(--text-muted);">미수강</span>
        `}
        <button class="btn btn-outline" style="padding:4px 10px; font-size:0.775rem;" onclick="event.stopPropagation(); openCourseDetailModal(${globalIdx});">
          ▶ 열기
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      openCourseDetailModal(globalIdx);
    });

    grid.appendChild(card);
  });
}

function openCourseDetailModal(slideIndex = 0) {
  app.currentSlideIndex = slideIndex;
  renderPPTSlidePlayer();
  openModal('courseDetailModal');
}

function renderPPTSlidePlayer() {
  const slide = app.slides[app.currentSlideIndex];
  app.markSlideViewed(slide.num);

  const chaptersContainer = document.getElementById('detailChaptersList');
  const titleEl = document.getElementById('detailTitle');
  const descEl = document.getElementById('detailDesc');

  if (titleEl) titleEl.textContent = slide.part;
  if (descEl) descEl.textContent = `[Slide ${slide.num} / ${app.slides.length}] ${slide.title}`;

  let selectOptions = '';
  app.slides.forEach((s, idx) => {
    selectOptions += `<option value="${idx}" ${idx === app.currentSlideIndex ? 'selected' : ''}>[${s.num}/${app.slides.length}] ${s.title.substring(0, 28)}</option>`;
  });

  const progressPercent = Math.round((slide.num / app.slides.length) * 100);

  chaptersContainer.innerHTML = `
    <!-- Top Progress Bar -->
    <div class="slide-top-progress" title="슬라이드 위치 ${progressPercent}%">
      <div class="slide-top-progress-fill" style="width: ${progressPercent}%"></div>
    </div>

    <!-- Minimalist Slide Control Top Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-card); padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-color); flex-wrap:wrap; gap:10px;">
      
      <!-- Nav Buttons -->
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="btn btn-outline" style="padding:5px 14px; font-size:0.85rem;" onclick="changeSlide(-1)" title="이전 (◀)">
          ◀ 이전
        </button>
        <button class="btn btn-primary" style="padding:5px 18px; font-size:0.85rem;" onclick="changeSlide(1)" title="다음 (▶) / 화면 클릭">
          다음 ▶
        </button>
      </div>

      <!-- Slide Counter & Jump Selector -->
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:0.85rem; font-weight:800; color:var(--primary-600);">
          SLIDE ${slide.num} / ${app.slides.length}
        </span>
        <select onchange="jumpToSlide(parseInt(this.value, 10))" class="filter-select" style="max-width:210px; padding:4px 8px; font-size:0.8rem;">
          ${selectOptions}
        </select>
      </div>
    </div>

    <!-- ANYWHERE-CLICKABLE SLIDE CANVAS STAGE -->
    <div class="slide-clickable-stage" onclick="changeSlide(1)" title="화면 어디든 클릭 시 다음 슬라이드로 이동">
      
      <div class="anywhere-click-badge">
        <span>화면 클릭 = 다음 슬라이드 ▶</span>
      </div>

      <!-- Presentation Slide Image -->
      <div style="text-align:center;">
        <img src="${slide.image}" class="slide-comic-img" alt="Slide ${slide.num} presentation" onError="this.style.display='none';">
      </div>

      <!-- Minimal Prompts & Codes if Present -->
      ${slide.prompt ? `
        <div style="margin-top: 12px;" onclick="event.stopPropagation();">
          <div style="font-size: 0.8rem; font-weight:700; color:var(--primary-600); margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
            <span>📋 AI 프롬프트 (클릭 시 1초 복사)</span>
            <button class="btn btn-outline" style="padding:2px 8px; font-size:0.75rem;" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">복사하기</button>
          </div>
          <div class="prompt-copy-box" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">${escapeHTML(slide.prompt)}</div>
        </div>
      ` : ''}

      ${slide.code ? `
        <div style="margin-top: 12px;" onclick="event.stopPropagation();">
          <div style="font-size: 0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:4px;">💻 코드 예시</div>
          <div class="code-box" style="font-size:0.8rem; margin:0;"><pre><code>${escapeHTML(slide.code)}</code></pre></div>
        </div>
      ` : ''}

      ${slide.cmd ? `
        <div style="margin-top: 12px;" onclick="event.stopPropagation();">
          <div style="font-size: 0.8rem; font-weight:700; color:var(--accent-emerald); margin-bottom:4px;">⚡ 실행 명령어</div>
          <div class="code-box" style="font-size:0.8rem; background:#047857; color:white;"><code>${escapeHTML(slide.cmd)}</code></div>
        </div>
      ` : ''}
    </div>

    <!-- Minimal Bottom Helper Bar -->
    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.775rem; color:var(--text-muted); padding:2px 4px;">
      <span>💡 화면 클릭, ➔, Space, Enter 키로 다음 슬라이드로 넘어갑니다.</span>
      <button class="btn btn-outline" style="padding:3px 8px; font-size:0.75rem;" onclick="app.markSlideViewed(${slide.num}); renderHeaderAndBanner(); renderPPTSlidePlayer();">
        ✔ 학습 기록
      </button>
    </div>
  `;
}

function setupKeyboardSlideNav() {
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('courseDetailModal');
    if (!modal || !modal.classList.contains('active')) return;

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
  renderPPTSlidePlayer();
  renderHeaderAndBanner();
}

function jumpToSlide(index) {
  if (index >= 0 && index < app.slides.length) {
    app.currentSlideIndex = index;
    renderPPTSlidePlayer();
    renderHeaderAndBanner();
  }
}

function setupModalEvents() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.closeModal);
      renderHeaderAndBanner();
      renderMainView();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
        renderHeaderAndBanner();
        renderMainView();
      }
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
