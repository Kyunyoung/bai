// Exact 59 PDF Slides Dataset
const PPT_SLIDES = Array.from({ length: 59 }, (_, i) => {
  const num = i + 1;
  let part = 'PART 01. 도입부';
  if (num >= 9 && num <= 21) part = 'PART 02. 세팅';
  else if (num >= 22 && num <= 36) part = 'PART 03. 엑셀취합';
  else if (num >= 37) part = 'PART 04. 표도우미';

  return {
    num: num,
    part: part,
    title: `PDF 슬라이드 ${num}장`,
    image: `slides_media/slide_${num}.jpg`
  };
});

// Seed Initial Contest Submissions (Empty default)
const SEED_SUBMISSIONS = [];

// AI Prompts Dataset
const AI_PROMPTS = [
  {
    cat: 'excel',
    tag: '엑셀취합',
    title: '📊 250개 엑셀 파일 자동 통합 프롬프트',
    code: '역할: 파이썬 데이터 엔지니어\n요청: C:\\policedata 폴더에 있는 250개 경찰서 엑셀(.xlsx) 파일의 "실적표" 시트를 하나의 엑셀 파일로 합치고, 서식이 다른 행은 자동 정형화하는 Python 스크립트를 작성해줘.'
  },
  {
    cat: 'table',
    tag: '표도우미',
    title: '📑 한글 표 자동 정렬 및 서식 도우미',
    code: '역할: 문서 자동화 전문가\n요청: 표 내의 공백을 제거하고, 1열은 중앙 정렬, 2열 숫자는 우측 정렬하며 천단위 콤마를 자동으로 삽입하는 자동화 로직을 작성해줘.'
  },
  {
    cat: 'python',
    tag: '파이썬/C#',
    title: '⚙️ 55개 시나리오 오프라인 스크립트 생성기',
    code: '역할: C# .NET 개발자\n요청: JSON 데이터셋을 읽어 시나리오별 이미지 패스와 슬라이드 매핑 JavaScript 코드를 자동 생성하는 클래스를 구성해줘.'
  },
  {
    cat: 'excel',
    tag: '오류검증',
    title: '🔍 엑셀 누락 행 & 이상치 교정 프롬프트',
    code: '역할: 데이터 품질 관리자\n요청: pandas 라이브러리를 이용해 값이 빈 셀(NaN)을 구별하여 사유를 기록하고, 합계 금액 불일치 행을 빨간색 셀로 하이라이트해줘.'
  }
];

// Seed Initial Voters Dataset
const SEED_VOTERS = [
  { id: 'voter_1', name: '김경위', dept: '디지털혁신팀', birthdate: '19900101', votedSubmissionId: null },
  { id: 'voter_2', name: '이형사', dept: '사이버범죄수사대', birthdate: '19850515', votedSubmissionId: null },
  { id: 'voter_3', name: '박수사관', dept: '종합조정관실', birthdate: '19921120', votedSubmissionId: null },
  { id: 'voter_4', name: '홍길동', dept: '생활안전과', birthdate: '19880808', votedSubmissionId: null }
];

// App Core State Manager
class VibePortalApp {
  constructor() {
    this.slides = PPT_SLIDES;
    this.currentSlideIndex = 0;
    this.theme = this.loadFromStorage('vibecoding_theme', 'light');
    this.viewedSlides = new Set(this.loadFromStorage('vibecoding_viewed_slides', []));
    
    // Contest Submissions (Initial Load from Local Storage / Supabase Sync)
    this.submissions = this.loadFromStorage('vibecoding_contest_submissions', []);
    if (!Array.isArray(this.submissions)) {
      this.submissions = [];
    }
    // Clean legacy seed submission entries if present in local storage
    const cleanedSubmissions = this.submissions.filter(s => s && s.id && !['sub_1', 'sub_2', 'sub_3'].includes(s.id));
    if (cleanedSubmissions.length !== this.submissions.length) {
      this.submissions = cleanedSubmissions;
      this.saveSubmissions();
    }

    // Registered Voters List
    this.voters = this.loadFromStorage('vibecoding_registered_voters', null);
    if (this.voters === null || !Array.isArray(this.voters)) {
      this.voters = SEED_VOTERS;
      this.saveVoters();
    }

    // Current Logged In Voter
    this.currentVoter = this.loadFromStorage('vibecoding_current_voter', null);

    // User Votes
    this.userVotes = new Set(this.loadFromStorage('vibecoding_user_votes', []));

    // Permanently Deleted Submission IDs
    this.deletedIds = new Set(this.loadFromStorage('vibecoding_deleted_ids', []));

    // Admin Auth State
    this.isAdmin = false;
  }

  saveVoters() {
    try {
      localStorage.setItem('vibecoding_registered_voters', JSON.stringify(this.voters));
      if (window.location.protocol.startsWith('http')) {
        fetch('/api/voters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.voters)
        }).catch(e => console.warn('Voters sync fallback:', e));
      }
    } catch (e) {
      console.error(e);
    }
  }

  saveCurrentVoter() {
    try {
      if (this.currentVoter) {
        localStorage.setItem('vibecoding_current_voter', JSON.stringify(this.currentVoter));
      } else {
        localStorage.removeItem('vibecoding_current_voter');
      }
    } catch (e) {
      console.error(e);
    }
  }

  saveDeletedIds() {
    try {
      localStorage.setItem('vibecoding_deleted_ids', JSON.stringify(Array.from(this.deletedIds)));
    } catch (e) {
      console.error(e);
    }
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

  saveSubmissions() {
    try {
      localStorage.setItem('vibecoding_contest_submissions', JSON.stringify(this.submissions));
    } catch (e) {
      console.error(e);
    }
  }

  saveUserVotes() {
    try {
      localStorage.setItem('vibecoding_user_votes', JSON.stringify(Array.from(this.userVotes)));
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

  getProgressPercent() {
    return Math.round((this.viewedSlides.size / this.slides.length) * 100);
  }
}

const app = new VibePortalApp();

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.protocol === 'file:') {
    const banner = document.getElementById('fileProtocolBanner');
    if (banner) banner.style.display = 'block';
  }

  initTheme();
  setupUrlParamsNav();
  setupPromptLibrary();
  renderHomeStats();
  renderHomeTopEntries();
  renderContestGallery();
  updateVotingTicketUI();
  updateVoterHeaderUI();
  renderVoterTable();
  setupModalEvents();
  fetchVotersFromServer();

  loadCentralSubmissions();
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

function setupUrlParamsNav() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab) {
    switchNavTab(tab);
  }
}

/* ==========================================
   NAVIGATION & TAB SWITCHER LOGIC
   ========================================== */

