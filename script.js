/* ==========================================
   바이브코딩 사내 교육 포털 - Core JavaScript (ES6+)
   기초 교육 전용 & 실습물 제출/집합교육 시상 투표 시스템
   ========================================== */

// Core Single Basic Course Dataset
const BASIC_COURSE = {
  id: 'vibe-basic-101',
  category: 'course',
  categoryLabel: '기초 필수 교육',
  title: '🚀 [기초 교육] AI 바이브코딩 입문 & 나만의 실습 작품 제작하기',
  desc: 'AI 도구(Copilot, ChatGPT) 기초 활용법을 이수하고, 업무 효율화를 위한 나만의 초간단 실습 결과물을 제작/제출하세요. 집합교육 때 현장 투표로 우수작 시상이 진행됩니다!',
  level: 'beginner',
  levelLabel: '초급 (누구나 가능)',
  duration: '45분',
  bannerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
  takeaways: [
    '바이브코딩(Vibe Coding)의 핵심 원리 및 AI 페어 프로그래밍 기초 습득',
    '업무 자동화 및 반복 작업을 줄이는 실전 AI 프롬프트 작성 요령',
    '30분 만에 완성하는 나만의 초간단 실습 결과물 만들기 및 집합교육 시상 제출'
  ],
  codeExample: {
    language: 'PROMPT',
    code: `/* [초간단 실습 예시 프롬프트]\n * System: 당신은 사내 생산성 전문가입니다.\n * Task: 아래 주간 업무 목록을 요약하고, 다음 주 우선순위 3가지를 도출하는 파이썬 코드를 작성해줘.\n */`
  },
  chapters: [
    { id: 'c1', title: '1장. 바이브코딩 핵심 개념 및 AI 도구 세팅', time: '15분' },
    { id: 'c2', title: '2장. 초간단 프롬프팅으로 실습 결과물 구상하기', time: '20분' },
    { id: 'c3', title: '3장. 실습물 제출 및 집합교육 시상 투표 참여 가이드', time: '10분' }
  ],
  quiz: [
    {
      q: '바이브코딩(Vibe Coding)을 활용할 때 가장 권장되는 접근 방식은 무엇인가요?',
      options: [
        'AI 도구를 보조 조수로 활용하며 의도를 구체적인 프롬프트로 유도한다.',
        '모든 프롬프트를 텍스트 1줄로 모호하게 전달한다.',
        '생성된 코드를 전혀 검증하지 않는다.',
        '실습물 제출을 거부한다.'
      ],
      answer: 0,
      explanation: '정답입니다! 명확한 프롬프트를 전달하고 AI 결과를 검토하며 완성하는 것이 바이브코딩 기초입니다.'
    },
    {
      q: '이번 사내 기초교육 완료 후 수행해야 하는 활동은 무엇인가요?',
      options: [
        '초간단 실습 결과물(프롬프트 또는 코드)을 제출하고 집합교육 때 투표 및 시상에 참여한다.',
        '컴퓨터를 바로 끈다.',
        '다른 사람의 실습물을 삭제한다.',
        '아무것도 제출하지 않는다.'
      ],
      answer: 0,
      explanation: '정답입니다! 학습 후 작성하신 아이디어나 실습물을 제출하면 집합교육 현장 투표로 시상합니다.'
    }
  ]
};

