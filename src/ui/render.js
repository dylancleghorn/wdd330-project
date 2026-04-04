import { formatDate, formatDateTime, createSeverityClass } from '../utils/helpers.js';

export function renderAppSkeleton(root) {
  root.innerHTML = `
    <div class="page-shell">
      <aside class="side-panel">
        <div class="brand-block">
          <div class="shield-icon">🛡️</div>
          <div>
            <h1>SecureWatch</h1>
          </div>
        </div>

        <nav class="side-nav">
          <a href="#overview" class="nav-link active">Overview</a>
          <a href="#search" class="nav-link">Search</a>
          <a href="#chart" class="nav-link">Severity Chart</a>
          <a href="#table" class="nav-link">Vulnerability Table</a>
        </nav>

        
      </aside>

      <main class="main-panel">
        <header class="top-bar">
          <div>
            <h2>Threat Visibility Dashboard</h2>
          </div>
          <div class="status-pill" id="last-updated-pill">Loading data...</div>
        </header>

        <section class="hero-card card fade-in" id="overview">
          <div>
            <p class="eyebrow">What this app does</p>
            <h3>Track recent vulnerabilities and enrich them with extra context</h3>
            <p class="hero-copy">
              NVD provides the main CVE feed. CIRCL adds extra detail when a user opens a vulnerability.
              The dashboard then calculates a simple risk score from what was found.
            </p>
          </div>
          <button class="ghost-button" id="refresh-button">Refresh data</button>
        </section>

        <section class="stats-grid" id="stats-grid"></section>

        <section class="control-grid" id="search">
          <div class="card control-card slide-up">
            <div class="section-heading-row">
              <div>
                <p class="eyebrow">Search tools</p>
                <h3>Find vulnerabilities</h3>
              </div>
            </div>

            <form id="search-form" class="search-form">
              <label class="field-group">
                <span>Keyword search</span>
                <input id="keyword-input" type="text" placeholder="Try microsoft, cisco, apache, wordpress..." />
              </label>

              <div class="filter-row">
                <label class="field-group">
                  <span>Severity</span>
                  <select id="severity-filter">
                    <option value="ALL">All</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </label>

                <label class="field-group">
                  <span>Sort by</span>
                  <select id="sort-by">
                    <option value="published-desc">Newest published</option>
                    <option value="score-desc">Highest score</option>
                    <option value="severity-desc">Highest severity</option>
                    <option value="id-asc">CVE id</option>
                  </select>
                </label>
              </div>

              <div class="action-row">
                <button type="submit" class="primary-button">Search</button>
                <button type="button" id="clear-button" class="ghost-button">Clear</button>
                <button type="button" id="toggle-view-button" class="ghost-button">Toggle compact view</button>
              </div>
            </form>
          </div>

          <div class="card score-card scale-in">
            <p class="eyebrow">Combined result</p>
            <h3>Risk score</h3>
            <div class="risk-number" id="risk-score">0</div>
            <div class="risk-label" id="risk-label">Low</div>
            <div class="progress-shell">
              <div class="progress-bar" id="risk-progress"></div>
            </div>
            <p class="muted-copy" id="risk-explanation">
              Risk score will update when data loads.
            </p>
          </div>
        </section>

        <section class="card chart-card" id="chart">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Visual summary</p>
              <h3>CVEs by severity</h3>
            </div>
          </div>
          <div id="severity-chart" class="severity-chart" aria-label="Bar chart showing CVEs by severity" role="img"></div>
        </section>

        <section class="card table-card" id="table">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Main data</p>
              <h3>Recent and matching vulnerabilities</h3>
            </div>
            <div class="table-count" id="table-count">0 items</div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>CVE</th>
                  <th>Severity</th>
                  <th>Score</th>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>Published</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="table-body"></tbody>
            </table>
          </div>
        </section>

        <div id="details-modal" class="modal hidden" aria-hidden="true">
          <div class="modal-backdrop" data-close-modal></div>
          <div class="modal-dialog card scale-in" role="dialog" aria-modal="true" aria-labelledby="details-modal-title">
            <div class="section-heading-row modal-header">
              <div>
                <p class="eyebrow">Selected vulnerability</p>
                <h3 id="details-modal-title">NVD + CIRCL detail panel</h3>
              </div>
              <button type="button" class="ghost-button modal-close-button" id="close-modal-button">Close</button>
            </div>
            <div id="details-panel" class="details-panel empty-state">
              Click a row or button to load extra details for a CVE.
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function renderStats(container, stats) {
  const cards = [
    { label: 'Total CVEs', value: stats.total },
    { label: 'Critical', value: stats.critical },
    { label: 'High', value: stats.high },
    { label: 'Medium', value: stats.medium },
    { label: 'Average Score', value: stats.averageScore }
  ];

  container.innerHTML = cards
    .map(
      (card) => `
        <article class="card stat-card hover-lift">
          <p class="stat-label">${card.label}</p>
          <p class="stat-value">${card.value}</p>
        </article>
      `
    )
    .join('');
}

export function renderTable(container, vulnerabilities, compactView = false) {
  if (!vulnerabilities.length) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="empty-row">No vulnerabilities matched your filters.</td>
      </tr>
    `;
    return;
  }

  container.innerHTML = vulnerabilities
    .map(
      (item) => `
        <tr data-cve-id="${item.id}" class="table-row ${compactView ? 'compact-row' : ''}">
          <td data-label="CVE">
            <div class="cell-title">${item.id}</div>
            <div class="cell-subtitle">${compactView ? '' : item.description.slice(0, 90)}${item.description.length > 90 ? '...' : ''}</div>
          </td>
          <td data-label="Severity">
            <span class="severity-badge ${createSeverityClass(item.severity)}">${item.severity}</span>
          </td>
          <td data-label="Score">${item.score}</td>
          <td data-label="Vendor">${item.vendor}</td>
          <td data-label="Product">${item.product}</td>
          <td data-label="Published">${formatDate(item.published)}</td>
          <td data-label="Action">
            <button class="tiny-button" data-detail-button="${item.id}">View</button>
          </td>
        </tr>
      `
    )
    .join('');
}

