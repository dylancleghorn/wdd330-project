import './style.css';
import { fetchRecentVulnerabilities, searchVulnerabilities, fetchCveHistory } from './api/nvd.js';
import { fetchEpssDetail } from './api/epss.js';
import { calculateRiskScore, summarizeStats } from './data/risk.js';
import { getSettings, saveSettings } from './utils/storage.js';
import { formatDateTime } from './utils/helpers.js';
import {
  renderAppSkeleton,
  renderStats,
  renderTable,
  renderDetails,
  updateRiskUI,
  updateLastUpdated
} from './ui/render.js';

const state = {
  allVulnerabilities: [],
  filteredVulnerabilities: [],
  selectedVulnerability: null,
  compactView: false,
  settings: getSettings()
};

const root = document.querySelector('#app');
renderAppSkeleton(root);

const statsGrid = document.querySelector('#stats-grid');
const tableBody = document.querySelector('#table-body');
const detailsPanel = document.querySelector('#details-panel');
const detailsModal = document.querySelector('#details-modal');
const closeModalButton = document.querySelector('#close-modal-button');
const tableCount = document.querySelector('#table-count');
const keywordInput = document.querySelector('#keyword-input');
const severityFilter = document.querySelector('#severity-filter');
const sortBy = document.querySelector('#sort-by');
const searchForm = document.querySelector('#search-form');
const clearButton = document.querySelector('#clear-button');
const refreshButton = document.querySelector('#refresh-button');
const toggleViewButton = document.querySelector('#toggle-view-button');
const chartContainer = document.querySelector('#severity-chart');

function severityPriority(severity) {
  const order = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
    UNKNOWN: 0
  };

  return order[severity] ?? 0;
}

function applyFilters() {
  const severityText = severityFilter.value;
  const sortText = sortBy.value;

  let results = [...state.allVulnerabilities];

  if (severityText !== 'ALL') {
    results = results.filter((item) => item.severity === severityText);
  }

  if (sortText === 'published-desc') {
    results.sort((a, b) => new Date(b.published) - new Date(a.published));
  } else if (sortText === 'score-desc') {
    results.sort((a, b) => b.score - a.score);
  } else if (sortText === 'severity-desc') {
    results.sort((a, b) => severityPriority(b.severity) - severityPriority(a.severity));
  } else if (sortText === 'id-asc') {
    results.sort((a, b) => a.id.localeCompare(b.id));
  }

  state.filteredVulnerabilities = results;
  renderEverything();
  persistSettings();
}

function persistSettings() {
  state.settings = {
    ...state.settings,
    recentSearch: keywordInput.value,
    severityFilter: severityFilter.value,
    sortBy: sortBy.value,
    savedView: state.compactView ? 'compact' : 'table',
    lastUpdated: new Date().toISOString()
  };

  saveSettings(state.settings);
}

function restoreSettings() {
  keywordInput.value = state.settings.recentSearch || '';
  severityFilter.value = state.settings.severityFilter || 'ALL';
  sortBy.value = state.settings.sortBy || 'published-desc';
  state.compactView = state.settings.savedView === 'compact';
}

function buildSeverityCounts(vulnerabilities) {
  const counts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0
  };

  vulnerabilities.forEach((item) => {
    if (item.severity === 'CRITICAL') counts.Critical += 1;
    else if (item.severity === 'HIGH') counts.High += 1;
    else if (item.severity === 'MEDIUM') counts.Medium += 1;
    else counts.Low += 1;
  });

  return counts;
}

function renderChart(vulnerabilities) {
  const counts = buildSeverityCounts(vulnerabilities);
  const entries = Object.entries(counts);
  const maxValue = Math.max(...Object.values(counts), 1);

  chartContainer.innerHTML = entries
    .map(([label, value]) => {
      const heightPercent = Math.max((value / maxValue) * 100, value > 0 ? 10 : 0);
      const cssLabel = label.toLowerCase();

      return `
        <div class="chart-column">
          <div class="chart-value">${value}</div>
          <div class="chart-bar-shell">
            <div class="chart-bar ${cssLabel}" style="height: ${heightPercent}%"></div>
          </div>
          <div class="chart-label">${label}</div>
        </div>
      `;
    })
    .join('');
}