function switchNavTab(tabName) {
  // Update nav buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update sections
  document.querySelectorAll('.portal-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSectionMap = {
    home: 'sectionHome',
    education: 'sectionEducation',
    contest: 'sectionContest',
    admin: 'sectionAdmin'
  };

  const targetId = targetSectionMap[tabName] || 'sectionHome';
  const targetSec = document.getElementById(targetId);
  if (targetSec) targetSec.classList.add('active');

  // Specific tab render triggers
  if (tabName === 'home') {
    renderHomeStats();
    renderHomeTopEntries();
  } else if (tabName === 'contest') {
    renderContestGallery();
    updateVotingTicketUI();
  } else if (tabName === 'admin') {
    if (app.isAdmin) {
      document.getElementById('adminAuthBox').style.display = 'none';
      document.getElementById('adminDashboardBox').style.display = 'block';
      renderAdminDashboard();
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchContestSubTab(subtabName) {
  document.querySelectorAll('.contest-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subtab === subtabName);
  });

  document.querySelectorAll('.contest-subcontent').forEach(sub => {
    sub.classList.remove('active');
  });

  const subMap = {
    gallery: 'subtabGallery',
    submit: 'subtabSubmit',
    guide: 'subtabGuide'
  };

  const targetId = subMap[subtabName] || 'subtabGallery';
  const targetSub = document.getElementById(targetId);
  if (targetSub) targetSub.classList.add('active');

  if (subtabName === 'gallery') {
    renderContestGallery();
  }
}

/* ==========================================
   HOME DASHBOARD LOGIC
   ========================================== */

function renderHomeStats() {
  const subCount = app.submissions.filter(s => s.status !== 'hidden').length;
  const totalVotes = app.submissions.reduce((sum, s) => sum + (s.status !== 'hidden' ? s.votes : 0), 0);
  const progress = app.getProgressPercent();

  const elSubs = document.getElementById('homeStatSubmissions');
  if (elSubs) elSubs.textContent = `${subCount} 개`;

  const elVotes = document.getElementById('homeStatVotes');
  if (elVotes) elVotes.textContent = `${totalVotes} 표`;

  const elProg = document.getElementById('homeStatProgress');
  if (elProg) elProg.textContent = `${progress}%`;
}

function renderHomeTopEntries() {
  const container = document.getElementById('homeTopEntriesGrid');
  if (!container) return;

  const topThree = [...app.submissions]
    .filter(s => s.status !== 'hidden')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  if (topThree.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:40px 20px; background:var(--card-bg, #ffffff); border-radius:var(--radius-lg, 12px); border:1px dashed var(--border-color, #cbd5e1);">
        <div style="font-size:2.5rem; margin-bottom:8px;">🏆</div>
        <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">아직 출품된 작품이 없습니다</h4>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:16px;">첫 번째 작품을 등록하고 명예의 전당 1위에 도전해보세요!</p>
        <button class="btn btn-primary btn-sm" onclick="openDirectSubmissionModal()">🚀 지금 작품 등록하기</button>
      </div>
    `;
    return;
  }

  let html = '';
  topThree.forEach((s, idx) => {
    const isVoted = app.userVotes.has(s.id);
    const hasVideo = s.videoUrl || s.videoData;
    const resolvedVideoSrc = getPlayableVideoUrl(s);
    html += `
      <div class="contest-card">
        <div class="contest-thumb-wrapper" onclick="openSubmissionDetailModal('${s.id}')">
          ${hasVideo ? `
            <video src="${resolvedVideoSrc}" class="contest-thumb-img" autoplay loop muted playsinline style="object-fit:cover; pointer-events:none;"></video>
            <div class="video-badge">📱 🎬 시연 영상</div>
          ` : `
            <img src="${s.image}" class="contest-thumb-img" alt="${s.title}">
          `}
          <div class="contest-rank-badge">👑 TOP ${idx + 1}위</div>
        </div>
        <div class="contest-card-body">
          <div class="contest-card-meta">
            <span>👤 ${s.name} (${s.dept})</span>
            <span>📅 ${s.date}</span>
          </div>
          <h3 class="contest-card-title" onclick="openSubmissionDetailModal('${s.id}')" style="cursor:pointer;">${s.title}</h3>
          <p class="contest-card-desc">${s.desc}</p>
          
          <div class="contest-card-footer">
            <span class="vote-count-text">❤️ ${s.votes} 표</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <button class="btn btn-outline" style="padding:5px 10px; font-size:0.75rem;" onclick="event.stopPropagation(); promptPasscodeVerification('${s.id}', 'edit');" title="작품 내용 수정">
                ✏️ 수정
              </button>
              <button class="btn btn-outline" style="padding:5px 10px; font-size:0.75rem; color:#ef4444;" onclick="event.stopPropagation(); promptPasscodeVerification('${s.id}', 'cancel');" title="출품 삭제/취소">
                🗑️ 취소
              </button>
              <button class="vote-heart-btn ${isVoted ? 'voted' : ''}" onclick="event.stopPropagation(); handleVote('${s.id}');">
                ${isVoted ? '✔ 투표 완료' : '❤️ 투표하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================
   AI PROMPT LIBRARY LOGIC (1-CLICK COPY)
   ========================================== */

function setupPromptLibrary() {
  const tabs = document.getElementById('promptFilterTabs');
  if (!tabs) return;

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    renderPromptLibrary(btn.dataset.cat);
  });

  renderPromptLibrary('all');
}

function renderPromptLibrary(filterCat = 'all') {
  const container = document.getElementById('promptLibraryGrid');
  if (!container) return;

  const filtered = filterCat === 'all' 
    ? AI_PROMPTS 
    : AI_PROMPTS.filter(p => p.cat === filterCat);

  let html = '';
  filtered.forEach((p, idx) => {
    html += `
      <div class="prompt-card">
        <div class="prompt-card-header">
          <span class="prompt-tag">#${p.tag}</span>
        </div>
        <h4 class="prompt-card-title">${p.title}</h4>
        <div class="prompt-code-container">${p.code}</div>
        <button class="prompt-copy-btn" onclick="copyPromptText(\`${encodeURIComponent(p.code)}\`, this)">
          📋 1-Click 프롬프트 복사
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function copyPromptText(encodedText, btnEl) {
  const text = decodeURIComponent(encodedText);
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnEl.innerHTML;
    btnEl.innerHTML = '✅ 복사 완료!';
    btnEl.style.background = '#10b981';
    btnEl.style.color = 'white';

    showToast('📋 AI 프롬프트가 클립보드에 복사되었습니다!', 'success');

    setTimeout(() => {
      btnEl.innerHTML = originalText;
      btnEl.style.background = '';
      btnEl.style.color = '';
    }, 2000);
  }).catch(err => {
    showToast('복사 중 오류가 발생했습니다.', 'info');
  });
}

/* ==========================================
   CONTEST SUBMISSION & REAL-TIME VOTING LOGIC
   ========================================== */

function updateVotingTicketUI() {
  const ticketDisplay = document.getElementById('userTicketDisplay');
  if (ticketDisplay) {
    const remaining = 3 - app.userVotes.size;
    ticketDisplay.textContent = `${remaining} / 3 표`;
  }
}

function renderContestGallery() {
  const grid = document.getElementById('contestGalleryGrid');
  if (!grid) return;

  const searchKeyword = (document.getElementById('contestSearchInput')?.value || '').toLowerCase();
  const sortType = document.getElementById('contestSortSelect')?.value || 'votes';

  let list = app.submissions.filter(s => s.status !== 'hidden');

  // Filter Search
  if (searchKeyword) {
    list = list.filter(s => 
      s.title.toLowerCase().includes(searchKeyword) ||
      s.name.toLowerCase().includes(searchKeyword) ||
      s.dept.toLowerCase().includes(searchKeyword) ||
      s.desc.toLowerCase().includes(searchKeyword)
    );
  }

  // Filter Sort
  if (sortType === 'votes') {
    list.sort((a, b) => b.votes - a.votes);
  } else if (sortType === 'newest') {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortType === 'my') {
    list = list.filter(s => app.userVotes.has(s.id));
  }

  if (list.length === 0) {
    if (app.submissions.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:60px 20px; background:var(--card-bg, #ffffff); border-radius:var(--radius-lg, 12px); border:1px dashed var(--border-color, #cbd5e1);">
          <div style="font-size:3rem; margin-bottom:12px;">🎨</div>
          <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-main); margin-bottom:8px;">등록된 출품작이 없습니다</h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">첫 번째 바이브코딩 업무 자동화 작품을 등록해보세요!</p>
          <button class="btn btn-primary" onclick="openDirectSubmissionModal()">🚀 첫 작품 출품하기</button>
        </div>
      `;
    } else {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">검색 조건에 일치하는 출품작이 없습니다.</div>`;
    }
    return;
  }

  let html = '';
  list.forEach((s, idx) => {
    const isVoted = app.currentVoter && app.currentVoter.votedSubmissionId === s.id;
    const hasVideo = s.videoUrl || s.videoData;
    const resolvedVideoSrc = getPlayableVideoUrl(s);
    html += `
      <div class="contest-card">
        <div class="contest-thumb-wrapper" onclick="openSubmissionDetailModal('${s.id}')">
          ${hasVideo ? `
            <video src="${resolvedVideoSrc}" class="contest-thumb-img" autoplay loop muted playsinline style="object-fit:cover; pointer-events:none;"></video>
            <div class="video-badge">📱 🎬 시연 영상</div>
          ` : `
            <img src="${s.image}" class="contest-thumb-img" alt="${s.title}">
          `}
          <div class="contest-rank-badge">🏆 ${idx + 1}위 (${s.votes}표)</div>
        </div>
        <div class="contest-card-body">
          <div class="contest-card-meta">
            <span>👤 ${s.name} (${s.dept})</span>
            <span>📅 ${s.date}</span>
          </div>
          <h3 class="contest-card-title" onclick="openSubmissionDetailModal('${s.id}')" style="cursor:pointer;">${s.title}</h3>
          <p class="contest-card-desc">${s.desc}</p>
          
          <div class="contest-card-footer">
            <span class="vote-count-text">❤️ ${s.votes} 표</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <button class="btn btn-outline" style="padding:5px 10px; font-size:0.75rem;" onclick="event.stopPropagation(); promptPasscodeVerification('${s.id}', 'edit');" title="작품 내용 수정">
                ✏️ 수정
              </button>
              <button class="btn btn-outline" style="padding:5px 10px; font-size:0.75rem; color:#ef4444;" onclick="event.stopPropagation(); promptPasscodeVerification('${s.id}', 'cancel');" title="출품 삭제/취소">
                🗑️ 취소
              </button>
              <button class="vote-heart-btn ${isVoted ? 'voted' : ''}" onclick="event.stopPropagation(); handleVote('${s.id}');">
                ${isVoted ? '✔ 투표 완료' : '❤️ 투표하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function filterContestGallery() {
  renderContestGallery();
}

function handleVote(submissionId) {
  // Check if voter is logged in
  if (!app.currentVoter) {
    showToast('⚠️ 투표를 위해 먼저 성명 검색 및 생년월일 비밀번호로 로그인해 주세요!', 'info');
    openVoterLoginModal();
    return;
  }

  const sub = app.submissions.find(s => s.id === submissionId);
  if (!sub) return;

  const voter = app.voters.find(v => v.name.trim() === app.currentVoter.name.trim() && normalizeBirthdate(v.birthdate) === normalizeBirthdate(app.currentVoter.birthdate)) || app.currentVoter;

  if (voter.votedSubmissionId === submissionId) {
    // Cancel Vote
    voter.votedSubmissionId = null;
    sub.votes = Math.max(0, sub.votes - 1);
    showToast(`'${sub.title}' 투표를 취소했습니다.`, 'info');
  } else {
    // If already voted for another submission, cancel previous vote first
    if (voter.votedSubmissionId) {
      const prevSub = app.submissions.find(s => s.id === voter.votedSubmissionId);
      if (prevSub) prevSub.votes = Math.max(0, prevSub.votes - 1);
    }
    voter.votedSubmissionId = submissionId;
    sub.votes += 1;
    showToast(`🎉 '${sub.title}' 작품에 투표하셨습니다!`, 'success');
  }

  app.currentVoter = voter;
  app.saveCurrentVoter();
  app.saveVoters();
  app.saveSubmissions();

  updateVoterHeaderUI();
  renderContestGallery();
  renderHomeStats();
  renderHomeTopEntries();
}

let uploadedVideoFile = null;
let uploadedImageFile = null;
let activeVideoPreviewObjectUrl = null;

function handleImageFileSelect(event, previewId, wrapperId) {
  const file = event.target.files?.[0];
  if (!file) return;

  uploadedImageFile = file;

  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById(previewId || 'subImagePreview');
    const wrapper = document.getElementById(wrapperId || 'imagePreviewWrapper');
    if (preview) preview.src = e.target.result;
    if (wrapper) wrapper.style.display = 'block';
    showToast('🖼️ 작품 캡처 이미지가 첨부되었습니다!', 'success');
  };
  try {
    reader.readAsDataURL(file);
  } catch (e) {
    console.error('Image read error:', e);
  }
}

function handleVideoFileSelect(event, previewId, wrapperId) {
  const file = event.target.files?.[0];
  if (!file) return;

  const maxVidSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxVidSize) {
    showToast('⚠️ 동영상 파일 크기는 최대 100MB까지 지원됩니다.', 'warning');
    event.target.value = '';
    return;
  }

  if (activeVideoPreviewObjectUrl) {
    try { URL.revokeObjectURL(activeVideoPreviewObjectUrl); } catch (e) {}
  }

  uploadedVideoFile = file;
  activeVideoPreviewObjectUrl = URL.createObjectURL(file);

  const preview = document.getElementById(previewId || 'subVideoPreview');
  const wrapper = document.getElementById(wrapperId || 'videoPreviewWrapper');

  if (preview) preview.src = activeVideoPreviewObjectUrl;
  if (wrapper) wrapper.style.display = 'block';

  showToast('📱 시연 영상 파일이 선택되었습니다! (' + (file.name || '동영상 파일') + ')', 'info');
}

function loadSampleDemoVideoIntoForm() {
  const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  uploadedVideoUrl = sampleVideoUrl;

  const preview = document.getElementById('subVideoPreview');
  const wrapper = document.getElementById('videoPreviewWrapper');

  if (preview) preview.src = sampleVideoUrl;
  if (wrapper) wrapper.style.display = 'block';

  const nameEl = document.getElementById('subName');
  const deptEl = document.getElementById('subDept');
  const titleEl = document.getElementById('subTitle');
  const descEl = document.getElementById('subDesc');
  const passEl = document.getElementById('subPasscode');

  if (nameEl) nameEl.value = '김경위';
  if (deptEl) deptEl.value = '디지털혁신팀';
  if (titleEl) titleEl.value = '📊 250개 경찰서 엑셀 1초 서식 검증기 (시연)';
  if (descEl) descEl.value = '전국 250개 경찰서 서식 오류를 1초만에 자동 검증하는 파이썬 취합 도구 시연 영상입니다.';
  if (passEl) passEl.value = '1234';

  showToast('🎉 시연 동영상 및 기본 출품 정보가 1초만에 자동 세팅되었습니다!', 'success');
}

function submitStarRating(submissionId, criteria, score) {
  const s = app.submissions.find(item => item.id === submissionId);
  if (!s) return;

  if (!s.ratings) s.ratings = [];
  s.ratings.push({ criteria, score, date: new Date().toISOString() });
  app.saveSubmissions();

  showToast(`⭐ 시연 영상 평가 (${criteria}: ${score}점)를 반영했습니다!`, 'success');
}

/* CROSS-DEVICE DATA SYNC LOGIC (핸드폰 ↔ PC) */
function exportSubmissionsJSONText() {
  const jsonStr = JSON.stringify(app.submissions);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jsonStr).then(() => {
      showToast('📋 동기화 텍스트가 복사되었습니다! PC 동기화 팝업에 붙여넣으세요.', 'success');
    }).catch(() => {
      promptCopyFallback(jsonStr);
    });
  } else {
    promptCopyFallback(jsonStr);
  }
}

function promptCopyFallback(str) {
  prompt('아래 동기화 텍스트를 전체 복사(Ctrl+C / 꾹 누르기)하여 PC 팝업에 붙여넣으세요:', str);
}

function downloadSubmissionsJSONFile() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(app.submissions, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `vibecoding_submissions_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('💾 제출작 JSON 동기화 파일이 다운로드되었습니다.', 'success');
}

function importSubmissionsJSONText() {
  const input = document.getElementById('syncImportInput')?.value.trim();
  if (!input) {
    showToast('동기화할 텍스트 데이터를 입력해주세요.', 'info');
    return;
  }

  try {
    const imported = JSON.parse(input);
    if (!Array.isArray(imported)) {
      showToast('⚠️ 올바른 제출작 데이터 형식이 아닙니다.', 'info');
      return;
    }

    mergeSubmissionsData(imported);
    closeModal('syncDataModal');
    document.getElementById('syncImportInput').value = '';
    showToast('🚀 핸드폰 제출작이 PC 갤러리로 성공적으로 동기화되었습니다!', 'success');
  } catch (e) {
    showToast('⚠️ JSON 데이터 파싱 실패. 올바른 텍스트를 입력해주세요.', 'info');
  }
}

function handleSubmissionsJSONFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        mergeSubmissionsData(imported);
        closeModal('syncDataModal');
        showToast('📂 JSON 파일 제출작 데이터가 동기화되었습니다!', 'success');
      }
    } catch (err) {
      showToast('⚠️ 올바른 JSON 파일이 아닙니다.', 'info');
    }
  };
  reader.readAsText(file);
}

function mergeSubmissionsData(newItems) {
  if (!Array.isArray(newItems)) return;

  const validRemoteItems = newItems.filter(item => item && item.id && !app.deletedIds.has(item.id));

  const mergedMap = new Map();

  // 1. Primary: Remote items from central DB
  validRemoteItems.forEach(item => {
    if (item && item.id && !app.deletedIds.has(item.id)) {
      mergedMap.set(item.id, item);
    }
  });

  // 2. Secondary: Local items stored in localStorage
  const localStoredRaw = localStorage.getItem('vibecoding_contest_submissions');
  let localStoredList = [];
  try {
    localStoredList = localStoredRaw ? JSON.parse(localStoredRaw) : [];
  } catch (e) {}

  localStoredList.forEach(item => {
    if (item && item.id && !app.deletedIds.has(item.id)) {
      if (!mergedMap.has(item.id)) {
        mergedMap.set(item.id, item);
      }
    }
  });

  // If central DB is empty [] and local storage is empty [], set submissions to []
  if (validRemoteItems.length === 0 && localStoredList.length === 0) {
    mergedMap.clear();
  }

  app.submissions = Array.from(mergedMap.values()).sort((a, b) => {
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  app.saveSubmissions();
  renderContestGallery();
  renderHomeStats();
  renderHomeTopEntries();
  if (app.isAdmin) renderAdminDashboard();
}

// Real-time tab sync listener
window.addEventListener('storage', (e) => {
  if (e.key === 'vibecoding_contest_submissions') {
    try {
      const updated = JSON.parse(e.newValue || '[]');
      app.submissions = Array.isArray(updated) ? updated : [];
      renderContestGallery();
      renderHomeStats();
    } catch (err) {}
  }
});

/* SUPABASE CENTRAL DATABASE LOGIC */
let lastFocusSyncTime = 0;

// Auto Re-fetch on Tab Visibility, Online, & Focus Events (No Polling)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && window.isBackendConfigured()) {
    loadCentralSubmissions();
  }
});

window.addEventListener('online', () => {
  if (window.isBackendConfigured()) {
    showToast('🌐 네트워크 연결 복구됨: 중앙 DB 동기화를 수행합니다.', 'info');
    loadCentralSubmissions();
  }
});

window.addEventListener('focus', () => {
  const now = Date.now();
  if (now - lastFocusSyncTime > 3000 && window.isBackendConfigured()) {
    lastFocusSyncTime = now;
    loadCentralSubmissions();
  }
});

async function loadCentralSubmissions() {
  if (!window.isBackendConfigured()) {
    const badge = document.getElementById('realtimeSyncBadge');
    if (badge) {
      badge.textContent = '⚠️ 중앙 DB 미설정 (config.js 환경설정 필요)';
      badge.style.background = 'rgba(239, 68, 68, 0.15)';
      badge.style.color = '#dc2626';
    }
    return;
  }

  try {
    const items = await window.SubmissionsService.fetchSubmissions();
    if (Array.isArray(items)) {
      app.submissions = items;
      app.saveSubmissions();
      renderContestGallery();
      renderHomeStats();
      renderHomeTopEntries();
    }
  } catch (e) {
    console.error('Load Central Submissions Error:', e);
  }

  window.SubmissionsService.subscribeToRealtimeSubmissions(
    (newSub) => {
      const idx = app.submissions.findIndex(s => s.id === newSub.id);
      if (idx === -1) {
        app.submissions.unshift(newSub);
      } else {
        app.submissions[idx] = newSub;
      }
      app.saveSubmissions();
      renderContestGallery();
      renderHomeStats();
      renderHomeTopEntries();
    },
    (updatedSub) => {
      const idx = app.submissions.findIndex(s => s.id === updatedSub.id);
      if (idx !== -1) {
        app.submissions[idx] = updatedSub;
      } else {
        app.submissions.unshift(updatedSub);
      }
      app.saveSubmissions();
      renderContestGallery();
      renderHomeStats();
      renderHomeTopEntries();
    },
    (deletedId) => {
      app.submissions = app.submissions.filter(s => s.id !== deletedId);
      app.saveSubmissions();
      renderContestGallery();
      renderHomeStats();
      renderHomeTopEntries();
    }
  );
}

async function forceRefreshCentralSync() {
  if (!window.isBackendConfigured()) {
    showToast('⚠️ 중앙 저장소가 설정되지 않았습니다. config.js를 확인해주세요.', 'warning');
    return;
  }

  showToast('🔄 Supabase 중앙 DB와 실시간 재동기화를 진행 중입니다...', 'info');
  try {
    const items = await window.SubmissionsService.fetchSubmissions();
    if (Array.isArray(items)) {
      app.submissions = items;
      app.saveSubmissions();
      renderContestGallery();
      renderHomeStats();
      renderHomeTopEntries();
      showToast(`✅ 동기화 완료! 총 ${items.length}개 출품작이 반영되었습니다. (시각: ${new Date().toLocaleTimeString()})`, 'success');
    }
  } catch (e) {
    showToast('❌ 동기화 실패: ' + e.message, 'error');
  }
}

function handleImagePresetChange(val) {
  const customInput = document.getElementById('subCustomImageUrl');
  const uploadWrapper = document.getElementById('imageUploadWrapper');
  if (customInput) {
    customInput.style.display = val === 'custom' ? 'block' : 'none';
  }
  if (uploadWrapper) {
    uploadWrapper.style.display = val === 'upload' ? 'block' : 'none';
  }
}

function promptPasscodeVerification(submissionId, actionType) {
  // Close any open modals to prevent overlay collision
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.classList.remove('active');
    m.setAttribute('aria-hidden', 'true');
  });

  const s = app.submissions.find(item => item.id === submissionId);
  if (!s) return;

  if (app.isAdmin) {
    if (actionType === 'edit') {
      openEditSubmissionModal(submissionId);
    } else if (actionType === 'cancel') {
      handleCancelSubmission(submissionId);
    }
    return;
  }

  document.getElementById('verifySubId').value = submissionId;
  document.getElementById('verifyActionType').value = actionType;
  document.getElementById('verifyPassInput').value = '';

  setTimeout(() => {
    openModal('verifyPasscodeModal');
    setTimeout(() => {
      document.getElementById('verifyPassInput')?.focus();
    }, 100);
  }, 50);
}

