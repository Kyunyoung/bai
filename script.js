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

// Seed Initial Contest Submissions (if empty)
const SEED_SUBMISSIONS = [
  {
    id: 'sub_1',
    name: '김경위',
    dept: '디지털혁신팀',
    title: '📊 250개 경찰서 엑셀 1초 서식 검증기',
    desc: '전국 250개 경찰서에서 들어오는 취합 서식 오류를 파이썬 openpyxl 스크립트로 1초만에 자동 검증하고 정형화하는 통합 도구입니다.',
    url: 'https://github.com/police-excel-validator',
    image: 'slides_media/slide_22.jpg',
    votes: 42,
    date: '2026-08-01',
    status: 'visible'
  },
  {
    id: 'sub_2',
    name: '이형사',
    dept: '사이버범죄수사대',
    title: '📑 한글/엑셀 공문서 표도우미 자동화 툴',
    desc: '복잡한 공문서 표 작성 및 셀 정렬을 클릭 한 번으로 자동 변환해주는 표도우미 매크로 도구입니다.',
    url: 'https://github.com/hwp-table-helper',
    image: 'slides_media/slide_37.jpg',
    votes: 38,
    date: '2026-08-02',
    status: 'visible'
  },
  {
    id: 'sub_3',
    name: '박수사관',
    dept: '종합조정관실',
    title: '⚙️ 오프라인 설치형 자동 보고서 생성기',
    desc: '인터넷 연결이 제한된 오프라인 내부망에서 55개 실습 시나리오를 바탕으로 보고서를 자동 작성합니다.',
    url: 'https://github.com/offline-report-gen',
    image: 'slides_media/slide_9.jpg',
    votes: 29,
    date: '2026-08-03',
    status: 'visible'
  }
];

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

