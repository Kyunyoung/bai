using System;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;
using System.Collections.Generic;

class SlideItem {
    public int Num { get; set; }
    public string Title { get; set; }
    public string Subtitle { get; set; }
    public string AllText { get; set; }
    public List<string> TextArray { get; set; }
}

class SlideObj {
    public int num { get; set; }
    public string part { get; set; }
    public string title { get; set; }
    public string subtitle { get; set; }
    public string image { get; set; }
    public string body { get; set; }
    public string prompt { get; set; }
    public string code { get; set; }
    public string cmd { get; set; }
}

class Program {
    static void Main() {
        string jsonPath = @"c:\Users\1\Desktop\bai\exact_59_slides_text.json";
        string outJsPath = @"c:\Users\1\Desktop\bai\script.js";
        
        string jsonContent = File.ReadAllText(jsonPath, Encoding.UTF8);
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        serializer.MaxJsonLength = int.MaxValue;
        
        List<SlideItem> items = serializer.Deserialize<List<SlideItem>>(jsonContent);
        List<SlideObj> outSlides = new List<SlideObj>();
        
        foreach (var item in items) {
            int num = item.Num;
            string part = "PART 01. 도입부";
            if (num <= 8) part = "PART 01. 도입부";
            else if (num <= 21) part = "PART 02. 초급 - 세팅";
            else if (num <= 36) part = "PART 03. 초급 - 엑셀취합";
            else part = "PART 04. 중급 - 표도우미";
            
            List<string> cleanItems = new List<string>();
            if (item.TextArray != null) {
                foreach (var t in item.TextArray) {
                    string s = t.Trim();
                    int dummy;
                    if (s.Length > 0 && !(s.Length <= 2 && int.TryParse(s, out dummy))) {
                        cleanItems.Add(s);
                    }
                }
            }
            
            string title = cleanItems.Count > 0 ? cleanItems[0] : "슬라이드 " + num;
            string subtitle = cleanItems.Count > 1 ? cleanItems[1] : "";
            
            List<string> bodyList = new List<string>();
            if (cleanItems.Count > 2) {
                for (int k = 2; k < cleanItems.Count; k++) {
                    bodyList.Add(cleanItems[k]);
                }
            }
            
            string bodyText = string.Join("\n", bodyList.ToArray());
            string prompt = "";
            string code = "";
            string cmd = "";
            
            foreach (string line in bodyList) {
                if (line.Contains("파이썬 pandas를") || line.Contains("sample_report.txt") || line.Contains("tkinter GUI로") || line.Contains("한글 문서 내") || line.Contains("에러 메시지") || line.Contains("기능을 추가해줘") || line.Contains("경고 메세지")) {
                    prompt = line;
                }
                if (line.Contains("import ") || line.Contains("pd.concat") || line.Contains("re.compile") || line.Contains("start_no =")) {
                    code = line;
                }
                if (line.Contains("python ") || line.Contains("pip install") || line.Contains("py -m pip")) {
                    cmd = line;
                }
            }
            
            outSlides.Add(new SlideObj {
                num = num,
                part = part,
                title = title,
                subtitle = subtitle,
                image = "slides_media/slide_" + num + ".jpg",
                body = bodyText,
                prompt = prompt,
                code = code,
                cmd = cmd
            });
        }
        
        string slidesJson = serializer.Serialize(outSlides);
        
        StringBuilder sb = new StringBuilder();
        sb.AppendLine("/* ==========================================");
        sb.AppendLine("   바이브코딩 사내 교육 포털 - Core JavaScript (ES6+)");
        sb.AppendLine("   PDF 59개 슬라이드 교재 텍스트 & 이미지 100% 정밀 연동");
        sb.AppendLine("   ========================================== */");
        sb.AppendLine();
        sb.AppendLine("const PPT_SLIDES = " + slidesJson + ";");
        sb.AppendLine();
        sb.AppendLine(@"class VibePortalApp {
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
    <!-- PDF SLIDE ACCURATE THEATER CANVAS -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:20px; box-shadow:var(--shadow-lg);">
      
      <!-- Top Header & Controls -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-main); padding:10px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color); flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="category-tag" style="font-size:0.85rem; font-weight:700;">${slide.part}</span>
          <span style="font-size:1.05rem; font-weight:800; color:var(--text-main);">
            SLIDE ${slide.num} / ${app.slides.length}
          </span>
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-outline" style="padding:6px 14px; font-size:0.875rem;" onclick="changeSlide(-1)" title="이전 슬라이드 (◀)">
            ◀ 이전
          </button>
          <button class="btn btn-primary" style="padding:6px 20px; font-size:0.875rem; font-weight:700;" onclick="changeSlide(1)" title="다음 슬라이드 (▶)">
            다음 ▶
          </button>