let verifyPasscodeCache = '';

function handleVerifyPasscodeSubmit(event) {
  if (event) {
    if (typeof event.preventDefault === 'function') event.preventDefault();
  }

  const id = document.getElementById('verifySubId').value;
  const actionType = document.getElementById('verifyActionType').value;
  const passInput = document.getElementById('verifyPassInput').value.trim();

  if (!passInput) {
    showToast('⚠️ 본인 확인 비밀번호를 입력해주세요.', 'warning');
    return false;
  }

  verifyPasscodeCache = passInput;
  closeModal('verifyPasscodeModal');

  if (actionType === 'edit') {
    openEditSubmissionModal(id);
  } else if (actionType === 'cancel') {
    handleCancelSubmission(id, passInput);
  }

  return false;
}

async function handleSubmissionSubmit(event) {
  if (event) {
    if (typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
  }

  if (!window.isBackendConfigured()) {
    showToast('⚠️ 중앙 저장소가 설정되지 않아 등록할 수 없습니다. config.js 설정을 확인해주세요.', 'warning');
    return false;
  }

  const submitBtn = document.querySelector('#submissionForm button[type="submit"]');
  const origBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  try {
    const nameInput = document.getElementById('subName');
    const deptInput = document.getElementById('subDept');
    const titleInput = document.getElementById('subTitle');
    const descInput = document.getElementById('subDesc');
    const passInput = document.getElementById('subPasscode');

    const name = nameInput ? nameInput.value.trim() : '';
    const dept = deptInput ? deptInput.value.trim() : '';
    const title = titleInput ? titleInput.value.trim() : '';
    const desc = descInput ? descInput.value.trim() : '';
    const passcode = passInput ? passInput.value.trim() : '';

    if (!name || !dept || !title || !desc || !passcode) {
      showToast('⚠️ 필수 입력 항목과 비밀번호를 모두 입력해주세요.', 'warning');
      return false;
    }

    if (passcode.length < 4) {
      showToast('⚠️ 본인 확인 비밀번호는 최소 4자리 이상이어야 합니다.', 'warning');
      if (passInput) passInput.focus();
      return false;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ 중앙 DB 서버 등록 중...';
    }

    const url = document.getElementById('subUrl')?.value.trim() || '';
    const inputVideoUrl = document.getElementById('subVideoUrl')?.value.trim();

    const preset = document.getElementById('subImagePreset')?.value || 'slides_media/slide_22.jpg';
    const customImg = document.getElementById('subCustomImageUrl')?.value.trim();
    let image_url = preset;
    if (preset === 'custom') {
      image_url = customImg || 'slides_media/slide_22.jpg';
    }

    const videoFileInput = document.getElementById('subVideoFile');
    const imageFileInput = document.getElementById('subImageFile');

    const videoFile = uploadedVideoFile || videoFileInput?.files?.[0] || null;
    const imageFile = (preset === 'upload') ? (uploadedImageFile || imageFileInput?.files?.[0] || null) : null;

    const formData = {
      name,
      dept,
      title,
      desc,
      url,
      passcode,
      image_url,
      video_url: inputVideoUrl || (uploadedVideoFile ? null : uploadedVideoUrl) || null,
      imageFile,
      videoFile
    };

    const newSub = await window.SubmissionsService.createSubmission(formData);

    uploadedVideoFile = null;
    uploadedImageFile = null;
    uploadedVideoUrl = null;
    uploadedImageDataUrl = null;

    app.submissions.unshift(newSub);
    app.saveSubmissions();

    const form = document.getElementById('submissionForm');
    if (form) form.reset();
    closeModal('submissionModal');

    showToast(`🟢 '${title}' 작품이 중앙 DB에 성공적으로 저장되었습니다! 다른 기기에서도 확인하실 수 있습니다.`, 'success');
    switchNavTab('contest');
    switchContestSubTab('gallery');
    renderHomeStats();
    renderHomeTopEntries();
    renderContestGallery();

  } catch (err) {
    console.error('Submission error:', err);
    showToast('❌ 작품 등록 실패: ' + (err.message || '서버 저장 중 오류가 발생했습니다.'), 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnHTML;
    }
  }

  return false;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.zIndex = '999999';
    modal.style.transform = 'none';
    modal.setAttribute('aria-hidden', 'false');

    const card = modal.querySelector('.modal-card');
    if (card) {
      card.style.transform = 'none';
      card.style.transition = 'none';
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.transform = 'none';
    modal.setAttribute('aria-hidden', 'true');

    const card = modal.querySelector('.modal-card');
    if (card) {
      card.style.transform = 'none';
      card.style.transition = 'none';
    }
  }
}

// Global modal backdrop & ESC key listeners for instant closing
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    e.target.style.display = 'none';
    e.target.style.visibility = 'hidden';
    e.target.style.opacity = '0';
    e.target.setAttribute('aria-hidden', 'true');
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
      modal.setAttribute('aria-hidden', 'true');
    });
  }
});

