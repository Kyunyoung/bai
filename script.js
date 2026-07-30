/* ==========================================
   바이브코딩 사내 교육 포털 - Core JavaScript (ES6+)
   PDF 59개 슬라이드 원본 이미지 전용 100% 순수 뷰어
   (기존 PPT 텍스트 및 외부 설명 텍스트 완전 제거)
   ========================================== */

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
    selectOptions += `<option value="${idx}" ${idx === app.currentSlideIndex ? 'selected' : ''}>${viewedTag}PDF 슬라이드 ${s.num}장</option>`;
  });

  const progressPercent = Math.round((slide.num / app.slides.length) * 100);

  stage.innerHTML = `
    <!-- 100% PURE PDF SLIDE VIEWER STAGE (NO EXTERNAL TEXT) -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:20px; box-shadow:var(--shadow-lg);">
      
      <!-- Top Control Bar -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-main); padding:10px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color); flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="category-tag" style="font-size:0.85rem; font-weight:700;">${slide.part}</span>
          <span style="font-size:1.1rem; font-weight:800; color:var(--primary-600);">
            PDF SLIDE ${slide.num} / ${app.slides.length}
          </span>
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-outline" style="padding:6px 14px; font-size:0.875rem;" onclick="changeSlide(-1)" title="이전 슬라이드 (◀)">
            ◀ 이전
          </button>
          <button class="btn btn-primary" style="padding:6px 20px; font-size:0.875rem; font-weight:700;" onclick="changeSlide(1)" title="다음 슬라이드 (▶)">
            다음 ▶
          </button>

          <select onchange="jumpToSlide(parseInt(this.value, 10))" class="filter-select" style="max-width:200px; padding:6px 10px; font-size:0.85rem;">
            ${selectOptions}
          </select>
        </div>
      </div>

      <!-- Top Progress Fill Bar -->
      <div class="slide-top-progress" style="height:6px; margin-bottom:16px;" title="슬라이드 위치 ${progressPercent}%">
        <div class="slide-top-progress-fill" style="width: ${progressPercent}%; background:var(--primary-600);"></div>
      </div>

      <!-- PURE PDF SLIDE IMAGE DISPLAY CANVAS -->
      <div class="slide-clickable-stage" onclick="changeSlide(1)" style="cursor:pointer; position:relative; text-align:center; padding:12px; background:var(--bg-main); border-radius:var(--radius-md); border:1px solid var(--border-color);" title="화면 어디든 클릭 시 다음 슬라이드로 이동">
        
        <div class="anywhere-click-badge" style="position:absolute; top:16px; right:16px; z-index:10; pointer-events:none;">
          <span style="background:rgba(37,99,235,0.9); color:white; padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:700;">화면 클릭 = 다음 슬라이드 ▶</span>
        </div>

        <!-- 100% PURE PDF SLIDE PAGE IMAGE -->
        <img src="${slide.image}?v=7" class="slide-comic-img" style="max-height:680px; width:100%; object-fit:contain; border-radius:var(--radius-md); box-shadow:var(--shadow-md);" alt="PDF Slide ${slide.num}">
      </div>

      <!-- Bottom Navigation Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.825rem; color:var(--text-muted); margin-top:14px; padding:0 4px;">
        <span>💡 화면 클릭 또는 키보드 방향키(➔), Space, Enter 키로 PDF 59개 슬라이드를 한 장씩 순서대로 정독하세요.</span>
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