// Initial Pre-populated Sample Submissions for Team Gathering Award Gallery
const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-01',
    title: '✉️ [업무자동화] AI 주간 보고서 자동 작성 프롬프트 스크립트',
    desc: '매주 1시간씩 걸리던 주간 실적 정리 작업을 Notion 템플릿과 연동하여 1분 만에 초안을 만드는 AI 프롬프트 세트를 작성해보았습니다.',
    content: `System: 당신은 수석 개발자입니다.\nInput: 금주 진행한 깃허브 커밋 5개\nTask: 커밋 로그를 기반으로 사내 보고용 주간 보고서 마크다운을 자동 작성하세요.`,
    author: '김철수 대리',
    dept: '디지털혁신팀',
    votes: 8,
    date: '2026.07.26'
  },
  {
    id: 'sub-02',
    title: '📊 [생산성] 파이썬 엑셀 데이터 자동 결합 & 요약 유틸리티',
    desc: '흩어져 있는 5개 부서 엑셀 파일을 Copilot의 도움을 받아 단 20줄의 Python 코드로 병합하는 실습물을 구현했습니다.',
    content: `import pandas as pd\n# Copilot으로 생성한 초간단 엑셀 합치기\nfiles = ['dept1.xlsx', 'dept2.xlsx']\ndf = pd.concat([pd.read_excel(f) for f in files])\ndf.to_excel('merged_result.xlsx', index=False)`,
    author: '이영희 과장',
    dept: '경영지원팀',
    votes: 12,
    date: '2026.07.27'
  },
  {
    id: 'sub-03',
    title: '🤖 [커뮤니케이션] Slack 공지사항 가독성 개선 자동 프롬프트',
    desc: '긴 텍스트 공지사항을 핵심 요약 3줄과 체크리스트로 자동 재구성해주는 슬랙용 프롬프터입니다.',
    content: `Task: 아래 긴 공지글을 읽고\n1. [핵심 요약 3줄]\n2. [직원 조치 사항]\n으로 분리하여 카드 형태로 템플릿화하세요.`,
    author: '박민수 프로',
    dept: '소프트웨어개발실',
    votes: 5,
    date: '2026.07.27'
  }
];

// App State Manager
class VibePortalApp {
  constructor() {
    this.course = BASIC_COURSE;

    this.progress = this.loadFromStorage('vibecoding_user_progress', {
      completedCourses: [],
      completedChapters: {},
      quizScores: {}
    });

    this.userInfo = this.loadFromStorage('vibecoding_user_info', {
      name: '홍길동 프로',
      dept: '소프트웨어개발실'
    });

    this.submissions = this.loadFromStorage('vibecoding_submissions', INITIAL_SUBMISSIONS);
    this.userVotes = this.loadFromStorage('vibecoding_user_votes', []); // Array of submitted IDs voted by this user

    this.theme = this.loadFromStorage('vibecoding_theme', 'light');

    this.activeTab = 'course'; // 'course', 'gallery', 'my_sub'
    this.searchQuery = '';
    this.sortBy = 'votes'; // 'votes', 'latest', 'title'
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
      localStorage.setItem('vibecoding_user_votes', JSON.stringify(this.userVotes));
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

  getCourseProgress() {
    if (this.progress.completedCourses.includes(this.course.id)) {
      return 100;
    }
    const completedChaps = this.progress.completedChapters[this.course.id] || [];
    return Math.round((completedChaps.length / this.course.chapters.length) * 100);
  }

  toggleChapterCompletion(chapterId) {
    if (!this.progress.completedChapters[this.course.id]) {
      this.progress.completedChapters[this.course.id] = [];
    }

    const chapList = this.progress.completedChapters[this.course.id];
    const index = chapList.indexOf(chapterId);

    if (index > -1) {
      chapList.splice(index, 1);
    } else {
      chapList.push(chapterId);
    }

    if (chapList.length === this.course.chapters.length) {
      if (!this.progress.completedCourses.includes(this.course.id)) {
        this.progress.completedCourses.push(this.course.id);
        showToast(`🎉 기초 교육 수료를 축하합니다! 이제 실습물을 제출해보세요!`, 'success');
        triggerConfetti();
      }
    } else {
      const idx = this.progress.completedCourses.indexOf(this.course.id);
      if (idx > -1) this.progress.completedCourses.splice(idx, 1);
    }

    this.saveProgress();
  }

  toggleCourseMasterCompletion() {
    const isCompleted = this.progress.completedCourses.includes(this.course.id);
    if (isCompleted) {
      const idx = this.progress.completedCourses.indexOf(this.course.id);
      if (idx > -1) this.progress.completedCourses.splice(idx, 1);
      this.progress.completedChapters[this.course.id] = [];
      showToast('기초 교육 수료 완료가 취소되었습니다.', 'info');
    } else {
      this.progress.completedCourses.push(this.course.id);
      this.progress.completedChapters[this.course.id] = this.course.chapters.map(c => c.id);
      showToast(`🎉 축하합니다! 기초 교육 코스를 완수하셨습니다!`, 'success');
      triggerConfetti();
    }
    this.saveProgress();
  }

  // Voting action
  toggleVote(subId) {
    const sub = this.submissions.find(s => s.id === subId);
    if (!sub) return;

    const voteIdx = this.userVotes.indexOf(subId);
    if (voteIdx > -1) {
      // Cancel vote
      this.userVotes.splice(voteIdx, 1);
      sub.votes = Math.max(0, sub.votes - 1);
      showToast(`'${sub.title}' 투표를 취소했습니다.`, 'info');
    } else {
      // Cast vote
      this.userVotes.push(subId);
      sub.votes += 1;
      showToast(`⭐ '${sub.title}'에 투표하셨습니다! (집합교육 시상 반영)`, 'success');
    }

    this.saveSubmissions();
  }

  // Add new user submission
  addSubmission(title, desc, content) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

    const newSub = {
      id: 'sub-' + Date.now(),
      title,
      desc,
      content,
      author: this.userInfo.name,
      dept: this.userInfo.dept,
      votes: 1, // Automatic initial vote by author
      date: dateStr
    };

    this.submissions.unshift(newSub);
    this.userVotes.push(newSub.id);
    this.saveSubmissions();
    showToast('🚀 실습물이 성공적으로 제출되어 집합교육 시상 후보에 등록되었습니다!', 'success');
    triggerConfetti();
  }
}