function openUnifiedSubmissionForm() {
  switchNavTab('contest');
  switchContestSubTab('submit');
  const formCard = document.querySelector('#subtabSubmit .form-container-card');
  if (formCard) {
    formCard.scrollIntoView({ behavior: 'smooth' });
  }
}

// Aliases for legacy callers
function openDirectSubmissionModal() { openUnifiedSubmissionForm(); }
function openSimpleSubmissionModal() { openUnifiedSubmissionForm(); }

function getPlayableVideoUrl(s) {
  if (!s) return '';
  
  if (s.videoData && typeof s.videoData === 'string' && s.videoData.startsWith('data:video/')) {
    return s.videoData;
  }

  if (s.videoUrl && typeof s.videoUrl === 'string' && s.videoUrl.trim().length > 0) {
    const trimmed = s.videoUrl.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('blob:') || trimmed.startsWith('data:') || trimmed.startsWith('data/') || trimmed.endsWith('.mp4') || trimmed.endsWith('.webm') || trimmed.endsWith('.mov')) {
      return trimmed;
    }
  }

  return '';
}

function openSubmissionDetailModal(submissionId) {
  const s = app.submissions.find(item => item.id === submissionId);
  if (!s) return;

  const modalTitle = document.getElementById('modalSubTitle');
  if (modalTitle) modalTitle.textContent = s.title;

  const modalBody = document.getElementById('modalSubBody');
  if (modalBody) {
    const isVoted = app.userVotes.has(s.id);
    const videoSrc = getPlayableVideoUrl(s);

    modalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        
        <!-- Video Player if Video Uploaded -->
        ${(s.videoData || s.videoUrl) ? `
          <div style="background:#0f172a; padding:16px; border-radius:var(--radius-md); border:1px solid #1e293b;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
              <span style="font-size:0.9rem; font-weight:800; color:#38bdf8;">📱 🎬 핸드폰 촬영 시연 영상 플레이어</span>
              <div style="display:flex; gap:6px;">
                <a href="${videoSrc}" download="demo_video.mp4" target="_blank" class="btn btn-primary btn-sm" style="font-size:0.75rem; padding:4px 10px;">
                  📥 영상 다운로드 / 외부 보기
                </a>
              </div>
            </div>
            <video controls playsinline preload="metadata" src="${videoSrc}" style="width:100%; max-height:360px; border-radius:8px; background:#000; outline:none;">
              <source src="${videoSrc}" type="video/mp4">
              <source src="data/sample_demo.mp4" type="video/mp4">
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4">
              이 브라우저는 동영상 재생을 지원하지 않습니다. 위 [다운로드] 버튼을 이용해주세요.
            </video>
          </div>
        ` : `
          <img src="${s.image}" style="width:100%; max-height:360px; object-fit:cover; border-radius:var(--radius-md);" alt="${s.title}">
        `}
        
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span style="font-size:0.9rem; font-weight:700; color:var(--primary-600);">👤 ${s.name} (${s.dept})</span>
          <span style="font-size:0.85rem; color:var(--text-muted);">📅 제출일: ${s.date}</span>
        </div>

        <div style="background:var(--bg-main); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <h4 style="font-size:1rem; font-weight:700; margin-bottom:8px;">💡 작품 설명 & 기획 의도</h4>
          <p style="font-size:0.9rem; color:var(--text-main); line-height:1.6; white-space:pre-wrap;">${s.desc}</p>
        </div>

        ${s.url && s.url !== '#' ? `
          <div style="display:flex; align-items:center; justify-content:space-between; background:var(--primary-50); padding:12px 16px; border-radius:var(--radius-md); border:1px solid var(--primary-100);">
            <span style="font-size:0.85rem; font-weight:700; color:var(--primary-800);">🔗 시연 결과물 링크:</span>
            <a href="${s.url}" target="_blank" class="btn btn-primary btn-sm">외부 링크 열기 🚀</a>
          </div>
        ` : ''}

        <!-- Actions Bar (Voting & Protected Edit/Cancel) -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; flex-wrap:wrap; gap:12px;">
          <span style="font-size:1.2rem; font-weight:800; color:var(--primary-600);">❤️ 총 ${s.votes} 표 득표</span>
          
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn btn-outline" style="font-size:0.85rem;" onclick="promptPasscodeVerification('${s.id}', 'edit');" title="비밀번호 인증 후 수정">
              🔒 ✏️ 작품 수정
            </button>
            <button class="btn btn-outline" style="font-size:0.85rem; color:#ef4444;" onclick="closeModal('submissionDetailModal'); promptPasscodeVerification('${s.id}', 'cancel');" title="비밀번호 인증 후 삭제">
              🔒 🗑️ 제출 취소
            </button>
            <button class="vote-heart-btn ${isVoted ? 'voted' : ''}" onclick="handleVote('${s.id}'); openSubmissionDetailModal('${s.id}');">
              ${isVoted ? '✔ 투표 취소' : '❤️ 이 작품에 투표하기'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  openModal('submissionDetailModal');
}

/* Edit Submission Modal Handlers */
function openEditSubmissionModal(submissionId) {
  const s = app.submissions.find(item => item.id === submissionId);
  if (!s) return;

  document.getElementById('editSubId').value = s.id;
  document.getElementById('editName').value = s.name;
  document.getElementById('editDept').value = s.dept;
  document.getElementById('editTitle').value = s.title;
  document.getElementById('editDesc').value = s.desc;
  document.getElementById('editUrl').value = s.url !== '#' ? s.url : '';

  const presetSelect = document.getElementById('editImagePreset');
  const customInput = document.getElementById('editCustomImageUrl');

  if (['slides_media/slide_22.jpg', 'slides_media/slide_37.jpg', 'slides_media/slide_9.jpg'].includes(s.image)) {
    presetSelect.value = s.image;
    customInput.style.display = 'none';
  } else {
    presetSelect.value = 'custom';
    customInput.style.display = 'block';
    customInput.value = s.image;
  }

  openModal('editSubmissionModal');
}

function handleEditImagePresetChange(val) {
  const customInput = document.getElementById('editCustomImageUrl');
  if (customInput) {
    customInput.style.display = val === 'custom' ? 'block' : 'none';
  }
}

async function handleEditSubmissionSubmit(event) {
  if (event) {
    if (typeof event.preventDefault === 'function') event.preventDefault();
  }

  if (!window.isBackendConfigured()) {
    showToast('⚠️ 중앙 저장소가 설정되지 않아 수정할 수 없습니다.', 'warning');
    return false;
  }

  const id = document.getElementById('editSubId').value;
  const s = app.submissions.find(item => item.id === id);
  if (!s) return false;

  const passcode = verifyPasscodeCache;
  if (!passcode) {
    showToast('⚠️ 본인 확인 비밀번호가 필요합니다.', 'warning');
    return false;
  }

  const submitBtn = document.querySelector('#editSubmissionForm button[type="submit"]');
  const origBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ 수정사항 저장 중...';
  }

  try {
    const name = document.getElementById('editName').value.trim();
    const dept = document.getElementById('editDept').value.trim();
    const title = document.getElementById('editTitle').value.trim();
    const desc = document.getElementById('editDesc').value.trim();
    const url = document.getElementById('editUrl').value.trim();

    const preset = document.getElementById('editImagePreset').value;
    const customImg = document.getElementById('editCustomImageUrl').value.trim();
    let image_url = preset;
    if (preset === 'custom') {
      image_url = customImg || s.image || 'slides_media/slide_22.jpg';
    }

    const formData = {
      name,
      dept,
      title,
      desc,
      url,
      image_url
    };

    const updatedSub = await window.SubmissionsService.updateSubmission(id, passcode, formData);

    const idx = app.submissions.findIndex(item => item.id === id);
    if (idx !== -1) {
      app.submissions[idx] = updatedSub;
    }
    app.saveSubmissions();

    verifyPasscodeCache = '';
    closeModal('editSubmissionModal');
    closeModal('verifyPasscodeModal');

    showToast('✅ 작품 수정사항이 성공적으로 저장되었습니다!', 'success');

    renderContestGallery();
    renderHomeStats();
    renderHomeTopEntries();
    if (app.isAdmin) renderAdminDashboard();
  } catch (err) {
    console.error('Edit Submission Error:', err);
    showToast('❌ 수정 실패: ' + (err.message || '비밀번호가 일치하지 않습니다.'), 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;
    }
  }

  return false;
}

async function handleCancelSubmission(submissionId, passcodeOverride = null) {
  const passcode = passcodeOverride || verifyPasscodeCache;
  if (!passcode) {
    showToast('⚠️ 본인 확인 비밀번호를 입력해주세요.', 'warning');
    return false;
  }

  if (!window.isBackendConfigured()) {
    showToast('⚠️ 중앙 저장소가 설정되지 않아 취소할 수 없습니다.', 'warning');
    return false;
  }

  const s = app.submissions.find(item => item.id === submissionId);
  const title = s ? s.title : '';

  if (!confirm(`'${title || '작품'}' 출품을 정말로 취소/삭제하시겠습니까?`)) {
    return false;
  }

  try {
    await window.SubmissionsService.deleteSubmission(submissionId, passcode);

    app.submissions = app.submissions.filter(item => item.id !== submissionId);
    app.saveSubmissions();

    verifyPasscodeCache = '';
    closeModal('submissionDetailModal');
    closeModal('verifyPasscodeModal');

    showToast(`🗑️ '${title || '작품'}' 출품이 성공적으로 취소(삭제)되었습니다.`, 'success');

    renderContestGallery();
    renderHomeStats();
    renderHomeTopEntries();
    if (app.isAdmin) renderAdminDashboard();
  } catch (err) {
    console.error('Cancel Submission Error:', err);
    showToast('❌ 삭제 실패: ' + (err.message || '비밀번호가 일치하지 않습니다.'), 'error');
  }
}

/* ==========================================
   ADMIN CENTER & CSV DATA EXPORT LOGIC
   ========================================== */

async function verifyAdminAuth() {
  const emailInput = document.getElementById('adminEmailInput');
  const passInput = document.getElementById('adminPassInput');
  const email = emailInput ? emailInput.value.trim() : '';
  const pass = passInput ? passInput.value : '';

  if (!window.isBackendConfigured()) {
    showToast('⚠️ Supabase 중앙 DB가 설정되지 않았습니다. config.js를 확인하세요.', 'warning');
    return;
  }

  const client = window.getSupabaseClient();
  if (!client) {
    showToast('⚠️ Supabase 클라이언트를 불러올 수 없습니다.', 'error');
    return;
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: pass
    });

    if (error) {
      throw error;
    }

    const { data: isAdmin, error: adminErr } = await client.rpc('is_admin');
    if (adminErr || !isAdmin) {
      await client.auth.signOut();
      showToast('⚠️ 관리자 권한이 승인되지 않은 계정입니다.', 'warning');
      return;
    }

    app.isAdmin = true;
    showToast('🔑 Supabase 관리자 인증 성공!', 'success');
    document.getElementById('adminAuthBox').style.display = 'none';
    document.getElementById('adminDashboardBox').style.display = 'block';
    renderAdminDashboard();
  } catch (err) {
    console.error('Admin auth error:', err);
    showToast('❌ 로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
  }
}