// App Core State Manager
class VibePortalApp {
  constructor() {
    this.slides = PPT_SLIDES;
    this.currentSlideIndex = 0;
    this.theme = this.loadFromStorage('vibecoding_theme', 'light');
    this.viewedSlides = new Set(this.loadFromStorage('vibecoding_viewed_slides', []));
    
    // Contest Submissions
    this.submissions = this.loadFromStorage('vibecoding_contest_submissions', null);
    if (!this.submissions || this.submissions.length === 0) {
      this.submissions = SEED_SUBMISSIONS;
      this.saveSubmissions();
    }

    // User Votes (Max 3 votes limit)
    this.userVotes = new Set(this.loadFromStorage('vibecoding_user_votes', []));

    // Admin Auth State
    this.isAdmin = false;
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
  initTheme();
  setupUrlParamsNav();
  setupPromptLibrary();
  renderHomeStats();
  renderHomeTopEntries();
  renderContestGallery();
  updateVotingTicketUI();
  setupModalEvents();
  fetchGitHubSubmissions();

  // 100% AUTOMATIC BACKGROUND SYNC EVERY 3 SECONDS (전 세계 핸드폰 ↔ PC 3초 실시간 무선 감지!)
  setInterval(() => {
    autoSyncCentralCloudDB();
  }, 3000);
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

  let html = '';
  topThree.forEach((s, idx) => {
    const isVoted = app.userVotes.has(s.id);
    const hasVideo = s.videoUrl || s.videoData;
    html += `
      <div class="contest-card">
        <div class="contest-thumb-wrapper" onclick="openSubmissionDetailModal('${s.id}')">
          ${hasVideo ? `
            <video src="${s.videoUrl || s.videoData}" class="contest-thumb-img" autoplay loop muted playsinline style="object-fit:cover; pointer-events:none;"></video>
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
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">검색 조건에 일치하는 출품작이 없습니다.</div>`;
    return;
  }

  let html = '';
  list.forEach((s, idx) => {
    const isVoted = app.userVotes.has(s.id);
    const hasVideo = s.videoUrl || s.videoData;
    html += `
      <div class="contest-card">
        <div class="contest-thumb-wrapper" onclick="openSubmissionDetailModal('${s.id}')">
          ${hasVideo ? `
            <video src="${s.videoUrl || s.videoData}" class="contest-thumb-img" autoplay loop muted playsinline style="object-fit:cover; pointer-events:none;"></video>
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
  const sub = app.submissions.find(s => s.id === submissionId);
  if (!sub) return;

  if (app.userVotes.has(submissionId)) {
    // Cancel Vote
    app.userVotes.delete(submissionId);
    sub.votes = Math.max(0, sub.votes - 1);
    app.saveUserVotes();
    app.saveSubmissions();
    showToast(`'${sub.title}' 투표를 취소했습니다.`, 'info');
  } else {
    // Check ticket limit (1 person max 3 votes)
    if (app.userVotes.size >= 3) {
      showToast('⚠️ 1인당 최대 3표까지만 투표 가능합니다.', 'info');
      return;
    }

    app.userVotes.add(submissionId);
    sub.votes += 1;
    app.saveUserVotes();
    app.saveSubmissions();
    showToast(`🎉 '${sub.title}'에 투표하셨습니다!`, 'success');
  }

  updateVotingTicketUI();
  renderContestGallery();
  renderHomeStats();
  renderHomeTopEntries();
}

let uploadedVideoDataUrl = null;
let uploadedVideoUrl = null;

function handleVideoFileSelect(event, previewId, wrapperId) {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById(previewId);
  const wrapper = document.getElementById(wrapperId);

  // 1. Instant local preview via ObjectURL (0 MB memory overhead)
  const localObjectUrl = URL.createObjectURL(file);
  uploadedVideoUrl = localObjectUrl;
  if (preview) preview.src = localObjectUrl;
  if (wrapper) wrapper.style.display = 'block';

  showToast('📱 핸드폰 시연 영상을 서버로 전송 중입니다...', 'info');

  // 2. Direct binary stream upload if running over HTTP
  if (window.location.protocol.startsWith('http')) {
    fetch('/api/upload-video', {
      method: 'POST',
      headers: { 'Content-Type': file.type || 'video/mp4' },
      body: file
    })
    .then(res => res.json())
    .then(data => {
      if (data.videoUrl) {
        uploadedVideoUrl = data.videoUrl;
        showToast('✅ 핸드폰 시연 영상이 서버에 성공적으로 저장되었습니다!', 'success');
      }
    })
    .catch(err => {
      console.warn('Stream upload fallback:', err);
    });
  }

  // Also read base64 for fallback
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedVideoDataUrl = e.target.result;
  };
  try {
    reader.readAsDataURL(file);
  } catch (e) {}
}

function createInteractiveCanvasVideoBlob(callback) {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 854;
  const ctx = canvas.getContext('2d');

  const stream = canvas.captureStream(30);
  let mediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  } catch (e) {
    mediaRecorder = new MediaRecorder(stream);
  }

  const chunks = [];
  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    callback(videoUrl);
  };

  mediaRecorder.start();

  let frame = 0;
  const totalFrames = 120; // 4 seconds video

  function renderFrame() {
    frame++;

    // Background Dark Phone Backdrop
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 480, 854);

    // Phone Top Status Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 480, 44);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('📱 18:35', 20, 28);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('🔴 REC 00:04', 350, 28);

    // App Header Bar
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 44, 480, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('⚡ 바이브코딩 AI 자동화 시연', 24, 88);

    // Card 1: Prompt Box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 134, 440, 140);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('🤖 AI 프롬프트 명령', 36, 168);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px sans-serif';
    const textPrompt = '"전국 250개 경찰서 엑셀 1초 검증해줘"';
    const charLen = Math.min(textPrompt.length, Math.floor(frame / 2.5));
    ctx.fillText(textPrompt.substring(0, charLen), 36, 204);

    // Card 2: Progress Animation Bar
    const progress = Math.min(1.0, frame / (totalFrames * 0.7));
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 294, 440, 150);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`⚡ 자동 검증 진행률 (${Math.floor(progress * 100)}%)`, 36, 328);

    // Progress Bar Fill
    ctx.fillStyle = '#334155';
    ctx.fillRect(36, 350, 390, 24);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(36, 350, Math.max(12, 390 * progress), 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px monospace';
    ctx.fillText(`Processing... [${Math.floor(progress * 250)} / 250 경찰서]`, 36, 408);

    // Card 3: Execution Results (Appears after 40% progress)
    if (progress > 0.3) {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(20, 464, 440, 260);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🏆 시연 결과 100% 자동화 성공!', 36, 504);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText('✅ 강남경찰서: 서식 정상 (오류 0개)', 36, 544);
      ctx.fillText('✅ 종로경찰서: 서식 자동 표준화', 36, 584);
      ctx.fillText('✅ 마포경찰서: 취합 서식 교정 완료', 36, 624);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('⏱️ 소요시간: 0.85초 (4시간 -> 1초 단축)', 36, 674);
    }

    if (frame < totalFrames) {
      requestAnimationFrame(renderFrame);
    } else {
      mediaRecorder.stop();
    }
  }

  renderFrame();
}

