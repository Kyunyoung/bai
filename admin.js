// Admin Dashboard Logic for /admin
let adminVoters = [];
let adminSubmissions = [];
let currentTheme = 'light';

// Toast Notification Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: '✅',
    info: '💡',
    warning: '⚠️',
    danger: '❌'
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || '🔔'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Init Theme
function initTheme() {
  try {
    const saved = localStorage.getItem('vibecoding_theme');
    if (saved) currentTheme = JSON.parse(saved);
  } catch (e) {
    currentTheme = 'light';
  }
  document.documentElement.setAttribute('data-theme', currentTheme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('vibecoding_theme', JSON.stringify(currentTheme));
      document.documentElement.setAttribute('data-theme', currentTheme);
      icon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    });
  }
}

// Load Data
async function loadAdminData() {
  const syncBadge = document.getElementById('syncStatusBadge');

  try {
    const localV = localStorage.getItem('vibe_voters_db');
    if (localV) adminVoters = JSON.parse(localV);
  } catch (e) {}

  // Fetch Central Submissions via SubmissionsService
  if (window.isBackendConfigured()) {
    try {
      const items = await window.SubmissionsService.fetchSubmissions();
      if (Array.isArray(items)) {
        adminSubmissions = items;
      }
    } catch (e) {
      console.error('Admin Load Error:', e);
    }
  } else {
    try {
      const local = localStorage.getItem('vibecoding_contest_submissions');
      if (local) adminSubmissions = JSON.parse(local);
    } catch (err) {}
  }

  if (syncBadge) {
    if (window.isBackendConfigured()) {
      syncBadge.textContent = '🟢 Supabase 중앙 DB 연동 완료';
      syncBadge.style.background = '#10b981';
    } else {
      syncBadge.textContent = '⚠️ 중앙 DB 미설정';
      syncBadge.style.background = '#ef4444';
    }
  }

  renderAdminKPIs();
  renderVoterTable();
  renderSubmissionTable();
}

// Save Submissions
async function saveAdminSubmissions() {
  try {
    localStorage.setItem('vibecoding_contest_submissions', JSON.stringify(adminSubmissions));
  } catch (e) {}
  renderAdminKPIs();
}

async function clearAllSubmissions() {
  if (!confirm('⚠️ 모든 작품 출품 내역을 정말로 전체 초기화(삭제)하시겠습니까?\n이 작업은 취소할 수 없습니다.')) {
    return;
  }

  if (!window.isBackendConfigured()) {
    showToast('⚠️ 중앙 DB가 설정되지 않았습니다.', 'warning');
    return;
  }

  try {
    for (const sub of adminSubmissions) {
      try {
        await window.SubmissionsService.adminDeleteSubmission(sub.id);
      } catch (e) {}
    }
    adminSubmissions = [];
    localStorage.setItem('vibecoding_contest_submissions', JSON.stringify([]));
    showToast('🗑️ 중앙 DB의 모든 출품작 내역이 초기화되었습니다.', 'success');
  } catch (err) {
    showToast('❌ 초기화 실패: ' + err.message, 'error');
  }

  renderAdminKPIs();
  renderSubmissionTable();
}

// Render KPIs
function renderAdminKPIs() {
  const totalVotersEl = document.getElementById('kpiTotalVoters');
  const votedCountEl = document.getElementById('kpiVotedCount');
  const totalSubmissionsEl = document.getElementById('kpiTotalSubmissions');
  const totalVotesEl = document.getElementById('kpiTotalVotes');

  const votedCount = adminVoters.filter(v => v.votedSubmissionId != null).length;
  const totalVotes = adminSubmissions.reduce((sum, s) => sum + (s.votes || 0), 0);

  if (totalVotersEl) totalVotersEl.textContent = `${adminVoters.length} 명`;
  if (votedCountEl) votedCountEl.textContent = `${votedCount} 명`;
  if (totalSubmissionsEl) totalSubmissionsEl.textContent = `${adminSubmissions.length} 개`;
  if (totalVotesEl) totalVotesEl.textContent = `${totalVotes} 표`;
}