async function logoutAdminAuth() {
  app.isAdmin = false;
  const client = window.getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {}
  }
  document.getElementById('adminAuthBox').style.display = 'block';
  document.getElementById('adminDashboardBox').style.display = 'none';
  showToast('관리자 로그아웃 되었습니다.', 'info');
}

function renderAdminDashboard() {
  const subs = app.submissions;
  const totalVotes = subs.reduce((sum, s) => sum + s.votes, 0);

  const elTotal = document.getElementById('adminTotalSubs');
  if (elTotal) elTotal.textContent = subs.length;

  const elVotes = document.getElementById('adminTotalVotes');
  if (elVotes) elVotes.textContent = totalVotes;

  const topSub = [...subs].sort((a, b) => b.votes - a.votes)[0];
  const elTop = document.getElementById('adminTopRank');
  if (elTop) {
    elTop.textContent = topSub ? `${topSub.title} (${topSub.votes}표)` : '-';
  }

  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  let html = '';
  subs.forEach((s) => {
    html += `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td><img src="${s.image}" style="width:48px; height:36px; object-fit:cover; border-radius:4px;" alt="thumb"></td>
        <td>${s.name}</td>
        <td>${s.dept}</td>
        <td><strong>${s.title}</strong></td>
        <td><span style="font-weight:800; color:var(--primary-600);">${s.votes} 표</span></td>
        <td>${s.date}</td>
        <td>
          <span class="${s.status === 'hidden' ? 'badge-status-hidden' : 'badge-status-visible'}">
            ${s.status === 'hidden' ? '🙈 숨김' : '👁️ 공개'}
          </span>
        </td>
        <td>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.75rem;" onclick="toggleSubmissionStatus('${s.id}')">
            ${s.status === 'hidden' ? '복구' : '숨김'}
          </button>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.75rem; color:#ef4444;" onclick="deleteSubmission('${s.id}')">
            삭제
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function toggleSubmissionStatus(id) {
  const sub = app.submissions.find(s => s.id === id);
  if (sub) {
    sub.status = sub.status === 'hidden' ? 'visible' : 'hidden';
    app.saveSubmissions();
    renderAdminDashboard();
    renderHomeStats();
    renderHomeTopEntries();
    showToast('상태가 변경되었습니다.', 'info');
  }
}

function deleteSubmission(id) {
  if (confirm('정말로 이 제출작을 삭제하시겠습니까?')) {
    app.submissions = app.submissions.filter(s => s.id !== id);
    app.saveSubmissions();
    renderAdminDashboard();
    renderHomeStats();
    renderHomeTopEntries();
    showToast('제출작이 삭제되었습니다.', 'info');
  }
}

function exportContestDataCSV() {
  const subs = app.submissions;
  if (!subs || subs.length === 0) {
    showToast('내보낼 데이터가 없습니다.', 'info');
    return;
  }

  // UTF-8 BOM Header for Excel Compatibility
  let csvContent = '\uFEFF';
  csvContent += '제출ID,제출자,소속,작품명,기획의도 및 주요기능,결과물URL,득표수,제출일자,상태\n';

  subs.forEach(s => {
    const cleanDesc = `"${s.desc.replace(/"/g, '""')}"`;
    const cleanTitle = `"${s.title.replace(/"/g, '""')}"`;
    csvContent += `${s.id},${s.name},${s.dept},${cleanTitle},${cleanDesc},${s.url},${s.votes},${s.date},${s.status}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `vibecoding_contest_results_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('📥 엑셀/CSV 데이터 다운로드가 완료되었습니다!', 'success');
}