export function renderDetails(container, vulnerability, circlDetail, history = []) {
  if (!vulnerability) {
    container.className = 'details-panel empty-state';
    container.textContent = 'Click a row or button to load extra details for a CVE.';
    return;
  }

  const historyMarkup = history.length
    ? `<ul class="history-list">
        ${history
      .slice(0, 5)
      .map(
        (item) => `
              <li>
                <strong>${formatDateTime(item.created)}</strong>
                <span>${item.change?.description || 'NVD change record available.'}</span>
              </li>
            `
      )
      .join('')}
      </ul>`
    : '<p class="muted-copy">No recent NVD history records were returned for this CVE.</p>';

  const referenceMarkup = circlDetail.references?.length
    ? `<ul class="reference-list">
        ${circlDetail.references
      .slice(0, 5)
      .map((url) => `<li><a href="${url}" target="_blank" rel="noreferrer">${url}</a></li>`)
      .join('')}
      </ul>`
    : '<p class="muted-copy">No CIRCL references available right now.</p>';

  container.className = 'details-panel';
  container.innerHTML = `
    <div class="detail-top-row">
      <div>
        <h4>${vulnerability.id}</h4>
        <p class="muted-copy">${vulnerability.description}</p>
      </div>
      <span class="severity-badge ${createSeverityClass(vulnerability.severity)}">${vulnerability.severity}</span>
    </div>

    <div class="detail-grid">
      <div class="detail-box">
        <p class="detail-label">Score</p>
        <p class="detail-value">${vulnerability.score}</p>
      </div>
      <div class="detail-box">
        <p class="detail-label">CWE</p>
        <p class="detail-value">${vulnerability.cwe}</p>
      </div>
      <div class="detail-box">
        <p class="detail-label">Vendor / Product</p>
        <p class="detail-value">${vulnerability.vendor} / ${vulnerability.product}</p>
      </div>
      <div class="detail-box">
        <p class="detail-label">Published</p>
        <p class="detail-value">${formatDate(vulnerability.published)}</p>
      </div>
    </div>

    <div class="detail-section">
      <h5>CIRCL enrichment</h5>
      <p class="muted-copy">${circlDetail.summary}</p>
      <p class="muted-copy">Assigner: ${circlDetail.assigner}</p>
      <p class="muted-copy">Exploit flag: ${circlDetail.exploited ? 'Yes' : 'No'}</p>
      ${referenceMarkup}
    </div>

    <div class="detail-section">
      <h5>NVD change history</h5>
      ${historyMarkup}
    </div>
  `;
}

export function updateRiskUI(scoreData) {
  const scoreElement = document.querySelector('#risk-score');
  const labelElement = document.querySelector('#risk-label');
  const explanationElement = document.querySelector('#risk-explanation');
  const progressElement = document.querySelector('#risk-progress');

  scoreElement.textContent = scoreData.score;
  labelElement.textContent = scoreData.label;
  explanationElement.textContent = scoreData.explanation;
  progressElement.style.width = `${scoreData.score}%`;
}

export function updateLastUpdated(text) {
  const pill = document.querySelector('#last-updated-pill');
  pill.textContent = text;
}