// Render Voter Table
function renderVoterTable(filteredVoters = null) {
  const tbody = document.getElementById('voterTableBody');
  const badge = document.getElementById('voterListCount');
  const list = filteredVoters || adminVoters;

  if (badge) badge.textContent = `${adminVoters.length}명`;
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">등록된 투표자가 없습니다. 위 엑셀 등록 서식에서 업로드해주세요.</td></tr>`;
    return;
  }

  let html = '';
  list.forEach((v, idx) => {
    const isVoted = v.votedSubmissionId != null;
    html += `
      <tr>
        <td>${idx + 1}</td>
        <td style="font-weight:800; color:var(--text-heading);">${v.name}</td>
        <td>${v.dept || '-'}</td>
        <td style="font-family:monospace; font-weight:700;">${v.birthdate || '-'}</td>
        <td>
          ${isVoted ? '<span style="color:#10b981; font-weight:800;">✔ 투표 완료</span>' : '<span style="color:var(--text-muted);">미투표</span>'}
        </td>
        <td style="text-align:center;">
          <button type="button" class="btn-delete-item" onclick="deleteSingleVoter('${v.id}')">삭제</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// Filter Voter Table
function filterVoterTable() {
  const query = (document.getElementById('voterSearchInput')?.value || '').trim().toLowerCase();
  if (!query) {
    renderVoterTable();
    return;
  }
  const filtered = adminVoters.filter(v => 
    (v.name || '').toLowerCase().includes(query) || 
    (v.dept || '').toLowerCase().includes(query)
  );
  renderVoterTable(filtered);
}

// Delete Single Voter
function deleteSingleVoter(id) {
  const voter = adminVoters.find(v => v.id === id);
  if (!voter) return;
  if (confirm(`'${voter.name}'님을 투표자 명단에서 삭제하시겠습니까?`)) {
    adminVoters = adminVoters.filter(v => v.id !== id);
    saveAdminVoters();
    renderVoterTable();
    showToast(`'${voter.name}'님이 명단에서 삭제되었습니다.`, 'info');
  }
}

// Clear All Voters
function clearAllVotersList() {
  if (adminVoters.length === 0) {
    showToast('등록된 투표자가 없습니다.', 'info');
    return;
  }
  if (confirm('⚠️ 모든 투표자 명단을 초기화하시겠습니까? (이 작업은 되돌릴 수 없습니다.)')) {
    adminVoters = [];
    saveAdminVoters();
    renderVoterTable();
    showToast('투표자 명단이 전체 초기화되었습니다.', 'warning');
  }
}

// Excel Upload Handler
function handleExcelFileSelect(event) {
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
        processAdminExcelRows(rows);
      } catch (err) {
        console.error('XLSX parse error:', err);
        showToast('❌ 엑셀 파일 파싱 중 오류가 발생했습니다.', 'danger');
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    // CSV fallback
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).map(l => l.split(/,|\t/));
      processAdminExcelRows(lines);
    };
    reader.readAsText(file, 'utf-8');
  }

  event.target.value = '';
}

// Process Rows
function processAdminExcelRows(rows) {
  if (!rows || rows.length < 2) {
    showToast('⚠️ 엑셀 데이터가 부족합니다. 최소 헤더 1행과 데이터 1행이 필요합니다.', 'warning');
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
    adminVoters = newVoters;
    saveAdminVoters();
    renderVoterTable();
    showToast(`🎉 엑셀에서 ${addedCount}명의 투표자가 성공적으로 등록되었습니다!`, 'success');
  } else {
    showToast('등록할 유효한 투표자 데이터가 없습니다.', 'warning');
  }
}

// Download Sample CSV
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

// Render Submissions Table
function renderSubmissionTable() {
  const tbody = document.getElementById('submissionTableBody');
  const badge = document.getElementById('submissionListCount');

  if (badge) badge.textContent = `${adminSubmissions.length}개`;
  if (!tbody) return;

  if (adminSubmissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-muted);">등록된 출품작이 없습니다.</td></tr>`;
    return;
  }

  let html = '';
  adminSubmissions.forEach((sub, idx) => {
    html += `
      <tr>
        <td>${idx + 1}</td>
        <td style="font-weight:800; color:var(--primary-700);">${sub.title}</td>
        <td>${sub.name}</td>
        <td>${sub.dept || '-'}</td>
        <td><strong style="color:#2563eb;">${sub.votes || 0} 표</strong></td>
        <td>${sub.date || '-'}</td>
        <td style="text-align:center;">
          <button type="button" class="btn-delete-item" onclick="deleteSingleSubmission('${sub.id}')">삭제</button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// Delete Single Submission
async function deleteSingleSubmission(id) {
  const sub = adminSubmissions.find(s => s.id === id);
  if (!sub) return;
  if (!confirm(`'${sub.title}' 작품을 삭제하시겠습니까?`)) return;

  if (window.isBackendConfigured()) {
    try {
      await window.SubmissionsService.adminDeleteSubmission(id);
      adminSubmissions = adminSubmissions.filter(s => s.id !== id);
      localStorage.setItem('vibecoding_contest_submissions', JSON.stringify(adminSubmissions));
      renderSubmissionTable();
      renderAdminKPIs();
      showToast(`'${sub.title}' 작품이 중앙 DB에서 삭제되었습니다.`, 'success');
    } catch (err) {
      showToast('❌ 삭제 실패: ' + err.message, 'error');
    }
  } else {
    adminSubmissions = adminSubmissions.filter(s => s.id !== id);
    localStorage.setItem('vibecoding_contest_submissions', JSON.stringify(adminSubmissions));
    renderSubmissionTable();
    renderAdminKPIs();
    showToast(`'${sub.title}' 작품이 로컬에서 삭제되었습니다.`, 'info');
  }
}

// Admin Authentication Management
function checkAdminAuth() {
  const isLoggedIn = sessionStorage.getItem('vibe_admin_logged_in') === 'true';
  const modal = document.getElementById('adminLoginModal');
  const container = document.getElementById('adminMainContainer');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  if (isLoggedIn) {
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    if (container) {
      container.style.display = 'block';
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'inline-flex';
    }
    loadAdminData();
  } else {
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
    if (container) {
      container.style.display = 'none';
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'none';
    }
  }
}

async function handleAdminLoginSubmit(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const idInput = document.getElementById('adminAuthId');
  const passInput = document.getElementById('adminAuthPassword');
  const errBox = document.getElementById('adminLoginError');

  const inputId = idInput ? idInput.value.trim() : '';
  const inputPass = passInput ? passInput.value.trim() : '';

  if (!inputId || !inputPass) {
    if (errBox) {
      errBox.textContent = '⚠️ 아이디와 비밀번호를 모두 입력해주세요.';
      errBox.style.display = 'block';
    }
    return;
  }

  // 1. Try Supabase Auth first if backend is configured
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

  // 2. Fallback to configured ADMIN_ID & ADMIN_PASSCODE check
  if (!authenticated) {
    const expectedId = window.BAI_CONFIG?.ADMIN_ID || 'admin';
    const expectedPass = window.BAI_CONFIG?.ADMIN_PASSCODE || 'admin1234';
    if (inputId === expectedId && inputPass === expectedPass) {
      authenticated = true;
    }
  }

  if (authenticated) {
    sessionStorage.setItem('vibe_admin_logged_in', 'true');
    if (errBox) errBox.style.display = 'none';
    checkAdminAuth();
    showToast('🔓 관리자 인증 성공! 엑셀 관리자 대시보드에 접근합니다.', 'success');
  } else {
    if (errBox) {
      errBox.textContent = '⚠️ 아이디 또는 비밀번호가 올바르지 않습니다.';
      errBox.style.display = 'block';
    }
    showToast('❌ 로그인 실패: 아이디/비밀번호를 확인해주세요.', 'danger');
  }
}

function handleAdminLogout() {
  if (confirm('🔒 관리자 모드에서 로그아웃 하시겠습니까?')) {
    sessionStorage.removeItem('vibe_admin_logged_in');
    checkAdminAuth();
    showToast('🔒 관리자 로그아웃 되었습니다.', 'info');
  }
}

window.handleAdminLoginSubmit = handleAdminLoginSubmit;
window.handleAdminLogout = handleAdminLogout;
window.checkAdminAuth = checkAdminAuth;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  checkAdminAuth();
});