/* ==========================================
   ZEN SLIDE FOCUS MODE CORE LOGIC (focus.html)
   ========================================== */

let isLaserActive = false;
let isAutoplayActive = false;
let autoplayTimer = null;
let hudHideTimer = null;
let isZoomed = false;

function initZenFocusMode() {
  const zenStage = document.getElementById('zenStage');
  if (!zenStage) return;

  // Check URL query parameter for starting slide index
  const params = new URLSearchParams(window.location.search);
  const paramSlide = params.get('slide');
  if (paramSlide !== null && !isNaN(paramSlide)) {
    const idx = parseInt(paramSlide, 10);
    if (idx >= 0 && idx < app.slides.length) {
      app.currentSlideIndex = idx;
    }
  }

  // Populate Select Dropdown
  const select = document.getElementById('zenSlideSelect');
  if (select) {
    let optionsHtml = '';
    app.slides.forEach((s, idx) => {
      optionsHtml += `<option value="${idx}">슬라이드 ${s.num}장 (${s.part.split('.')[0]})</option>`;
    });
    select.innerHTML = optionsHtml;
  }

  // Render Thumbnail Grid in Bottom Drawer
  renderZenThumbGrid();

  // Initial Slide Render
  renderZenSlide();

  // Setup HUD Auto-Hide Listener
  setupHudAutoHide();

  // Setup Laser Pointer Movement Listener
  setupLaserPointerMovement();

  // Setup Zen Specific Keyboard Listener
  setupZenKeyboardNav();
}

function renderZenSlide() {
  const slide = app.slides[app.currentSlideIndex];
  if (!slide) return;

  app.markSlideViewed(slide.num);

  const img = document.getElementById('zenSlideImg');
  if (img) {
    img.src = `${slide.image}?v=8`;
    img.alt = `PDF Slide ${slide.num}`;
    if (isZoomed) {
      isZoomed = false;
      img.classList.remove('zoomed');
    }
  }

  const counter = document.getElementById('zenSlideCounter');
  if (counter) counter.textContent = `SLIDE ${slide.num} / ${app.slides.length}`;

  const partTag = document.getElementById('zenPartTag');
  if (partTag) partTag.textContent = slide.part.split('.')[0] || 'PART';

  const select = document.getElementById('zenSlideSelect');
  if (select) select.value = app.currentSlideIndex;

  const percent = Math.round((slide.num / app.slides.length) * 100);
  const progressBar = document.getElementById('zenProgressBar');
  if (progressBar) progressBar.style.width = `${percent}%`;

  const progressText = document.getElementById('zenProgressText');
  if (progressText) progressText.textContent = `${percent}%`;

  // Update Thumbnail Drawer Active Card
  const thumbCards = document.querySelectorAll('.zen-thumb-card');
  thumbCards.forEach((card, idx) => {
    if (idx === app.currentSlideIndex) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      card.classList.remove('active');
    }
  });
}