function openDetailsModal() {
  detailsModal.classList.remove('hidden');
  detailsModal.classList.add('open');
  detailsModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeDetailsModal() {
  detailsModal.classList.remove('open');
  detailsModal.classList.add('hidden');
  detailsModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function renderEverything() {
  const stats = summarizeStats(state.filteredVulnerabilities);
  const riskData = calculateRiskScore(state.filteredVulnerabilities);

  renderStats(statsGrid, stats);
  renderTable(tableBody, state.filteredVulnerabilities, state.compactView);
  updateRiskUI(riskData);
  renderChart(state.filteredVulnerabilities);
  tableCount.textContent = `${state.filteredVulnerabilities.length} items`;

  if (!state.selectedVulnerability) {
    renderDetails(detailsPanel, null, {}, []);
    closeDetailsModal();
  }
}

async function loadDetails(cveId) {
  const selected = state.allVulnerabilities.find((item) => item.id === cveId);

  if (!selected) return;

  state.selectedVulnerability = selected;
  detailsPanel.className = 'details-panel loading-state';
  detailsPanel.textContent = 'Loading extra NVD and EPSS details...';

  const [epssDetail, history] = await Promise.all([
    fetchEpssDetail(cveId),
    fetchCveHistory(cveId)
  ]);

  renderDetails(detailsPanel, selected, epssDetail, history);
  openDetailsModal();
}

async function loadInitialData() {
  updateLastUpdated('Loading recent CVEs...');

  const vulnerabilities = await fetchRecentVulnerabilities();
  state.allVulnerabilities = vulnerabilities;
  state.selectedVulnerability = null;

  applyFilters();

  const timeText = formatDateTime(new Date().toISOString());
  updateLastUpdated(`Last refreshed: ${timeText}`);
}

async function runSearchFromApi() {
  const searchText = keywordInput.value.trim();

  if (!searchText) {
    await loadInitialData();
    return;
  }

  updateLastUpdated(`Searching NVD for "${searchText}"...`);

  const vulnerabilities = await searchVulnerabilities(searchText);
  state.allVulnerabilities = vulnerabilities;
  state.selectedVulnerability = null;

  applyFilters();

  const timeText = formatDateTime(new Date().toISOString());
  updateLastUpdated(`Search finished: ${timeText}`);
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await runSearchFromApi();
});

refreshButton.addEventListener('click', async () => {
  if (keywordInput.value.trim()) {
    await runSearchFromApi();
    return;
  }

  await loadInitialData();
});

clearButton.addEventListener('click', async () => {
  keywordInput.value = '';
  severityFilter.value = 'ALL';
  sortBy.value = 'published-desc';
  persistSettings();
  await loadInitialData();
});

severityFilter.addEventListener('change', applyFilters);
sortBy.addEventListener('change', applyFilters);
keywordInput.addEventListener('input', persistSettings);

toggleViewButton.addEventListener('click', () => {
  state.compactView = !state.compactView;
  renderTable(tableBody, state.filteredVulnerabilities, state.compactView);
  persistSettings();
});

tableBody.addEventListener('click', async (event) => {
  const detailButton = event.target.closest('[data-detail-button]');
  const row = event.target.closest('[data-cve-id]');

  if (detailButton) {
    await loadDetails(detailButton.dataset.detailButton);
    return;
  }

  if (row) {
    await loadDetails(row.dataset.cveId);
  }
});

restoreSettings();
if (keywordInput.value.trim()) {
  runSearchFromApi();
} else {
  loadInitialData();
}

closeModalButton.addEventListener('click', closeDetailsModal);

detailsModal.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-modal]')) {
    closeDetailsModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && detailsModal.classList.contains('open')) {
    closeDetailsModal();
  }
});