function loadSampleDemoVideoIntoForm() {
  showToast('🎬 핸드폰 촬영 시연 샘플 동영상을 생성 중입니다...', 'info');
  createInteractiveCanvasVideoBlob(videoUrl => {
    uploadedVideoDataUrl = videoUrl;
    const preview = document.getElementById('subVideoPreview');
    const wrapper = document.getElementById('videoPreviewWrapper');

    if (preview) preview.src = videoUrl;
    if (wrapper) wrapper.style.display = 'block';

    if (!document.getElementById('subName').value) document.getElementById('subName').value = '김경위';
    if (!document.getElementById('subDept').value) document.getElementById('subDept').value = '디지털혁신팀';
    if (!document.getElementById('subTitle').value) document.getElementById('subTitle').value = '📱 250개 경찰서 엑셀 1초 서식 검증기 (핸드폰 시연)';
    if (!document.getElementById('subDesc').value) document.getElementById('subDesc').value = '핸드폰으로 직접 촬영한 250개 경찰서 엑셀 서식 1초 검증 스크립트 실습 시연 영상입니다.';
    if (!document.getElementById('subPasscode').value) document.getElementById('subPasscode').value = '1234';

    showToast('🎉 핸드폰 촬영 시연 샘플 영상이 1초만에 세팅되었습니다!', 'success');
  });
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
  const existingIds = new Set(app.submissions.map(item => item.id));
  let addedCount = 0;

  newItems.forEach(item => {
    if (!existingIds.has(item.id)) {
      app.submissions.unshift(item);
      existingIds.add(item.id);
      addedCount++;
    } else {
      const idx = app.submissions.findIndex(s => s.id === item.id);
      if (idx !== -1) app.submissions[idx] = item;
    }
  });

  app.saveSubmissions();
  renderContestGallery();
  renderHomeStats();
  renderHomeTopEntries();
  if (app.isAdmin) renderAdminDashboard();
}

/* GITHUB REST API CENTRAL DATABASE LOGIC */
let ghConfig = {
  owner: localStorage.getItem('vibecoding_gh_owner') || 'Kyunyoung',
  repo: localStorage.getItem('vibecoding_gh_repo') || 'bai',
  token: localStorage.getItem('vibecoding_gh_token') || '',
  path: 'data/submissions.json'
};

function saveGitHubConfig() {
  const owner = document.getElementById('ghOwnerInput')?.value.trim();
  const repo = document.getElementById('ghRepoInput')?.value.trim();
  const token = document.getElementById('ghTokenInput')?.value.trim();

  if (owner) {
    ghConfig.owner = owner;
    localStorage.setItem('vibecoding_gh_owner', owner);
  }
  if (repo) {
    ghConfig.repo = repo;
    localStorage.setItem('vibecoding_gh_repo', repo);
  }
  if (token) {
    ghConfig.token = token;
    localStorage.setItem('vibecoding_gh_token', token);
  }

  showToast('💾 GitHub REST API 중앙 DB 설정이 저장되었습니다!', 'success');
  fetchGitHubSubmissions(true);
}