function renderZenThumbGrid() {
  const grid = document.getElementById('zenThumbGrid');
  if (!grid) return;

  let html = '';
  app.slides.forEach((s, idx) => {
    html += `
      <div class="zen-thumb-card ${idx === app.currentSlideIndex ? 'active' : ''}" onclick="jumpToSlide(${idx})">
        <img src="${s.image}?v=7" class="zen-thumb-img" alt="Slide ${s.num}">
        <div class="zen-thumb-num">슬라이드 ${s.num}장</div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

function setupHudAutoHide() {
  const hud = document.getElementById('zenHeaderHud');
  const hint = document.getElementById('zenIdleHint');
  if (!hud) return;

  const resetTimer = () => {
    hud.classList.add('visible');
    if (hint) hint.classList.remove('hidden');

    clearTimeout(hudHideTimer);
    hudHideTimer = setTimeout(() => {
      const drawer = document.getElementById('zenThumbDrawer');
      const modal = document.querySelector('.modal-overlay.active');
      if (!drawer?.classList.contains('active') && !modal) {
        hud.classList.remove('visible');
        if (hint) hint.classList.add('hidden');
      }
    }, 2500);
  };

  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('touchstart', resetTimer);
  window.addEventListener('click', resetTimer);
  resetTimer();
}

function setupLaserPointerMovement() {
  const laser = document.getElementById('virtualLaserPointer');
  if (!laser) return;

  window.addEventListener('mousemove', (e) => {
    if (isLaserActive) {
      laser.style.left = `${e.clientX}px`;
      laser.style.top = `${e.clientY}px`;
    }
  });
}

function toggleLaserPointer() {
  isLaserActive = !isLaserActive;
  const laser = document.getElementById('virtualLaserPointer');
  const btn = document.getElementById('zenLaserBtn');

  if (isLaserActive) {
    laser?.classList.add('active');
    btn?.classList.add('active');
    showToast('🔴 가상 레이저 포인터가 활성화되었습니다. (단축키 L로 끄기)', 'info');
  } else {
    laser?.classList.remove('active');
    btn?.classList.remove('active');
    showToast('레이저 포인터가 비활성화되었습니다.', 'info');
  }
}

function toggleAutoplay() {
  isAutoplayActive = !isAutoplayActive;
  const btn = document.getElementById('zenAutoplayBtn');
  const icon = document.getElementById('zenAutoplayIcon');
  const label = document.getElementById('zenAutoplayLabel');

  if (isAutoplayActive) {
    btn?.classList.add('active');
    if (icon) icon.textContent = '⏸️';
    if (label) label.textContent = '일시정지';
    showToast('▶ 3초 간격 슬라이드 자동 재생 시작 (단축키 A로 정지)', 'success');
    
    autoplayTimer = setInterval(() => {
      changeSlide(1);
    }, 3000);
  } else {
    btn?.classList.remove('active');
    if (icon) icon.textContent = '▶';
    if (label) label.textContent = '자동재생';
    showToast('자동 재생이 정지되었습니다.', 'info');
    clearInterval(autoplayTimer);
  }
}

function toggleThumbDrawer() {
  const drawer = document.getElementById('zenThumbDrawer');
  const btn = document.getElementById('zenThumbBtn');
  if (!drawer) return;

  const isActive = drawer.classList.toggle('active');
  btn?.classList.toggle('active', isActive);

  if (isActive) {
    const activeCard = drawer.querySelector('.zen-thumb-card.active');
    activeCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function toggleFullscreen() {
  const icon = document.getElementById('zenFullscreenIcon');
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      if (icon) icon.textContent = '❐';
      showToast('전체화면 모드로 전환되었습니다 (Esc로 종료)', 'info');
    }).catch(err => {
      console.warn(err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        if (icon) icon.textContent = '⛶';
      });
    }
  }
}

function handleStageClick(e) {
  if (e.target.closest('.zen-nav-arrow')) return;

  if (e.target.id === 'zenSlideImg') {
    isZoomed = !isZoomed;
    e.target.classList.toggle('zoomed', isZoomed);
    return;
  }

  changeSlide(1);
}

function changeSlide(direction) {
  app.currentSlideIndex = (app.currentSlideIndex + direction + app.slides.length) % app.slides.length;
  if (document.getElementById('zenStage')) {
    renderZenSlide();
  }
}

function jumpToSlide(index) {
  if (index >= 0 && index < app.slides.length) {
    app.currentSlideIndex = index;
    if (document.getElementById('zenStage')) {
      renderZenSlide();
    }
  }
}

function setupZenKeyboardNav() {
  window.addEventListener('keydown', (e) => {
    if (!document.getElementById('zenStage')) return;

    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key.toLowerCase();

    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      changeSlide(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      changeSlide(-1);
    } else if (key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    } else if (key === 'a') {
      e.preventDefault();
      toggleAutoplay();
    } else if (key === 'l') {
      e.preventDefault();
      toggleLaserPointer();
    } else if (key === 't') {
      e.preventDefault();
      toggleThumbDrawer();
    } else if (e.key === 'Home') {
      e.preventDefault();
      jumpToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      jumpToSlide(app.slides.length - 1);
    } else if (key === '?' || key === 'k') {
      e.preventDefault();
      const helpModal = document.getElementById('helpModal');
      if (helpModal?.classList.contains('active')) {
        closeModal('helpModal');
      } else {
        openModal('helpModal');
      }
    } else if (e.key === 'Escape') {
      const helpModal = document.getElementById('helpModal');
      const drawer = document.getElementById('zenThumbDrawer');

      if (helpModal?.classList.contains('active')) {
        closeModal('helpModal');
      } else if (drawer?.classList.contains('active')) {
        toggleThumbDrawer();
      } else {
        window.location.href = 'index.html';
      }
    }
  });
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
}

// Explicitly expose global action functions to window for 100% inline onclick compatibility
window.openModal = openModal;
window.closeModal = closeModal;
window.openUnifiedSubmissionForm = openUnifiedSubmissionForm;
window.openDirectSubmissionModal = openUnifiedSubmissionForm;
window.openSimpleSubmissionModal = openUnifiedSubmissionForm;
window.handleSubmissionSubmit = handleSubmissionSubmit;
window.loadSampleDemoVideoIntoForm = loadSampleDemoVideoIntoForm;
window.handleVideoFileSelect = handleVideoFileSelect;
window.handleImageFileSelect = handleImageFileSelect;
window.handleImagePresetChange = handleImagePresetChange;
window.forceRefreshCentralSync = forceRefreshCentralSync;
window.openSubmissionDetailModal = openSubmissionDetailModal;
window.switchNavTab = switchNavTab;
window.switchContestSubTab = switchContestSubTab;
window.openVoterLoginModal = openVoterLoginModal;
window.openVoterAdminModal = openVoterAdminModal;
window.handleVoterAdminAuthSubmit = handleVoterAdminAuthSubmit;
window.handleVoterHeaderClick = handleVoterHeaderClick;
window.handleVoterSearchInput = handleVoterSearchInput;
window.handleVoterSelectChange = handleVoterSelectChange;
window.selectVoterFromSearch = selectVoterFromSearch;
window.handleVoterLoginSubmit = handleVoterLoginSubmit;
window.logoutVoter = logoutVoter;
window.handleVoterExcelFileSelect = handleVoterExcelFileSelect;
window.downloadSampleVoterExcel = downloadSampleVoterExcel;
async function clearAllSubmissions() {
  if (!confirm('⚠️ 등록된 모든 작품 출품 내역을 전체 초기화(삭제)하시겠습니까?\n이 작업은 취소할 수 없습니다.')) {
    return;
  }

  if (window.isBackendConfigured()) {
    try {
      for (const sub of app.submissions) {
        try {
          await window.SubmissionsService.adminDeleteSubmission(sub.id);
        } catch (e) {}
      }
      app.submissions = [];
      app.saveSubmissions();
      showToast('🗑️ 중앙 DB의 모든 출품작 내역이 초기화되었습니다.', 'success');
    } catch (err) {
      showToast('❌ 초기화 실패: ' + err.message, 'error');
    }
  } else {
    app.submissions = [];
    app.saveSubmissions();
    showToast('🗑️ 로컬 출품작 목록이 초기화되었습니다.', 'info');
  }

  renderContestGallery();
  renderHomeStats();
  renderHomeTopEntries();
  if (app.isAdmin) renderAdminDashboard();
}

window.clearAllSubmissions = clearAllSubmissions;
window.clearAllVotersList = clearAllVotersList;
window.handleSimpleSubmissionSubmit = handleSimpleSubmissionSubmit;

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

/* ==========================================
   VOTER MANAGEMENT & EXCEL IMPORT LOGIC
   ========================================== */

function fetchVotersFromServer() {
  if (!window.location.protocol.startsWith('http')) return;
  fetch('/api/voters')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        app.voters = data;
        app.saveVoters();
        renderVoterTable();
        populateVoterSelect();
      }
    })
    .catch(err => console.warn('Fetch voters failed:', err));
}

function updateVoterHeaderUI() {
  const btn = document.getElementById('voterHeaderBtn');
  const ticketDisplay = document.getElementById('userTicketDisplay');

  if (app.currentVoter) {
    if (btn) {
      btn.innerHTML = `<span>👤 [${app.currentVoter.dept}] ${app.currentVoter.name} 님 (로그아웃)</span>`;
      btn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    }
    if (ticketDisplay) {
      const voted = app.currentVoter.votedSubmissionId;
      ticketDisplay.innerHTML = voted 
        ? `<span style="color:#34d399; font-weight:800;">✔ 투표 완료됨</span>` 
        : `<span style="color:#34d399; font-weight:800;">🎟️ 투표 가능 (1표 권한)</span>`;
    }
  } else {
    if (btn) {
      btn.innerHTML = `<span>👤 투표자 로그인</span>`;
      btn.style.background = 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)';
    }
    if (ticketDisplay) {
      ticketDisplay.innerHTML = `<span style="color:#fbbf24; font-weight:800;">🔓 로그인 후 투표 가능</span>`;
    }
  }
}

function handleVoterHeaderClick() {
  if (app.currentVoter) {
    if (confirm(`'${app.currentVoter.name} (${app.currentVoter.dept})' 님, 로그아웃 하시겠습니까?`)) {
      logoutVoter();
    }
  } else {
    openVoterLoginModal();
  }
}

function openVoterLoginModal() {
  const searchInput = document.getElementById('voterSearchInput');
  const birthInput = document.getElementById('voterBirthInput');
  const errBox = document.getElementById('voterLoginError');
  const dropdown = document.getElementById('voterSearchResults');

  if (searchInput) searchInput.value = '';
  if (birthInput) birthInput.value = '';
  if (errBox) { errBox.style.display = 'none'; errBox.textContent = ''; }
  if (dropdown) dropdown.style.display = 'none';

  populateVoterSelect();
  openModal('voterLoginModal');
}

function populateVoterSelect() {
  const select = document.getElementById('voterSelect');
  if (!select) return;

  let html = '<option value="">-- 미리 등록된 투표자 선택 --</option>';
  app.voters.forEach(v => {
    html += `<option value="${v.name}">${v.name} (${v.dept})</option>`;
  });
  select.innerHTML = html;
}

function handleVoterSearchInput(query) {
  const dropdown = document.getElementById('voterSearchResults');
  if (!dropdown) return;

  const q = query.trim().toLowerCase();
  if (!q) {
    dropdown.style.display = 'none';
    return;
  }

  const matches = app.voters.filter(v => 
    v.name.toLowerCase().includes(q) || v.dept.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    dropdown.innerHTML = `<div class="voter-search-item" style="color:var(--text-muted);">검색 결과가 없습니다.</div>`;
    dropdown.style.display = 'block';
    return;
  }

  let html = '';
  matches.forEach(v => {
    html += `
      <div class="voter-search-item" onclick="selectVoterFromSearch('${v.name}', '${v.dept}')">
        <strong>${v.name}</strong>
        <span style="font-size:0.75rem; color:var(--text-muted);">${v.dept}</span>
      </div>
    `;
  });
  dropdown.innerHTML = html;
  dropdown.style.display = 'block';
}

function selectVoterFromSearch(name, dept) {
  const input = document.getElementById('voterSearchInput');
  const dropdown = document.getElementById('voterSearchResults');
  if (input) input.value = name;
  if (dropdown) dropdown.style.display = 'none';

  const birthInput = document.getElementById('voterBirthInput');
  if (birthInput) birthInput.focus();
}

function handleVoterSelectChange(selectElem) {
  const selectedName = selectElem.value;
  if (selectedName) {
    selectVoterFromSearch(selectedName, '');
  }
}

function normalizeBirthdate(val) {
  if (!val) return '';
  return String(val).replace(/[^0-9]/g, '');
}

function handleVoterLoginSubmit(event) {
  event.preventDefault();
  const searchName = (document.getElementById('voterSearchInput')?.value || '').trim();
  const rawBirth = (document.getElementById('voterBirthInput')?.value || '').trim();
  const errBox = document.getElementById('voterLoginError');

  if (!searchName || !rawBirth) {
    if (errBox) {
      errBox.textContent = '성명과 비밀번호(생년월일)를 모두 입력해주세요.';
      errBox.style.display = 'block';
    }
    return;
  }

  const normalizedInputBirth = normalizeBirthdate(rawBirth);

  // Search voter
  const matchedVoter = app.voters.find(v => {
    if (v.name.trim() !== searchName) return false;
    const voterBirth = normalizeBirthdate(v.birthdate);
    if (voterBirth === normalizedInputBirth) return true;
    if (voterBirth.length >= 6 && normalizedInputBirth.length >= 6) {
      if (voterBirth.slice(-6) === normalizedInputBirth.slice(-6)) return true;
    }
    return false;
  });

  if (!matchedVoter) {
    if (errBox) {
      errBox.textContent = '❌ 등록된 성명 및 생년월일과 일치하지 않습니다. 엑셀 사전 등록 여부를 확인하세요.';
      errBox.style.display = 'block';
    }
    return;
  }

  // Login success
  app.currentVoter = matchedVoter;
  app.saveCurrentVoter();
  updateVoterHeaderUI();
  closeModal('voterLoginModal');
  showToast(`🎉 ${matchedVoter.name} (${matchedVoter.dept}) 님, 성공적으로 로그인되었습니다!`, 'success');
  renderContestGallery();
}

function logoutVoter() {
  app.currentVoter = null;
  app.saveCurrentVoter();
  updateVoterHeaderUI();
  showToast('로그아웃되었습니다.', 'info');
  renderContestGallery();
}

function openVoterAdminModal() {
  const isLoggedIn = sessionStorage.getItem('vibe_admin_logged_in') === 'true';
  if (!isLoggedIn) {
    const authId = document.getElementById('voterAdminAuthId');
    const authPass = document.getElementById('voterAdminAuthPassword');
    const authErr = document.getElementById('voterAdminAuthError');
    if (authId) authId.value = '';
    if (authPass) authPass.value = '';
    if (authErr) authErr.style.display = 'none';
    openModal('voterAdminAuthModal');
    return;
  }
  renderVoterTable();
  openModal('voterAdminModal');
}

async function handleVoterAdminAuthSubmit(event) {
  if (event && typeof event.preventDefault === 'function') event.preventDefault();

  const idInput = document.getElementById('voterAdminAuthId');
  const passInput = document.getElementById('voterAdminAuthPassword');
  const errBox = document.getElementById('voterAdminAuthError');

  const inputId = idInput ? idInput.value.trim() : '';
  const inputPass = passInput ? passInput.value.trim() : '';

  if (!inputId || !inputPass) {
    if (errBox) {
      errBox.textContent = '⚠️ 아이디와 비밀번호를 모두 입력해주세요.';
      errBox.style.display = 'block';
    }
    return;
  }

  let authenticated = false;
  if (window.isBackendConfigured && window.isBackendConfigured() && window.getSupabaseClient) {
    const client = window.getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: inputId.includes('@') ? inputId : `${inputId}@admin.local`,
          password: inputPass
        });
        if (!error && data?.session) {
          authenticated = true;
        }
      } catch (e) {}
    }
  }

  if (!authenticated) {
    const expectedId = window.BAI_CONFIG?.ADMIN_ID || 'admin';
    const expectedPass = window.BAI_CONFIG?.ADMIN_PASSCODE || 'admin1234';
    if (inputId === expectedId && inputPass === expectedPass) {
      authenticated = true;
    }
  }

  if (authenticated) {
    sessionStorage.setItem('vibe_admin_logged_in', 'true');
    closeModal('voterAdminAuthModal');
    renderVoterTable();
    openModal('voterAdminModal');
    showToast('🔓 관리자 인증 성공! 엑셀 사전 등록 관리 화면으로 이동합니다.', 'success');
  } else {
    if (errBox) {
      errBox.textContent = '⚠️ 아이디 또는 비밀번호가 올바르지 않습니다.';
      errBox.style.display = 'block';
    }
    showToast('❌ 로그인 실패: 아이디/비밀번호를 확인해주세요.', 'danger');
  }
}

function renderVoterTable() {
  const tbody = document.getElementById('voterTableBody');
  const countBadge = document.getElementById('voterCountBadge');
  if (!tbody) return;

  if (countBadge) countBadge.textContent = `${app.voters.length}명`;

  if (app.voters.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">등록된 투표자가 없습니다. 엑셀 파일을 업로드하세요.</td></tr>`;
    return;
  }

  let html = '';
  app.voters.forEach((v, idx) => {
    const isVoted = v.votedSubmissionId != null;
    html += `
      <tr>
        <td style="padding:10px 12px;">${idx + 1}</td>
        <td style="padding:10px 12px; font-weight:700;">${v.name}</td>
        <td style="padding:10px 12px;">${v.dept || '-'}</td>
        <td style="padding:10px 12px; font-family:monospace;">${v.birthdate || '-'}</td>
        <td style="padding:10px 12px;">
          ${isVoted ? '<span style="color:#10b981; font-weight:800;">✔ 투표 완료</span>' : '<span style="color:var(--text-muted);">미투표</span>'}
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function handleVoterExcelFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  if (window.XLSX && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processExcelRows(rows);
      } catch (err) {
        console.error('XLSX parse error:', err);
        showToast('엑셀 파일 파싱 중 오류가 발생했습니다.', 'info');
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    // CSV / Text fallback
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).map(l => l.split(/,|\t/));
      processExcelRows(lines);
    };
    reader.readAsText(file, 'utf-8');
  }

  event.target.value = '';
}

function processExcelRows(rows) {
  if (!rows || rows.length < 2) {
    showToast('⚠️ 엑셀 데이터가 부족합니다. 최소 헤더 1행과 데이터 1행이 필요합니다.', 'info');
    return;
  }

  const headers = rows[0].map(h => String(h || '').trim());
  
  let nameColIdx = headers.findIndex(h => h.includes('성명') || h.includes('이름') || h.toLowerCase().includes('name'));
  let deptColIdx = headers.findIndex(h => h.includes('소속') || h.includes('부서') || h.includes('팀') || h.toLowerCase().includes('dept'));
  let birthColIdx = headers.findIndex(h => h.includes('생년월일') || h.includes('생일') || h.includes('비밀번호') || h.toLowerCase().includes('birth'));

  if (nameColIdx === -1) nameColIdx = 0;
  if (deptColIdx === -1) deptColIdx = 1;
  if (birthColIdx === -1) birthColIdx = 2;

  let addedCount = 0;
  const newVoters = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const name = String(row[nameColIdx] || '').trim();
    const dept = String(row[deptColIdx] || '').trim();
    const birthdate = String(row[birthColIdx] || '').trim();

    if (!name) continue;

    const newVoter = {
      id: 'voter_' + Date.now() + '_' + Math.floor(Math.random()*1000),
      name: name,
      dept: dept || '사내',
      birthdate: birthdate || '19900101',
      votedSubmissionId: null
    };
    newVoters.push(newVoter);
    addedCount++;
  }

  if (newVoters.length > 0) {
    app.voters = newVoters;
    app.saveVoters();
    renderVoterTable();
    populateVoterSelect();
    showToast(`🎉 엑셀에서 ${addedCount}명의 투표자가 성공적으로 등록되었습니다!`, 'success');
  } else {
    showToast('등록할 유효한 투표자 데이터가 없습니다.', 'info');
  }
}

function downloadSampleVoterExcel() {
  const csvContent = "\uFEFF성명,소속,생년월일\n홍길동,디지털혁신팀,19900101\n김경위,사이버범죄수사대,19850515\n이형사,종합조정관실,19921120\n박수사관,생활안전과,19880808";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', '투표자_등록_샘플_서식.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📄 샘플 엑셀 서식이 다운로드되었습니다.', 'success');
}

function clearAllVotersList() {
  if (confirm('등록된 투표자 명단을 전체 초기화하시겠습니까?')) {
    app.voters = [];
    app.currentVoter = null;
    app.saveVoters();
    app.saveCurrentVoter();
    renderVoterTable();
    populateVoterSelect();
    updateVoterHeaderUI();
    showToast('등록된 투표자 명단이 전체 초기화되었습니다.', 'info');
  }
}