// Instantiate App
const app = new VibePortalApp();

// DOM Loading Init
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderHeaderAndBanner();
  renderTabBadges();
  renderMainView();

  setupSearchAndFilters();
  setupModalEvents();
  setupSubmissionForm();
  setupProfileForm();
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
  document.getElementById('headerUserName').textContent = app.userInfo.name;
  document.getElementById('headerUserDept').textContent = app.userInfo.dept;
  document.getElementById('welcomeUserName').textContent = app.userInfo.name;
  document.getElementById('headerAvatar').textContent = app.userInfo.name.charAt(0);

  const progress = app.getCourseProgress();
  document.getElementById('statOverallProgress').textContent = progress;
  document.getElementById('bannerProgressFill').style.width = `${progress}%`;

  document.getElementById('statSubmissionCount').textContent = app.submissions.length;
  document.getElementById('statMyVotesCount').textContent = app.userVotes.length;
}

function renderTabBadges() {
  document.getElementById('galleryCountBadge').textContent = app.submissions.length;
  const myCount = app.submissions.filter(s => s.author === app.userInfo.name).length;
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

  // Category Tabs
  const categoryTabs = document.getElementById('categoryTabs');
  categoryTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    app.activeTab = btn.dataset.category;
    renderMainView();
  });

  // Sort select
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    app.sortBy = e.target.value;
    renderMainView();
  });
}

// Main Dynamic View Renderer
function renderMainView() {
  const grid = document.getElementById('mainGrid');
  grid.innerHTML = '';

  const sortSelect = document.getElementById('sortSelect');

  if (app.activeTab === 'course') {
    sortSelect.style.display = 'none';
    document.getElementById('resultsCount').textContent = '기초 교육 코스 (1개)';
    renderSingleCourseCard(grid);
  } else if (app.activeTab === 'gallery') {
    sortSelect.style.display = 'inline-block';
    renderSubmissionsGallery(grid, false);
  } else if (app.activeTab === 'my_sub') {
    sortSelect.style.display = 'inline-block';
    renderSubmissionsGallery(grid, true);
  }
}