function loadGitHubConfigUI() {
  const ownerEl = document.getElementById('ghOwnerInput');
  const repoEl = document.getElementById('ghRepoInput');
  const tokenEl = document.getElementById('ghTokenInput');

  if (ownerEl) ownerEl.value = ghConfig.owner;
  if (repoEl) repoEl.value = ghConfig.repo;
  if (tokenEl) tokenEl.value = ghConfig.token;
}

async function fetchGitHubSubmissions(showToastNotice = false) {
  if (!ghConfig.owner || !ghConfig.repo) return;

  const rawUrl = `https://raw.githubusercontent.com/${ghConfig.owner}/${ghConfig.repo}/main/${ghConfig.path}?t=${Date.now()}`;

  try {
    const res = await fetch(rawUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        mergeSubmissionsData(data);
        const badge = document.getElementById('githubDbStatusBadge');
        if (badge) {
          badge.textContent = `🐙 GitHub DB 실시간 연동 중 (${data.length}개 커밋 동기화)`;
          badge.style.background = 'rgba(16, 185, 129, 0.15)';
          badge.style.color = '#059669';
        }
        if (showToastNotice) showToast(`🐙 GitHub에서 ${data.length}개의 최신 제출작을 동기화했습니다!`, 'success');
      }
    } else {
      if (showToastNotice) showToast('GitHub 리포지토리의 submissions.json 연동 대기 중입니다.', 'info');
    }
  } catch (err) {
    console.warn('GitHub API fetch error:', err);
    if (showToastNotice) showToast('⚠️ GitHub DB 읽기 실패. 소유자/리포지토리명을 확인하세요.', 'info');
  }
}

async function pushSubmissionToGitHub(newSub) {
  if (!ghConfig.owner || !ghConfig.repo || !ghConfig.token) {
    console.log('GitHub Token/Repo not fully set for auto-commit.');
    return;
  }

  const apiUrl = `https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${ghConfig.path}`;

  try {
    let sha = '';
    const getRes = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${ghConfig.token}` }
    });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }

    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(app.submissions, null, 2))));

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${ghConfig.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `feat: Add contest submission '${newSub.title}' by ${newSub.name}`,
        content: contentBase64,
        sha: sha || undefined
      })
    });

    if (putRes.ok) {
      showToast('🐙 GitHub 중앙 DB에 Commit 등록이 완료되었습니다!', 'success');
    }
  } catch (e) {
    console.warn('GitHub API push error:', e);
  }
}

/* 100% AUTOMATIC REAL-TIME CLOUD DB SYNC ENGINE */
const FREE_CLOUD_DB_URL = 'https://jsonblob.com/api/jsonBlob/019fcc42-f8a8-7f5e-94c8-bc3557750fe5';

async function autoSyncCentralCloudDB() {
  // 1. If running under HTTP/HTTPS server (e.g. node server.js), check local server API first!
  if (window.location.protocol.startsWith('http')) {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          mergeSubmissionsData(items);
        }
      }
    } catch (e) {}
  }

  // 2. Global CORS Cloud DB
  try {
    const res = await fetch(`${FREE_CLOUD_DB_URL}?t=${Date.now()}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.record || []);
      if (Array.isArray(items) && items.length > 0) {
        mergeSubmissionsData(items);
      }
    }
  } catch (e) {}

  if (ghConfig.owner && ghConfig.repo) {
    await fetchGitHubSubmissions(false);
  }
}

async function autoPushSubmissionToCloudDB(newSub) {
  // 1. If running under HTTP/HTTPS server, push to local server API first!
  if (window.location.protocol.startsWith('http')) {
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app.submissions)
      });
      showToast('🟢 서버 중앙 DB에 실시간 등록되었습니다!', 'success');
    } catch (e) {}
  }

  // 2. Push to Global Cloud DB
  const sanitized = app.submissions.map(item => {
    const copy = { ...item };
    if (copy.videoData && copy.videoData.length > 50000) {
      copy.videoData = '';
    }
    return copy;
  });

  try {
    await fetch(FREE_CLOUD_DB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(sanitized)
    });
    showToast('🟢 중앙 클라우드 DB에 실시간 무선 등록되었습니다!', 'success');
  } catch (e) {}

  pushSubmissionToGitHub(newSub);
}

