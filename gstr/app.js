// BRT GST Returns & Rent Compliance Tracker - Frontend Logic
(function () {
  'use strict';

  // --- SCHEME STATE ---
  let currentScheme = 'monthly'; // 'monthly' | 'qrmp' | 'composition'
  let appActiveMonth = 'NOV 2026';
  let isJanuaryEntered = false;

  // --- MONTHLY STATE (Preserved 1:1 with Screenshot) ---
  let currentMonth = 'OCT 2026'; // When working month is Nov 2026, return period is Oct 2026
  let monthsList = [];
  let allFilings = [];
  let filteredFilings = [];
  let selectedIds = new Set();
  let currentRentFilter = 'ALL';
  let currentStatusFilter = 'ALL';
  let searchQuery = '';

  // --- QRMP STATE ---
  let currentQrmpQuarter = 'Q3 (JUL - SEP 2026)';
  let qrmpQuartersList = [];
  let allQrmpFilings = [];
  let filteredQrmpFilings = [];
  let currentQrmpQuarterInfo = null;
  let qrmpSelectedIds = new Set();
  let qrmpRentFilter = 'ALL';
  let qrmpStatusFilter = 'ALL';
  let qrmpSearchQuery = '';

  // --- COMPOSITION STATE ---
  let currentCompositionQuarter = 'Q3 (JUL - SEP 2026)';
  let compositionQuartersList = [];
  let allCompositionFilings = [];
  let filteredCompositionFilings = [];
  let currentCompositionQuarterInfo = null;
  let compositionSelectedIds = new Set();
  let compositionStatusFilter = 'ALL';
  let compositionSearchQuery = '';

  // --- DOM ELEMENTS ---
  const monthSelect = document.getElementById('monthSelect');
  const periodSelectLabel = document.getElementById('periodSelectLabel');
  const appSubtitle = document.getElementById('appSubtitle');
  const btnRolloverText = document.getElementById('btnRolloverText');
  const btnCopyPrevData = document.getElementById('btnCopyPrevData');
  const btnCopyPrevDataText = document.getElementById('btnCopyPrevDataText');
  const periodStatusDot = document.getElementById('periodStatusDot');
  const workingMonthSelect = document.getElementById('workingMonthSelect');
  const periodSubtextInfo = document.getElementById('periodSubtextInfo');
  const btnAdvanceMonth = document.getElementById('btnAdvanceMonth');
  const btnAdvanceMonthText = document.getElementById('btnAdvanceMonthText');
  const btnResetNov = document.getElementById('btnResetNov');

  // Scheme Views
  const viewMonthly = document.getElementById('viewMonthly');
  const viewQrmp = document.getElementById('viewQrmp');
  const viewComposition = document.getElementById('viewComposition');

  // Monthly DOM Elements
  const tableBody = document.getElementById('tableBody');
  const monthlyCardsContainer = document.getElementById('monthlyCardsContainer');
  const noResults = document.getElementById('noResults');
  const searchInput = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const bulkActionsBar = document.getElementById('bulkActionsBar');
  const bulkSelectedCount = document.getElementById('bulkSelectedCount');
  const btnMonthlyCards = document.getElementById('btnMonthlyCards');
  const btnMonthlyTable = document.getElementById('btnMonthlyTable');

  // Monthly KPI Elements
  const kpiTotalClients = document.getElementById('kpiTotalClients');
  const kpiRentCount = document.getElementById('kpiRentCount');
  const kpiTotalRentAmount = document.getElementById('kpiTotalRentAmount');
  const kpiItcCount = document.getElementById('kpiItcCount');
  const kpiOwnCount = document.getElementById('kpiOwnCount');
  const kpiG1Filed = document.getElementById('kpiG1Filed');
  const kpiG3bFiled = document.getElementById('kpiG3bFiled');
  const progG1 = document.getElementById('progG1');
  const progG3b = document.getElementById('progG3b');
  const kpiG1Due = document.getElementById('kpiG1Due');
  const kpiG3bDue = document.getElementById('kpiG3bDue');

  // QRMP DOM Elements
  const qrmpTableBody = document.getElementById('qrmpTableBody');
  const qrmpCardsContainer = document.getElementById('qrmpCardsContainer');
  const qrmpNoResults = document.getElementById('qrmpNoResults');
  const qrmpSearchInput = document.getElementById('qrmpSearchInput');
  const btnQrmpClearSearch = document.getElementById('btnQrmpClearSearch');
  const qrmpSelectAllCheckbox = document.getElementById('qrmpSelectAllCheckbox');
  const btnQrmpCards = document.getElementById('btnQrmpCards');
  const btnQrmpTable = document.getElementById('btnQrmpTable');
  const thQrmpM1 = document.getElementById('thQrmpM1');
  const thQrmpM2 = document.getElementById('thQrmpM2');
  const thQrmpM3 = document.getElementById('thQrmpM3');
  const kpiQrmpTotal = document.getElementById('kpiQrmpTotal');
  const kpiQrmpM1Title = document.getElementById('kpiQrmpM1Title');
  const kpiQrmpM1Filed = document.getElementById('kpiQrmpM1Filed');
  const kpiQrmpM1Due = document.getElementById('kpiQrmpM1Due');
  const progQrmpM1 = document.getElementById('progQrmpM1');
  const kpiQrmpM2Title = document.getElementById('kpiQrmpM2Title');
  const kpiQrmpM2Filed = document.getElementById('kpiQrmpM2Filed');
  const kpiQrmpM2Due = document.getElementById('kpiQrmpM2Due');
  const progQrmpM2 = document.getElementById('progQrmpM2');
  const kpiQrmpM3Title = document.getElementById('kpiQrmpM3Title');
  const kpiQrmpM3Filed = document.getElementById('kpiQrmpM3Filed');
  const kpiQrmpM3Due = document.getElementById('kpiQrmpM3Due');
  const progQrmpM3 = document.getElementById('progQrmpM3');
  const kpiQrmpG3bFiled = document.getElementById('kpiQrmpG3bFiled');
  const kpiQrmpG3bDue = document.getElementById('kpiQrmpG3bDue');
  const progQrmpG3b = document.getElementById('progQrmpG3b');
  const kpiQrmpTaxCount = document.getElementById('kpiQrmpTaxCount');
  const kpiQrmpTotalTax = document.getElementById('kpiQrmpTotalTax');

  // Composition DOM Elements
  const compTableBody = document.getElementById('compTableBody');
  const compCardsContainer = document.getElementById('compCardsContainer');
  const compNoResults = document.getElementById('compNoResults');
  const compSearchInput = document.getElementById('compSearchInput');
  const btnCompClearSearch = document.getElementById('btnCompClearSearch');
  const compSelectAllCheckbox = document.getElementById('compSelectAllCheckbox');
  const btnCompCards = document.getElementById('btnCompCards');
  const btnCompTable = document.getElementById('btnCompTable');
  const kpiCompTotal = document.getElementById('kpiCompTotal');
  const kpiComp08Filed = document.getElementById('kpiComp08Filed');
  const kpiComp08Due = document.getElementById('kpiComp08Due');
  const progComp08 = document.getElementById('progComp08');
  const kpiCompG4Filed = document.getElementById('kpiCompG4Filed');
  const kpiCompG4Due = document.getElementById('kpiCompG4Due');
  const progCompG4 = document.getElementById('progCompG4');
  const kpiCompTurnoverCount = document.getElementById('kpiCompTurnoverCount');
  const kpiCompTotalTurnover = document.getElementById('kpiCompTotalTurnover');
  const kpiCompTaxCount = document.getElementById('kpiCompTaxCount');
  const kpiCompTotalTax = document.getElementById('kpiCompTotalTax');

  // Modals
  const modalRollover = document.getElementById('modalRollover');
  const modalAddClient = document.getElementById('modalAddClient');
  const modalFilingDate = document.getElementById('modalFilingDate');
  const modalBookmarklet = document.getElementById('modalBookmarklet');
  const toast = document.getElementById('toast');

  // --- VIEW MODE STATE (Cards vs Table) ---
  // Default view is strictly Table across all schemes (Monthly, QRMP, Composition, Master)
  let monthlyViewMode = localStorage.getItem('gstr_monthly_view_v2') || 'table';
  let qrmpViewMode = localStorage.getItem('gstr_qrmp_view_v2') || 'table';
  let compViewMode = localStorage.getItem('gstr_comp_view_v2') || 'table';

  function setMonthlyViewMode(mode) {
    monthlyViewMode = mode;
    try { localStorage.setItem('gstr_monthly_view_v2', mode); } catch (_) {}
    if (btnMonthlyCards && btnMonthlyTable) {
      btnMonthlyCards.classList.toggle('active', mode === 'cards');
      btnMonthlyTable.classList.toggle('active', mode === 'table');
    }
    const tableCard = viewMonthly ? viewMonthly.querySelector('.table-card') : null;
    if (tableCard) {
      tableCard.classList.remove('view-mode-cards', 'view-mode-table');
      tableCard.classList.add(mode === 'cards' ? 'view-mode-cards' : 'view-mode-table');
    }
  }

  function setQrmpViewMode(mode) {
    qrmpViewMode = mode;
    try { localStorage.setItem('gstr_qrmp_view_v2', mode); } catch (_) {}
    if (btnQrmpCards && btnQrmpTable) {
      btnQrmpCards.classList.toggle('active', mode === 'cards');
      btnQrmpTable.classList.toggle('active', mode === 'table');
    }
    const tableCard = viewQrmp ? viewQrmp.querySelector('.table-card') : null;
    if (tableCard) {
      tableCard.classList.remove('view-mode-cards', 'view-mode-table');
      tableCard.classList.add(mode === 'cards' ? 'view-mode-cards' : 'view-mode-table');
    }
  }

  function setCompViewMode(mode) {
    compViewMode = mode;
    try { localStorage.setItem('gstr_comp_view_v2', mode); } catch (_) {}
    if (btnCompCards && btnCompTable) {
      btnCompCards.classList.toggle('active', mode === 'cards');
      btnCompTable.classList.toggle('active', mode === 'table');
    }
    const tableCard = viewComposition ? viewComposition.querySelector('.table-card') : null;
    if (tableCard) {
      tableCard.classList.remove('view-mode-cards', 'view-mode-table');
      tableCard.classList.add(mode === 'cards' ? 'view-mode-cards' : 'view-mode-table');
    }
  }

  // Today's ISO date string (YYYY-MM-DD)
  function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format currency with Indian Comma separators and exactly 2 decimal places (e.g. "128.00", "874.56", "20,000.00")
  function formatNumber(val) {
    if (!val && val !== 0) return '0.00';
    const num = parseFloat(val.toString().replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Format amount to exact 2-decimal string for inputs (e.g. 128 -> "128.00", 874.56 -> "874.56")
  function formatAmount2Dec(val, returnEmptyIfBlank = true) {
    if (val === null || val === undefined || val === '') {
      return returnEmptyIfBlank ? '' : '0.00';
    }
    const clean = String(val).replace(/[^0-9.]/g, '');
    if (!clean) return returnEmptyIfBlank ? '' : '0.00';
    const num = parseFloat(clean);
    if (isNaN(num)) return returnEmptyIfBlank ? '' : '0.00';
    return num.toFixed(2);
  }

  // Format currency with Indian Comma separators and exactly 2 decimal places (e.g. 128 -> "128.00", 20000 -> "20,000.00")
  function formatCurrency2Dec(val, fallback = '') {
    if (val === null || val === undefined || val === '') return fallback;
    const clean = String(val).replace(/[^0-9.]/g, '');
    if (!clean) return fallback;
    const num = parseFloat(clean);
    if (isNaN(num)) return fallback;
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Sanitize input while typing (allow digits and at most one decimal point with up to 2 decimal places)
  function sanitizeDecimalInput(val) {
    if (!val) return '';
    let clean = String(val).replace(/[^0-9.]/g, '');
    let parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts[0] + '.' + parts.slice(1).join('');
      parts = clean.split('.');
    }
    if (parts.length >= 2) {
      clean = parts[0] + '.' + parts[1].slice(0, 2);
    }
    return clean;
  }

  // Safe API helper that validates JSON and provides actionable server restart messages
  async function apiFetch(endpoint, options = {}) {
    // If Supabase is configured OR running on a static host (GitHub Pages, file://) where no Node server exists:
    if (window.BRT_SUPABASE && (window.BRT_SUPABASE.isConfigured() || window.location.hostname.includes('github.io') || window.location.protocol === 'file:')) {
      try {
        return await window.BRT_SUPABASE.handleApiRequest(endpoint, options);
      } catch (err) {
        console.error('[Supabase Route Error]', err);
        throw err;
      }
    }

    let res;
    try {
      res = await fetch(endpoint, options);
    } catch (networkErr) {
      if (window.location.hostname.includes('github.io') || window.location.protocol === 'file:') {
        if (window.BRT_SUPABASE) window.BRT_SUPABASE.openSettingsModal();
        throw new Error('Please connect your Supabase database in the settings modal to enable live cloud features on GitHub Pages.');
      }
      throw networkErr;
    }
    const contentType = res.headers.get('content-type') || '';
    
    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        if (contentType.includes('application/json')) {
          const errObj = await res.json();
          if (errObj && errObj.error) errMsg = errObj.error;
        } else {
          const text = await res.text();
          if (text.includes('<!DOCTYPE') || text.includes('<html')) {
            errMsg = "Server needs to be restarted. Please close your console and double-click 'start.bat' (or 'restart.bat') to reload backend routes.";
          }
        }
      } catch (_) {}
      throw new Error(errMsg);
    }

    if (!contentType.includes('application/json')) {
      const text = await res.text();
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        throw new Error("Server needs to be restarted. Please close your console and double-click 'start.bat' (or 'restart.bat') to reload backend routes.");
      }
      throw new Error('Server returned non-JSON response');
    }

    return await res.json();
  }

  // --- INITIALIZATION ---
  async function init() {
    setupEventListeners();

    // Listen for data update messages from parent dashboard
    window.addEventListener('message', async (e) => {
      if (e && e.data && e.data.type === 'GSTR_DATA_UPDATED') {
        if (currentScheme === 'monthly') await fetchFilings(currentMonth);
        else if (currentScheme === 'qrmp') await fetchQrmpFilings(currentQrmpQuarter);
        else if (currentScheme === 'composition') await fetchCompositionFilings(currentCompositionQuarter);
      }
    });

    // Initialize view modes (cards for mobile/tablet, table for desktop)
    setMonthlyViewMode(monthlyViewMode);
    setQrmpViewMode(qrmpViewMode);
    setCompViewMode(compViewMode);

    // Listen for realtime cloud updates from Supabase (phone/tablet sync)
    if (window.BRT_SUPABASE) {
      window.BRT_SUPABASE.onRemoteUpdate(async () => {
        showToast('⚡ Live cloud update synced from another device!');
        if (currentScheme === 'monthly') await fetchFilings(currentMonth);
        else if (currentScheme === 'qrmp') await fetchQrmpFilings(currentQrmpQuarter);
        else if (currentScheme === 'composition') await fetchCompositionFilings(currentCompositionQuarter);
      });
    }

    await fetchPeriodStatus();
    await fetchMonths();
    if (monthsList.length > 0) {
      // In Nov 2026, return period must show only till Oct 2026 (strictly preceding working month)
      const available = getAvailableMonthlyReturnPeriods();
      currentMonth = available.length > 0 ? available[available.length - 1].name : 'OCT 2026';
      renderPeriodDropdown();
      await fetchFilings(currentMonth);
    }
    // Pre-fetch QRMP and Composition quarters in the background
    await fetchQrmpQuarters();
    await fetchCompositionQuarters();
  }

  // --- SCHEME SWITCHING ---
  function switchScheme(scheme) {
    currentScheme = scheme;

    // Highlight active tab button
    document.querySelectorAll('.scheme-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scheme') === scheme);
    });

    const viewMaster = document.getElementById('viewMaster');

    // Toggle views
    if (viewMonthly) viewMonthly.style.display = scheme === 'monthly' ? 'block' : 'none';
    if (viewQrmp) viewQrmp.style.display = scheme === 'qrmp' ? 'block' : 'none';
    if (viewComposition) viewComposition.style.display = scheme === 'composition' ? 'block' : 'none';
    if (viewMaster) viewMaster.style.display = scheme === 'master' ? 'block' : 'none';

    const btnRollover = document.getElementById('btnRolloverModal');
    const btnAddClient = document.getElementById('btnAddClientModal');

    // Update Header labels & Subtitles
    if (scheme === 'monthly') {
      if (monthSelect) monthSelect.disabled = false;
      periodSelectLabel.textContent = 'Return Period:';
      if (appSubtitle) { appSubtitle.textContent = ''; appSubtitle.style.display = 'none'; }
      btnRolloverText.textContent = 'Month Rollover';
      if (btnCopyPrevDataText) btnCopyPrevDataText.textContent = 'Copy Prev Month';
      if (btnCopyPrevData) btnCopyPrevData.style.display = 'inline-flex';
      if (btnRollover) btnRollover.style.display = 'inline-flex';
      if (btnAddClient) btnAddClient.style.display = 'inline-flex';
      renderPeriodDropdown();
      if (allFilings.length === 0) fetchFilings(currentMonth);
    } else if (scheme === 'qrmp') {
      if (monthSelect) monthSelect.disabled = false;
      periodSelectLabel.textContent = 'Return Quarter:';
      if (appSubtitle) { appSubtitle.textContent = ''; appSubtitle.style.display = 'none'; }
      btnRolloverText.textContent = 'Quarter Rollover';
      if (btnCopyPrevDataText) btnCopyPrevDataText.textContent = 'Copy Prev Quarter';
      if (btnCopyPrevData) btnCopyPrevData.style.display = 'inline-flex';
      if (btnRollover) btnRollover.style.display = 'inline-flex';
      if (btnAddClient) btnAddClient.style.display = 'inline-flex';
      if (qrmpQuartersList.length === 0) {
        fetchQrmpQuarters().then(() => {
          if (qrmpQuartersList.length > 0) {
            syncQrmpQuarterSelection();
            renderPeriodDropdown();
            fetchQrmpFilings(currentQrmpQuarter);
          }
        });
      } else {
        syncQrmpQuarterSelection();
        renderPeriodDropdown();
        fetchQrmpFilings(currentQrmpQuarter);
      }
    } else if (scheme === 'composition') {
      if (monthSelect) monthSelect.disabled = false;
      periodSelectLabel.textContent = 'Return Quarter:';
      if (appSubtitle) { appSubtitle.textContent = ''; appSubtitle.style.display = 'none'; }
      btnRolloverText.textContent = 'Quarter Rollover';
      if (btnCopyPrevDataText) btnCopyPrevDataText.textContent = 'Copy Prev Quarter';
      if (btnCopyPrevData) btnCopyPrevData.style.display = 'inline-flex';
      if (btnRollover) btnRollover.style.display = 'inline-flex';
      if (btnAddClient) btnAddClient.style.display = 'inline-flex';
      if (compositionQuartersList.length === 0) {
        fetchCompositionQuarters().then(() => {
          if (compositionQuartersList.length > 0) {
            syncCompositionQuarterSelection();
            renderPeriodDropdown();
            fetchCompositionFilings(currentCompositionQuarter);
          }
        });
      } else {
        syncCompositionQuarterSelection();
        renderPeriodDropdown();
        fetchCompositionFilings(currentCompositionQuarter);
      }
    } else if (scheme === 'master') {
      if (periodSelectLabel) periodSelectLabel.textContent = 'Directory:';
      if (monthSelect) {
        monthSelect.innerHTML = '<option value="all">All Schemes &amp; Periods (148 Companies)</option>';
        monthSelect.disabled = true;
      }
      if (appSubtitle) { appSubtitle.textContent = ''; appSubtitle.style.display = 'none'; }
      if (btnRollover) btnRollover.style.display = 'none';
      if (btnCopyPrevData) btnCopyPrevData.style.display = 'none';
      if (btnAddClient) btnAddClient.style.display = 'inline-flex';
      loadMasterDataAndRender();
    }

    // Toggle period status banner (hide on Master view to eliminate header clutter & monthly rollover banner)
    const periodStatusBanner = document.getElementById('periodStatusBanner');
    if (periodStatusBanner) {
      periodStatusBanner.style.display = scheme === 'master' ? 'none' : 'flex';
    }
    if (scheme === 'master') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function syncQrmpQuarterSelection() {
    const available = getAvailableQrmpQuarters();
    if (!available.some(q => q.name === currentQrmpQuarter)) {
      if (isJanuaryEntered) {
        const q4 = available.find(q => q.name.includes('Q4'));
        currentQrmpQuarter = q4 ? q4.name : available[available.length - 1].name;
      } else {
        const q3 = available.find(q => q.name.includes('Q3'));
        currentQrmpQuarter = q3 ? q3.name : available[available.length - 1].name;
      }
    }
  }

  function syncCompositionQuarterSelection() {
    const available = getAvailableCompositionQuarters();
    if (!available.some(q => q.name === currentCompositionQuarter)) {
      if (isJanuaryEntered) {
        const q4 = available.find(q => q.name.includes('Q4'));
        currentCompositionQuarter = q4 ? q4.name : available[available.length - 1].name;
      } else {
        const q3 = available.find(q => q.name.includes('Q3'));
        currentCompositionQuarter = q3 ? q3.name : available[available.length - 1].name;
      }
    }
  }

  function getAvailableQrmpQuarters() {
    if (isJanuaryEntered) {
      return qrmpQuartersList;
    }
    // In Nov 2026: only show up to Q3 (JUL - SEP 2026)
    return qrmpQuartersList.filter(q => !q.name.includes('Q4 (OCT - DEC 2026)') && !q.name.includes('2027'));
  }

  function getAvailableCompositionQuarters() {
    if (isJanuaryEntered) {
      return compositionQuartersList;
    }
    // In Nov 2026: only show up to Q3 (JUL - SEP 2026)
    return compositionQuartersList.filter(q => !q.name.includes('Q4 (OCT - DEC 2026)') && !q.name.includes('2027'));
  }

  const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const FULL_MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  function parseMonthYear(str) {
    if (!str) return null;
    const upper = str.trim().toUpperCase();
    let mIdx = -1;
    let year = null;
    for (let i = 0; i < 12; i++) {
      if (upper.includes(MONTH_NAMES[i]) || upper.includes(FULL_MONTHS[i])) {
        mIdx = i;
        break;
      }
    }
    const yMatch = upper.match(/20\d{2}/);
    if (yMatch) year = parseInt(yMatch[0], 10);
    if (mIdx !== -1 && year !== null) {
      return { monthIndex: mIdx, year };
    }
    return null;
  }

  function isMonthBefore(str1, str2) {
    const p1 = parseMonthYear(str1);
    const p2 = parseMonthYear(str2);
    if (!p1 || !p2) return true;
    if (p1.year < p2.year) return true;
    if (p1.year === p2.year && p1.monthIndex < p2.monthIndex) return true;
    return false;
  }

  function getAvailableMonthlyReturnPeriods() {
    return monthsList.filter(m => isMonthBefore(m.name, appActiveMonth));
  }

  function renderPeriodDropdown() {
    monthSelect.innerHTML = '';
    const rolloverSource = document.getElementById('rolloverSourceMonth');
    if (rolloverSource) rolloverSource.innerHTML = '';

    if (currentScheme === 'monthly') {
      const availableMonths = getAvailableMonthlyReturnPeriods();

      availableMonths.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.name;
        opt.textContent = `${m.name} (${m.percentComplete || 0}% Complete)`;
        monthSelect.appendChild(opt);

        if (rolloverSource) {
          const opt2 = document.createElement('option');
          opt2.value = m.name;
          opt2.textContent = m.name;
          rolloverSource.appendChild(opt2);
        }
      });

      // Ensure selected return period is valid among available months
      if (!availableMonths.some(m => m.name === currentMonth)) {
        currentMonth = availableMonths.length > 0 ? availableMonths[availableMonths.length - 1].name : 'OCT 2026';
      }
      monthSelect.value = currentMonth;
    } else if (currentScheme === 'qrmp') {
      const activeQuarters = getAvailableQrmpQuarters();

      activeQuarters.forEach(q => {
        const opt = document.createElement('option');
        opt.value = q.name;
        opt.textContent = `${q.name} (${q.percentComplete || 0}% Complete)`;
        monthSelect.appendChild(opt);

        if (rolloverSource) {
          const opt2 = document.createElement('option');
          opt2.value = q.name;
          opt2.textContent = q.name;
          rolloverSource.appendChild(opt2);
        }
      });

      syncQrmpQuarterSelection();
      monthSelect.value = currentQrmpQuarter;
    } else if (currentScheme === 'composition') {
      const activeQuarters = getAvailableCompositionQuarters();

      activeQuarters.forEach(q => {
        const opt = document.createElement('option');
        opt.value = q.name;
        opt.textContent = `${q.name} (${q.percentComplete || 0}% Complete)`;
        monthSelect.appendChild(opt);

        if (rolloverSource) {
          const opt2 = document.createElement('option');
          opt2.value = q.name;
          opt2.textContent = q.name;
          rolloverSource.appendChild(opt2);
        }
      });

      syncCompositionQuarterSelection();
      monthSelect.value = currentCompositionQuarter;
    }
  }

  // --- PERIOD MANAGEMENT & QUARTER UNLOCK LOGIC ---
  async function fetchPeriodStatus() {
    try {
      const data = await apiFetch('/api/period');
      if (data && data.periodConfig) {
        appActiveMonth = data.periodConfig.activeMonth || 'NOV 2026';
        isJanuaryEntered = Boolean(data.periodConfig.enteredJanuary);
        updatePeriodStatusUi();
      }
    } catch (_) {}
  }

  function updatePeriodStatusUi() {
    if (workingMonthSelect) {
      workingMonthSelect.value = appActiveMonth;
    }

    const availableMonths = getAvailableMonthlyReturnPeriods();
    const latestReturnMonth = availableMonths.length > 0 ? availableMonths[availableMonths.length - 1].name : 'OCT 2026';

    if (periodSubtextInfo) {
      if (isJanuaryEntered) {
        periodSubtextInfo.innerHTML = `&bull; Monthly Return Period: <strong>till ${latestReturnMonth}</strong> &bull; Quarters: <strong>till Q4 (OCT - DEC 2026) [UNLOCKED]</strong>`;
      } else {
        periodSubtextInfo.innerHTML = `&bull; Monthly Return Period: <strong>till ${latestReturnMonth}</strong> &bull; Quarters: <strong>till Q3 (JUL - SEP 2026)</strong>`;
      }
    }

    if (periodStatusDot) {
      if (appActiveMonth.includes('NOV')) {
        periodStatusDot.className = 'period-pulse-dot dot-nov';
      } else if (appActiveMonth.includes('DEC')) {
        periodStatusDot.className = 'period-pulse-dot dot-dec';
      } else {
        periodStatusDot.className = 'period-pulse-dot dot-jan';
      }
    }

    if (btnAdvanceMonth && btnAdvanceMonthText) {
      if (appActiveMonth.includes('NOV')) {
        btnAdvanceMonthText.textContent = 'Advance to DEC 2026 ➔';
        btnAdvanceMonth.setAttribute('data-target-month', 'DEC 2026');
        btnAdvanceMonth.style.display = 'inline-flex';
        if (btnResetNov) btnResetNov.style.display = 'none';
      } else if (appActiveMonth.includes('DEC')) {
        btnAdvanceMonthText.textContent = 'Advance to JAN 2027 ➔';
        btnAdvanceMonth.setAttribute('data-target-month', 'JAN 2027');
        btnAdvanceMonth.style.display = 'inline-flex';
        if (btnResetNov) btnResetNov.style.display = 'inline-flex';
      } else if (appActiveMonth.includes('JAN')) {
        btnAdvanceMonthText.textContent = 'Advance to FEB 2027 ➔';
        btnAdvanceMonth.setAttribute('data-target-month', 'FEB 2027');
        btnAdvanceMonth.style.display = 'inline-flex';
        if (btnResetNov) btnResetNov.style.display = 'inline-flex';
      } else {
        btnAdvanceMonth.style.display = 'none';
        if (btnResetNov) btnResetNov.style.display = 'inline-flex';
      }
    }
  }

  async function setWorkingMonth(newMonth) {
    try {
      const upper = newMonth.toUpperCase();
      const isJan = upper.includes('JAN') || upper.includes('2027');

      const res = await apiFetch('/api/period', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeMonth: newMonth,
          enteredJanuary: isJan
        })
      });

      if (res.success) {
        appActiveMonth = res.periodConfig.activeMonth;
        isJanuaryEntered = Boolean(res.periodConfig.enteredJanuary);
        updatePeriodStatusUi();

        // Refresh months & quarters lists from server
        await fetchMonths();
        await fetchQrmpQuarters();
        await fetchCompositionQuarters();

        // Update default selection for monthly return period
        const availableMonths = getAvailableMonthlyReturnPeriods();
        currentMonth = availableMonths.length > 0 ? availableMonths[availableMonths.length - 1].name : 'OCT 2026';

        // Update default selection for quarters
        if (isJanuaryEntered) {
          currentQrmpQuarter = 'Q4 (OCT - DEC 2026)';
          currentCompositionQuarter = 'Q4 (OCT - DEC 2026)';
          showToast(`🚀 Entered ${appActiveMonth}: Q4 (OCT - DEC 2026) is unlocked! Q3 data copied to Q4.`);
        } else {
          currentQrmpQuarter = 'Q3 (JUL - SEP 2026)';
          currentCompositionQuarter = 'Q3 (JUL - SEP 2026)';
          showToast(`Working calendar set to ${appActiveMonth}: Return periods available till ${currentMonth}!`);
        }

        renderPeriodDropdown();

        if (currentScheme === 'monthly') {
          await fetchFilings(currentMonth);
        } else if (currentScheme === 'qrmp') {
          await fetchQrmpFilings(currentQrmpQuarter);
        } else if (currentScheme === 'composition') {
          await fetchCompositionFilings(currentCompositionQuarter);
        }
      }
    } catch (err) {
      showToast('Error updating working month: ' + err.message);
    }
  }

  async function setJanuaryPeriod(enteredJan, monthName) {
    if (enteredJan) {
      await setWorkingMonth(monthName || 'JAN 2027');
    } else {
      await setWorkingMonth(monthName || 'NOV 2026');
    }
  }

  // --- MONTHLY API CALLS & RENDERING (Preserved) ---
  async function fetchMonths() {
    try {
      const data = await apiFetch('/api/months');
      monthsList = data.months || [];
      if (currentScheme === 'monthly') renderPeriodDropdown();
    } catch (err) {
      showToast('Error loading months: ' + err.message);
    }
  }

  async function fetchFilings(month) {
    try {
      const data = await apiFetch(`/api/filings/${encodeURIComponent(month)}`);
      allFilings = data.filings || [];
      selectedIds.clear();
      updateBulkBar();
      applyFiltersAndRender();
      updateKpis();
      return data;
    } catch (err) {
      showToast('Error loading filings: ' + err.message);
      return null;
    }
  }

  async function updateFiling(clientId, updates) {
    try {
      const data = await apiFetch(`/api/filings/${encodeURIComponent(currentMonth)}/${encodeURIComponent(clientId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (data.success) {
        const item = allFilings.find(f => f.id === clientId);
        if (item) {
          Object.assign(item, updates);
        }
        updateKpis();
        return true;
      }
    } catch (err) {
      showToast('Failed to save update: ' + err.message);
    }
    return false;
  }

  function updateKpis() {
    const total = allFilings.length;
    let rent = 0;
    let itc = 0;
    let own = 0;
    let totalRentAmount = 0;
    let g1 = 0;
    let g3b = 0;

    allFilings.forEach(f => {
      if (f.rent === 'Rent') {
        rent++;
        if (f.rentAmount) {
          const num = parseFloat(String(f.rentAmount).replace(/[^0-9.]/g, ''));
          if (!isNaN(num)) totalRentAmount += num;
        }
      } else if (f.rent === 'ITC') {
        itc++;
      } else if (f.rent === 'Own') {
        own++;
      }

      if (f.gstr1 === 'Filed') g1++;
      if (f.gstr3b === 'Filed') g3b++;
    });

    if (kpiTotalClients) kpiTotalClients.textContent = total;
    if (kpiRentCount) kpiRentCount.textContent = rent;
    if (kpiTotalRentAmount) {
      kpiTotalRentAmount.textContent = totalRentAmount > 0 
        ? `Total Rent: ₹${totalRentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : 'Total Rent: ₹0.00';
    }
    if (kpiItcCount) kpiItcCount.textContent = itc;
    if (kpiOwnCount) kpiOwnCount.textContent = own;

    if (kpiG1Filed) kpiG1Filed.textContent = `${g1} / ${total}`;
    if (kpiG3bFiled) kpiG3bFiled.textContent = `${g3b} / ${total}`;

    const g1Pct = total > 0 ? Math.round((g1 / total) * 100) : 0;
    const g3bPct = total > 0 ? Math.round((g3b / total) * 100) : 0;

    progG1.style.width = g1Pct + '%';
    progG3b.style.width = g3bPct + '%';

    const activeM = monthsList.find(m => m.name === currentMonth);
    if (activeM) {
      kpiG1Due.textContent = `Due Date: ${activeM.g1Due || '11th'}`;
      kpiG3bDue.textContent = `Due Date: ${activeM.g3bDue || '20th'}`;
    }
  }

  function applyFiltersAndRender() {
    filteredFilings = allFilings.filter(f => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = (f.name || '').toLowerCase().includes(q);
        const matchUser = (f.user || '').toLowerCase().includes(q);
        const matchGst = (f.gst || '').toLowerCase().includes(q);
        const matchRem = (f.remarks || '').toLowerCase().includes(q);
        const matchAmt = (f.rentAmount || '').toString().toLowerCase().includes(q);
        const matchTax = (f.taxableAmount || '').toString().toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchGst && !matchRem && !matchAmt && !matchTax) return false;
      }

      if (currentRentFilter === 'UNASSIGNED') {
        if (f.rent) return false;
      } else if (currentRentFilter !== 'ALL') {
        if (f.rent !== currentRentFilter) return false;
      }

      if (currentStatusFilter === 'PENDING') {
        if (f.gstr1 === 'Filed' && f.gstr3b === 'Filed') return false;
      } else if (currentStatusFilter === 'FILED') {
        if (f.gstr1 !== 'Filed' || f.gstr3b !== 'Filed') return false;
      }

      return true;
    });

    renderTable();
  }

  function renderMonthlyCardHtml(item) {
    const isG1Filed = item.gstr1 === 'Filed';
    const isG3bFiled = item.gstr3b === 'Filed';

    return `
      <div class="mobile-shop-card ${selectedIds.has(item.id) ? 'selected' : ''}" data-id="${item.id}">
        <div class="m-card-header">
          <div class="m-card-title-wrap">
            <span class="m-card-sno">#${item.sno}</span>
            <h4 class="m-card-shop-name" data-action="editShopName" data-id="${item.id}" title="Tap to edit details">
              ${escapeHtml(item.name)}
            </h4>
          </div>
          <div class="m-card-top-actions">
            <button class="m-btn-icon" data-action="editShopName" data-id="${item.id}" title="Edit Shop Details">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="m-btn-icon m-btn-delete" data-action="deleteShop" data-id="${item.id}" data-name="${escapeHtml(item.name)}" title="Delete Shop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <div class="m-card-creds">
          <div class="m-cred-row">
            <div class="m-cred-item">
              <span class="m-cred-label">USER</span>
              <div class="m-cred-val-wrap">
                <span class="m-cred-val">${escapeHtml(item.user || '-')}</span>
                ${item.user ? `<button class="btn-copy-pill" data-copy="${escapeHtml(item.user)}" title="Copy User Name"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>` : ''}
              </div>
            </div>
            <div class="m-cred-item">
              <span class="m-cred-label">GSTIN</span>
              <div class="m-cred-val-wrap">
                <span class="m-cred-val font-mono">${escapeHtml(item.gst || '-')}</span>
                ${item.gst ? `<button class="btn-copy-pill" data-copy="${escapeHtml(item.gst)}" title="Copy GSTIN"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>` : ''}
              </div>
            </div>
          </div>
          ${item.user ? `
            <button class="m-portal-launch-btn" data-action="openGstLogin" data-user="${escapeHtml(item.user)}" data-name="${escapeHtml(item.name)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>GST Portal Login · Copies "${escapeHtml(item.user)}"</span>
            </button>
          ` : ''}
        </div>

        <div class="m-card-filings">
          <div class="m-filing-slot">
            <div class="m-filing-label">GSTR-1</div>
            <button class="status-btn m-status-btn status-${item.gstr1}" data-action="clickG1" data-id="${item.id}" title="${isG1Filed ? 'Click to edit filing date or revert' : 'Click to enter filing date and mark Filed'}">
              <span>${isG1Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isG1Filed && item.gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr1Date)}</span>` : ''}
            ${item.gstr1Arn ? `<span class="arn-tag">ARN: ${escapeHtml(item.gstr1Arn)}</span>` : ''}
          </div>

          <div class="m-filing-slot">
            <div class="m-filing-label">GSTR-3B</div>
            ${isG1Filed ? `
              <button class="status-btn m-status-btn status-${item.gstr3b}" data-action="clickG3b" data-id="${item.id}" title="${isG3bFiled ? 'Click to edit filing date or revert' : 'Click to enter filing date and mark Filed'}">
                <span>${isG3bFiled ? '✓ Filed' : 'Pending'}</span>
              </button>
              ${isG3bFiled && item.gstr3bDate ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr3bDate)}</span>` : ''}
              ${item.gstr3bArn ? `<span class="arn-tag">ARN: ${escapeHtml(item.gstr3bArn)}</span>` : ''}
            ` : `
              <button class="status-btn m-status-btn status-locked" data-action="lockedG3b" data-id="${item.id}" title="Cannot file GSTR-3B: GSTR-1 must be filed first!">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pending</span>
              </button>
              <span class="lock-hint-badge">G1 Required</span>
            `}
          </div>
        </div>

        <div class="m-card-inputs">
          <div class="m-input-group">
            <label class="m-input-label">Taxable Amount (₹)</label>
            <div class="tax-input-cell">
              <span class="tax-currency-symbol">₹</span>
              <input type="text" 
                     class="taxable-amount-input" 
                     data-id="${item.id}" 
                     value="${item.taxableAmount ? formatAmount2Dec(item.taxableAmount) : ''}" 
                     placeholder="0.00" 
                     inputmode="decimal" 
                     autocomplete="off"
                     title="Enter Taxable Amount (e.g. 128.00, 874.56)">
            </div>
          </div>
          <div class="m-input-group">
            <label class="m-input-label">Remarks</label>
            <input type="text" 
                   class="remarks-input" 
                   data-id="${item.id}" 
                   value="${escapeHtml(item.remarks || '')}" 
                   placeholder="Add notes...">
          </div>
        </div>
      </div>
    `;
  }

  function renderTable() {
    tableBody.innerHTML = '';
    if (monthlyCardsContainer) monthlyCardsContainer.innerHTML = '';

    if (filteredFilings.length === 0) {
      noResults.style.display = 'block';
      selectAllCheckbox.checked = false;
      return;
    }
    noResults.style.display = 'none';

    let cardsHtml = '';
    filteredFilings.forEach(item => {
      const tr = document.createElement('tr');
      if (selectedIds.has(item.id)) tr.classList.add('selected');

      const isChecked = selectedIds.has(item.id) ? 'checked' : '';
      const isG1Filed = item.gstr1 === 'Filed';
      const isG3bFiled = item.gstr3b === 'Filed';

      tr.innerHTML = `
        <td><input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isChecked}></td>
        <td class="sno-cell">${item.sno}</td>
        <td>
          <div class="shop-name-cell" data-action="editShopName" data-id="${item.id}" title="Click to edit Company / Shop Name">${escapeHtml(item.name)}</div>
        </td>
        <td>
          <div class="rent-cell-static" data-action="editShopName" data-id="${item.id}" title="Click to edit Rent Option & Amount" style="cursor: pointer;">
            <span class="rent-badge rent-badge-${item.rent || 'Rent'}">${escapeHtml(item.rent || 'Rent')}</span>
            ${item.rent === 'Rent' ? `
              <div class="rent-amount-display-tag" title="Monthly Rent Amount (Click to edit)">
                <span class="rent-curr-symbol">₹</span>
                <span class="rent-curr-val">${escapeHtml(formatNumber(item.rentAmount || item.suggestedRentAmount || '0'))}</span>
              </div>
            ` : ''}
          </div>
        </td>
        <td>
          <div class="copy-wrapper">
            <span class="copy-text">${escapeHtml(item.user || '-')}</span>
            ${item.user ? `<button class="btn-copy" data-copy="${escapeHtml(item.user)}" title="Copy User Name"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>` : ''}
          </div>
        </td>
        <td>
          <div class="gstin-row">
            <span class="copy-text">${escapeHtml(item.gst || '-')}</span>
            ${item.gst ? `
              <button class="btn-copy" data-copy="${escapeHtml(item.gst)}" title="Copy GSTIN">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            ` : ''}
            ${item.user ? `
              <button class="btn-portal-icon" data-action="openGstLogin" data-user="${escapeHtml(item.user)}" data-name="${escapeHtml(item.name)}" title="Open GST Portal Login & Copy Username (${escapeHtml(item.user)})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
            ` : ''}
          </div>
        </td>
        <td>
          <div class="status-cell-wrapper">
            <button class="status-btn status-${item.gstr1}" data-action="clickG1" data-id="${item.id}" title="${isG1Filed ? 'Click to edit filing date or revert' : 'Click to enter filing date and mark Filed'}">
              <span>${isG1Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isG1Filed && item.gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr1Date)}</span>` : ''}
            ${item.gstr1Arn ? `<span class="arn-tag">ARN: ${escapeHtml(item.gstr1Arn)}</span>` : ''}
          </div>
        </td>
        <td>
          <div class="status-cell-wrapper">
            ${isG1Filed ? `
              <button class="status-btn status-${item.gstr3b}" data-action="clickG3b" data-id="${item.id}" title="${isG3bFiled ? 'Click to edit filing date or revert' : 'Click to enter filing date and mark Filed'}">
                <span>${isG3bFiled ? '✓ Filed' : 'Pending'}</span>
              </button>
              ${isG3bFiled && item.gstr3bDate ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr3bDate)}</span>` : ''}
              ${item.gstr3bArn ? `<span class="arn-tag">ARN: ${escapeHtml(item.gstr3bArn)}</span>` : ''}
            ` : `
              <button class="status-btn status-locked" data-action="lockedG3b" data-id="${item.id}" title="Cannot file GSTR-3B: GSTR-1 must be filed first!">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pending</span>
              </button>
            `}
          </div>
        </td>
        <td>
          <div class="tax-input-cell">
            <span class="tax-currency-symbol">₹</span>
            <input type="text" 
                   class="taxable-amount-input" 
                   data-id="${item.id}" 
                   value="${item.taxableAmount ? formatAmount2Dec(item.taxableAmount) : ''}" 
                   placeholder="0.00" 
                   inputmode="decimal" 
                   autocomplete="off"
                   title="Enter Taxable Amount (e.g. 128.00, 874.56)">
          </div>
        </td>
        <td>
          <input type="text" class="remarks-input" data-id="${item.id}" value="${escapeHtml(item.remarks || '')}" placeholder="Add notes...">
        </td>
        <td style="text-align: center;">
          <div class="actions-cell">
            <button class="btn-edit-name" data-action="editShopName" data-id="${item.id}" title="Edit Company / Shop Details">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>Edit</span>
            </button>
            <button class="btn-delete-shop" data-action="deleteShop" data-id="${item.id}" data-name="${escapeHtml(item.name)}" title="Delete Shop">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              <span>Delete</span>
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
      cardsHtml += renderMonthlyCardHtml(item);
    });

    if (monthlyCardsContainer) {
      monthlyCardsContainer.innerHTML = cardsHtml;
    }

    updateSelectAllCheckbox();
  }

  // --- QRMP API & RENDERING ---
  async function fetchQrmpQuarters() {
    try {
      const data = await apiFetch('/api/qrmp/quarters');
      qrmpQuartersList = data.quarters || [];
      if (!qrmpQuartersList.some(q => q.name === currentQrmpQuarter) && qrmpQuartersList.length > 0) {
        const defQ = qrmpQuartersList.find(q => q.name.includes('OCT - DEC') || q.name.includes('Q4'));
        currentQrmpQuarter = defQ ? defQ.name : qrmpQuartersList[0].name;
      }
      if (currentScheme === 'qrmp') renderPeriodDropdown();
      return qrmpQuartersList;
    } catch (err) {
      showToast('Error loading QRMP quarters: ' + err.message);
      return [];
    }
  }

  async function fetchQrmpFilings(quarter) {
    try {
      const data = await apiFetch(`/api/qrmp/filings/${encodeURIComponent(quarter)}`);
      allQrmpFilings = data.filings || [];
      currentQrmpQuarterInfo = data.quarterInfo || null;
      qrmpSelectedIds.clear();
      applyQrmpFiltersAndRender();
      updateQrmpKpis();
      return data;
    } catch (err) {
      showToast('Error loading QRMP filings: ' + err.message);
      return null;
    }
  }

  async function updateQrmpFiling(clientId, updates) {
    try {
      const data = await apiFetch(`/api/qrmp/filings/${encodeURIComponent(currentQrmpQuarter)}/${encodeURIComponent(clientId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (data && data.success) {
        const item = allQrmpFilings.find(f => f.id === clientId);
        if (item) {
          Object.assign(item, updates);
          // If M3 GSTR-1 became Pending, reset GSTR-3B in local state too
          if (updates.m3Gstr1 === 'Pending') {
            item.gstr3b = 'Pending';
            item.gstr3bDate = '';
            item.gstr3bArn = '';
          }
        }
        applyQrmpFiltersAndRender();
        updateQrmpKpis();
        return true;
      } else {
        showToast('Error: ' + (data.error || 'Failed to update'));
      }
    } catch (err) {
      showToast('Failed to save update: ' + err.message);
    }
    return false;
  }

  function updateQrmpKpis() {
    const total = allQrmpFilings.length;
    let m1 = 0, m2 = 0, m3 = 0, g3b = 0;
    let totalTax = 0, taxCount = 0;

    allQrmpFilings.forEach(f => {
      if (f.m1Gstr1 === 'Filed') m1++;
      if (f.m2Gstr1 === 'Filed') m2++;
      if (f.m3Gstr1 === 'Filed') m3++;
      if (f.gstr3b === 'Filed') g3b++;
      if (f.taxableAmount) {
        const num = parseFloat(f.taxableAmount.toString().replace(/[^0-9.]/g, ''));
        if (!isNaN(num) && num > 0) {
          totalTax += num;
          taxCount++;
        }
      }
    });

    kpiQrmpTotal.textContent = total;
    kpiQrmpM1Filed.textContent = `${m1} / ${total}`;
    kpiQrmpM2Filed.textContent = `${m2} / ${total}`;
    kpiQrmpM3Filed.textContent = `${m3} / ${total}`;
    kpiQrmpG3bFiled.textContent = `${g3b} / ${total}`;

    progQrmpM1.style.width = total > 0 ? `${Math.round((m1 / total) * 100)}%` : '0%';
    progQrmpM2.style.width = total > 0 ? `${Math.round((m2 / total) * 100)}%` : '0%';
    progQrmpM3.style.width = total > 0 ? `${Math.round((m3 / total) * 100)}%` : '0%';
    progQrmpG3b.style.width = total > 0 ? `${Math.round((g3b / total) * 100)}%` : '0%';

    kpiQrmpTaxCount.textContent = taxCount;
    kpiQrmpTotalTax.textContent = totalTax > 0 ? `Total: ₹${totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Total: ₹0.00';

    if (currentQrmpQuarterInfo) {
      kpiQrmpM1Title.textContent = `M1 GSTR-1 (${currentQrmpQuarterInfo.m1.split(' ')[0]})`;
      kpiQrmpM2Title.textContent = `M2 GSTR-1 (${currentQrmpQuarterInfo.m2.split(' ')[0]})`;
      kpiQrmpM3Title.textContent = `★ M3 GSTR-1 (${currentQrmpQuarterInfo.m3.split(' ')[0]})`;

      kpiQrmpM1Due.textContent = `Due Date: ${currentQrmpQuarterInfo.m1Due || '13th'} (Optional IFF)`;
      kpiQrmpM2Due.textContent = `Due Date: ${currentQrmpQuarterInfo.m2Due || '13th'} (Optional IFF)`;
      kpiQrmpM3Due.textContent = `Due Date: ${currentQrmpQuarterInfo.m3Due || '13th'} (COMPULSORY)`;
      kpiQrmpG3bDue.textContent = `Due Date: ${currentQrmpQuarterInfo.g3bDue || '22nd/24th'} (Locked until M3)`;

      thQrmpM1.textContent = `${currentQrmpQuarterInfo.m1.split(' ')[0]} (M1) G1`;
      thQrmpM2.textContent = `${currentQrmpQuarterInfo.m2.split(' ')[0]} (M2) G1`;
      thQrmpM3.innerHTML = `${currentQrmpQuarterInfo.m3.split(' ')[0]} (M3) G1 <span class="tag-req">REQ</span>`;
    }
  }

  function applyQrmpFiltersAndRender() {
    filteredQrmpFilings = allQrmpFilings.filter(f => {
      if (qrmpSearchQuery) {
        const q = qrmpSearchQuery.toLowerCase();
        const matchName = (f.name || '').toLowerCase().includes(q);
        const matchUser = (f.user || '').toLowerCase().includes(q);
        const matchGst = (f.gst || '').toLowerCase().includes(q);
        const matchRem = (f.remarks || '').toLowerCase().includes(q);
        const matchAmt = (f.taxableAmount || '').toString().toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchGst && !matchRem && !matchAmt) return false;
      }
      if (qrmpRentFilter !== 'ALL') {
        const itemRent = f.rent || 'Rent';
        if (itemRent !== qrmpRentFilter) return false;
      }
      if (qrmpStatusFilter === 'PENDING') {
        if (f.gstr3b === 'Filed') return false;
      } else if (qrmpStatusFilter === 'FILED') {
        if (f.gstr3b !== 'Filed') return false;
      }
      return true;
    });
    renderQrmpTable();
  }

  function renderQrmpCardHtml(item) {
    const isM1Filed = item.m1Gstr1 === 'Filed';
    const isM2Filed = item.m2Gstr1 === 'Filed';
    const isM3Filed = item.m3Gstr1 === 'Filed';
    const isG3bFiled = item.gstr3b === 'Filed';

    return `
      <div class="mobile-shop-card ${qrmpSelectedIds.has(item.id) ? 'selected' : ''}" data-id="${item.id}">
        <div class="m-card-header">
          <div class="m-card-title-wrap">
            <span class="m-card-sno">#${item.sno}</span>
            <h4 class="m-card-shop-name" data-action="editQrmpShop" data-id="${item.id}" title="Tap to edit QRMP Company">
              ${escapeHtml(item.name)}
            </h4>
          </div>
          <div class="m-card-top-actions">
            <span class="rent-badge rent-badge-${item.rent || 'Rent'}" data-action="editQrmpShop" data-id="${item.id}">
              ${escapeHtml(item.rent || 'Rent')}
              ${item.rent === 'Rent' && item.rentAmount ? ` · ₹${escapeHtml(formatNumber(item.rentAmount))}` : ''}
            </span>
            <button class="m-btn-icon" data-action="editQrmpShop" data-id="${item.id}" title="Edit QRMP Company">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="m-btn-icon m-btn-delete" data-action="deleteQrmpShop" data-id="${item.id}" data-name="${escapeHtml(item.name)}" title="Delete QRMP Company">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <div class="m-card-creds">
          <div class="m-cred-row">
            <div class="m-cred-item">
              <span class="m-cred-label">USER</span>
              <div class="m-cred-val-wrap">
                <span class="m-cred-val">${escapeHtml(item.user || '-')}</span>
                ${item.user ? `<button class="btn-copy-pill" data-copy="${escapeHtml(item.user)}" title="Copy User Name"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>` : ''}
              </div>
            </div>
            <div class="m-cred-item">
              <span class="m-cred-label">GSTIN</span>
              <div class="m-cred-val-wrap">
                <span class="m-cred-val font-mono">${escapeHtml(item.gst || '-')}</span>
                ${item.gst ? `<button class="btn-copy-pill" data-copy="${escapeHtml(item.gst)}" title="Copy GSTIN"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>` : ''}
              </div>
            </div>
          </div>
          ${item.user ? `
            <button class="m-portal-launch-btn" data-action="openGstLogin" data-user="${escapeHtml(item.user)}" data-name="${escapeHtml(item.name)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>GST Portal Login · Copies "${escapeHtml(item.user)}"</span>
            </button>
          ` : ''}
        </div>

        <div class="m-card-filings m-filings-qrmp">
          <div class="m-filing-slot">
            <div class="m-filing-label">M1 G1 (IFF)</div>
            <button class="status-btn m-status-btn status-${item.m1Gstr1}" data-action="clickQrmpM1" data-id="${item.id}">
              <span>${isM1Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isM1Filed && item.m1Gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.m1Gstr1Date)}</span>` : ''}
          </div>

          <div class="m-filing-slot">
            <div class="m-filing-label">M2 G1 (IFF)</div>
            <button class="status-btn m-status-btn status-${item.m2Gstr1}" data-action="clickQrmpM2" data-id="${item.id}">
              <span>${isM2Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isM2Filed && item.m2Gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.m2Gstr1Date)}</span>` : ''}
          </div>

          <div class="m-filing-slot m-slot-compulsory">
            <div class="m-filing-label text-amber-700 font-bold">★ M3 G1 (REQ)</div>
            <button class="status-btn m-status-btn status-${item.m3Gstr1}" data-action="clickQrmpM3" data-id="${item.id}" style="${isM3Filed ? '' : 'border-color: #f59e0b; color: #b45309;'}">
              <span>${isM3Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isM3Filed && item.m3Gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.m3Gstr1Date)}</span>` : ''}
          </div>

          <div class="m-filing-slot">
            <div class="m-filing-label">GSTR-3B (Quarterly)</div>
            ${isM3Filed ? `
              <button class="status-btn m-status-btn status-${item.gstr3b}" data-action="clickQrmpG3b" data-id="${item.id}">
                <span>${isG3bFiled ? '✓ Filed' : 'Pending'}</span>
              </button>
              ${isG3bFiled && item.gstr3bDate ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr3bDate)}</span>` : ''}
            ` : `
              <button class="status-btn m-status-btn status-locked" data-action="lockedQrmpG3b" data-id="${item.id}">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pending</span>
              </button>
              <span class="lock-hint-badge">M3 Required</span>
            `}
          </div>
        </div>

        <div class="m-card-inputs">
          <div class="m-input-group">
            <label class="m-input-label">Taxable Amount (₹)</label>
            <div class="tax-input-cell">
              <span class="tax-currency-symbol">₹</span>
              <input type="text" 
                     class="taxable-amount-input qrmp-taxable-amount-input" 
                     data-id="${item.id}" 
                     value="${item.taxableAmount ? formatAmount2Dec(item.taxableAmount) : ''}" 
                     placeholder="0.00" 
                     inputmode="decimal" 
                     autocomplete="off"
                     title="Enter Taxable Amount (e.g. 128.00, 874.56)">
            </div>
          </div>
          <div class="m-input-group">
            <label class="m-input-label">Remarks</label>
            <input type="text" 
                   class="qrmp-remarks-input" 
                   data-id="${item.id}" 
                   value="${escapeHtml(item.remarks || '')}" 
                   placeholder="Add notes...">
          </div>
        </div>
      </div>
    `;
  }

  function renderQrmpTable() {
    qrmpTableBody.innerHTML = '';
    if (qrmpCardsContainer) qrmpCardsContainer.innerHTML = '';

    if (filteredQrmpFilings.length === 0) {
      qrmpNoResults.style.display = 'block';
      qrmpSelectAllCheckbox.checked = false;
      return;
    }
    qrmpNoResults.style.display = 'none';

    let cardsHtml = '';
    filteredQrmpFilings.forEach(item => {
      const tr = document.createElement('tr');
      if (qrmpSelectedIds.has(item.id)) tr.classList.add('selected');

      const isChecked = qrmpSelectedIds.has(item.id) ? 'checked' : '';
      const isM1Filed = item.m1Gstr1 === 'Filed';
      const isM2Filed = item.m2Gstr1 === 'Filed';
      const isM3Filed = item.m3Gstr1 === 'Filed';
      const isG3bFiled = item.gstr3b === 'Filed';

      tr.innerHTML = `
        <td><input type="checkbox" class="qrmp-row-checkbox" data-id="${item.id}" ${isChecked}></td>
        <td class="sno-cell">${item.sno}</td>
        <td>
          <div class="shop-name-cell" data-action="editQrmpShop" data-id="${item.id}" title="Click to edit QRMP Company Name">${escapeHtml(item.name)}</div>
        </td>
        <td>
          <div class="rent-cell-static" data-action="editQrmpShop" data-id="${item.id}" title="Click to edit QRMP Rent Option & Amount" style="cursor: pointer;">
            <span class="rent-badge rent-badge-${item.rent || 'Rent'}">${escapeHtml(item.rent || 'Rent')}</span>
            ${item.rent === 'Rent' ? `
              <div class="rent-amount-display-tag" title="Monthly Rent Amount (Click to edit)">
                <span class="rent-curr-symbol">₹</span>
                <span class="rent-curr-val">${escapeHtml(formatNumber(item.rentAmount || '0'))}</span>
              </div>
            ` : ''}
          </div>
        </td>
        <td>
          <div class="copy-wrapper">
            <span class="copy-text">${escapeHtml(item.user || '-')}</span>
            ${item.user ? `<button class="btn-copy" data-copy="${escapeHtml(item.user)}" title="Copy User Name"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>` : ''}
          </div>
        </td>
        <td>
          <div class="gstin-row">
            <span class="copy-text">${escapeHtml(item.gst || '-')}</span>
            ${item.gst ? `
              <button class="btn-copy" data-copy="${escapeHtml(item.gst)}" title="Copy GSTIN">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            ` : ''}
            ${item.user ? `
              <button class="btn-portal-icon" data-action="openGstLogin" data-user="${escapeHtml(item.user)}" data-name="${escapeHtml(item.name)}" title="Open GST Portal Login & Copy Username (${escapeHtml(item.user)})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
            ` : ''}
          </div>
        </td>

        <!-- Month 1 GSTR-1 (IFF/Optional) -->
        <td>
          <div class="status-cell-wrapper">
            <button class="status-btn status-${item.m1Gstr1}" data-action="clickQrmpM1" data-id="${item.id}" title="${isM1Filed ? 'M1 GSTR-1 Filed. Click to edit or revert' : 'Click to record filing date and mark M1 GSTR-1 Filed'}">
              <span>${isM1Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isM1Filed && item.m1Gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.m1Gstr1Date)}</span>` : ''}
            ${item.m1Gstr1Arn ? `<span class="arn-tag">ARN: ${escapeHtml(item.m1Gstr1Arn)}</span>` : ''}
          </div>
        </td>

        <!-- Month 2 GSTR-1 (IFF/Optional) -->
        <td>
          <div class="status-cell-wrapper">
            <button class="status-btn status-${item.m2Gstr1}" data-action="clickQrmpM2" data-id="${item.id}" title="${isM2Filed ? 'M2 GSTR-1 Filed. Click to edit or revert' : 'Click to record filing date and mark M2 GSTR-1 Filed'}">
              <span>${isM2Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isM2Filed && item.m2Gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.m2Gstr1Date)}</span>` : ''}
            ${item.m2Gstr1Arn ? `<span class="arn-tag">ARN: ${escapeHtml(item.m2Gstr1Arn)}</span>` : ''}
          </div>
        </td>

        <!-- Month 3 GSTR-1 (Quarterly / COMPULSORY) -->
        <td>
          <div class="status-cell-wrapper">
            <button class="status-btn status-${item.m3Gstr1}" data-action="clickQrmpM3" data-id="${item.id}" style="${isM3Filed ? '' : 'border-color: #f59e0b; color: #b45309;'}" title="${isM3Filed ? 'Month 3 GSTR-1 Filed (Compulsory fulfilled). Click to edit or revert' : 'COMPULSORY: Must be filed before Quarterly GSTR-3B can be filed!'}">
              <span>${isM3Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isM3Filed && item.m3Gstr1Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.m3Gstr1Date)}</span>` : ''}
            ${item.m3Gstr1Arn ? `<span class="arn-tag">ARN: ${escapeHtml(item.m3Gstr1Arn)}</span>` : ''}
          </div>
        </td>

        <!-- GSTR-3B Quarterly (LOCKED UNTIL M3 GSTR-1 IS FILED!) -->
        <td>
          <div class="status-cell-wrapper">
            ${isM3Filed ? `
              <button class="status-btn status-${item.gstr3b}" data-action="clickQrmpG3b" data-id="${item.id}" title="${isG3bFiled ? 'Quarterly GSTR-3B Filed. Click to edit or revert' : 'Click to record filing date and mark Quarterly GSTR-3B as Filed'}">
                <span>${isG3bFiled ? '✓ Filed' : 'Pending'}</span>
              </button>
              ${isG3bFiled && item.gstr3bDate ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr3bDate)}</span>` : ''}
              ${item.gstr3bArn ? `<span class="arn-tag">ARN: ${escapeHtml(item.gstr3bArn)}</span>` : ''}
            ` : `
              <button class="status-btn status-locked" data-action="lockedQrmpG3b" data-id="${item.id}" title="Cannot file GSTR-3B: Month 3 GSTR-1 must be filed compulsorily first!">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Pending</span>
              </button>
              <span class="lock-hint-badge">M3 GSTR-1 Required</span>
            `}
          </div>
        </td>

        <!-- Taxable Amount -->
        <td>
          <div class="tax-input-cell">
            <span class="tax-currency-symbol">₹</span>
            <input type="text" 
                   class="taxable-amount-input qrmp-taxable-amount-input" 
                   data-id="${item.id}" 
                   value="${item.taxableAmount ? formatAmount2Dec(item.taxableAmount) : ''}" 
                   placeholder="0.00" 
                   inputmode="decimal" 
                   autocomplete="off"
                   title="Enter Taxable Amount (e.g. 128.00, 874.56)">
          </div>
        </td>

        <!-- Remarks -->
        <td>
          <input type="text" class="qrmp-remarks-input" data-id="${item.id}" value="${escapeHtml(item.remarks || '')}" placeholder="Add notes...">
        </td>

        <!-- Actions (Edit, Delete) -->
        <td style="text-align: center;">
          <div class="actions-cell">
            <button class="btn-edit-name" data-action="editQrmpShop" data-id="${item.id}" title="Edit QRMP Company Details">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>Edit</span>
            </button>
            <button class="btn-delete-shop" data-action="deleteQrmpShop" data-id="${item.id}" data-name="${escapeHtml(item.name)}" title="Delete QRMP Company">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              <span>Delete</span>
            </button>
          </div>
        </td>
      `;

      qrmpTableBody.appendChild(tr);
      cardsHtml += renderQrmpCardHtml(item);
    });

    if (qrmpCardsContainer) {
      qrmpCardsContainer.innerHTML = cardsHtml;
    }
  }

  async function deleteQrmpShop(clientId, shopName) {
    try {
      const data = await apiFetch(`/api/qrmp/clients/${encodeURIComponent(clientId)}`, { method: 'DELETE' });
      if (data && data.success) {
        allQrmpFilings = allQrmpFilings.filter(f => f.id !== clientId);
        allQrmpFilings.forEach((f, idx) => { f.sno = idx + 1; });
        qrmpSelectedIds.delete(clientId);
        applyQrmpFiltersAndRender();
        updateQrmpKpis();
        showToast(`✓ Shop "${shopName}" deleted successfully from QRMP`);
      } else {
        showToast('Error: ' + (data.error || 'Failed to delete'));
      }
    } catch (err) {
      showToast('Failed to delete: ' + err.message);
    }
  }

  // --- COMPOSITION API & RENDERING ---
  async function fetchCompositionQuarters() {
    try {
      const data = await apiFetch('/api/composition/quarters');
      compositionQuartersList = data.quarters || [];
      if (currentScheme === 'composition') renderPeriodDropdown();
    } catch (err) {
      showToast('Error loading Composition quarters: ' + err.message);
    }
  }

  async function fetchCompositionFilings(quarter) {
    try {
      const data = await apiFetch(`/api/composition/filings/${encodeURIComponent(quarter)}`);
      allCompositionFilings = data.filings || [];
      currentCompositionQuarterInfo = data.quarterInfo || null;
      compositionSelectedIds.clear();
      applyCompositionFiltersAndRender();
      updateCompositionKpis();
    } catch (err) {
      showToast('Error loading Composition filings: ' + err.message);
    }
  }

  async function updateCompositionFiling(clientId, updates) {
    try {
      const data = await apiFetch(`/api/composition/filings/${encodeURIComponent(currentCompositionQuarter)}/${encodeURIComponent(clientId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (data && data.success) {
        const item = allCompositionFilings.find(f => f.id === clientId);
        if (item) {
          Object.assign(item, updates);
        }
        applyCompositionFiltersAndRender();
        updateCompositionKpis();
        return true;
      }
    } catch (err) {
      showToast('Failed to save update: ' + err.message);
    }
    return false;
  }

  function updateCompositionKpis() {
    const total = allCompositionFilings.length;
    let cmp08 = 0, g4 = 0;
    let totalTurnover = 0, turnoverCount = 0;
    let totalTax = 0, taxCount = 0;

    allCompositionFilings.forEach(f => {
      if (f.cmp08 === 'Filed') cmp08++;
      if (f.gstr4 === 'Filed') g4++;
      if (f.taxableTurnover) {
        const num = parseFloat(f.taxableTurnover.toString().replace(/[^0-9.]/g, ''));
        if (!isNaN(num) && num > 0) {
          totalTurnover += num;
          turnoverCount++;
        }
      }
      if (f.taxAmount) {
        const num = parseFloat(f.taxAmount.toString().replace(/[^0-9.]/g, ''));
        if (!isNaN(num) && num > 0) {
          totalTax += num;
          taxCount++;
        }
      }
    });

    kpiCompTotal.textContent = total;
    kpiComp08Filed.textContent = `${cmp08} / ${total}`;
    kpiCompG4Filed.textContent = `${g4} / ${total}`;

    progComp08.style.width = total > 0 ? `${Math.round((cmp08 / total) * 100)}%` : '0%';
    progCompG4.style.width = total > 0 ? `${Math.round((g4 / total) * 100)}%` : '0%';

    kpiCompTurnoverCount.textContent = turnoverCount;
    kpiCompTotalTurnover.textContent = totalTurnover > 0 ? `Turnover: ₹${totalTurnover.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Turnover: ₹0.00';

    kpiCompTaxCount.textContent = taxCount;
    kpiCompTotalTax.textContent = totalTax > 0 ? `Tax: ₹${totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Tax: ₹0.00';

    if (currentCompositionQuarterInfo) {
      kpiComp08Due.textContent = `Due Date: ${currentCompositionQuarterInfo.cmp08Due || '18th of Next Month'}`;
      kpiCompG4Due.textContent = `Due Date: ${currentCompositionQuarterInfo.gstr4Due || '30th April'}`;
    }
  }

  function applyCompositionFiltersAndRender() {
    filteredCompositionFilings = allCompositionFilings.filter(f => {
      if (compositionSearchQuery) {
        const q = compositionSearchQuery.toLowerCase();
        const matchName = (f.name || '').toLowerCase().includes(q);
        const matchUser = (f.user || '').toLowerCase().includes(q);
        const matchGst = (f.gst || '').toLowerCase().includes(q);
        const matchRem = (f.remarks || '').toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchGst && !matchRem) return false;
      }
      if (compositionStatusFilter === 'PENDING') {
        if (f.cmp08 === 'Filed') return false;
      } else if (compositionStatusFilter === 'FILED') {
        if (f.cmp08 !== 'Filed') return false;
      }
      return true;
    });
    renderCompositionTable();
  }

  function renderCompCardHtml(item) {
    const isCmp08Filed = item.cmp08 === 'Filed';
    const isG4Filed = item.gstr4 === 'Filed';

    return `
      <div class="mobile-shop-card ${compositionSelectedIds.has(item.id) ? 'selected' : ''}" data-id="${item.id}">
        <div class="m-card-header">
          <div class="m-card-title-wrap">
            <span class="m-card-sno">#${item.sno}</span>
            <h4 class="m-card-shop-name" data-action="editCompShop" data-id="${item.id}" title="Tap to edit Composition Shop">
              ${escapeHtml(item.name)}
            </h4>
          </div>
          <div class="m-card-top-actions">
            <span class="category-badge">${escapeHtml(item.category || 'Trader')} (${escapeHtml(item.taxRate || '1%')})</span>
            <button class="m-btn-icon" data-action="editCompShop" data-id="${item.id}" title="Edit Composition Shop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="m-btn-icon m-btn-delete" data-action="deleteCompShop" data-id="${item.id}" data-name="${escapeHtml(item.name)}" title="Delete Composition Shop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <div class="m-card-creds">
          <div class="m-cred-row">
            <div class="m-cred-item">
              <span class="m-cred-label">USER</span>
              <div class="m-cred-val-wrap">
                <span class="m-cred-val">${escapeHtml(item.user || '-')}</span>
                ${item.user ? `<button class="btn-copy-pill" data-copy="${escapeHtml(item.user)}" title="Copy User Name"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>` : ''}
              </div>
            </div>
            <div class="m-cred-item">
              <span class="m-cred-label">GSTIN</span>
              <div class="m-cred-val-wrap">
                <span class="m-cred-val font-mono">${escapeHtml(item.gst || '-')}</span>
                ${item.gst ? `<button class="btn-copy-pill" data-copy="${escapeHtml(item.gst)}" title="Copy GSTIN"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>` : ''}
              </div>
            </div>
          </div>
          ${item.user ? `
            <button class="m-portal-launch-btn" data-action="openGstLogin" data-user="${escapeHtml(item.user)}" data-name="${escapeHtml(item.name)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>GST Portal Login · Copies "${escapeHtml(item.user)}"</span>
            </button>
          ` : ''}
        </div>

        <div class="m-card-filings">
          <div class="m-filing-slot">
            <div class="m-filing-label">CMP-08 (Quarterly)</div>
            <button class="status-btn m-status-btn status-${item.cmp08}" data-action="clickCmp08" data-id="${item.id}">
              <span>${isCmp08Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isCmp08Filed && item.cmp08Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.cmp08Date)}</span>` : ''}
          </div>

          <div class="m-filing-slot">
            <div class="m-filing-label">GSTR-4 (Annual)</div>
            <button class="status-btn m-status-btn status-${item.gstr4}" data-action="clickGstr4" data-id="${item.id}">
              <span>${isG4Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isG4Filed && item.gstr4Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr4Date)}</span>` : ''}
          </div>
        </div>

        <div class="m-card-inputs m-inputs-comp">
          <div class="m-input-group">
            <label class="m-input-label">Taxable Turnover (₹)</label>
            <div class="tax-input-cell">
              <span class="tax-currency-symbol">₹</span>
              <input type="text" 
                     class="taxable-amount-input comp-turnover-input" 
                     data-id="${item.id}" 
                     value="${item.taxableTurnover ? formatAmount2Dec(item.taxableTurnover) : ''}" 
                     placeholder="0.00" 
                     inputmode="decimal" 
                     autocomplete="off"
                     title="Enter Taxable Turnover (e.g. 128.00, 874.56)">
            </div>
          </div>
          <div class="m-input-group">
            <label class="m-input-label">Tax Amount (₹)</label>
            <div class="tax-input-cell">
              <span class="tax-currency-symbol">₹</span>
              <input type="text" 
                     class="taxable-amount-input comp-tax-input" 
                     data-id="${item.id}" 
                     value="${item.taxAmount ? formatAmount2Dec(item.taxAmount) : ''}" 
                     placeholder="0.00" 
                     inputmode="decimal" 
                     autocomplete="off"
                     title="Enter Tax Amount (e.g. 128.00, 874.56)">
            </div>
          </div>
          <div class="m-input-group" style="grid-column: 1 / -1;">
            <label class="m-input-label">Remarks</label>
            <input type="text" 
                   class="comp-remarks-input" 
                   data-id="${item.id}" 
                   value="${escapeHtml(item.remarks || '')}" 
                   placeholder="Add notes...">
          </div>
        </div>
      </div>
    `;
  }

  function renderCompositionTable() {
    compTableBody.innerHTML = '';
    if (compCardsContainer) compCardsContainer.innerHTML = '';

    if (filteredCompositionFilings.length === 0) {
      compNoResults.style.display = 'block';
      compSelectAllCheckbox.checked = false;
      return;
    }
    compNoResults.style.display = 'none';

    let cardsHtml = '';
    filteredCompositionFilings.forEach(item => {
      const tr = document.createElement('tr');
      if (compositionSelectedIds.has(item.id)) tr.classList.add('selected');

      const isChecked = compositionSelectedIds.has(item.id) ? 'checked' : '';
      const isCmp08Filed = item.cmp08 === 'Filed';
      const isG4Filed = item.gstr4 === 'Filed';

      tr.innerHTML = `
        <td><input type="checkbox" class="comp-row-checkbox" data-id="${item.id}" ${isChecked}></td>
        <td class="sno-cell">${item.sno}</td>
        <td>
          <div class="shop-name-cell" data-action="editCompShop" data-id="${item.id}" title="Click to edit Composition Shop Details">${escapeHtml(item.name)}</div>
        </td>
        <td>
          <div class="rent-status-cell">
            ${item.rent ? `<span class="badge rent-badge rent-${(item.rent || '').toLowerCase()}">${escapeHtml(item.rent)}</span>` : '<span class="text-muted">-</span>'}
            ${item.rentAmount ? `<span class="rent-amount-text">₹${formatCurrency2Dec(item.rentAmount)}</span>` : ''}
          </div>
        </td>
        <td>
          <span class="category-badge">${escapeHtml(item.category || 'Trader')} (${escapeHtml(item.taxRate || '1%')})</span>
        </td>
        <td>
          <div class="copy-wrapper">
            <span class="copy-text">${escapeHtml(item.user || '-')}</span>
            ${item.user ? `<button class="btn-copy" data-copy="${escapeHtml(item.user)}" title="Copy User Name"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>` : ''}
          </div>
        </td>
        <td>
          <div class="gstin-row">
            <span class="copy-text">${escapeHtml(item.gst || '-')}</span>
            ${item.gst ? `
              <button class="btn-copy" data-copy="${escapeHtml(item.gst)}" title="Copy GSTIN">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            ` : ''}
            ${item.user ? `
              <button class="btn-portal-icon" data-action="openGstLogin" data-user="${escapeHtml(item.user)}" data-name="${escapeHtml(item.name)}" title="Open GST Portal Login & Copy Username (${escapeHtml(item.user)})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
            ` : ''}
          </div>
        </td>

        <!-- CMP-08 Quarterly Statement -->
        <td>
          <div class="status-cell-wrapper">
            <button class="status-btn status-${item.cmp08}" data-action="clickCmp08" data-id="${item.id}" title="${isCmp08Filed ? 'CMP-08 Filed. Click to edit or revert' : 'Click to record filing date and mark CMP-08 Filed'}">
              <span>${isCmp08Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isCmp08Filed && item.cmp08Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.cmp08Date)}</span>` : ''}
            ${item.cmp08Arn ? `<span class="arn-tag">ARN: ${escapeHtml(item.cmp08Arn)}</span>` : ''}
          </div>
        </td>

        <!-- Taxable Turnover -->
        <td>
          <div class="tax-input-cell">
            <span class="tax-currency-symbol">₹</span>
            <input type="text" 
                   class="taxable-amount-input comp-turnover-input" 
                   data-id="${item.id}" 
                   value="${item.taxableTurnover ? formatAmount2Dec(item.taxableTurnover) : ''}" 
                   placeholder="0.00" 
                   inputmode="decimal" 
                   autocomplete="off"
                   title="Enter Taxable Turnover (e.g. 128.00, 874.56)">
          </div>
        </td>

        <!-- Tax Amount -->
        <td>
          <div class="tax-input-cell">
            <span class="tax-currency-symbol">₹</span>
            <input type="text" 
                   class="taxable-amount-input comp-tax-input" 
                   data-id="${item.id}" 
                   value="${item.taxAmount ? formatAmount2Dec(item.taxAmount) : ''}" 
                   placeholder="0.00" 
                   inputmode="decimal" 
                   autocomplete="off"
                   title="Enter Tax Amount (e.g. 128.00, 874.56)">
          </div>
        </td>

        <!-- GSTR-4 Annual Return -->
        <td>
          <div class="status-cell-wrapper">
            <button class="status-btn status-${item.gstr4}" data-action="clickGstr4" data-id="${item.id}" title="${isG4Filed ? 'GSTR-4 Filed. Click to edit or revert' : 'Click to record filing date and mark GSTR-4 Filed'}">
              <span>${isG4Filed ? '✓ Filed' : 'Pending'}</span>
            </button>
            ${isG4Filed && item.gstr4Date ? `<span class="filing-date-subtext">📅 ${escapeHtml(item.gstr4Date)}</span>` : ''}
            ${item.gstr4Arn ? `<span class="arn-tag">ARN: ${escapeHtml(item.gstr4Arn)}</span>` : ''}
          </div>
        </td>

        <!-- Remarks -->
        <td>
          <input type="text" class="comp-remarks-input" data-id="${item.id}" value="${escapeHtml(item.remarks || '')}" placeholder="Add notes...">
        </td>

        <!-- Actions -->
        <td style="text-align: center;">
          <div class="actions-cell">
            <button class="btn-edit-name" data-action="editCompShop" data-id="${item.id}" title="Edit Composition Shop Details">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span>Edit</span>
            </button>
            <button class="btn-delete-shop" data-action="deleteCompShop" data-id="${item.id}" data-name="${escapeHtml(item.name)}" title="Delete Composition Shop">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              <span>Delete</span>
            </button>
          </div>
        </td>
      `;

      compTableBody.appendChild(tr);
      cardsHtml += renderCompCardHtml(item);
    });

    if (compCardsContainer) {
      compCardsContainer.innerHTML = cardsHtml;
    }
  }

  async function deleteCompositionShop(clientId, shopName) {
    try {
      const data = await apiFetch(`/api/composition/clients/${encodeURIComponent(clientId)}`, { method: 'DELETE' });
      if (data && data.success) {
        allCompositionFilings = allCompositionFilings.filter(f => f.id !== clientId);
        allCompositionFilings.forEach((f, idx) => { f.sno = idx + 1; });
        compositionSelectedIds.delete(clientId);
        applyCompositionFiltersAndRender();
        updateCompositionKpis();
        showToast(`✓ Shop "${shopName}" deleted successfully from Composition`);
      } else {
        showToast('Error: ' + (data && data.error ? data.error : 'Failed to delete'));
      }
    } catch (err) {
      showToast('Failed to delete: ' + err.message);
    }
  }

  // --- DELETE SHOP (Monthly) ---
  async function deleteShop(clientId, shopName) {
    try {
      const data = await apiFetch(`/api/clients/${encodeURIComponent(clientId)}`, {
        method: 'DELETE'
      });
      if (data && data.success) {
        allFilings = allFilings.filter(f => f.id !== clientId);
        allFilings.forEach((f, idx) => { f.sno = idx + 1; });
        selectedIds.delete(clientId);
        applyFiltersAndRender();
        updateKpis();
        updateBulkBar();
        showToast(`✓ Shop "${shopName}" deleted successfully`);
      } else {
        showToast('Error: ' + (data.error || 'Failed to delete shop'));
      }
    } catch (err) {
      showToast('Failed to delete shop: ' + err.message);
    }
  }

  // --- FILING DATE MODAL ---
  function openDateModal(clientId, returnType, scheme = 'monthly') {
    let item = null;
    let title = '';
    let badge = '';
    let existingDate = '';
    let existingArn = '';
    let isCurrentlyFiled = false;

    if (scheme === 'monthly') {
      item = allFilings.find(f => f.id === clientId);
      if (!item) return;
      const isG1 = returnType === 'gstr1';
      isCurrentlyFiled = isG1 ? (item.gstr1 === 'Filed') : (item.gstr3b === 'Filed');
      existingDate = isG1 ? item.gstr1Date : item.gstr3bDate;
      existingArn = isG1 ? item.gstr1Arn : item.gstr3bArn;
      badge = isG1 ? 'GSTR-1' : 'GSTR-3B';
      title = isCurrentlyFiled ? `Edit ${badge} Filing Date` : `Mark ${badge} as Filed`;
    } else if (scheme === 'qrmp') {
      item = allQrmpFilings.find(f => f.id === clientId);
      if (!item) return;
      if (returnType === 'm1Gstr1') {
        const m1Label = currentQrmpQuarterInfo ? currentQrmpQuarterInfo.m1.split(' ')[0] : 'M1';
        badge = `${m1Label} GSTR-1 (IFF)`;
        isCurrentlyFiled = item.m1Gstr1 === 'Filed';
        existingDate = item.m1Gstr1Date;
        existingArn = item.m1Gstr1Arn;
      } else if (returnType === 'm2Gstr1') {
        const m2Label = currentQrmpQuarterInfo ? currentQrmpQuarterInfo.m2.split(' ')[0] : 'M2';
        badge = `${m2Label} GSTR-1 (IFF)`;
        isCurrentlyFiled = item.m2Gstr1 === 'Filed';
        existingDate = item.m2Gstr1Date;
        existingArn = item.m2Gstr1Arn;
      } else if (returnType === 'm3Gstr1') {
        const m3Label = currentQrmpQuarterInfo ? currentQrmpQuarterInfo.m3.split(' ')[0] : 'M3';
        badge = `${m3Label} GSTR-1 (COMPULSORY)`;
        isCurrentlyFiled = item.m3Gstr1 === 'Filed';
        existingDate = item.m3Gstr1Date;
        existingArn = item.m3Gstr1Arn;
      } else if (returnType === 'gstr3b') {
        badge = 'Quarterly GSTR-3B';
        isCurrentlyFiled = item.gstr3b === 'Filed';
        existingDate = item.gstr3bDate;
        existingArn = item.gstr3bArn;
      }
      title = isCurrentlyFiled ? `Edit ${badge} Filing Date` : `Mark ${badge} as Filed`;
    } else if (scheme === 'composition') {
      item = allCompositionFilings.find(f => f.id === clientId);
      if (!item) return;
      if (returnType === 'cmp08') {
        badge = 'CMP-08 (Quarterly Statement)';
        isCurrentlyFiled = item.cmp08 === 'Filed';
        existingDate = item.cmp08Date;
        existingArn = item.cmp08Arn;
      } else if (returnType === 'gstr4') {
        badge = 'GSTR-4 (Annual Return)';
        isCurrentlyFiled = item.gstr4 === 'Filed';
        existingDate = item.gstr4Date;
        existingArn = item.gstr4Arn;
      }
      title = isCurrentlyFiled ? `Edit ${badge} Filing Date` : `Mark ${badge} as Filed`;
    }

    document.getElementById('filingDateClientId').value = clientId;
    document.getElementById('filingDateReturnType').value = returnType;
    document.getElementById('filingDateScheme').value = scheme;
    document.getElementById('filingDateModalTitle').textContent = title;
    document.getElementById('filingDateReturnBadge').textContent = badge;
    document.getElementById('filingDateShopName').textContent = `${item.sno}. ${item.name}`;

    document.getElementById('filingDateField').value = existingDate || getTodayDateString();
    document.getElementById('filingDateArnField').value = existingArn || '';

    const revertBtn = document.getElementById('btnRevertToPending');
    revertBtn.style.display = isCurrentlyFiled ? 'block' : 'none';

    modalFilingDate.style.display = 'flex';
  }

  // --- EDIT SHOP MODAL ---
  function openEditShopNameModal(clientId, scheme = 'monthly') {
    let item = null;
    if (scheme === 'monthly') {
      item = allFilings.find(f => f.id === clientId);
    } else if (scheme === 'qrmp') {
      item = allQrmpFilings.find(f => f.id === clientId);
    } else if (scheme === 'composition') {
      item = allCompositionFilings.find(f => f.id === clientId);
    }
    if (!item) return;

    document.getElementById('editShopId').value = clientId;
    document.getElementById('editShopScheme').value = scheme;
    document.getElementById('editShopInputName').value = item.name || '';
    document.getElementById('editShopInputUser').value = item.user || '';
    document.getElementById('editShopInputGst').value = item.gst || '';

    // Rent fields for monthly, QRMP, and Composition
    const rentRow = document.getElementById('editShopInputRentStatus').closest('.form-row');
    if (rentRow) rentRow.style.display = 'flex';

    const rentStatus = item.rent || item.defaultRent || 'Rent';
    const rentSelect = document.getElementById('editShopInputRentStatus');
    if (rentSelect) rentSelect.value = rentStatus;

    const rentAmt = item.rentAmount || item.suggestedRentAmount || '';
    const amtInput = document.getElementById('editShopInputRentAmount');
    if (amtInput) amtInput.value = rentAmt ? formatAmount2Dec(rentAmt) : '';

    const colRent = document.getElementById('colEditRentAmount');
    if (colRent) colRent.style.display = (rentStatus === 'Rent') ? 'block' : 'none';

    const taxAmt = item.taxableAmount || item.taxableTurnover || '';
    const taxInput = document.getElementById('editShopInputTaxableAmount');
    if (taxInput) taxInput.value = taxAmt ? formatAmount2Dec(taxAmt) : '';

    const badgeContainer = document.getElementById('editShopInfoBadge');
    if (badgeContainer) {
      badgeContainer.innerHTML = `
        <span class="badge-tag">Scheme: <strong>${scheme.toUpperCase()}</strong></span>
        <span class="badge-tag">S.NO: <strong>#${item.sno}</strong></span>
        <span class="badge-tag">Current GSTIN: <strong>${escapeHtml(item.gst || 'None')}</strong></span>
        <span class="badge-tag">User: <strong>${escapeHtml(item.user || 'None')}</strong></span>
      `;
    }

    const portalDesc = document.getElementById('modalPortalLoginDesc');
    if (portalDesc) {
      portalDesc.textContent = item.user 
        ? `Copies username "${item.user}" and opens GST portal login in a new tab` 
        : `Opens GST portal login in a new tab`;
    }

    const modal = document.getElementById('modalEditShopName');
    if (modal) modal.style.display = 'flex';
    setTimeout(() => {
      const input = document.getElementById('editShopInputName');
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  // --- EVENT HANDLERS ---
  function setupEventListeners() {
    // Scheme tab buttons
    document.querySelectorAll('.scheme-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetScheme = e.currentTarget.getAttribute('data-scheme');
        switchScheme(targetScheme);
      });
    });

    // Period / Month selector dropdown (Return Period / Quarter selector)
    monthSelect.addEventListener('change', async (e) => {
      if (currentScheme === 'monthly') {
        currentMonth = e.target.value;
        const res = await fetchFilings(currentMonth);
        if (res && res.copiedFrom) {
          showToast(`Switched return period to ${currentMonth} • Auto-copied Company Name, Rent Option & Amount from ${res.copiedFrom}`);
        } else {
          showToast(`Switched return period to ${currentMonth}`);
        }
      } else if (currentScheme === 'qrmp') {
        currentQrmpQuarter = e.target.value;
        const res = await fetchQrmpFilings(currentQrmpQuarter);
        if (res && res.copiedFrom) {
          showToast(`Switched to QRMP ${currentQrmpQuarter} • Auto-copied Company Name, Rent Option & Amount, User, and GSTIN from ${res.copiedFrom}`);
        } else {
          showToast(`Switched to QRMP ${currentQrmpQuarter}`);
        }
      } else if (currentScheme === 'composition') {
        currentCompositionQuarter = e.target.value;
        const res = await fetchCompositionFilings(currentCompositionQuarter);
        if (res && res.copiedFrom) {
          showToast(`Switched to Composition ${currentCompositionQuarter} • Auto-copied Company Name, Rent Option & Amount, User, and GSTIN from ${res.copiedFrom}`);
        } else {
          showToast(`Switched to Composition ${currentCompositionQuarter}`);
        }
      }
    });

    // Working Month selector dropdown (Active Compliance Month)
    if (workingMonthSelect) {
      workingMonthSelect.addEventListener('change', async (e) => {
        await setWorkingMonth(e.target.value);
      });
    }

    // Advance Month Action button
    if (btnAdvanceMonth) {
      btnAdvanceMonth.addEventListener('click', async () => {
        const target = btnAdvanceMonth.getAttribute('data-target-month') || 'DEC 2026';
        await setWorkingMonth(target);
      });
    }

    // Reset back to NOV 2026 button
    if (btnResetNov) {
      btnResetNov.addEventListener('click', async () => {
        await setWorkingMonth('NOV 2026');
      });
    }

    // Copy Prev Data button click
    if (btnCopyPrevData) {
      btnCopyPrevData.addEventListener('click', async () => {
        try {
          if (currentScheme === 'monthly') {
            const res = await apiFetch(`/api/filings/${encodeURIComponent(currentMonth)}/copy-from-previous`, { method: 'POST' });
            showToast(res.message || `Copied Company Name, Rent Option & Amount from ${res.copiedFrom}`);
            await fetchFilings(currentMonth);
          } else if (currentScheme === 'qrmp') {
            const res = await apiFetch(`/api/qrmp/filings/${encodeURIComponent(currentQrmpQuarter)}/copy-from-previous`, { method: 'POST' });
            showToast(res.message || `Copied Company Name, Rent Option & Amount, User, and GSTIN from ${res.copiedFrom}`);
            await fetchQrmpFilings(currentQrmpQuarter);
          } else if (currentScheme === 'composition') {
            const res = await apiFetch(`/api/composition/filings/${encodeURIComponent(currentCompositionQuarter)}/copy-from-previous`, { method: 'POST' });
            showToast(res.message || `Copied Company Name, Rent Option & Amount, User, and GSTIN from ${res.copiedFrom}`);
            await fetchCompositionFilings(currentCompositionQuarter);
          }
        } catch (err) {
          showToast('Copy error: ' + err.message);
        }
      });
    }

    // Monthly Search input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      btnClearSearch.style.display = searchQuery ? 'block' : 'none';
      applyFiltersAndRender();
    });

    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      btnClearSearch.style.display = 'none';
      applyFiltersAndRender();
    });

    // QRMP Search input
    if (qrmpSearchInput) {
      qrmpSearchInput.addEventListener('input', (e) => {
        qrmpSearchQuery = e.target.value.trim();
        btnQrmpClearSearch.style.display = qrmpSearchQuery ? 'block' : 'none';
        applyQrmpFiltersAndRender();
      });

      btnQrmpClearSearch.addEventListener('click', () => {
        qrmpSearchInput.value = '';
        qrmpSearchQuery = '';
        btnQrmpClearSearch.style.display = 'none';
        applyQrmpFiltersAndRender();
      });
    }

    // Composition Search input
    if (compSearchInput) {
      compSearchInput.addEventListener('input', (e) => {
        compositionSearchQuery = e.target.value.trim();
        btnCompClearSearch.style.display = compositionSearchQuery ? 'block' : 'none';
        applyCompositionFiltersAndRender();
      });

      btnCompClearSearch.addEventListener('click', () => {
        compSearchInput.value = '';
        compositionSearchQuery = '';
        btnCompClearSearch.style.display = 'none';
        applyCompositionFiltersAndRender();
      });
    }

    // Monthly Rent filter pills
    document.querySelectorAll('[data-rent]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-rent]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentRentFilter = e.currentTarget.getAttribute('data-rent');
        applyFiltersAndRender();
      });
    });

    // Monthly Status filter pills
    document.querySelectorAll('[data-status]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-status]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentStatusFilter = e.currentTarget.getAttribute('data-status');
        applyFiltersAndRender();
      });
    });

    // QRMP Rent filter pills
    document.querySelectorAll('[data-qrmp-rent]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-qrmp-rent]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        qrmpRentFilter = e.currentTarget.getAttribute('data-qrmp-rent');
        applyQrmpFiltersAndRender();
      });
    });

    // QRMP Status filter pills
    document.querySelectorAll('[data-qrmp-status]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-qrmp-status]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        qrmpStatusFilter = e.currentTarget.getAttribute('data-qrmp-status');
        applyQrmpFiltersAndRender();
      });
    });

    // Composition Status filter pills
    document.querySelectorAll('[data-comp-status]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-comp-status]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        compositionStatusFilter = e.currentTarget.getAttribute('data-comp-status');
        applyCompositionFiltersAndRender();
      });
    });

    // ==========================================
    // VIEW SWITCHER CONTROLS (Cards vs Table)
    // ==========================================
    if (btnMonthlyCards) btnMonthlyCards.addEventListener('click', () => setMonthlyViewMode('cards'));
    if (btnMonthlyTable) btnMonthlyTable.addEventListener('click', () => setMonthlyViewMode('table'));
    if (btnQrmpCards) btnQrmpCards.addEventListener('click', () => setQrmpViewMode('cards'));
    if (btnQrmpTable) btnQrmpTable.addEventListener('click', () => setQrmpViewMode('table'));
    if (btnCompCards) btnCompCards.addEventListener('click', () => setCompViewMode('cards'));
    if (btnCompTable) btnCompTable.addEventListener('click', () => setCompViewMode('table'));

    // ==========================================
    // MONTHLY TABLE & CARDS EVENTS
    // ==========================================
    [tableBody, monthlyCardsContainer].forEach(container => {
      if (!container) return;

      container.addEventListener('change', async (e) => {
        if (e.target.classList.contains('row-checkbox')) {
          const id = e.target.getAttribute('data-id');
          if (e.target.checked) selectedIds.add(id);
          else selectedIds.delete(id);
          const tr = e.target.closest('tr');
          if (tr) tr.classList.toggle('selected', e.target.checked);
          const card = e.target.closest('.mobile-shop-card');
          if (card) card.classList.toggle('selected', e.target.checked);
          updateBulkBar();
          updateSelectAllCheckbox();
        }

        if (e.target.classList.contains('remarks-input')) {
          const clientId = e.target.getAttribute('data-id');
          const newRemarks = e.target.value.trim();
          await updateFiling(clientId, { remarks: newRemarks });
          showToast('Remarks saved');
        }

        if (e.target.classList.contains('taxable-amount-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          e.target.value = formatted;
          await updateFiling(clientId, { taxableAmount: formatted });
          showToast(`Taxable amount saved (${formatted ? '₹ ' + formatted : '₹ 0.00'})`);
        }
      });

      container.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('taxable-amount-input')) {
          if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
          if (e.key === 'Enter') { e.target.blur(); return; }
          if (e.ctrlKey || e.metaKey) return;
          if (e.key === '.') {
            if (e.target.value.includes('.')) e.preventDefault();
            return;
          }
          if (!/^[0-9]$/.test(e.key)) e.preventDefault();
        }
      });

      container.addEventListener('input', (e) => {
        if (e.target.classList.contains('taxable-amount-input')) {
          const val = e.target.value;
          const clean = sanitizeDecimalInput(val);
          if (val !== clean) e.target.value = clean;
        }
      });

      container.addEventListener('blur', async (e) => {
        if (e.target.classList.contains('taxable-amount-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          if (e.target.value !== formatted) {
            e.target.value = formatted;
            await updateFiling(clientId, { taxableAmount: formatted });
          }
        }
      }, true);

      container.addEventListener('paste', (e) => {
        if (e.target.classList.contains('taxable-amount-input')) {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text') || '';
          const clean = sanitizeDecimalInput(text);
          document.execCommand('insertText', false, clean);
        }
      });

      container.addEventListener('click', async (e) => {
        const gstLoginBtn = e.target.closest('[data-action="openGstLogin"]');
        if (gstLoginBtn) {
          const userName = gstLoginBtn.getAttribute('data-user');
          if (userName) {
            navigator.clipboard.writeText(userName).then(() => {
              showToast(`📋 Copied username "${userName}"! Press Ctrl+V in the Username box on GST Portal.`);
            }).catch(() => {
              showToast(`Opening GST Portal for ${userName}...`);
            });
          }
          window.open('https://services.gst.gov.in/services/login', '_blank');
          return;
        }

        const copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) {
          const text = copyBtn.getAttribute('data-copy');
          navigator.clipboard.writeText(text);
          showToast(`Copied "${text}" to clipboard!`);
          return;
        }

        const g1Btn = e.target.closest('[data-action="clickG1"]');
        if (g1Btn) {
          const clientId = g1Btn.getAttribute('data-id');
          openDateModal(clientId, 'gstr1', 'monthly');
          return;
        }

        const g3bBtn = e.target.closest('[data-action="clickG3b"]');
        if (g3bBtn) {
          const clientId = g3bBtn.getAttribute('data-id');
          openDateModal(clientId, 'gstr3b', 'monthly');
          return;
        }

        const lockedBtn = e.target.closest('[data-action="lockedG3b"]');
        if (lockedBtn) {
          const clientId = lockedBtn.getAttribute('data-id');
          const item = allFilings.find(f => f.id === clientId);
          const name = item ? item.name : 'this shop';
          showToast(`⚠️ GSTR-1 must be filed before you can file GSTR-3B for ${name}!`);
          return;
        }

        const editNameBtn = e.target.closest('[data-action="editShopName"]');
        if (editNameBtn) {
          const clientId = editNameBtn.getAttribute('data-id');
          openEditShopNameModal(clientId, 'monthly');
          return;
        }

        const deleteShopBtn = e.target.closest('[data-action="deleteShop"]');
        if (deleteShopBtn) {
          const clientId = deleteShopBtn.getAttribute('data-id');
          const shopName = deleteShopBtn.getAttribute('data-name') || 'this shop';
          if (confirm(`Are you sure you want to delete "${shopName}"?\n\nThis will remove the shop and all its return filing records across all months.`)) {
            await deleteShop(clientId, shopName);
          }
          return;
        }
      });
    });

    selectAllCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      filteredFilings.forEach(f => {
        if (isChecked) selectedIds.add(f.id);
        else selectedIds.delete(f.id);
      });
      document.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.checked = isChecked;
        const tr = cb.closest('tr');
        if (tr) tr.classList.toggle('selected', isChecked);
        const card = cb.closest('.mobile-shop-card');
        if (card) card.classList.toggle('selected', isChecked);
      });
      updateBulkBar();
    });

    // ==========================================
    // QRMP TABLE & CARDS EVENTS (M1, M2, M3 Compulsory, Q3B)
    // ==========================================
    [qrmpTableBody, qrmpCardsContainer].forEach(container => {
      if (!container) return;

      container.addEventListener('click', async (e) => {
        const gstLoginBtn = e.target.closest('[data-action="openGstLogin"]');
        if (gstLoginBtn) {
          const userName = gstLoginBtn.getAttribute('data-user');
          if (userName) {
            navigator.clipboard.writeText(userName).then(() => {
              showToast(`📋 Copied username "${userName}"!`);
            });
          }
          window.open('https://services.gst.gov.in/services/login', '_blank');
          return;
        }

        const copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) {
          const text = copyBtn.getAttribute('data-copy');
          navigator.clipboard.writeText(text);
          showToast(`Copied "${text}" to clipboard!`);
          return;
        }

        // M1 GSTR-1
        const m1Btn = e.target.closest('[data-action="clickQrmpM1"]');
        if (m1Btn) {
          const clientId = m1Btn.getAttribute('data-id');
          openDateModal(clientId, 'm1Gstr1', 'qrmp');
          return;
        }

        // M2 GSTR-1
        const m2Btn = e.target.closest('[data-action="clickQrmpM2"]');
        if (m2Btn) {
          const clientId = m2Btn.getAttribute('data-id');
          openDateModal(clientId, 'm2Gstr1', 'qrmp');
          return;
        }

        // M3 GSTR-1 (COMPULSORY)
        const m3Btn = e.target.closest('[data-action="clickQrmpM3"]');
        if (m3Btn) {
          const clientId = m3Btn.getAttribute('data-id');
          openDateModal(clientId, 'm3Gstr1', 'qrmp');
          return;
        }

        // Quarterly GSTR-3B (Unlocked)
        const g3bBtn = e.target.closest('[data-action="clickQrmpG3b"]');
        if (g3bBtn) {
          const clientId = g3bBtn.getAttribute('data-id');
          openDateModal(clientId, 'gstr3b', 'qrmp');
          return;
        }

        // Quarterly GSTR-3B (Locked because Month 3 GSTR-1 is not filed!)
        const lockedBtn = e.target.closest('[data-action="lockedQrmpG3b"]');
        if (lockedBtn) {
          const clientId = lockedBtn.getAttribute('data-id');
          const item = allQrmpFilings.find(f => f.id === clientId);
          const name = item ? item.name : 'this company';
          const m3Name = currentQrmpQuarterInfo ? currentQrmpQuarterInfo.m3.split(' ')[0] : 'Month 3';
          showToast(`⚠️ Compulsory Rule: ${m3Name} GSTR-1 must be filed before you can file Quarterly GSTR-3B for ${name}!`);
          return;
        }

        // Edit QRMP shop
        const editBtn = e.target.closest('[data-action="editQrmpShop"]');
        if (editBtn) {
          const clientId = editBtn.getAttribute('data-id');
          openEditShopNameModal(clientId, 'qrmp');
          return;
        }

        // Delete QRMP shop
        const delBtn = e.target.closest('[data-action="deleteQrmpShop"]');
        if (delBtn) {
          const clientId = delBtn.getAttribute('data-id');
          const shopName = delBtn.getAttribute('data-name') || 'this company';
          if (confirm(`Are you sure you want to delete "${shopName}" from QRMP Scheme?`)) {
            await deleteQrmpShop(clientId, shopName);
          }
          return;
        }
      });

      container.addEventListener('change', async (e) => {
        if (e.target.classList.contains('qrmp-remarks-input')) {
          const clientId = e.target.getAttribute('data-id');
          await updateQrmpFiling(clientId, { remarks: e.target.value.trim() });
          showToast('Remarks saved');
        }

        if (e.target.classList.contains('qrmp-taxable-amount-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          e.target.value = formatted;
          await updateQrmpFiling(clientId, { taxableAmount: formatted });
          showToast(`Taxable amount saved (${formatted ? '₹ ' + formatted : '₹ 0.00'})`);
        }
      });

      // Number & decimal validation for QRMP taxable amount
      container.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('qrmp-taxable-amount-input')) {
          if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
          if (e.key === 'Enter') { e.target.blur(); return; }
          if (e.ctrlKey || e.metaKey) return;
          if (e.key === '.') {
            if (e.target.value.includes('.')) e.preventDefault();
            return;
          }
          if (!/^[0-9]$/.test(e.key)) e.preventDefault();
        }
      });

      container.addEventListener('input', (e) => {
        if (e.target.classList.contains('qrmp-taxable-amount-input')) {
          const val = e.target.value;
          const clean = sanitizeDecimalInput(val);
          if (val !== clean) e.target.value = clean;
        }
      });

      container.addEventListener('blur', async (e) => {
        if (e.target.classList.contains('qrmp-taxable-amount-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          if (e.target.value !== formatted) {
            e.target.value = formatted;
            await updateQrmpFiling(clientId, { taxableAmount: formatted });
          }
        }
      }, true);

      container.addEventListener('paste', (e) => {
        if (e.target.classList.contains('qrmp-taxable-amount-input')) {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text') || '';
          const clean = sanitizeDecimalInput(text);
          document.execCommand('insertText', false, clean);
        }
      });
    });

    // ==========================================
    // COMPOSITION TABLE & CARDS EVENTS (CMP-08, GSTR-4)
    // ==========================================
    [compTableBody, compCardsContainer].forEach(container => {
      if (!container) return;

      container.addEventListener('click', async (e) => {
        const gstLoginBtn = e.target.closest('[data-action="openGstLogin"]');
        if (gstLoginBtn) {
          const userName = gstLoginBtn.getAttribute('data-user');
          if (userName) {
            navigator.clipboard.writeText(userName).then(() => {
              showToast(`📋 Copied username "${userName}"!`);
            });
          }
          window.open('https://services.gst.gov.in/services/login', '_blank');
          return;
        }

        const copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) {
          const text = copyBtn.getAttribute('data-copy');
          navigator.clipboard.writeText(text);
          showToast(`Copied "${text}" to clipboard!`);
          return;
        }

        // CMP-08 Quarterly
        const cmpBtn = e.target.closest('[data-action="clickCmp08"]');
        if (cmpBtn) {
          const clientId = cmpBtn.getAttribute('data-id');
          openDateModal(clientId, 'cmp08', 'composition');
          return;
        }

        // GSTR-4 Annual
        const g4Btn = e.target.closest('[data-action="clickGstr4"]');
        if (g4Btn) {
          const clientId = g4Btn.getAttribute('data-id');
          openDateModal(clientId, 'gstr4', 'composition');
          return;
        }

        // Edit Composition shop
        const editBtn = e.target.closest('[data-action="editCompShop"]');
        if (editBtn) {
          const clientId = editBtn.getAttribute('data-id');
          openEditShopNameModal(clientId, 'composition');
          return;
        }

        // Delete Composition shop
        const delBtn = e.target.closest('[data-action="deleteCompShop"]');
        if (delBtn) {
          const clientId = delBtn.getAttribute('data-id');
          const shopName = delBtn.getAttribute('data-name') || 'this shop';
          if (confirm(`Are you sure you want to delete "${shopName}" from Composition Scheme?`)) {
            await deleteCompositionShop(clientId, shopName);
          }
          return;
        }
      });

      container.addEventListener('change', async (e) => {
        if (e.target.classList.contains('comp-remarks-input')) {
          const clientId = e.target.getAttribute('data-id');
          await updateCompositionFiling(clientId, { remarks: e.target.value.trim() });
          showToast('Remarks saved');
        }

        if (e.target.classList.contains('comp-turnover-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          e.target.value = formatted;
          const item = allCompositionFilings.find(f => f.id === clientId);
          const rateNum = item && item.taxRate ? (parseFloat(item.taxRate) || 1) : 1;
          const computedTax = cleanVal ? ((parseFloat(cleanVal) * rateNum) / 100).toFixed(2) : '';

          await updateCompositionFiling(clientId, { 
            taxableTurnover: formatted, 
            taxAmount: computedTax 
          });

          // Sync sibling tax input in table or card
          const parentRow = e.target.closest('tr') || e.target.closest('.mobile-shop-card') || e.target.closest('.m-shop-card');
          if (parentRow) {
            const taxInput = parentRow.querySelector('.comp-tax-input');
            if (taxInput) taxInput.value = computedTax;
          }
          showToast(`Turnover & Tax saved (${formatted ? '₹ ' + formatted : '₹ 0.00'})`);
        }

        if (e.target.classList.contains('comp-tax-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          e.target.value = formatted;
          await updateCompositionFiling(clientId, { taxAmount: formatted });
          showToast(`Tax amount saved (${formatted ? '₹ ' + formatted : '₹ 0.00'})`);
        }
      });

      // Number & decimal validation for Composition inputs
      container.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('comp-turnover-input') || e.target.classList.contains('comp-tax-input')) {
          if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
          if (e.key === 'Enter') { e.target.blur(); return; }
          if (e.ctrlKey || e.metaKey) return;
          if (e.key === '.') {
            if (e.target.value.includes('.')) e.preventDefault();
            return;
          }
          if (!/^[0-9]$/.test(e.key)) e.preventDefault();
        }
      });

      container.addEventListener('input', (e) => {
        if (e.target.classList.contains('comp-turnover-input') || e.target.classList.contains('comp-tax-input')) {
          const val = e.target.value;
          const clean = sanitizeDecimalInput(val);
          if (val !== clean) e.target.value = clean;
        }
      });

      container.addEventListener('blur', async (e) => {
        if (e.target.classList.contains('comp-turnover-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          if (e.target.value !== formatted) {
            e.target.value = formatted;
            const item = allCompositionFilings.find(f => f.id === clientId);
            const rateNum = item && item.taxRate ? (parseFloat(item.taxRate) || 1) : 1;
            const computedTax = cleanVal ? ((parseFloat(cleanVal) * rateNum) / 100).toFixed(2) : '';
            await updateCompositionFiling(clientId, { 
              taxableTurnover: formatted, 
              taxAmount: computedTax 
            });
            const parentRow = e.target.closest('tr') || e.target.closest('.mobile-shop-card') || e.target.closest('.m-shop-card');
            if (parentRow) {
              const taxInput = parentRow.querySelector('.comp-tax-input');
              if (taxInput) taxInput.value = computedTax;
            }
          }
        }

        if (e.target.classList.contains('comp-tax-input')) {
          const clientId = e.target.getAttribute('data-id');
          const cleanVal = sanitizeDecimalInput(e.target.value);
          const formatted = cleanVal ? parseFloat(cleanVal).toFixed(2) : '';
          if (e.target.value !== formatted) {
            e.target.value = formatted;
            await updateCompositionFiling(clientId, { taxAmount: formatted });
          }
        }
      }, true);

      container.addEventListener('paste', (e) => {
        if (e.target.classList.contains('comp-turnover-input') || e.target.classList.contains('comp-tax-input')) {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text') || '';
          const clean = sanitizeDecimalInput(text);
          document.execCommand('insertText', false, clean);
        }
      });
    });

    // ==========================================
    // EXPORT BUTTONS (Context-Aware)
    // ==========================================
    function exportClientSideCsv(filename, rows) {
      const csvContent = rows.map(r => r.map(c => `"${String(c !== null && c !== undefined ? c : '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    document.getElementById('btnExportExcel').addEventListener('click', () => {
      // In live cloud / static mode, directly trigger download of master workbook
      const link = document.createElement('a');
      link.href = 'GST_Monthly_Returns_Tracker_FY2026-27.xlsx';
      link.download = 'GST_Monthly_Returns_Tracker_FY2026-27.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Downloading Excel workbook (.xlsx)...');
    });

    document.getElementById('btnExportCsv').addEventListener('click', () => {
      if (currentScheme === 'monthly') {
        const rows = [
          ['S.NO', 'Company Name', 'RENT OPTION', 'RENT AMOUNT (Rs)', 'User Name', 'GST No', 'GSTR-1', 'GSTR-3B', 'TAXABLE AMOUNT', 'REMARKS'],
          ...allFilings.map(f => [f.sno, f.name, f.rent || 'Rent', f.rentAmount || '', f.user || '', f.gst || '', f.gstr1 || 'Pending', f.gstr3b || 'Pending', f.taxableAmount || '', f.remarks || ''])
        ];
        exportClientSideCsv(`${currentMonth.replace(/\s+/g, '_')}_GST_Returns.csv`, rows);
        showToast(`Downloaded CSV for ${currentMonth}!`);
      } else if (currentScheme === 'qrmp') {
        const qInfo = currentQrmpQuarterInfo;
        const m1H = qInfo ? `${qInfo.m1} GSTR-1` : 'M1 GSTR-1';
        const m2H = qInfo ? `${qInfo.m2} GSTR-1` : 'M2 GSTR-1';
        const m3H = qInfo ? `${qInfo.m3} GSTR-1 (Compulsory)` : 'M3 GSTR-1 (Compulsory)';
        const rows = [
          ['S.NO', 'Company Name', 'RENT OPTION', 'RENT AMOUNT (Rs)', 'User Name', 'GST No', m1H, m2H, m3H, 'GSTR-3B (Quarterly)', 'TAXABLE AMOUNT', 'REMARKS'],
          ...allQrmpFilings.map(f => [f.sno, f.name, f.rent || 'Rent', f.rentAmount || '', f.user || '', f.gst || '', f.m1Gstr1 || 'Pending', f.m2Gstr1 || 'Pending', f.m3Gstr1 || 'Pending', f.gstr3b || 'Pending', f.taxableAmount || '', f.remarks || ''])
        ];
        exportClientSideCsv(`${currentQrmpQuarter.replace(/[\s\(\)\-\:]+/g, '_')}_QRMP_Returns.csv`, rows);
        showToast(`Downloaded QRMP CSV for ${currentQrmpQuarter}!`);
      } else if (currentScheme === 'composition') {
        const rows = [
          ['S.NO', 'Company Name', 'Category', 'Tax Rate', 'User Name', 'GST No', 'CMP-08 (Quarterly)', 'TAXABLE TURNOVER', 'TAX AMOUNT', 'GSTR-4 (Annual)', 'REMARKS'],
          ...allCompositionFilings.map(f => [f.sno, f.name, f.category || 'Trader', f.taxRate || '1%', f.user || '', f.gst || '', f.cmp08 || 'Pending', f.taxableTurnover || '', f.taxAmount || '', f.gstr4 || 'Pending', f.remarks || ''])
        ];
        exportClientSideCsv(`${currentCompositionQuarter.replace(/[\s\(\)\-\:]+/g, '_')}_Composition_Returns.csv`, rows);
        showToast(`Downloaded Composition CSV for ${currentCompositionQuarter}!`);
      } else if (currentScheme === 'master') {
        exportMasterCSV();
      }
    });

    // Auto-Fill Guide Modal
    const btnBookmarkletInfo = document.getElementById('btnBookmarkletInfo');
    if (btnBookmarkletInfo) {
      btnBookmarkletInfo.addEventListener('click', () => {
        document.getElementById('modalBookmarklet').style.display = 'flex';
      });
    }

    function getNextMonthInfo(monthStr) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const fullNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      const parts = (monthStr || '').trim().split(/\s+/);
      if (parts.length >= 2) {
        const idx = months.indexOf(parts[0].toUpperCase());
        let yr = parseInt(parts[1], 10);
        if (idx !== -1 && !isNaN(yr)) {
          let nextIdx = (idx + 1) % 12;
          let nextYr = nextIdx === 0 ? yr + 1 : yr;
          const nextMonthName = `${months[nextIdx]} ${nextYr}`;
          const nextMonthTitle = `${fullNames[nextIdx]} ${nextYr}`;
          let dueIdx = (nextIdx + 1) % 12;
          let dueYr = dueIdx === 0 ? nextYr + 1 : nextYr;
          return {
            name: nextMonthName,
            title: nextMonthTitle,
            g1Due: `11-${months[dueIdx]}-${dueYr}`,
            g3bDue: `20-${months[dueIdx]}-${dueYr}`
          };
        }
      }
      return { name: '', title: '', g1Due: '11th of Next Month', g3bDue: '20th of Next Month' };
    }

    function parseQuarterYear(str) {
      if (!str) return null;
      const upper = str.trim().toUpperCase();
      let qNum = null;
      let year = null;
      if (upper.includes('Q1') || upper.includes('FIRST') || upper.includes('JAN') || upper.includes('MAR')) {
        qNum = 1;
      } else if (upper.includes('Q2') || upper.includes('SECOND') || upper.includes('APR') || upper.includes('JUN')) {
        qNum = 2;
      } else if (upper.includes('Q3') || upper.includes('THIRD') || upper.includes('JUL') || upper.includes('SEP')) {
        qNum = 3;
      } else if (upper.includes('Q4') || upper.includes('FOURTH') || upper.includes('OCT') || upper.includes('DEC')) {
        qNum = 4;
      }
      const yMatch = upper.match(/20\d{2}/);
      if (yMatch) year = parseInt(yMatch[0], 10);
      if (qNum !== null && year !== null) {
        return { qNum, year };
      }
      return null;
    }

    function getNextQuarterInfo(quarterStr) {
      const parsed = parseQuarterYear(quarterStr);
      const qNum = parsed ? parsed.qNum : 4;
      const yr = parsed ? parsed.year : 2026;
      const nextQNum = qNum === 4 ? 1 : qNum + 1;
      const nextYr = qNum === 4 ? yr + 1 : yr;

      const Q_RANGES = {
        1: 'JAN - MAR',
        2: 'APR - JUN',
        3: 'JUL - SEP',
        4: 'OCT - DEC'
      };
      const Q_TITLES = {
        1: 'First Quarter (January - March',
        2: 'Second Quarter (April - June',
        3: 'Third Quarter (July - September',
        4: 'Fourth Quarter (October - December'
      };

      return {
        name: `Q${nextQNum} (${Q_RANGES[nextQNum]} ${nextYr})`,
        title: `${Q_TITLES[nextQNum]} ${nextYr})`,
        qNum: nextQNum,
        year: nextYr
      };
    }

    // Rollover Modal
    document.getElementById('btnRolloverModal').addEventListener('click', () => {
      const modal = document.getElementById('modalRollover');
      const modalTitle = document.getElementById('rolloverModalTitle');
      const modalDesc = document.getElementById('rolloverModalDesc');
      const sourceLabel = document.getElementById('rolloverSourceLabel');
      const newIdLabel = document.getElementById('rolloverNewIdLabel');
      const newTitleLabel = document.getElementById('rolloverNewTitleLabel');
      const dueDatesRow = document.getElementById('rolloverDueDatesRow');
      const submitBtn = document.getElementById('btnRolloverSubmit');
      const sourceSelect = document.getElementById('rolloverSourceMonth');
      const nameInput = document.getElementById('rolloverNewMonth');
      const titleInput = document.getElementById('rolloverNewTitle');
      const g1Input = document.getElementById('rolloverG1Due');
      const g3bInput = document.getElementById('rolloverG3bDue');

      if (currentScheme === 'monthly') {
        if (modalTitle) modalTitle.textContent = 'Advance Month (Month-to-Month Rollover)';
        if (modalDesc) modalDesc.innerHTML = 'Advance returns filing to a new month. All <strong>63 shops</strong> will be automatically copied with <strong>Company Names, Rent Options (Rent, ITC, Own) & Rent Amounts</strong> preserved, while return filing statuses will be reset to <strong>Pending</strong>.';
        if (sourceLabel) sourceLabel.textContent = 'Source Month (Copy From):';
        if (newIdLabel) newIdLabel.textContent = 'New Month ID / Name (e.g. NOV 2026, JAN 2027):';
        if (newTitleLabel) newTitleLabel.textContent = 'Full Month Title (e.g. NOVEMBER 2026):';
        if (dueDatesRow) dueDatesRow.style.display = 'flex';
        if (submitBtn) submitBtn.textContent = 'Create Month & Roll Over';

        if (sourceSelect) {
          sourceSelect.innerHTML = '';
          monthsList.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.name; opt.textContent = m.name;
            sourceSelect.appendChild(opt);
          });
          sourceSelect.value = currentMonth;
        }

        const next = getNextMonthInfo(currentMonth);
        if (nameInput) nameInput.value = next.name;
        if (titleInput) titleInput.value = next.title;
        if (g1Input) g1Input.value = next.g1Due;
        if (g3bInput) g3bInput.value = next.g3bDue;
        modal.style.display = 'flex';
      } else if (currentScheme === 'qrmp') {
        if (modalTitle) modalTitle.textContent = 'Advance Quarter (Quarter-to-Quarter Rollover)';
        if (modalDesc) modalDesc.innerHTML = 'Advance QRMP filings to a new quarter. All <strong>62 companies</strong> will be automatically copied with <strong>Company Names, Rent Options & Rent Amounts</strong> preserved, while return filing statuses will be reset to <strong>Pending</strong>.';
        if (sourceLabel) sourceLabel.textContent = 'Source Quarter (Copy From):';
        if (newIdLabel) newIdLabel.textContent = 'New Quarter ID / Name (e.g. Q1 (JAN - MAR 2027)):';
        if (newTitleLabel) newTitleLabel.textContent = 'Full Quarter Title:';
        if (dueDatesRow) dueDatesRow.style.display = 'none';
        if (submitBtn) submitBtn.textContent = 'Create Quarter & Roll Over';

        if (sourceSelect) {
          sourceSelect.innerHTML = '';
          qrmpQuartersList.forEach(q => {
            const opt = document.createElement('option');
            opt.value = q.name; opt.textContent = q.name;
            sourceSelect.appendChild(opt);
          });
          sourceSelect.value = currentQrmpQuarter;
        }

        const next = getNextQuarterInfo(currentQrmpQuarter);
        if (nameInput) nameInput.value = next.name;
        if (titleInput) titleInput.value = next.title;
        modal.style.display = 'flex';
      }
    });

    const sourceMonthSelect = document.getElementById('rolloverSourceMonth');
    if (sourceMonthSelect) {
      sourceMonthSelect.addEventListener('change', (e) => {
        const nameInput = document.getElementById('rolloverNewMonth');
        const titleInput = document.getElementById('rolloverNewTitle');
        const g1Input = document.getElementById('rolloverG1Due');
        const g3bInput = document.getElementById('rolloverG3bDue');

        if (currentScheme === 'monthly') {
          const next = getNextMonthInfo(e.target.value);
          if (nameInput) nameInput.value = next.name;
          if (titleInput) titleInput.value = next.title;
          if (g1Input) g1Input.value = next.g1Due;
          if (g3bInput) g3bInput.value = next.g3bDue;
        } else if (currentScheme === 'qrmp') {
          const next = getNextQuarterInfo(e.target.value);
          if (nameInput) nameInput.value = next.name;
          if (titleInput) titleInput.value = next.title;
        }
      });
    }

    // Add Shop Modal
    document.getElementById('btnAddClientModal').addEventListener('click', () => {
      const addSchemeSelect = document.getElementById('addScheme');
      if (addSchemeSelect) {
        addSchemeSelect.value = currentScheme;
        const colRent = document.getElementById('colAddRentAmount');
        const rentSelect = document.getElementById('addRent');
        if (currentScheme === 'monthly' || currentScheme === 'qrmp') {
          if (rentSelect) rentSelect.closest('.form-row').style.display = 'flex';
          if (colRent) colRent.style.display = (rentSelect && rentSelect.value === 'Rent') ? 'block' : 'none';
        } else {
          if (rentSelect) rentSelect.closest('.form-row').style.display = 'none';
          if (colRent) colRent.style.display = 'none';
        }
      }
      document.getElementById('modalAddClient').style.display = 'flex';
    });

    // Scheme switcher in Add Shop Modal
    const addSchemeSelect = document.getElementById('addScheme');
    if (addSchemeSelect) {
      addSchemeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const rentRow = document.getElementById('addRent').closest('.form-row');
        if (rentRow) rentRow.style.display = (val === 'monthly' || val === 'qrmp') ? 'flex' : 'none';
      });
    }

    // Dynamic rent amount visibility in Add Shop modal
    const addRentSelect = document.getElementById('addRent');
    if (addRentSelect) {
      addRentSelect.addEventListener('change', (e) => {
        const col = document.getElementById('colAddRentAmount');
        const amtInput = document.getElementById('addRentAmount');
        if (e.target.value === 'Rent') {
          col.style.display = 'block';
          amtInput.focus();
        } else {
          col.style.display = 'none';
          amtInput.value = '';
        }
      });
    }

    // Dynamic rent amount visibility in Edit Shop modal
    const editRentSelect = document.getElementById('editShopInputRentStatus');
    if (editRentSelect) {
      editRentSelect.addEventListener('change', (e) => {
        const col = document.getElementById('colEditRentAmount');
        const amtInput = document.getElementById('editShopInputRentAmount');
        if (e.target.value === 'Rent') {
          col.style.display = 'block';
          amtInput.focus();
        } else {
          col.style.display = 'none';
          amtInput.value = '';
        }
      });
    }

    // Number and decimal validation for Modal amount inputs
    ['addRentAmount', 'addTaxableAmount', 'editShopInputRentAmount', 'editShopInputTaxableAmount'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('keydown', (e) => {
          if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
          if (e.key === 'Enter') { e.target.blur(); return; }
          if (e.ctrlKey || e.metaKey) return;
          if (e.key === '.') {
            if (e.target.value.includes('.')) e.preventDefault();
            return;
          }
          if (!/^[0-9]$/.test(e.key)) e.preventDefault();
        });
        el.addEventListener('input', (e) => {
          const clean = sanitizeDecimalInput(e.target.value);
          if (e.target.value !== clean) e.target.value = clean;
        });
        el.addEventListener('blur', (e) => {
          const clean = sanitizeDecimalInput(e.target.value);
          e.target.value = clean ? parseFloat(clean).toFixed(2) : '';
        });
        el.addEventListener('paste', (e) => {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text') || '';
          const clean = sanitizeDecimalInput(text);
          document.execCommand('insertText', false, clean);
        });
      }
    });

    // Add Shop Form Submit
    document.getElementById('addClientForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const schemeVal = document.getElementById('addScheme') ? document.getElementById('addScheme').value : currentScheme;
      const name = document.getElementById('addName').value.trim();
      const user = document.getElementById('addUser').value.trim();
      const gst = document.getElementById('addGst').value.trim();
      const defaultRent = document.getElementById('addRent') ? document.getElementById('addRent').value : 'Rent';
      const rawRentAmt = document.getElementById('addRentAmount') ? document.getElementById('addRentAmount').value.trim() : '';
      const cleanRent = sanitizeDecimalInput(rawRentAmt);
      const rentAmount = cleanRent ? parseFloat(cleanRent).toFixed(2) : '';

      const rawTaxAmt = document.getElementById('addTaxableAmount') ? document.getElementById('addTaxableAmount').value.trim() : '';
      const cleanTax = sanitizeDecimalInput(rawTaxAmt);
      const taxableAmount = cleanTax ? parseFloat(cleanTax).toFixed(2) : '';
      const remarks = document.getElementById('addRemarks') ? document.getElementById('addRemarks').value.trim() : '';

      try {
        let endpoint = '/api/clients';
        let payload = { name, user, gst, defaultRent, rentAmount, taxableAmount, remarks };

        if (schemeVal === 'qrmp') {
          endpoint = '/api/qrmp/clients';
          payload = { name, user, gst, defaultRent, rentAmount, taxableAmount, remarks };
        } else if (schemeVal === 'composition') {
          endpoint = '/api/composition/clients';
          payload = { name, user, gst, taxRate: '1%', category: 'Trader', remarks };
        }

        const data = await apiFetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (data.success) {
          modalAddClient.style.display = 'none';
          document.getElementById('addClientForm').reset();
          showToast(`Added new shop: "${name}"`);
          if (schemeVal === 'monthly') await fetchFilings(currentMonth);
          else if (schemeVal === 'qrmp') await fetchQrmpFilings(currentQrmpQuarter);
          else if (schemeVal === 'composition') await fetchCompositionFilings(currentCompositionQuarter);
        } else {
          alert(data.error || 'Failed to add shop');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });

    // Edit Shop Details Form Submit
    const editShopForm = document.getElementById('editShopNameForm');
    if (editShopForm) {
      editShopForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const clientId = document.getElementById('editShopId').value;
        const schemeVal = document.getElementById('editShopScheme').value || 'monthly';
        const newName = document.getElementById('editShopInputName').value.trim();
        const newUser = document.getElementById('editShopInputUser').value.trim();
        const newGst = document.getElementById('editShopInputGst').value.trim().toUpperCase();
        const newRentStatus = document.getElementById('editShopInputRentStatus').value;
        const rawRentAmt = (newRentStatus === 'Rent') 
          ? (document.getElementById('editShopInputRentAmount') ? document.getElementById('editShopInputRentAmount').value.trim() : '')
          : '';
        const cleanRent = sanitizeDecimalInput(rawRentAmt);
        const newRentAmt = cleanRent ? parseFloat(cleanRent).toFixed(2) : '';

        const rawTaxAmt = document.getElementById('editShopInputTaxableAmount')
          ? document.getElementById('editShopInputTaxableAmount').value.trim()
          : '';
        const cleanTax = sanitizeDecimalInput(rawTaxAmt);
        const newTaxAmt = cleanTax ? parseFloat(cleanTax).toFixed(2) : '';

        if (!newName) {
          showToast('Please enter a valid company/shop name.');
          return;
        }

        try {
          if (schemeVal === 'monthly') {
            const data = await apiFetch(`/api/clients/${encodeURIComponent(clientId)}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: newName, 
                user: newUser, 
                gst: newGst, 
                defaultRent: newRentStatus, 
                rentAmount: newRentAmt,
                taxableAmount: newTaxAmt
              })
            });
            if (data.success) {
              await updateFiling(clientId, { name: newName, rent: newRentStatus, rentAmount: newRentAmt, taxableAmount: newTaxAmt });
              allFilings.forEach(f => {
                if (f.id === clientId) {
                  f.name = newName; f.user = newUser; f.gst = newGst;
                  f.rent = newRentStatus; f.defaultRent = newRentStatus;
                  f.rentAmount = newRentAmt; f.taxableAmount = newTaxAmt;
                }
              });
              applyFiltersAndRender();
            }
          } else if (schemeVal === 'qrmp') {
            const data = await apiFetch(`/api/qrmp/clients/${encodeURIComponent(clientId)}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: newName, 
                user: newUser, 
                gst: newGst,
                defaultRent: newRentStatus,
                rentAmount: newRentAmt
              })
            });
            if (data.success) {
              await updateQrmpFiling(clientId, { 
                name: newName,
                rent: newRentStatus, 
                rentAmount: newRentAmt, 
                taxableAmount: newTaxAmt 
              });
              allQrmpFilings.forEach(f => {
                if (f.id === clientId) {
                  f.name = newName; f.user = newUser; f.gst = newGst;
                  f.rent = newRentStatus; f.defaultRent = newRentStatus;
                  f.rentAmount = newRentAmt; f.taxableAmount = newTaxAmt;
                }
              });
              applyQrmpFiltersAndRender();
            }
          } else if (schemeVal === 'composition') {
            const data = await apiFetch(`/api/composition/clients/${encodeURIComponent(clientId)}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: newName, 
                user: newUser, 
                gst: newGst,
                defaultRent: newRentStatus,
                rentAmount: newRentAmt
              })
            });
            if (data.success) {
              await updateCompositionFiling(clientId, { 
                name: newName,
                user: newUser,
                gst: newGst,
                rent: newRentStatus,
                rentAmount: newRentAmt,
                taxableTurnover: newTaxAmt 
              });
              allCompositionFilings.forEach(f => {
                if (f.id === clientId) {
                  f.name = newName; 
                  f.user = newUser; 
                  f.gst = newGst; 
                  f.rent = newRentStatus;
                  f.defaultRent = newRentStatus;
                  f.rentAmount = newRentAmt;
                  f.taxableTurnover = newTaxAmt;
                }
              });
              applyCompositionFiltersAndRender();
            }
          }

          const modal = document.getElementById('modalEditShopName');
          if (modal) modal.style.display = 'none';
          showToast(`Updated details for "${newName}"`);
        } catch (err) {
          showToast('Failed to save details: ' + err.message);
        }
      });
    }

    // Modal Delete Shop Button
    const btnModalDeleteShop = document.getElementById('btnModalDeleteShop');
    if (btnModalDeleteShop) {
      btnModalDeleteShop.addEventListener('click', async () => {
        const clientId = document.getElementById('editShopId').value;
        const schemeVal = document.getElementById('editShopScheme').value || 'monthly';
        const shopName = document.getElementById('editShopInputName').value.trim() || 'this shop';

        if (confirm(`Are you sure you want to delete "${shopName}"?`)) {
          const modal = document.getElementById('modalEditShopName');
          if (modal) modal.style.display = 'none';
          if (schemeVal === 'monthly') await deleteShop(clientId, shopName);
          else if (schemeVal === 'qrmp') await deleteQrmpShop(clientId, shopName);
          else if (schemeVal === 'composition') await deleteCompositionShop(clientId, shopName);
        }
      });
    }

    // Close buttons on all modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close');
        const m = document.getElementById(modalId);
        if (m) m.style.display = 'none';
      });
    });

    // Close modal when tapping backdrop (essential for mobile & tablet usability)
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.style.display = 'none';
        }
      });
    });

    // Close modal on Escape key for tablet keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach(m => {
          m.style.display = 'none';
        });
      }
    });

    // Filing Date Form Submit
    document.getElementById('filingDateForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const clientId = document.getElementById('filingDateClientId').value;
      const returnType = document.getElementById('filingDateReturnType').value;
      const scheme = document.getElementById('filingDateScheme').value || 'monthly';
      const filingDate = document.getElementById('filingDateField').value;
      const arn = document.getElementById('filingDateArnField').value.trim();

      const updates = {};
      if (scheme === 'monthly') {
        if (returnType === 'gstr1') {
          updates.gstr1 = 'Filed';
          updates.gstr1Date = filingDate;
          if (arn) updates.gstr1Arn = arn;
        } else {
          updates.gstr3b = 'Filed';
          updates.gstr3bDate = filingDate;
          if (arn) updates.gstr3bArn = arn;
        }
        await updateFiling(clientId, updates);
        applyFiltersAndRender();
      } else if (scheme === 'qrmp') {
        updates[returnType] = 'Filed';
        updates[`${returnType}Date`] = filingDate;
        if (arn) updates[`${returnType}Arn`] = arn;
        await updateQrmpFiling(clientId, updates);
      } else if (scheme === 'composition') {
        updates[returnType] = 'Filed';
        updates[`${returnType}Date`] = filingDate;
        if (arn) updates[`${returnType}Arn`] = arn;
        await updateCompositionFiling(clientId, updates);
      }

      modalFilingDate.style.display = 'none';
      showToast(`✓ Marked as Filed on ${filingDate}!`);
    });

    // Revert to Pending Button inside Filing Date Modal
    document.getElementById('btnRevertToPending').addEventListener('click', async () => {
      const clientId = document.getElementById('filingDateClientId').value;
      const returnType = document.getElementById('filingDateReturnType').value;
      const scheme = document.getElementById('filingDateScheme').value || 'monthly';

      const updates = {};
      if (scheme === 'monthly') {
        const item = allFilings.find(f => f.id === clientId);
        if (returnType === 'gstr1') {
          updates.gstr1 = 'Pending';
          updates.gstr1Date = '';
          updates.gstr1Arn = '';
          if (item && item.gstr3b === 'Filed') {
            updates.gstr3b = 'Pending';
            updates.gstr3bDate = '';
            updates.gstr3bArn = '';
            showToast('Notice: GSTR-3B was also reset to Pending because GSTR-1 is pending.');
          }
        } else {
          updates.gstr3b = 'Pending';
          updates.gstr3bDate = '';
          updates.gstr3bArn = '';
        }
        await updateFiling(clientId, updates);
        applyFiltersAndRender();
      } else if (scheme === 'qrmp') {
        const item = allQrmpFilings.find(f => f.id === clientId);
        updates[returnType] = 'Pending';
        updates[`${returnType}Date`] = '';
        updates[`${returnType}Arn`] = '';

        // If M3 GSTR-1 is reverted to Pending, Quarterly GSTR-3B MUST be reset to Pending because M3 is compulsory!
        if (returnType === 'm3Gstr1' && item && item.gstr3b === 'Filed') {
          updates.gstr3b = 'Pending';
          updates.gstr3bDate = '';
          updates.gstr3bArn = '';
          showToast('Notice: Quarterly GSTR-3B was also reset to Pending because Month 3 GSTR-1 is now pending.');
        }
        await updateQrmpFiling(clientId, updates);
      } else if (scheme === 'composition') {
        updates[returnType] = 'Pending';
        updates[`${returnType}Date`] = '';
        updates[`${returnType}Arn`] = '';
        await updateCompositionFiling(clientId, updates);
      }

      modalFilingDate.style.display = 'none';
      showToast(`Switched back to Pending`);
    });

    // Modal Copy Username
    const btnCopyModalUser = document.getElementById('btnCopyModalUser');
    if (btnCopyModalUser) {
      btnCopyModalUser.addEventListener('click', () => {
        const u = document.getElementById('editShopInputUser').value.trim();
        if (u) {
          navigator.clipboard.writeText(u);
          showToast(`Copied Username: "${u}"`);
        }
      });
    }

    // Modal Copy GSTIN
    const btnCopyModalGst = document.getElementById('btnCopyModalGst');
    if (btnCopyModalGst) {
      btnCopyModalGst.addEventListener('click', () => {
        const g = document.getElementById('editShopInputGst').value.trim().toUpperCase();
        if (g) {
          navigator.clipboard.writeText(g);
          showToast(`Copied GSTIN: "${g}"`);
        }
      });
    }

    // Modal Open Portal Login
    const btnModalPortalLogin = document.getElementById('btnModalPortalLogin');
    if (btnModalPortalLogin) {
      btnModalPortalLogin.addEventListener('click', () => {
        const u = document.getElementById('editShopInputUser').value.trim();
        if (u) {
          navigator.clipboard.writeText(u).then(() => {
            showToast(`📋 Copied username "${u}"! Press Ctrl+V in the Username box on GST Portal.`);
          }).catch(() => {
            showToast(`Opening GST Portal for ${u}...`);
          });
        }
        window.open('https://services.gst.gov.in/services/login', '_blank');
      });
    }

    // Rollover Form Submit
    document.getElementById('rolloverForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('rolloverNewMonth').value.trim();
      const title = document.getElementById('rolloverNewTitle').value.trim();
      const g1Due = document.getElementById('rolloverG1Due').value.trim();
      const g3bDue = document.getElementById('rolloverG3bDue').value.trim();
      const sourceVal = document.getElementById('rolloverSourceMonth').value;

      try {
        if (currentScheme === 'monthly') {
          const data = await apiFetch('/api/months/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, title, g1Due, g3bDue, sourceMonth: sourceVal })
          });
          if (data.success) {
            modalRollover.style.display = 'none';
            document.getElementById('rolloverForm').reset();
            showToast(data.message);
            await fetchMonths();
            currentMonth = newName;
            renderPeriodDropdown();
            await fetchFilings(currentMonth);
          } else {
            alert(data.error || 'Failed to create month');
          }
        } else if (currentScheme === 'qrmp') {
          const data = await apiFetch('/api/qrmp/quarters/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, title, sourceQuarter: sourceVal })
          });
          if (data.success) {
            modalRollover.style.display = 'none';
            document.getElementById('rolloverForm').reset();
            showToast(data.message);
            await fetchQrmpQuarters();
            currentQrmpQuarter = newName;
            renderPeriodDropdown();
            await fetchQrmpFilings(currentQrmpQuarter);
          } else {
            alert(data.error || 'Failed to create quarter');
          }
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });

    // Master Scheme Filter Buttons (Segmented pills & fallback filter pills)
    document.querySelectorAll('.master-scheme-pills .master-pill-btn, .master-scheme-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.getAttribute('data-scheme-filter');
        setMasterSchemeFilter(filter);
      });
    });

    // Master Search Input
    const mSearchInput = document.getElementById('masterSearchInput');
    if (mSearchInput) {
      mSearchInput.addEventListener('input', (e) => {
        masterSearchQuery = e.target.value.trim();
        const clearBtn = document.getElementById('btnMasterClearSearch');
        if (clearBtn) clearBtn.style.display = masterSearchQuery ? 'block' : 'none';
        renderMasterTable();
      });
    }

    const btnMClear = document.getElementById('btnMasterClearSearch');
    if (btnMClear) {
      btnMClear.addEventListener('click', () => {
        masterSearchQuery = '';
        if (mSearchInput) mSearchInput.value = '';
        btnMClear.style.display = 'none';
        renderMasterTable();
      });
    }

    // Master Secondary Filters (Status & Premises)
    const mStatusFilter = document.getElementById('masterStatusFilter');
    if (mStatusFilter) {
      mStatusFilter.addEventListener('change', (e) => {
        masterStatusFilter = e.target.value;
        renderMasterTable();
      });
    }

    const mPremisesFilter = document.getElementById('masterPremisesFilter');
    if (mPremisesFilter) {
      mPremisesFilter.addEventListener('change', (e) => {
        masterPremisesFilter = e.target.value;
        renderMasterTable();
      });
    }

    // Master Table vs Cards Toggle
    const btnMTable = document.getElementById('btnMasterTable');
    if (btnMTable) {
      btnMTable.addEventListener('click', () => setMasterViewMode('table'));
    }
    const btnMCards = document.getElementById('btnMasterCards');
    if (btnMCards) {
      btnMCards.addEventListener('click', () => setMasterViewMode('cards'));
    }

    // Master Export CSV (Controls bar and Hero header button)
    const btnMExport = document.getElementById('btnMasterExportCsv');
    if (btnMExport) {
      btnMExport.addEventListener('click', () => exportMasterCSV());
    }
    const btnMExportTop = document.getElementById('btnMasterExportCsvTop');
    if (btnMExportTop) {
      btnMExportTop.addEventListener('click', () => exportMasterCSV());
    }

    // Master Refresh Button
    const btnMRefresh = document.getElementById('btnMasterRefresh');
    if (btnMRefresh) {
      btnMRefresh.addEventListener('click', async () => {
        showToast('Refreshing Master Compliance Directory...');
        await loadMasterDataAndRender(true);
        showToast('✓ Master Compliance Directory Refreshed (148 Companies)');
      });
    }

    // Master Reset Filters
    const btnMReset = document.getElementById('btnResetMasterFilters');
    if (btnMReset) {
      btnMReset.addEventListener('click', () => resetMasterFilters());
    }

    // Master KPI Cards Click Handlers
    const kpiTotal = document.getElementById('kpiCardMasterTotal');
    if (kpiTotal) kpiTotal.addEventListener('click', () => setMasterSchemeFilter('all'));
    const kpiM = document.getElementById('kpiCardMasterMonthly');
    if (kpiM) kpiM.addEventListener('click', () => setMasterSchemeFilter('monthly'));
    const kpiQ = document.getElementById('kpiCardMasterQrmp');
    if (kpiQ) kpiQ.addEventListener('click', () => setMasterSchemeFilter('qrmp'));
    const kpiC = document.getElementById('kpiCardMasterComp');
    if (kpiC) kpiC.addEventListener('click', () => setMasterSchemeFilter('composition'));

    // Master Period Filter Buttons inside Company Detail Modal
    const btnPerFilled = document.getElementById('btnMasterPeriodFilterFilled');
    if (btnPerFilled) {
      btnPerFilled.addEventListener('click', () => setMasterPeriodFilter('filled_only'));
    }
    const btnPerAll = document.getElementById('btnMasterPeriodFilterAll');
    if (btnPerAll) {
      btnPerAll.addEventListener('click', () => setMasterPeriodFilter('all'));
    }

    // Master Print Company Details & Filing History (Header & Footer)
    const btnMPrint = document.getElementById('btnMasterPrintReport');
    if (btnMPrint) {
      btnMPrint.addEventListener('click', () => printMasterCompanyDetails());
    }
    const btnMPrintFooter = document.getElementById('btnMasterPrintReportFooter');
    if (btnMPrintFooter) {
      btnMPrintFooter.addEventListener('click', () => printMasterCompanyDetails());
    }

    // Master Edit Filing Form Submit
    const editForm = document.getElementById('masterEditFilingForm');
    if (editForm) {
      editForm.addEventListener('submit', handleSaveMasterFiling);
    }
  }

  // ==========================================================================
  // MASTER COMPLIANCE DIRECTORY (Unified Monthly, QRMP, Composition View)
  // ==========================================================================

  let masterData = null;
  let masterSchemeFilter = 'all'; // 'all' | 'monthly' | 'qrmp' | 'composition'
  let masterSearchQuery = '';
  let masterStatusFilter = 'all'; // 'all' | 'has_filed' | 'pending_only'
  let masterPremisesFilter = 'all'; // 'all' | 'rent' | 'own'
  let masterViewMode = localStorage.getItem('gstr_master_view') || (window.innerWidth <= 640 ? 'cards' : 'table');
  let activeMasterCompanyId = null;
  let activeMasterCompanyScheme = null;
  let activeMasterPeriodFilter = 'filled_only'; // 'filled_only' | 'all'

  async function loadMasterData(force = false) {
    if (!force && masterData && masterData.clients && masterData.clients.length > 0) {
      return masterData;
    }
    try {
      const res = await apiFetch('/api/master-data');
      if (res && res.success) {
        masterData = res;
      }
    } catch (err) {
      console.warn('API /api/master-data fetch failed, trying local fallback:', err);
    }
    if (!masterData && window.__LOCAL_FALLBACK_DB) {
      masterData = JSON.parse(JSON.stringify(window.__LOCAL_FALLBACK_DB));
    }
    return masterData;
  }

  function getUnifiedMasterCompanies() {
    if (!masterData) return [];

    const monthlyFilings = masterData.filings || {};
    const qrmpFilings = masterData.qrmpFilings || {};
    const compFilings = masterData.compositionFilings || {};

    const months = masterData.months || [];
    const qrmpQuarters = masterData.qrmpQuarters || [];
    const compQuarters = masterData.compositionQuarters || [];

    const list = [];

    // 1. Monthly (63)
    (masterData.clients || []).forEach((c, idx) => {
      let filedCount = 0;
      let totalTax = 0;
      let latestFiledPeriod = '';
      let latestFiledDate = '';

      months.forEach(m => {
        const f = monthlyFilings[m.name] ? monthlyFilings[m.name][c.id] : null;
        if (f && (f.gstr1 === 'Filed' || f.gstr3b === 'Filed')) {
          filedCount++;
          if (!latestFiledPeriod) latestFiledPeriod = m.name;
          if (f.gstr3bDate && !latestFiledDate) latestFiledDate = f.gstr3bDate;
          else if (f.gstr1Date && !latestFiledDate) latestFiledDate = f.gstr1Date;
          if (f.taxableAmount) {
            const num = parseFloat(String(f.taxableAmount).replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) totalTax += num;
          }
        }
      });

      list.push({
        id: c.id,
        sno: idx + 1,
        name: c.name,
        user: c.user || '',
        gst: c.gst || '',
        rent: c.defaultRent || c.rent || 'Rent',
        rentAmount: c.rentAmount || '',
        scheme: 'monthly',
        schemeLabel: 'Monthly (3B)',
        filedCount,
        totalPeriods: months.length,
        totalTax,
        latestFiledPeriod,
        latestFiledDate
      });
    });

    // 2. QRMP (62)
    (masterData.qrmpClients || []).forEach((c, idx) => {
      let filedCount = 0;
      let totalTax = 0;
      let latestFiledPeriod = '';
      let latestFiledDate = '';

      qrmpQuarters.forEach(q => {
        const f = qrmpFilings[q.name] ? qrmpFilings[q.name][c.id] : null;
        if (f && (f.gstr3b === 'Filed' || f.m1Iff === 'Filed' || f.m2Iff === 'Filed' || f.m3Gstr1 === 'Filed')) {
          filedCount++;
          if (!latestFiledPeriod) latestFiledPeriod = q.name;
          if (f.gstr3bDate && !latestFiledDate) latestFiledDate = f.gstr3bDate;
          if (f.taxableAmount) {
            const num = parseFloat(String(f.taxableAmount).replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) totalTax += num;
          }
        }
      });

      list.push({
        id: c.id,
        sno: idx + 1,
        name: c.name,
        user: c.user || '',
        gst: c.gst || '',
        rent: c.defaultRent || c.rent || 'Rent',
        rentAmount: c.rentAmount || '',
        scheme: 'qrmp',
        schemeLabel: 'QRMP (Quarterly)',
        filedCount,
        totalPeriods: qrmpQuarters.length,
        totalTax,
        latestFiledPeriod,
        latestFiledDate
      });
    });

    // 3. Composition (23)
    (masterData.compositionClients || []).forEach((c, idx) => {
      let filedCount = 0;
      let totalTax = 0;
      let totalTurnover = 0;
      let latestFiledPeriod = '';
      let latestFiledDate = '';

      compQuarters.forEach(q => {
        const f = compFilings[q.name] ? compFilings[q.name][c.id] : null;
        if (f && (f.cmp08 === 'Filed' || f.gstr4 === 'Filed')) {
          filedCount++;
          if (!latestFiledPeriod) latestFiledPeriod = q.name;
          if (f.cmp08Date && !latestFiledDate) latestFiledDate = f.cmp08Date;
          if (f.taxAmount) {
            const num = parseFloat(String(f.taxAmount).replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) totalTax += num;
          }
          if (f.taxableTurnover) {
            const num = parseFloat(String(f.taxableTurnover).replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) totalTurnover += num;
          }
        }
      });

      list.push({
        id: c.id,
        sno: idx + 1,
        name: c.name,
        user: c.user || '',
        gst: c.gst || '',
        rent: c.defaultRent || c.rent || 'Rent',
        rentAmount: c.rentAmount || '',
        scheme: 'composition',
        schemeLabel: 'Composition (CMP-08)',
        taxRate: c.taxRate || '1%',
        filedCount,
        totalPeriods: compQuarters.length,
        totalTax,
        totalTurnover,
        latestFiledPeriod,
        latestFiledDate
      });
    });

    return list;
  }

  function updateMasterKpis(companies) {
    const total = companies.length;
    let monthly = 0;
    let qrmp = 0;
    let comp = 0;
    let totalFiledReturns = 0;

    companies.forEach(c => {
      if (c.scheme === 'monthly') monthly++;
      else if (c.scheme === 'qrmp') qrmp++;
      else if (c.scheme === 'composition') comp++;
      totalFiledReturns += (c.filedCount || 0);
    });

    const elTotal = document.getElementById('kpiMasterTotal');
    const elMonthly = document.getElementById('kpiMasterMonthly');
    const elQrmp = document.getElementById('kpiMasterQrmp');
    const elComp = document.getElementById('kpiMasterComp');
    const elFiled = document.getElementById('kpiMasterFiled');

    if (elTotal) elTotal.textContent = total;
    if (elMonthly) elMonthly.textContent = monthly;
    if (elQrmp) elQrmp.textContent = qrmp;
    if (elComp) elComp.textContent = comp;
    if (elFiled) elFiled.textContent = totalFiledReturns;

    const bAll = document.getElementById('badgeMasterAll');
    const bMonthly = document.getElementById('badgeMasterMonthly');
    const bQrmp = document.getElementById('badgeMasterQrmp');
    const bComp = document.getElementById('badgeMasterComp');

    if (bAll) bAll.textContent = total;
    if (bMonthly) bMonthly.textContent = monthly;
    if (bQrmp) bQrmp.textContent = qrmp;
    if (bComp) bComp.textContent = comp;
  }

  function filterMasterCompanies(companies) {
    return companies.filter(c => {
      // Scheme filter
      if (masterSchemeFilter !== 'all' && c.scheme !== masterSchemeFilter) {
        return false;
      }

      // Search query
      if (masterSearchQuery) {
        const q = masterSearchQuery.toLowerCase();
        const matchName = (c.name || '').toLowerCase().includes(q);
        const matchUser = (c.user || '').toLowerCase().includes(q);
        const matchGst = (c.gst || '').toLowerCase().includes(q);
        const matchRent = (c.rent || '').toLowerCase().includes(q);
        const matchAmt = String(c.rentAmount || '').toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchGst && !matchRent && !matchAmt) {
          return false;
        }
      }

      // Status filter
      if (masterStatusFilter === 'has_filed' && c.filedCount === 0) {
        return false;
      }
      if (masterStatusFilter === 'pending_only' && c.filedCount > 0) {
        return false;
      }

      // Premises filter
      if (masterPremisesFilter === 'rent' && c.rent !== 'Rent') {
        return false;
      }
      if (masterPremisesFilter === 'own' && c.rent === 'Rent') {
        return false;
      }

      return true;
    });
  }

  function renderMasterTable() {
    const allCompanies = getUnifiedMasterCompanies();
    updateMasterKpis(allCompanies);

    const filtered = filterMasterCompanies(allCompanies);
    const tbody = document.getElementById('masterTableBody');
    const tableWrapper = document.getElementById('masterTableWrapper');
    const cardsContainer = document.getElementById('masterCardsContainer');
    const noResults = document.getElementById('masterNoResults');

    const showingCountEl = document.getElementById('masterShowingCount');
    const totalCountEl = document.getElementById('masterTotalCount');
    const summaryTextEl = document.getElementById('masterFilterSummaryText');

    if (showingCountEl) showingCountEl.textContent = filtered.length;
    if (totalCountEl) totalCountEl.textContent = allCompanies.length;
    if (summaryTextEl) {
      if (masterSchemeFilter !== 'all' || masterStatusFilter !== 'all' || masterPremisesFilter !== 'all' || masterSearchQuery) {
        summaryTextEl.textContent = `(Filtered from ${allCompanies.length} total)`;
      } else {
        summaryTextEl.textContent = '';
      }
    }

    if (filtered.length === 0) {
      if (tbody) tbody.innerHTML = '';
      if (cardsContainer) cardsContainer.innerHTML = '';
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
      return;
    }
    if (noResults) noResults.style.display = 'none';

    // Apply view mode visibility
    if (masterViewMode === 'table') {
      if (tableWrapper) tableWrapper.style.display = 'block';
      if (cardsContainer) cardsContainer.style.display = 'none';
    } else {
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'grid';
    }

    // 1. Render Table Rows (High-density SaaS layout with 9 columns)
    if (tbody) {
      tbody.innerHTML = filtered.map((c, index) => {
        const schemeBadgeClass = c.scheme === 'monthly' ? 'badge-scheme-monthly' : (c.scheme === 'qrmp' ? 'badge-scheme-qrmp' : 'badge-scheme-comp');
        const schemePillLabel = c.scheme === 'monthly' ? 'Monthly' : (c.scheme === 'qrmp' ? 'QRMP' : 'Composition');
        const rentDisplay = c.rent === 'Rent'
          ? `<span class="badge-rent">Rent: ₹${(c.rentAmount ? formatCurrency2Dec(c.rentAmount) : '0.00')}</span>`
          : `<span class="badge-own">${escapeHtml(c.rent || 'Own')}</span>`;

        const compliancePill = c.filedCount > 0
          ? `<span class="status-pill-filed" title="Latest filed: ${escapeHtml(c.latestFiledPeriod)}">✓ ${c.filedCount} ${c.scheme === 'monthly' ? 'Months' : 'Quarters'} Filed</span>`
          : `<span class="status-pill-pending">⏳ All Pending</span>`;

        const taxFormatted = (c.totalTax && c.totalTax > 0)
          ? `<span style="font-weight: 700; color: #4f46e5; font-size: 0.82rem;">₹ ${formatCurrency2Dec(c.totalTax)}</span>`
          : `<span style="color: #94a3b8; font-size: 0.8rem;">--</span>`;

        return `
          <tr class="master-row" onclick="openMasterCompanyDetail('${escapeHtml(c.id)}', '${escapeHtml(c.scheme)}')">
            <td style="text-align: center; color: #64748b; font-weight: 600; font-family: monospace;">${index + 1}</td>
            <td><span class="badge-scheme ${schemeBadgeClass}">${schemePillLabel}</span></td>
            <td>
              <div style="font-weight: 600; color: #0f172a; cursor: pointer; line-height: 1.3;" title="Click to view filing history">
                ${escapeHtml(c.name)}
              </div>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 5px; font-family: monospace; font-size: 0.8rem;">
                <span style="font-weight: 500; color: #334155;">${escapeHtml(c.user || '--')}</span>
                ${c.user ? `<button type="button" class="btn-copy-chip" onclick="event.stopPropagation(); copyMasterText('${escapeHtml(c.user)}', 'User copied')" title="Copy username">Copy</button>` : ''}
              </div>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 5px; font-family: monospace; font-size: 0.8rem;">
                <span style="font-weight: 600; color: #059669;">${escapeHtml(c.gst || '--')}</span>
                ${c.gst ? `<button type="button" class="btn-copy-chip" onclick="event.stopPropagation(); copyMasterText('${escapeHtml(c.gst)}', 'GSTIN copied')" title="Copy GSTIN">Copy</button>` : ''}
                ${c.gst ? `<a href="https://services.gst.gov.in/services/login" target="_blank" onclick="event.stopPropagation();" title="Open GST Portal" class="portal-link-btn">↗ Portal</a>` : ''}
              </div>
            </td>
            <td>${rentDisplay}</td>
            <td>${compliancePill}</td>
            <td style="text-align: right;">${taxFormatted}</td>
            <td style="text-align: center;">
              <button type="button" class="btn btn-xs btn-outline-primary" onclick="event.stopPropagation(); openMasterCompanyDetail('${escapeHtml(c.id)}', '${escapeHtml(c.scheme)}')">
                View History &rarr;
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 2. Render Cards View (Spacious 3-column max grid)
    if (cardsContainer) {
      cardsContainer.innerHTML = filtered.map((c, index) => {
        const schemeBadgeClass = c.scheme === 'monthly' ? 'badge-scheme-monthly' : (c.scheme === 'qrmp' ? 'badge-scheme-qrmp' : 'badge-scheme-comp');
        const schemePillLabel = c.scheme === 'monthly' ? 'Monthly' : (c.scheme === 'qrmp' ? 'QRMP' : 'Composition');
        const compliancePill = c.filedCount > 0
          ? `<span class="status-pill-filed">✓ ${c.filedCount} ${c.scheme === 'monthly' ? 'Months' : 'Quarters'} Filed</span>`
          : `<span class="status-pill-pending">⏳ All Pending</span>`;

        const rentDisplay = c.rent === 'Rent'
          ? `<span class="badge-rent">Rent: ₹${(c.rentAmount ? formatCurrency2Dec(c.rentAmount) : '0.00')}</span>`
          : `<span class="badge-own">${escapeHtml(c.rent || 'Own')}</span>`;

        return `
          <div class="master-company-card" onclick="openMasterCompanyDetail('${escapeHtml(c.id)}', '${escapeHtml(c.scheme)}')">
            <div class="master-card-header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="master-card-sno">#${index + 1}</span>
                <span class="badge-scheme ${schemeBadgeClass}">${schemePillLabel}</span>
              </div>
              <div>${compliancePill}</div>
            </div>

            <div class="master-card-title">${escapeHtml(c.name)}</div>

            <div class="master-card-grid-meta">
              <div class="meta-item">
                <div class="meta-label">USER</div>
                <div class="meta-val" style="display: flex; align-items: center; gap: 5px; font-family: monospace;">
                  <span>${escapeHtml(c.user || '--')}</span>
                  ${c.user ? `<button type="button" class="btn-copy-chip" onclick="event.stopPropagation(); copyMasterText('${escapeHtml(c.user)}', 'User copied')">Copy</button>` : ''}
                </div>
              </div>
              <div class="meta-item">
                <div class="meta-label">GSTIN</div>
                <div class="meta-val" style="display: flex; align-items: center; gap: 5px; font-family: monospace;">
                  <span style="color: #059669; font-weight: 700;">${escapeHtml(c.gst || '--')}</span>
                  ${c.gst ? `<button type="button" class="btn-copy-chip" onclick="event.stopPropagation(); copyMasterText('${escapeHtml(c.gst)}', 'GSTIN copied')">Copy</button>` : ''}
                </div>
              </div>
              <div class="meta-item">
                <div class="meta-label">PREMISES</div>
                <div class="meta-val">${rentDisplay}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">RECORDED TAX</div>
                <div class="meta-val" style="color: #4f46e5; font-weight: 700;">
                  ${c.totalTax > 0 ? '₹ ' + formatCurrency2Dec(c.totalTax) : '--'}
                </div>
              </div>
            </div>

            <div class="master-card-footer">
              <span style="font-size: 0.75rem; color: #64748b;">
                ${c.latestFiledPeriod ? `Latest: <strong>${escapeHtml(c.latestFiledPeriod)}</strong>` : 'No returns filed'}
              </span>
              <button type="button" class="btn btn-xs btn-outline-primary" onclick="event.stopPropagation(); openMasterCompanyDetail('${escapeHtml(c.id)}', '${escapeHtml(c.scheme)}')">
                View History &rarr;
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function setMasterViewMode(mode) {
    masterViewMode = mode;
    try { localStorage.setItem('gstr_master_view', mode); } catch (_) {}
    const btnTable = document.getElementById('btnMasterTable');
    const btnCards = document.getElementById('btnMasterCards');
    if (btnTable && btnCards) {
      btnTable.classList.toggle('active', mode === 'table');
      btnCards.classList.toggle('active', mode === 'cards');
    }
    const tableWrapper = document.getElementById('masterTableWrapper');
    const cardsContainer = document.getElementById('masterCardsContainer');
    if (tableWrapper && cardsContainer) {
      if (mode === 'table') {
        tableWrapper.style.display = 'block';
        cardsContainer.style.display = 'none';
      } else {
        tableWrapper.style.display = 'none';
        cardsContainer.style.display = 'grid';
      }
    }
  }

  function setMasterSchemeFilter(scheme) {
    masterSchemeFilter = scheme;
    // Update pills
    document.querySelectorAll('.master-scheme-pills .master-pill-btn, .master-scheme-filters .filter-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-scheme-filter') === scheme);
    });
    // Update KPI card active outlines
    const kpiTotal = document.getElementById('kpiCardMasterTotal');
    const kpiM = document.getElementById('kpiCardMasterMonthly');
    const kpiQ = document.getElementById('kpiCardMasterQrmp');
    const kpiC = document.getElementById('kpiCardMasterComp');
    if (kpiTotal) kpiTotal.classList.toggle('active', scheme === 'all');
    if (kpiM) kpiM.classList.toggle('active', scheme === 'monthly');
    if (kpiQ) kpiQ.classList.toggle('active', scheme === 'qrmp');
    if (kpiC) kpiC.classList.toggle('active', scheme === 'composition');

    renderMasterTable();
  }

  function resetMasterFilters() {
    masterSchemeFilter = 'all';
    masterSearchQuery = '';
    masterStatusFilter = 'all';
    masterPremisesFilter = 'all';

    const input = document.getElementById('masterSearchInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('btnMasterClearSearch');
    if (clearBtn) clearBtn.style.display = 'none';

    const stSelect = document.getElementById('masterStatusFilter');
    if (stSelect) stSelect.value = 'all';
    const prSelect = document.getElementById('masterPremisesFilter');
    if (prSelect) prSelect.value = 'all';

    document.querySelectorAll('.master-scheme-pills .master-pill-btn, .master-scheme-filters .filter-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-scheme-filter') === 'all');
    });

    const kpiTotal = document.getElementById('kpiCardMasterTotal');
    const kpiM = document.getElementById('kpiCardMasterMonthly');
    const kpiQ = document.getElementById('kpiCardMasterQrmp');
    const kpiC = document.getElementById('kpiCardMasterComp');
    if (kpiTotal) kpiTotal.classList.add('active');
    if (kpiM) kpiM.classList.remove('active');
    if (kpiQ) kpiQ.classList.remove('active');
    if (kpiC) kpiC.classList.remove('active');

    renderMasterTable();
    showToast('Filters reset to default');
  }

  async function loadMasterDataAndRender(force = false) {
    await loadMasterData(force);
    setMasterViewMode(masterViewMode);
    renderMasterTable();
  }

  function openMasterCompanyDetail(companyId, scheme) {
    activeMasterCompanyId = companyId;
    activeMasterCompanyScheme = scheme;

    const allCompanies = getUnifiedMasterCompanies();
    const comp = allCompanies.find(c => c.id === companyId && c.scheme === scheme);
    if (!comp) {
      showToast('Company record not found');
      return;
    }

    // Set Header
    const nameEl = document.getElementById('modalMasterCompanyName');
    const badgeEl = document.getElementById('modalMasterCompanySchemeBadge');
    const userEl = document.getElementById('modalMasterUser');
    const gstinEl = document.getElementById('modalMasterGstin');
    const rentEl = document.getElementById('modalMasterRent');

    if (nameEl) nameEl.textContent = comp.name;
    if (badgeEl) {
      badgeEl.textContent = comp.schemeLabel;
      badgeEl.className = 'scheme-pill ' + (scheme === 'monthly' ? 'tab-pill' : (scheme === 'qrmp' ? 'tab-pill-qrmp' : 'tab-pill-comp'));
    }
    if (userEl) userEl.textContent = comp.user || '--';
    if (gstinEl) gstinEl.textContent = comp.gst || '--';
    if (rentEl) {
      rentEl.textContent = comp.rent === 'Rent'
        ? `Rent (₹${(comp.rentAmount ? formatCurrency2Dec(comp.rentAmount) : '0.00')})`
        : comp.rent || 'Own';
    }

    // Stats chips
    const statFilled = document.getElementById('modalStatFilled');
    const statTax = document.getElementById('modalStatTax');
    const statDate = document.getElementById('modalStatDate');

    if (statFilled) statFilled.textContent = `${comp.filedCount} of ${comp.totalPeriods} periods`;
    if (statTax) statTax.textContent = `₹ ${formatCurrency2Dec(comp.totalTax || 0, '0.00')}`;
    if (statDate) statDate.textContent = comp.latestFiledDate || comp.latestFiledPeriod || 'None';

    // If company has filled periods, default to filled_only. If 0 filled periods, show all periods!
    activeMasterPeriodFilter = comp.filedCount > 0 ? 'filled_only' : 'all';
    const btnFilled = document.getElementById('btnMasterPeriodFilterFilled');
    const btnAll = document.getElementById('btnMasterPeriodFilterAll');
    if (btnFilled && btnAll) {
      btnFilled.classList.toggle('active', activeMasterPeriodFilter === 'filled_only');
      btnFilled.classList.toggle('btn-primary', activeMasterPeriodFilter === 'filled_only');
      btnFilled.classList.toggle('btn-outline', activeMasterPeriodFilter !== 'filled_only');

      btnAll.classList.toggle('active', activeMasterPeriodFilter === 'all');
      btnAll.classList.toggle('btn-primary', activeMasterPeriodFilter === 'all');
      btnAll.classList.toggle('btn-outline', activeMasterPeriodFilter !== 'all');
    }

    renderMasterPeriodsList();

    // Show modal
    const modal = document.getElementById('modalMasterCompany');
    if (modal) modal.style.display = 'flex';
  }

  function setMasterPeriodFilter(filter) {
    activeMasterPeriodFilter = filter;
    const btnFilled = document.getElementById('btnMasterPeriodFilterFilled');
    const btnAll = document.getElementById('btnMasterPeriodFilterAll');
    if (btnFilled && btnAll) {
      btnFilled.classList.toggle('active', filter === 'filled_only');
      btnFilled.classList.toggle('btn-primary', filter === 'filled_only');
      btnFilled.classList.toggle('btn-outline', filter !== 'filled_only');

      btnAll.classList.toggle('active', filter === 'all');
      btnAll.classList.toggle('btn-primary', filter === 'all');
      btnAll.classList.toggle('btn-outline', filter !== 'all');
    }
    renderMasterPeriodsList();
  }

  function renderMasterPeriodsList() {
    if (!activeMasterCompanyId || !activeMasterCompanyScheme || !masterData) return;

    const container = document.getElementById('masterCompanyPeriodsContainer');
    const emptyState = document.getElementById('masterCompanyEmptyPeriods');
    if (!container) return;

    const companyId = activeMasterCompanyId;
    const scheme = activeMasterCompanyScheme;

    let periodItems = [];

    if (scheme === 'monthly') {
      const months = masterData.months || [];
      const filings = masterData.filings || {};

      months.forEach(m => {
        const f = filings[m.name] ? filings[m.name][companyId] : null;
        const g1 = (f && f.gstr1 === 'Filed');
        const g3b = (f && f.gstr3b === 'Filed');
        const isFiled = g1 || g3b;

        if (activeMasterPeriodFilter === 'filled_only' && !isFiled) return;

        periodItems.push({
          period: m.name,
          g1Status: f ? (f.gstr1 || 'Pending') : 'Pending',
          g1Date: f ? (f.gstr1Date || '') : '',
          g1Arn: f ? (f.gstr1Arn || '') : '',
          g3bStatus: f ? (f.gstr3b || 'Pending') : 'Pending',
          g3bDate: f ? (f.gstr3bDate || '') : '',
          g3bArn: f ? (f.gstr3bArn || '') : '',
          tax: f ? (f.taxableAmount || '') : '',
          rent: f ? (f.rent || '') : '',
          rentAmount: f ? (f.rentAmount || '') : '',
          remarks: f ? (f.remarks || '') : ''
        });
      });
    } else if (scheme === 'qrmp') {
      const quarters = masterData.qrmpQuarters || [];
      const filings = masterData.qrmpFilings || {};

      quarters.forEach(q => {
        const f = filings[q.name] ? filings[q.name][companyId] : null;
        const isFiled = f && (f.gstr3b === 'Filed' || f.m1Iff === 'Filed' || f.m2Iff === 'Filed' || f.m3Gstr1 === 'Filed');

        if (activeMasterPeriodFilter === 'filled_only' && !isFiled) return;

        periodItems.push({
          period: q.name,
          m1Date: f ? (f.m1IffDate || '') : '',
          m1Arn: f ? (f.m1IffArn || '') : '',
          m2Date: f ? (f.m2IffDate || '') : '',
          m2Arn: f ? (f.m2IffArn || '') : '',
          m3Date: f ? (f.m3Gstr1Date || '') : '',
          m3Arn: f ? (f.m3Gstr1Arn || '') : '',
          g3bStatus: f ? (f.gstr3b || 'Pending') : 'Pending',
          g3bDate: f ? (f.gstr3bDate || '') : '',
          g3bArn: f ? (f.gstr3bArn || '') : '',
          tax: f ? (f.taxableAmount || '') : '',
          rent: f ? (f.rent || '') : '',
          rentAmount: f ? (f.rentAmount || '') : '',
          remarks: f ? (f.remarks || '') : ''
        });
      });
    } else if (scheme === 'composition') {
      const quarters = masterData.compositionQuarters || [];
      const filings = masterData.compositionFilings || {};

      quarters.forEach(q => {
        const f = filings[q.name] ? filings[q.name][companyId] : null;
        const isFiled = f && (f.cmp08 === 'Filed' || f.gstr4 === 'Filed');

        if (activeMasterPeriodFilter === 'filled_only' && !isFiled) return;

        periodItems.push({
          period: q.name,
          cmp08Status: f ? (f.cmp08 || 'Pending') : 'Pending',
          cmp08Date: f ? (f.cmp08Date || '') : '',
          cmp08Arn: f ? (f.cmp08Arn || '') : '',
          turnover: f ? (f.taxableTurnover || '') : '',
          tax: f ? (f.taxAmount || '') : '',
          g4Status: f ? (f.gstr4 || 'Pending') : 'Pending',
          g4Date: f ? (f.gstr4Date || '') : '',
          rent: f ? (f.rent || '') : '',
          rentAmount: f ? (f.rentAmount || '') : '',
          remarks: f ? (f.remarks || '') : ''
        });
      });
    }

    if (periodItems.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';

    // Build Table for scheme (Clean layout without Edit buttons, ready for printing)
    if (scheme === 'monthly') {
      container.innerHTML = `
        <table class="master-period-table">
          <thead>
            <tr>
              <th width="120">Return Month</th>
              <th>GSTR-1 (Sales)</th>
              <th>GSTR-3B (Tax Return)</th>
              <th width="140" style="text-align: right;">Tax Amount</th>
              <th width="170">Rent Info</th>
            </tr>
          </thead>
          <tbody>
            ${periodItems.map(item => `
              <tr>
                <td><strong style="color: #0f172a; font-size: 0.88rem;">${escapeHtml(item.period)}</strong></td>
                <td>
                  <div>
                    <span class="${item.g1Status === 'Filed' ? 'status-pill-filed' : 'status-pill-pending'}">${escapeHtml(item.g1Status)}</span>
                    ${item.g1Date ? `<div style="font-size: 0.74rem; color: #059669; font-weight: 500; margin-top: 3px;">📅 ${escapeHtml(item.g1Date)}</div>` : ''}
                    ${item.g1Arn ? `<div style="font-size: 0.7rem; color: #64748b; font-family: monospace;">ARN: ${escapeHtml(item.g1Arn)}</div>` : ''}
                  </div>
                </td>
                <td>
                  <div>
                    <span class="${item.g3bStatus === 'Filed' ? 'status-pill-filed' : 'status-pill-pending'}">${escapeHtml(item.g3bStatus)}</span>
                    ${item.g3bDate ? `<div style="font-size: 0.74rem; color: #059669; font-weight: 500; margin-top: 3px;">📅 ${escapeHtml(item.g3bDate)}</div>` : ''}
                    ${item.g3bArn ? `<div style="font-size: 0.7rem; color: #64748b; font-family: monospace;">ARN: ${escapeHtml(item.g3bArn)}</div>` : ''}
                  </div>
                </td>
                <td style="text-align: right;">
                  <strong style="color: #4f46e5; font-size: 0.88rem;">${item.tax ? '₹ ' + formatCurrency2Dec(item.tax) : '--'}</strong>
                </td>
                <td>
                  <span style="font-size: 0.82rem; color: #475569;">${escapeHtml(item.rent || 'Own')} ${item.rentAmount ? '(₹' + formatCurrency2Dec(item.rentAmount) + ')' : ''}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (scheme === 'qrmp') {
      container.innerHTML = `
        <table class="master-period-table">
          <thead>
            <tr>
              <th width="140">Return Quarter</th>
              <th>M1 &amp; M2 (IFF)</th>
              <th>M3 (GSTR-1)</th>
              <th>GSTR-3B (Quarterly)</th>
              <th width="140" style="text-align: right;">Tax Amount</th>
            </tr>
          </thead>
          <tbody>
            ${periodItems.map(item => `
              <tr>
                <td><strong style="color: #0f172a; font-size: 0.88rem;">${escapeHtml(item.period)}</strong></td>
                <td>
                  <div style="font-size: 0.78rem;">
                    <div>M1: ${item.m1Date ? `<span style="color: #059669; font-weight: 600;">📅 ${escapeHtml(item.m1Date)}</span>` : '<span style="color: #94a3b8;">Pending</span>'}</div>
                    <div style="margin-top: 2px;">M2: ${item.m2Date ? `<span style="color: #059669; font-weight: 600;">📅 ${escapeHtml(item.m2Date)}</span>` : '<span style="color: #94a3b8;">Pending</span>'}</div>
                  </div>
                </td>
                <td>
                  <div style="font-size: 0.78rem;">
                    ${item.m3Date ? `<span style="color: #059669; font-weight: 600;">📅 ${escapeHtml(item.m3Date)}</span>` : '<span style="color: #94a3b8;">Pending</span>'}
                  </div>
                </td>
                <td>
                  <div>
                    <span class="${item.g3bStatus === 'Filed' ? 'status-pill-filed' : 'status-pill-pending'}">${escapeHtml(item.g3bStatus)}</span>
                    ${item.g3bDate ? `<div style="font-size: 0.74rem; color: #059669; font-weight: 500; margin-top: 3px;">📅 ${escapeHtml(item.g3bDate)}</div>` : ''}
                    ${item.g3bArn ? `<div style="font-size: 0.7rem; color: #64748b; font-family: monospace;">ARN: ${escapeHtml(item.g3bArn)}</div>` : ''}
                  </div>
                </td>
                <td style="text-align: right;">
                  <strong style="color: #4f46e5; font-size: 0.88rem;">${item.tax ? '₹ ' + formatCurrency2Dec(item.tax) : '--'}</strong>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (scheme === 'composition') {
      container.innerHTML = `
        <table class="master-period-table">
          <thead>
            <tr>
              <th width="140">Return Quarter</th>
              <th>CMP-08 (Quarterly Tax)</th>
              <th width="140" style="text-align: right;">Turnover</th>
              <th width="130" style="text-align: right;">Tax Amount</th>
              <th width="160">GSTR-4 (Annual)</th>
            </tr>
          </thead>
          <tbody>
            ${periodItems.map(item => `
              <tr>
                <td><strong style="color: #0f172a; font-size: 0.88rem;">${escapeHtml(item.period)}</strong></td>
                <td>
                  <div>
                    <span class="${item.cmp08Status === 'Filed' ? 'status-pill-filed' : 'status-pill-pending'}">${escapeHtml(item.cmp08Status)}</span>
                    ${item.cmp08Date ? `<div style="font-size: 0.74rem; color: #059669; font-weight: 500; margin-top: 3px;">📅 ${escapeHtml(item.cmp08Date)}</div>` : ''}
                    ${item.cmp08Arn ? `<div style="font-size: 0.7rem; color: #64748b; font-family: monospace;">ARN: ${escapeHtml(item.cmp08Arn)}</div>` : ''}
                  </div>
                </td>
                <td style="text-align: right;">
                  <strong style="color: #0284c7; font-size: 0.88rem;">${item.turnover ? '₹ ' + formatCurrency2Dec(item.turnover) : '--'}</strong>
                </td>
                <td style="text-align: right;">
                  <strong style="color: #4f46e5; font-size: 0.88rem;">${item.tax ? '₹ ' + formatCurrency2Dec(item.tax) : '--'}</strong>
                </td>
                <td>
                  <div>
                    <span class="${item.g4Status === 'Filed' ? 'status-pill-filed' : 'status-pill-pending'}">${escapeHtml(item.g4Status)}</span>
                    ${item.g4Date ? `<div style="font-size: 0.74rem; color: #059669; font-weight: 500; margin-top: 2px;">📅 ${escapeHtml(item.g4Date)}</div>` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }

  function printMasterCompanyDetails() {
    if (!activeMasterCompanyId || !activeMasterCompanyScheme || !masterData) {
      showToast('No company details selected for printing');
      return;
    }

    const allCompanies = getUnifiedMasterCompanies();
    const comp = allCompanies.find(c => c.id === activeMasterCompanyId && c.scheme === activeMasterCompanyScheme);
    if (!comp) {
      showToast('Company record not found');
      return;
    }

    const scheme = activeMasterCompanyScheme;
    const companyId = activeMasterCompanyId;
    let periodItems = [];

    if (scheme === 'monthly') {
      const months = masterData.months || [];
      const filings = masterData.filings || {};

      months.forEach(m => {
        const f = filings[m.name] ? filings[m.name][companyId] : null;
        const g1 = (f && f.gstr1 === 'Filed');
        const g3b = (f && f.gstr3b === 'Filed');
        const isFiled = g1 || g3b;

        if (activeMasterPeriodFilter === 'filled_only' && !isFiled) return;

        periodItems.push({
          period: m.name,
          g1Status: f ? (f.gstr1 || 'Pending') : 'Pending',
          g1Date: f ? (f.gstr1Date || '') : '',
          g1Arn: f ? (f.gstr1Arn || '') : '',
          g3bStatus: f ? (f.gstr3b || 'Pending') : 'Pending',
          g3bDate: f ? (f.gstr3bDate || '') : '',
          g3bArn: f ? (f.gstr3bArn || '') : '',
          tax: f ? (f.taxableAmount || '') : '',
          rent: f ? (f.rent || '') : '',
          rentAmount: f ? (f.rentAmount || '') : ''
        });
      });
    } else if (scheme === 'qrmp') {
      const quarters = masterData.qrmpQuarters || [];
      const filings = masterData.qrmpFilings || {};

      quarters.forEach(q => {
        const f = filings[q.name] ? filings[q.name][companyId] : null;
        const isFiled = f && (f.gstr3b === 'Filed' || f.m1Iff === 'Filed' || f.m2Iff === 'Filed' || f.m3Gstr1 === 'Filed');

        if (activeMasterPeriodFilter === 'filled_only' && !isFiled) return;

        periodItems.push({
          period: q.name,
          m1Date: f ? (f.m1IffDate || '') : '',
          m1Arn: f ? (f.m1IffArn || '') : '',
          m2Date: f ? (f.m2IffDate || '') : '',
          m2Arn: f ? (f.m2IffArn || '') : '',
          m3Date: f ? (f.m3Gstr1Date || '') : '',
          m3Arn: f ? (f.m3Gstr1Arn || '') : '',
          g3bStatus: f ? (f.gstr3b || 'Pending') : 'Pending',
          g3bDate: f ? (f.gstr3bDate || '') : '',
          g3bArn: f ? (f.gstr3bArn || '') : '',
          tax: f ? (f.taxableAmount || '') : ''
        });
      });
    } else if (scheme === 'composition') {
      const quarters = masterData.compositionQuarters || [];
      const filings = masterData.compositionFilings || {};

      quarters.forEach(q => {
        const f = filings[q.name] ? filings[q.name][companyId] : null;
        const isFiled = f && (f.cmp08 === 'Filed' || f.gstr4 === 'Filed');

        if (activeMasterPeriodFilter === 'filled_only' && !isFiled) return;

        periodItems.push({
          period: q.name,
          cmp08Status: f ? (f.cmp08 || 'Pending') : 'Pending',
          cmp08Date: f ? (f.cmp08Date || '') : '',
          cmp08Arn: f ? (f.cmp08Arn || '') : '',
          turnover: f ? (f.taxableTurnover || '') : '',
          tax: f ? (f.taxAmount || '') : '',
          g4Status: f ? (f.gstr4 || 'Pending') : 'Pending',
          g4Date: f ? (f.gstr4Date || '') : ''
        });
      });
    }

    const printDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    let tableHtml = '';

    if (scheme === 'monthly') {
      tableHtml = `
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 15%;">Return Month</th>
              <th style="width: 25%;">GSTR-1 (Sales)</th>
              <th style="width: 25%;">GSTR-3B (Tax Return)</th>
              <th style="width: 15%; text-align: right;">Tax Amount</th>
              <th style="width: 20%;">Rent Details</th>
            </tr>
          </thead>
          <tbody>
            ${periodItems.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 18px; color: #64748b;">No return periods to display.</td></tr>' : periodItems.map(p => `
              <tr>
                <td><strong>${escapeHtml(p.period)}</strong></td>
                <td>
                  <span class="badge ${p.g1Status === 'Filed' ? 'badge-filed' : 'badge-pending'}">${escapeHtml(p.g1Status)}</span>
                  ${p.g1Date ? `<div class="sub-info">Date: ${escapeHtml(p.g1Date)}</div>` : ''}
                  ${p.g1Arn ? `<div class="sub-arn">ARN: ${escapeHtml(p.g1Arn)}</div>` : ''}
                </td>
                <td>
                  <span class="badge ${p.g3bStatus === 'Filed' ? 'badge-filed' : 'badge-pending'}">${escapeHtml(p.g3bStatus)}</span>
                  ${p.g3bDate ? `<div class="sub-info">Date: ${escapeHtml(p.g3bDate)}</div>` : ''}
                  ${p.g3bArn ? `<div class="sub-arn">ARN: ${escapeHtml(p.g3bArn)}</div>` : ''}
                </td>
                <td style="text-align: right; font-weight: 600;">
                  ${p.tax ? '₹ ' + formatCurrency2Dec(p.tax) : '--'}
                </td>
                <td>
                  ${escapeHtml(p.rent || 'Own')} ${p.rentAmount ? '(₹' + formatCurrency2Dec(p.rentAmount) + ')' : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (scheme === 'qrmp') {
      tableHtml = `
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 18%;">Return Quarter</th>
              <th style="width: 24%;">M1 &amp; M2 (IFF)</th>
              <th style="width: 20%;">M3 (GSTR-1)</th>
              <th style="width: 23%;">GSTR-3B (Quarterly)</th>
              <th style="width: 15%; text-align: right;">Tax Amount</th>
            </tr>
          </thead>
          <tbody>
            ${periodItems.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 18px; color: #64748b;">No return periods to display.</td></tr>' : periodItems.map(p => `
              <tr>
                <td><strong>${escapeHtml(p.period)}</strong></td>
                <td>
                  <div>M1: ${p.m1Date ? p.m1Date : 'Pending'}</div>
                  <div>M2: ${p.m2Date ? p.m2Date : 'Pending'}</div>
                </td>
                <td>
                  ${p.m3Date ? `<strong>${p.m3Date}</strong>` : 'Pending'}
                </td>
                <td>
                  <span class="badge ${p.g3bStatus === 'Filed' ? 'badge-filed' : 'badge-pending'}">${escapeHtml(p.g3bStatus)}</span>
                  ${p.g3bDate ? `<div class="sub-info">Date: ${escapeHtml(p.g3bDate)}</div>` : ''}
                  ${p.g3bArn ? `<div class="sub-arn">ARN: ${escapeHtml(p.g3bArn)}</div>` : ''}
                </td>
                <td style="text-align: right; font-weight: 600;">
                  ${p.tax ? '₹ ' + formatCurrency2Dec(p.tax) : '--'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (scheme === 'composition') {
      tableHtml = `
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 18%;">Return Quarter</th>
              <th style="width: 27%;">CMP-08 (Quarterly Tax)</th>
              <th style="width: 18%; text-align: right;">Turnover</th>
              <th style="width: 17%; text-align: right;">Tax Amount</th>
              <th style="width: 20%;">GSTR-4 (Annual)</th>
            </tr>
          </thead>
          <tbody>
            ${periodItems.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 18px; color: #64748b;">No return periods to display.</td></tr>' : periodItems.map(p => `
              <tr>
                <td><strong>${escapeHtml(p.period)}</strong></td>
                <td>
                  <span class="badge ${p.cmp08Status === 'Filed' ? 'badge-filed' : 'badge-pending'}">${escapeHtml(p.cmp08Status)}</span>
                  ${p.cmp08Date ? `<div class="sub-info">Date: ${escapeHtml(p.cmp08Date)}</div>` : ''}
                  ${p.cmp08Arn ? `<div class="sub-arn">ARN: ${escapeHtml(p.cmp08Arn)}</div>` : ''}
                </td>
                <td style="text-align: right; font-weight: 600; color: #0369a1;">
                  ${p.turnover ? '₹ ' + formatCurrency2Dec(p.turnover) : '--'}
                </td>
                <td style="text-align: right; font-weight: 600;">
                  ${p.tax ? '₹ ' + formatCurrency2Dec(p.tax) : '--'}
                </td>
                <td>
                  <span class="badge ${p.g4Status === 'Filed' ? 'badge-filed' : 'badge-pending'}">${escapeHtml(p.g4Status)}</span>
                  ${p.g4Date ? `<div class="sub-info">Date: ${escapeHtml(p.g4Date)}</div>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>GST Return Filing Statement - ${escapeHtml(comp.name)}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-size: 11pt;
            line-height: 1.4;
          }
          .header-box {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 14px;
          }
          .org-title {
            font-size: 15pt;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: -0.02em;
          }
          .org-sub {
            font-size: 8.5pt;
            color: #64748b;
            margin-top: 2px;
          }
          .report-tag {
            text-align: right;
          }
          .report-badge {
            display: inline-block;
            background: #f1f5f9;
            color: #0f172a;
            font-size: 8.5pt;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            border: 1px solid #cbd5e1;
            text-transform: uppercase;
          }
          .report-date {
            font-size: 8pt;
            color: #64748b;
            margin-top: 4px;
          }
          .company-profile {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px 14px;
            margin-bottom: 14px;
          }
          .comp-name-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 8px;
          }
          .comp-name {
            font-size: 13pt;
            font-weight: 700;
            color: #0f172a;
          }
          .scheme-pill {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
          }
          .profile-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            font-size: 9pt;
          }
          .grid-item .label {
            font-size: 7.5pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .grid-item .value {
            font-weight: 600;
            color: #0f172a;
          }
          .grid-item .gstin {
            font-family: monospace;
            color: #047857;
            font-weight: 700;
          }
          .summary-bar {
            display: flex;
            justify-content: space-between;
            background: #eff6ff;
            border: 1px solid #dbeafe;
            border-radius: 6px;
            padding: 8px 14px;
            margin-bottom: 14px;
            font-size: 9pt;
          }
          .summary-item strong {
            color: #1e40af;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-bottom: 20px;
          }
          .print-table th {
            background: #f1f5f9;
            color: #334155;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 8pt;
            letter-spacing: 0.03em;
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
            text-align: left;
          }
          .print-table td {
            padding: 8px 10px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
          }
          .print-table tr:nth-child(even) td {
            background: #fafafa;
          }
          .badge {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 999px;
            font-size: 7.5pt;
            font-weight: 700;
            text-transform: uppercase;
          }
          .badge-filed {
            background: #dcfce7;
            color: #15803d;
            border: 1px solid #86efac;
          }
          .badge-pending {
            background: #fee2e2;
            color: #b91c1c;
            border: 1px solid #fca5a5;
          }
          .sub-info {
            font-size: 7.5pt;
            color: #047857;
            margin-top: 2px;
            font-weight: 500;
          }
          .sub-arn {
            font-size: 7pt;
            color: #64748b;
            font-family: monospace;
            margin-top: 1px;
          }
          .footer-box {
            margin-top: 30px;
            border-top: 1px solid #cbd5e1;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 8pt;
            color: #64748b;
          }
          .sign-box {
            text-align: center;
            width: 160px;
            border-top: 1px dashed #64748b;
            padding-top: 4px;
            font-size: 8pt;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div>
            <div class="org-title">ClientLedger Pro</div>
            <div class="org-sub">GST Returns Filing &amp; Statutory Compliance Tracker</div>
          </div>
          <div class="report-tag">
            <span class="report-badge">GST Compliance Statement</span>
            <div class="report-date">${printDate}</div>
          </div>
        </div>

        <div class="company-profile">
          <div class="comp-name-row">
            <div class="comp-name">${escapeHtml(comp.name)}</div>
            <span class="scheme-pill">${escapeHtml(comp.schemeLabel)}</span>
          </div>
          <div class="profile-grid">
            <div class="grid-item">
              <div class="label">GSTIN</div>
              <div class="value gstin">${escapeHtml(comp.gst || 'Not Available')}</div>
            </div>
            <div class="grid-item">
              <div class="label">Portal Username</div>
              <div class="value">${escapeHtml(comp.user || '--')}</div>
            </div>
            <div class="grid-item">
              <div class="label">Premises &amp; Rent</div>
              <div class="value">${escapeHtml(comp.rent || 'Own')} ${comp.rentAmount ? '(₹' + formatCurrency2Dec(comp.rentAmount) + ')' : ''}</div>
            </div>
            <div class="grid-item">
              <div class="label">Filing Status</div>
              <div class="value" style="color: ${comp.filedCount > 0 ? '#15803d' : '#b91c1c'}; font-weight: 700;">
                ${comp.filedCount > 0 ? comp.filedCount + ' Periods Filed' : 'All Pending'}
              </div>
            </div>
          </div>
        </div>

        <div class="summary-bar">
          <div class="summary-item">Tracked Periods: <strong>${comp.totalPeriods || 0}</strong></div>
          <div class="summary-item">Returns Filed: <strong>${comp.filedCount || 0}</strong></div>
          <div class="summary-item">Total Recorded Tax: <strong>₹ ${formatCurrency2Dec(comp.totalTax || 0, '0.00')}</strong></div>
          <div class="summary-item">Latest Filing: <strong>${comp.latestFiledDate || comp.latestFiledPeriod || 'None'}</strong></div>
        </div>

        <div style="font-size: 9pt; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.03em;">
          Statutory Return Filing Details (${activeMasterPeriodFilter === 'filled_only' ? 'Filled Periods Only' : 'All Periods'})
        </div>

        ${tableHtml}

        <div class="footer-box">
          <div>
            <div>Computer-generated GST compliance statement from ClientLedger Pro.</div>
            <div>Valid for internal audit, client verification, and compliance record keeping.</div>
          </div>
          <div class="sign-box">
            Authorized Signatory
          </div>
        </div>
      </body>
      </html>
    `;

    // Print using an invisible iframe to maintain app state
    let printFrame = document.getElementById('masterPrintIframe');
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'masterPrintIframe';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printHtml);
    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (err) {
        // Fallback to popup window if iframe print is blocked
        const pWin = window.open('', '_blank');
        if (pWin) {
          pWin.document.write(printHtml);
          pWin.document.close();
          pWin.focus();
          pWin.print();
        }
      }
    }, 250);
  }

  function openMasterEditFiling(companyId, scheme, period) {
    const allCompanies = getUnifiedMasterCompanies();
    const comp = allCompanies.find(c => c.id === companyId && c.scheme === scheme);
    if (!comp) return;

    document.getElementById('editFilingClientId').value = companyId;
    document.getElementById('editFilingScheme').value = scheme;
    document.getElementById('editFilingPeriod').value = period;

    const subTitle = document.getElementById('modalEditFilingSubtitle');
    if (subTitle) subTitle.textContent = `${comp.name} • ${period} (${comp.schemeLabel})`;

    const fieldsContainer = document.getElementById('editFilingFieldsContainer');
    if (!fieldsContainer) return;

    if (scheme === 'monthly') {
      const filings = (masterData.filings && masterData.filings[period]) ? (masterData.filings[period][companyId] || {}) : {};
      fieldsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-1 Status</label>
            <select id="editM_gstr1" class="form-control">
              <option value="Pending" ${filings.gstr1 !== 'Filed' ? 'selected' : ''}>Pending</option>
              <option value="Filed" ${filings.gstr1 === 'Filed' ? 'selected' : ''}>Filed</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-1 Filing Date</label>
            <input type="date" id="editM_gstr1Date" class="form-control" value="${escapeHtml(filings.gstr1Date || '')}">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-1 ARN</label>
          <input type="text" id="editM_gstr1Arn" class="form-control" placeholder="e.g. AA3609260012345" value="${escapeHtml(filings.gstr1Arn || '')}">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-3B Status</label>
            <select id="editM_gstr3b" class="form-control">
              <option value="Pending" ${filings.gstr3b !== 'Filed' ? 'selected' : ''}>Pending</option>
              <option value="Filed" ${filings.gstr3b === 'Filed' ? 'selected' : ''}>Filed</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-3B Filing Date</label>
            <input type="date" id="editM_gstr3bDate" class="form-control" value="${escapeHtml(filings.gstr3bDate || '')}">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-3B ARN</label>
          <input type="text" id="editM_gstr3bArn" class="form-control" placeholder="e.g. AA3609260098765" value="${escapeHtml(filings.gstr3bArn || '')}">
        </div>

        <div class="form-group" style="margin-bottom: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
          <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">Taxable / Tax Amount (₹)</label>
          <input type="number" id="editM_tax" class="form-control" placeholder="0" value="${escapeHtml(filings.taxableAmount || '')}">
        </div>
      `;
    } else if (scheme === 'qrmp') {
      const filings = (masterData.qrmpFilings && masterData.qrmpFilings[period]) ? (masterData.qrmpFilings[period][companyId] || {}) : {};
      fieldsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">M1 (IFF) Date</label>
            <input type="date" id="editQ_m1Date" class="form-control" value="${escapeHtml(filings.m1IffDate || '')}">
          </div>
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">M2 (IFF) Date</label>
            <input type="date" id="editQ_m2Date" class="form-control" value="${escapeHtml(filings.m2IffDate || '')}">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">M3 (GSTR-1) Date</label>
          <input type="date" id="editQ_m3Date" class="form-control" value="${escapeHtml(filings.m3Gstr1Date || '')}">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-3B Status</label>
            <select id="editQ_gstr3b" class="form-control">
              <option value="Pending" ${filings.gstr3b !== 'Filed' ? 'selected' : ''}>Pending</option>
              <option value="Filed" ${filings.gstr3b === 'Filed' ? 'selected' : ''}>Filed</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-3B Date</label>
            <input type="date" id="editQ_gstr3bDate" class="form-control" value="${escapeHtml(filings.gstr3bDate || '')}">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">Tax Amount (₹)</label>
          <input type="number" id="editQ_tax" class="form-control" placeholder="0" value="${escapeHtml(filings.taxableAmount || '')}">
        </div>
      `;
    } else if (scheme === 'composition') {
      const filings = (masterData.compositionFilings && masterData.compositionFilings[period]) ? (masterData.compositionFilings[period][companyId] || {}) : {};
      fieldsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">CMP-08 Status</label>
            <select id="editC_cmp08" class="form-control">
              <option value="Pending" ${filings.cmp08 !== 'Filed' ? 'selected' : ''}>Pending</option>
              <option value="Filed" ${filings.cmp08 === 'Filed' ? 'selected' : ''}>Filed</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">CMP-08 Filing Date</label>
            <input type="date" id="editC_cmp08Date" class="form-control" value="${escapeHtml(filings.cmp08Date || '')}">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">CMP-08 ARN</label>
          <input type="text" id="editC_cmp08Arn" class="form-control" placeholder="e.g. AA3609260055443" value="${escapeHtml(filings.cmp08Arn || '')}">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">Taxable Turnover (₹)</label>
            <input type="number" id="editC_turnover" class="form-control" placeholder="0" value="${escapeHtml(filings.taxableTurnover || '')}">
          </div>
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">Tax Amount (₹)</label>
            <input type="number" id="editC_tax" class="form-control" placeholder="0" value="${escapeHtml(filings.taxAmount || '')}">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-4 (Annual) Status</label>
            <select id="editC_g4" class="form-control">
              <option value="Pending" ${filings.gstr4 !== 'Filed' ? 'selected' : ''}>Pending</option>
              <option value="Filed" ${filings.gstr4 === 'Filed' ? 'selected' : ''}>Filed</option>
            </select>
          </div>
          <div class="form-group">
            <label style="font-size: 0.78rem; font-weight: 600; color: #334155; display: block; margin-bottom: 4px;">GSTR-4 Filing Date</label>
            <input type="date" id="editC_g4Date" class="form-control" value="${escapeHtml(filings.gstr4Date || '')}">
          </div>
        </div>
      `;
    }

    const modal = document.getElementById('modalMasterEditFiling');
    if (modal) modal.style.display = 'flex';
  }

  async function handleSaveMasterFiling(e) {
    if (e) e.preventDefault();
    const companyId = document.getElementById('editFilingClientId').value;
    const scheme = document.getElementById('editFilingScheme').value;
    const period = document.getElementById('editFilingPeriod').value;

    if (!companyId || !scheme || !period) return;

    let updates = {};

    if (scheme === 'monthly') {
      const g1 = document.getElementById('editM_gstr1').value;
      const g1Date = document.getElementById('editM_gstr1Date').value;
      const g1Arn = document.getElementById('editM_gstr1Arn').value.trim();
      const g3b = document.getElementById('editM_gstr3b').value;
      const g3bDate = document.getElementById('editM_gstr3bDate').value;
      const g3bArn = document.getElementById('editM_gstr3bArn').value.trim();
      const tax = document.getElementById('editM_tax').value.trim();

      updates = {
        gstr1: g1,
        gstr1Date: g1 === 'Filed' ? g1Date : '',
        gstr1Arn: g1 === 'Filed' ? g1Arn : '',
        gstr3b: g3b,
        gstr3bDate: g3b === 'Filed' ? g3bDate : '',
        gstr3bArn: g3b === 'Filed' ? g3bArn : '',
        taxableAmount: tax
      };

      try {
        await apiFetch(`/api/filings/${encodeURIComponent(period)}/${encodeURIComponent(companyId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (err) {
        console.warn('API update failed, updating local state only:', err);
      }

      if (!masterData.filings) masterData.filings = {};
      if (!masterData.filings[period]) masterData.filings[period] = {};
      masterData.filings[period][companyId] = { ...(masterData.filings[period][companyId] || {}), ...updates };

      if (currentMonth === period && allFilings) {
        const item = allFilings.find(f => f.id === companyId);
        if (item) Object.assign(item, updates);
      }
    } else if (scheme === 'qrmp') {
      const m1Date = document.getElementById('editQ_m1Date').value;
      const m2Date = document.getElementById('editQ_m2Date').value;
      const m3Date = document.getElementById('editQ_m3Date').value;
      const g3b = document.getElementById('editQ_gstr3b').value;
      const g3bDate = document.getElementById('editQ_gstr3bDate').value;
      const tax = document.getElementById('editQ_tax').value.trim();

      updates = {
        m1Iff: m1Date ? 'Filed' : 'Pending',
        m1IffDate: m1Date,
        m2Iff: m2Date ? 'Filed' : 'Pending',
        m2IffDate: m2Date,
        m3Gstr1: m3Date ? 'Filed' : 'Pending',
        m3Gstr1Date: m3Date,
        gstr3b: g3b,
        gstr3bDate: g3b === 'Filed' ? g3bDate : '',
        taxableAmount: tax
      };

      try {
        await apiFetch(`/api/qrmp/filings/${encodeURIComponent(period)}/${encodeURIComponent(companyId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (err) {
        console.warn('API QRMP update failed, updating local state only:', err);
      }

      if (!masterData.qrmpFilings) masterData.qrmpFilings = {};
      if (!masterData.qrmpFilings[period]) masterData.qrmpFilings[period] = {};
      masterData.qrmpFilings[period][companyId] = { ...(masterData.qrmpFilings[period][companyId] || {}), ...updates };

      if (currentQrmpQuarter === period && allQrmpFilings) {
        const item = allQrmpFilings.find(f => f.id === companyId);
        if (item) Object.assign(item, updates);
      }
    } else if (scheme === 'composition') {
      const cmp08 = document.getElementById('editC_cmp08').value;
      const cmp08Date = document.getElementById('editC_cmp08Date').value;
      const cmp08Arn = document.getElementById('editC_cmp08Arn').value.trim();
      const turnover = document.getElementById('editC_turnover').value.trim();
      const tax = document.getElementById('editC_tax').value.trim();
      const g4 = document.getElementById('editC_g4').value;
      const g4Date = document.getElementById('editC_g4Date').value;

      updates = {
        cmp08: cmp08,
        cmp08Date: cmp08 === 'Filed' ? cmp08Date : '',
        cmp08Arn: cmp08 === 'Filed' ? cmp08Arn : '',
        taxableTurnover: turnover,
        taxAmount: tax,
        gstr4: g4,
        gstr4Date: g4 === 'Filed' ? g4Date : ''
      };

      try {
        await apiFetch(`/api/composition/filings/${encodeURIComponent(period)}/${encodeURIComponent(companyId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (err) {
        console.warn('API Composition update failed, updating local state only:', err);
      }

      if (!masterData.compositionFilings) masterData.compositionFilings = {};
      if (!masterData.compositionFilings[period]) masterData.compositionFilings[period] = {};
      masterData.compositionFilings[period][companyId] = { ...(masterData.compositionFilings[period][companyId] || {}), ...updates };

      if (currentCompositionQuarter === period && allCompositionFilings) {
        const item = allCompositionFilings.find(f => f.id === companyId);
        if (item) Object.assign(item, updates);
      }
    }

    const editModal = document.getElementById('modalMasterEditFiling');
    if (editModal) editModal.style.display = 'none';

    showToast(`✓ Saved filing details for ${period}`);
    openMasterCompanyDetail(companyId, scheme);
    renderMasterTable();
  }

  function exportMasterCSV() {
    const companies = getUnifiedMasterCompanies();
    if (!companies || companies.length === 0) {
      showToast('No master companies available for export');
      return;
    }
    const headers = ['S.NO', 'SCHEME', 'COMPANY NAME', 'USER NAME', 'GSTIN', 'PREMISES / RENT', 'RENT AMOUNT', 'FILED RETURNS', 'TOTAL TAX (Rs)', 'LATEST FILED PERIOD'];
    const rows = companies.map((c, i) => [
      i + 1,
      c.schemeLabel,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.user || '').replace(/"/g, '""')}"`,
      `"${(c.gst || '').replace(/"/g, '""')}"`,
      c.rent || 'Own',
      c.rentAmount ? formatAmount2Dec(c.rentAmount) : '',
      c.filedCount,
      c.totalTax ? formatAmount2Dec(c.totalTax) : '0.00',
      c.latestFiledPeriod || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GST_Master_Compliance_Directory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Master Compliance CSV');
  }

  function copyMasterText(text, msg) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(msg || 'Copied to clipboard');
      }).catch(() => {
        showToast(msg || 'Copied to clipboard');
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(msg || 'Copied to clipboard');
    }
  }

  // Expose helpers globally so inline handlers and parent dashboard can call them
  window.switchScheme = switchScheme;
  window.openMasterCompanyDetail = openMasterCompanyDetail;
  window.openMasterEditFiling = openMasterEditFiling;
  window.setMasterSchemeFilter = setMasterSchemeFilter;
  window.resetMasterFilters = resetMasterFilters;
  window.copyMasterText = copyMasterText;
  window.setMasterPeriodFilter = setMasterPeriodFilter;
  window.loadMasterDataAndRender = loadMasterDataAndRender;
  window.printMasterCompanyDetails = printMasterCompanyDetails;


  function updateBulkBar() {
    const count = selectedIds.size;
    if (count > 0) {
      bulkActionsBar.style.display = 'flex';
      bulkSelectedCount.textContent = `${count} shop${count > 1 ? 's' : ''} selected`;
    } else {
      bulkActionsBar.style.display = 'none';
    }
  }

  function updateSelectAllCheckbox() {
    if (filteredFilings.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }
    const allSelected = filteredFilings.every(f => selectedIds.has(f.id));
    selectAllCheckbox.checked = allSelected;
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Start app on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