// Render Single Core Basic Course Card
function renderSingleCourseCard(container) {
  const isCompleted = app.progress.completedCourses.includes(app.course.id);
  const progressPercent = app.getCourseProgress();
  const hasPassedQuiz = (app.progress.quizScores[app.course.id] || 0) >= 80;

  const card = document.createElement('article');
  card.className = `course-card ${isCompleted ? 'completed' : ''}`;
  card.style.gridColumn = '1 / -1';
  card.style.maxWidth = '840px';
  card.style.margin = '0 auto';

  card.innerHTML = `
    <div class="card-banner" style="background: ${app.course.bannerGradient}">
      <div class="card-banner-overlay"></div>
      <div class="card-banner-top">
        <span class="category-tag">${app.course.categoryLabel}</span>
        <span style="color:#fff; font-size:0.85rem; font-weight:700;">★ 필수 이수 및 실습물 제출</span>
      </div>
      <div class="card-banner-bottom">
        <span class="level-badge beginner">● ${app.course.levelLabel}</span>
        <span>⏱ ${app.course.duration}</span>
      </div>
    </div>

    <div class="card-body">
      <h2 class="course-title" style="font-size: 1.35rem;">${app.course.title}</h2>
      <p class="course-desc" style="font-size: 0.95rem;">${app.course.desc}</p>

      <div style="background-color: var(--primary-50); padding: 14px 18px; border-radius: var(--radius-md); border-left: 4px solid var(--primary-600); margin: 8px 0;">
        <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--primary-800); margin-bottom: 4px;">🎁 직장 집합 교육 시상 이벤트 참여 방법</h4>
        <ol style="padding-left: 18px; font-size: 0.85rem; color: var(--text-main); display:flex; flex-direction:column; gap:4px;">
          <li>아래 <strong>'학습하기'</strong> 버튼을 눌러 1장~3장 기초 커리큘럼을 이수합니다.</li>
          <li>AI 프롬프트 또는 파이썬/JS 코드로 만든 <strong>초간단 실습물</strong>을 제출합니다.</li>
          <li>집합교육 때 동료들과 실습물을 공유하고 <strong>현장 투표로 시상 및 상품</strong>을 받습니다!</li>
        </ol>
      </div>

      <div class="card-footer">
        <div class="progress-header">
          <span>${isCompleted ? '✔ 기초교육 수료 완료' : '학습 진도율'}</span>
          <span class="progress-percent">${progressPercent}%</span>
        </div>

        <div class="card-progress-bar">
          <div class="card-progress-fill" style="width: ${progressPercent}%"></div>
        </div>

        <div class="card-actions">
          <button class="btn btn-primary" style="flex: 1;" onclick="openCourseDetailModal()">
            ${progressPercent > 0 ? '이어서 학습하기' : '학습 시작하기'}
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

// Render Submissions Gallery (All or My submissions)
function renderSubmissionsGallery(container, myOnly = false) {
  let list = [...app.submissions];

  if (myOnly) {
    list = list.filter(s => s.author === app.userInfo.name);
  }

  // Search Filter
  if (app.searchQuery) {
    const q = app.searchQuery;
    list = list.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.author.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
    );
  }

  // Sort
  if (app.sortBy === 'votes') {
    list.sort((a, b) => b.votes - a.votes);
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
          ${myOnly ? '기초 교육을 수강하고 첫 번째 실습물을 제출해 집합교육 시상에 도전해 보세요!' : '첫 번째 시상 후보 작품을 작성해 보세요.'}
        </p>
        <button class="btn btn-accent" onclick="openSubmitModal()">✨ 실습물 제출하기</button>
      </div>
    `;
    return;
  }

  // Ranked Submissions Render
  // Calculate Rank
  const sortedByVoteList = [...app.submissions].sort((a, b) => b.votes - a.votes);

  list.forEach(sub => {
    const rankIndex = sortedByVoteList.findIndex(s => s.id === sub.id);
    let rankBadgeText = '';
    if (rankIndex === 0 && sub.votes > 0) rankBadgeText = '🥇 1위 후보';
    else if (rankIndex === 1 && sub.votes > 0) rankBadgeText = '🥈 2위 후보';
    else if (rankIndex === 2 && sub.votes > 0) rankBadgeText = '🥉 3위 후보';
    else if (sub.votes > 0) rankBadgeText = `${rankIndex + 1}위 (${sub.votes}표)`;

    const isVoted = app.userVotes.includes(sub.id);

    const card = document.createElement('article');
    card.className = 'submission-card';
    card.innerHTML = `
      <div class="submission-card-header">
        <div class="author-badge">
          <div class="author-avatar">${sub.author.charAt(0)}</div>
          <div>
            <div style="font-weight:700; font-size:0.95rem;">${sub.author}</div>
            <div style="font-size:0.775rem; color:var(--text-muted);">${sub.dept} · ${sub.date}</div>
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

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color);">
        <span style="font-size:0.85rem; color:var(--text-muted);">
          현재 득표: <strong style="color:var(--primary-600); font-size:1rem;">${sub.votes}표</strong>
        </span>

        <button class="vote-btn ${isVoted ? 'voted' : ''}" onclick="app.toggleVote('${sub.id}'); renderHeaderAndBanner(); renderTabBadges(); renderMainView();">
          ${isVoted ? '⭐ 투표 완료' : '⭐ 투표하기'}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==========================================
// Modal Handlers
// ==========================================
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

  document.getElementById('userProfileBtn').addEventListener('click', () => {
    document.getElementById('inputUserName').value = app.userInfo.name;
    document.getElementById('inputUserDept').value = app.userInfo.dept;
    openModal('profileModal');
  });

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
  openModal('submitProjectModal');
}

function openCourseDetailModal() {
  const course = app.course;
  document.getElementById('detailTitle').textContent = course.title;
  document.getElementById('detailDesc').textContent = course.desc;

  const takeawaysUl = document.getElementById('detailTakeaways');
  takeawaysUl.innerHTML = course.takeaways.map(t => `<li>${t}</li>`).join('');

  document.getElementById('codeLanguage').textContent = course.codeExample.language;
  document.getElementById('codeContent').textContent = course.codeExample.code;

  document.getElementById('copyCodeBtn').onclick = () => {
    navigator.clipboard.writeText(course.codeExample.code);
    showToast('코드가 클립보드에 복사되었습니다.', 'info');
  };

  renderDetailChapters();

  const masterBtn = document.getElementById('detailMasterToggleBtn');
  const isCompleted = app.progress.completedCourses.includes(course.id);
  masterBtn.innerHTML = `<span>✔</span> ${isCompleted ? '완료 취소하기' : '전체 완료로 표시'}`;
  masterBtn.onclick = () => {
    app.toggleCourseMasterCompletion();
    renderDetailChapters();
    renderHeaderAndBanner();
    renderMainView();
    const nowCompleted = app.progress.completedCourses.includes(course.id);
    masterBtn.innerHTML = `<span>✔</span> ${nowCompleted ? '완료 취소하기' : '전체 완료로 표시'}`;
  };

  openModal('courseDetailModal');
}

function renderDetailChapters() {
  const list = document.getElementById('detailChaptersList');
  list.innerHTML = '';

  const completedChaps = app.progress.completedChapters[app.course.id] || [];

  app.course.chapters.forEach(chap => {
    const isCompleted = completedChaps.includes(chap.id);
    const div = document.createElement('div');
    div.className = `chapter-item ${isCompleted ? 'completed' : ''}`;
    div.innerHTML = `
      <div class="chapter-checkbox">${isCompleted ? '✓' : ''}</div>
      <div class="chapter-info">
        <div class="chapter-title">${chap.title}</div>
        <div class="chapter-time">소요시간: ${chap.time}</div>
      </div>
    `;

    div.onclick = () => {
      app.toggleChapterCompletion(chap.id);
      renderDetailChapters();
      renderHeaderAndBanner();
      renderMainView();
    };

    list.appendChild(div);
  });
}

// Submission Form Setup
function setupSubmissionForm() {
  const form = document.getElementById('submissionForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('subTitle').value.trim();
    const desc = document.getElementById('subDesc').value.trim();
    const content = document.getElementById('subContent').value.trim();

    if (title && desc && content) {
      app.addSubmission(title, desc, content);
      form.reset();
      closeModal('submitProjectModal');

      // Switch to Gallery tab
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

// Quiz Modal
function openQuizModal() {
  document.getElementById('quizCourseTitle').textContent = app.course.title;
  renderQuizContent();
  openModal('quizModal');
}

function renderQuizContent() {
  const container = document.getElementById('quizBodyContent');
  container.innerHTML = '';

  let html = `
    <div style="background-color: var(--primary-50); padding: 16px 20px; border-radius: var(--radius-md); font-size: 0.9rem;">
      💡 기초 자가진단 퀴즈입니다. <strong>80점 이상</strong> 획득 시 이수증이 발급됩니다.
    </div>
    <form id="quizForm" style="display:flex; flex-direction:column; gap:20px;">
  `;

  app.course.quiz.forEach((qItem, qIdx) => {
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

function gradeQuiz() {
  const form = document.getElementById('quizForm');
  let correctCount = 0;

  app.course.quiz.forEach((qItem, qIdx) => {
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

  const score = Math.round((correctCount / app.course.quiz.length) * 100);
  app.progress.quizScores[app.course.id] = score;
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
  document.getElementById('certCourseTitle').textContent = app.course.title;
  document.getElementById('certUserName').textContent = app.userInfo.name;
  document.getElementById('certDeptName').textContent = app.userInfo.dept;

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
    const name = document.getElementById('inputUserName').value.trim();
    const dept = document.getElementById('inputUserDept').value.trim();

    if (name && dept) {
      app.userInfo.name = name;
      app.userInfo.dept = dept;
      app.saveUserInfo();

      renderHeaderAndBanner();
      renderTabBadges();
      renderMainView();
      closeModal('profileModal');
      showToast('프로필 정보가 변경되었습니다.', 'success');
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