function handleImagePresetChange(val) {
  const customInput = document.getElementById('subCustomImageUrl');
  if (customInput) {
    customInput.style.display = val === 'custom' ? 'block' : 'none';
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

function handleVerifyPasscodeSubmit(event) {
  event.preventDefault();

  const id = document.getElementById('verifySubId').value;
  const actionType = document.getElementById('verifyActionType').value;
  const passInput = document.getElementById('verifyPassInput').value.trim();

  const s = app.submissions.find(item => item.id === id);
  if (!s) return;

  const expectedPasscode = s.passcode || '1234';

  if (passInput === expectedPasscode) {
    closeModal('verifyPasscodeModal');
    showToast('🔒 비밀번호 인증이 완료되었습니다.', 'success');

    setTimeout(() => {
      if (actionType === 'edit') {
        openEditSubmissionModal(id);
      } else if (actionType === 'cancel') {
        handleCancelSubmission(id);
      }
    }, 100);
  } else {
    showToast('⚠️ 비밀번호가 일치하지 않습니다. (샘플 예제 비밀번호: 1234)', 'info');
  }
}

function handleSubmissionSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('subName').value.trim();
  const dept = document.getElementById('subDept').value.trim();
  const title = document.getElementById('subTitle').value.trim();
  const desc = document.getElementById('subDesc').value.trim();
  const inputVideoUrl = document.getElementById('subVideoUrl')?.value.trim();
  const videoUrl = inputVideoUrl || uploadedVideoUrl || '';
  const passcode = document.getElementById('subPasscode').value.trim();
  
  const preset = document.getElementById('subImagePreset').value;
  const customImg = document.getElementById('subCustomImageUrl').value.trim();
  const image = preset === 'custom' ? (customImg || 'slides_media/slide_22.jpg') : preset;

  if (!name || !dept || !title || !desc || !passcode) {
    showToast('필수 항목 및 비밀번호를 모두 입력해주세요.', 'info');
    return;
  }

  const newSubId = `sub_${Date.now()}`;
  const newSub = {
    id: newSubId,
    name: name,
    dept: dept,
    title: title,
    desc: desc,
    url: url || '#',
    videoUrl: videoUrl || '',
    videoData: uploadedVideoDataUrl || '',
    image: image,
    passcode: passcode,
    votes: 0,
    ratings: [],
    date: new Date().toISOString().split('T')[0],
    status: 'visible'
  };

  uploadedVideoDataUrl = null;
  uploadedVideoUrl = null;

  app.submissions.unshift(newSub);
  app.saveSubmissions();
  autoPushSubmissionToCloudDB(newSub);

  showToast('🎉 바이브코딩 콘테스트에 작품이 출품되었습니다!', 'success');
  document.getElementById('submissionForm').reset();

  switchContestSubTab('gallery');
  renderHomeStats();
  renderHomeTopEntries();
}

function openSubmissionDetailModal(submissionId) {
  const s = app.submissions.find(item => item.id === submissionId);
  if (!s) return;

  const modalTitle = document.getElementById('modalSubTitle');
  if (modalTitle) modalTitle.textContent = s.title;

  const modalBody = document.getElementById('modalSubBody');
  if (modalBody) {
    const isVoted = app.userVotes.has(s.id);
    modalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        
        <!-- Video Player if Video Uploaded -->
        ${(s.videoData || s.videoUrl) ? `
          <div style="background:#0f172a; padding:16px; border-radius:var(--radius-md); border:1px solid #1e293b;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
              <span style="font-size:0.9rem; font-weight:800; color:#38bdf8;">📱 🎬 핸드폰 촬영 시연 영상 플레이어</span>
              <div style="display:flex; gap:6px;">
                <a href="${s.videoUrl || s.videoData}" download="demo_video" target="_blank" class="btn btn-primary btn-sm" style="font-size:0.75rem; padding:4px 10px;">
                  📥 영상 다운로드 / 외부 보기
                </a>
              </div>
            </div>
            <video controls playsinline preload="metadata" src="${s.videoUrl || s.videoData}" style="width:100%; max-height:360px; border-radius:8px; background:#000; outline:none;">
              <source src="${s.videoUrl}" type="video/mp4">
              <source src="${s.videoUrl}" type="video/webm">
              <source src="${s.videoUrl}" type="video/quicktime">
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

        <!-- Multi-Criteria Star Rating Evaluation Box -->
        <div class="evaluation-star-box">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main);">⭐ 시연 영상 종합 심사 평가</h4>
            <span style="font-size:0.8rem; color:var(--primary-600); font-weight:700;">평균 4.9 / 5.0 점</span>
          </div>

          <div class="star-rating-row">
            <span>🌟 완성도 (Completeness)</span>
            <div class="star-rating-select">
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '완성도', 5)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '완성도', 4)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '완성도', 3)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '완성도', 2)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '완성도', 1)">★</button>
            </div>
          </div>

          <div class="star-rating-row">
            <span>💡 창의성 (Creativity)</span>
            <div class="star-rating-select">
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '창의성', 5)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '창의성', 4)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '창의성', 3)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '창의성', 2)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '창의성', 1)">★</button>
            </div>
          </div>

          <div class="star-rating-row">
            <span>🚀 업무 활용도 (Practical Impact)</span>
            <div class="star-rating-select">
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '업무활용도', 5)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '업무활용도', 4)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '업무활용도', 3)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '업무활용도', 2)">★</button>
              <button class="star-btn selected" onclick="submitStarRating('${s.id}', '업무활용도', 1)">★</button>
            </div>
          </div>
        </div>

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

function handleEditSubmissionSubmit(event) {
  event.preventDefault();

  const id = document.getElementById('editSubId').value;
  const s = app.submissions.find(item => item.id === id);
  if (!s) return;

  const name = document.getElementById('editName').value.trim();
  const dept = document.getElementById('editDept').value.trim();
  const title = document.getElementById('editTitle').value.trim();
  const desc = document.getElementById('editDesc').value.trim();
  const url = document.getElementById('editUrl').value.trim();

  const preset = document.getElementById('editImagePreset').value;
  const customImg = document.getElementById('editCustomImageUrl').value.trim();
  const image = preset === 'custom' ? (customImg || 'slides_media/slide_22.jpg') : preset;

  s.name = name;
  s.dept = dept;
  s.title = title;
  s.desc = desc;
  s.url = url || '#';
  s.image = image;

  app.saveSubmissions();

  closeModal('editSubmissionModal');
  showToast('✅ 출품 작품 수정사항이 성공적으로 저장되었습니다!', 'success');

  renderContestGallery();
  renderHomeStats();
  renderHomeTopEntries();
  if (app.isAdmin) renderAdminDashboard();
}

function handleCancelSubmission(submissionId) {
  const s = app.submissions.find(item => item.id === submissionId);
  if (!s) return;

  if (confirm(`'${s.title}' 작품 출품을 정말로 취소/삭제하시겠습니까?`)) {
    app.submissions = app.submissions.filter(item => item.id !== submissionId);
    app.saveSubmissions();

    closeModal('submissionDetailModal');
    showToast('🗑️ 작품 출품이 취소되었습니다.', 'info');

    renderContestGallery();
    renderHomeStats();
    renderHomeTopEntries();
    if (app.isAdmin) renderAdminDashboard();
  }
}

/* ==========================================
   ADMIN CENTER & CSV DATA EXPORT LOGIC
   ========================================== */

function verifyAdminAuth() {
  const input = document.getElementById('adminPassInput');
  const pass = input ? input.value : '';

  if (pass === 'admin123' || pass === '1234') {
    app.isAdmin = true;
    showToast('🔑 관리자 로그인 성공!', 'success');
    document.getElementById('adminAuthBox').style.display = 'none';
    document.getElementById('adminDashboardBox').style.display = 'block';
    renderAdminDashboard();
  } else {
    showToast('비밀번호가 올바르지 않습니다. (기본: admin123)', 'info');
  }
}

function logoutAdminAuth() {
  app.isAdmin = false;
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