          <select onchange="jumpToSlide(parseInt(this.value, 10))" class="filter-select" style="max-width:260px; padding:6px 10px; font-size:0.85rem;">
            ${selectOptions}
          </select>
        </div>
      </div>

      <!-- Top Progress Fill Bar -->
      <div class="slide-top-progress" style="height:6px; margin-bottom:16px;" title="슬라이드 위치 ${progressPercent}%">
        <div class="slide-top-progress-fill" style="width: ${progressPercent}%; background:var(--primary-600);"></div>
      </div>

      <!-- PDF SLIDE IMAGE DISPLAY STAGE -->
      <div class="slide-clickable-stage" onclick="changeSlide(1)" style="cursor:pointer; position:relative; text-align:center; padding:12px; background:var(--bg-main); border-radius:var(--radius-md); border:1px solid var(--border-color);" title="화면 클릭 시 다음 슬라이드로 이동">
        
        <div class="anywhere-click-badge" style="position:absolute; top:16px; right:16px; z-index:10; pointer-events:none;">
          <span style="background:rgba(37,99,235,0.9); color:white; padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:700;">화면 클릭 = 다음 슬라이드 ▶</span>
        </div>

        <!-- 100% PDF ACCURATE SLIDE IMAGE -->
        <img src="${slide.image}?v=6" class="slide-comic-img" style="max-height:640px; width:100%; object-fit:contain; border-radius:var(--radius-md); box-shadow:var(--shadow-md);" alt="PDF Slide Page ${slide.num}">

        <!-- EXACT PDF TEXT DESCRIPTION BELOW IMAGE -->
        ${slide.title || slide.subtitle || slide.body ? `
          <div style="margin-top:16px; text-align:left; background:var(--bg-card); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color);" onclick="event.stopPropagation();">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--primary-600); margin-bottom:4px;">${slide.title}</h3>
            ${slide.subtitle ? `<div style="font-weight:700; color:var(--text-main); font-size:0.95rem; margin-bottom:8px;">${slide.subtitle}</div>` : ''}
            ${slide.body ? `<div style="white-space:pre-wrap; font-size:0.875rem; color:var(--text-main); line-height:1.6;">${slide.body}</div>` : ''}
          </div>
        ` : ''}

        <!-- AI Prompt Copy Box (if present on slide) -->
        ${slide.prompt ? `
          <div style="margin-top: 14px; text-align:left;" onclick="event.stopPropagation();">
            <div style="font-size: 0.85rem; font-weight:700; color:var(--primary-600); margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
              <span>📋 슬라이드 실습 AI 프롬프트 (클릭 시 1초 복사)</span>
              <button class="btn btn-outline" style="padding:2px 10px; font-size:0.75rem;" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">복사하기</button>
            </div>
            <div class="prompt-copy-box" onclick="copyTextToClipboard(\`${escapeHTML(slide.prompt)}\`)">${escapeHTML(slide.prompt)}</div>
          </div>
        ` : ''}

        ${slide.code ? `
          <div style="margin-top: 14px; text-align:left;" onclick="event.stopPropagation();">
            <div style="font-size: 0.85rem; font-weight:700; color:var(--text-muted); margin-bottom:6px;">💻 슬라이드 파이썬 코드 예시</div>
            <div class="code-box" style="font-size:0.825rem; margin:0;"><pre><code>${escapeHTML(slide.code)}</code></pre></div>
          </div>
        ` : ''}

        ${slide.cmd ? `
          <div style="margin-top: 14px; text-align:left;" onclick="event.stopPropagation();">
            <div style="font-size: 0.85rem; font-weight:700; color:var(--accent-emerald); margin-bottom:6px;">⚡ 실행 명령어</div>
            <div class="code-box" style="font-size:0.825rem; background:#047857; color:white;"><code>${escapeHTML(slide.cmd)}</code></div>
          </div>
        ` : ''}
      </div>

      <!-- Bottom Helper Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.825rem; color:var(--text-muted); margin-top:14px; padding:0 4px;">
        <span>💡 화면 클릭 또는 키보드 방향키(➔), Space, Enter 키로 PDF 59개 슬라이드를 정밀하게 학습하세요.</span>
        <button class="btn btn-outline" style="padding:3px 10px; font-size:0.75rem;" onclick="app.markAllSlidesViewed()">
          ✔ 전체 수강완료 처리
        </button>
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
");

        File.WriteAllText(outJsPath, sb.ToString(), Encoding.UTF8);
        Console.WriteLine("SUCCESS: Generated script.js via C# compiler!");
    }
}
