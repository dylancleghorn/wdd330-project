(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();const V=[{id:"CVE-2024-10001",description:"Sample remote code execution vulnerability in a fictional web service.",published:"2026-03-21T10:00:00.000Z",lastModified:"2026-03-25T12:00:00.000Z",severity:"CRITICAL",score:9.8,cwe:"CWE-94",vendor:"Acme",product:"PortalX",referencesCount:5,sourceIdentifier:"sample-source"},{id:"CVE-2024-10002",description:"Sample authentication bypass issue in a cloud admin panel.",published:"2026-03-19T13:30:00.000Z",lastModified:"2026-03-26T08:15:00.000Z",severity:"HIGH",score:8.1,cwe:"CWE-287",vendor:"SkyNetics",product:"AdminHub",referencesCount:3,sourceIdentifier:"sample-source"},{id:"CVE-2024-10003",description:"Sample denial of service issue caused by malformed request handling.",published:"2026-03-14T09:00:00.000Z",lastModified:"2026-03-18T11:20:00.000Z",severity:"MEDIUM",score:6.4,cwe:"CWE-400",vendor:"Northwind",product:"FlowAPI",referencesCount:2,sourceIdentifier:"sample-source"},{id:"CVE-2024-10004",description:"Sample info disclosure weakness in a reporting endpoint.",published:"2026-03-11T07:45:00.000Z",lastModified:"2026-03-11T07:45:00.000Z",severity:"LOW",score:3.7,cwe:"CWE-200",vendor:"BlueMesa",product:"InsightPro",referencesCount:1,sourceIdentifier:"sample-source"}],M={"CVE-2024-10001":{summary:"Sample CIRCL enrichment showing exploit references and vendor context.",cvss:9.8,references:["https://example.com/advisory-1","https://example.com/exploit-1"],exploited:!0,assigner:"Sample CNA"},"CVE-2024-10002":{summary:"Sample CIRCL enrichment with a product-focused description.",cvss:8.1,references:["https://example.com/advisory-2"],exploited:!1,assigner:"Sample CNA"}};function T(e={}){var t,s,i;return((t=e.cvssMetricV31)==null?void 0:t[0])||((s=e.cvssMetricV30)==null?void 0:s[0])||((i=e.cvssMetricV2)==null?void 0:i[0])||null}function D(e=[]){var t,s,i;return((i=(s=(t=e==null?void 0:e[0])==null?void 0:t.description)==null?void 0:s[0])==null?void 0:i.value)||"Unknown"}function U(e=[]){for(const t of e)for(const s of t.nodes||[])for(const i of s.cpeMatch||[]){const n=(i.criteria||"").split(":");if(n.length>5)return{vendor:n[3]||"Unknown",product:n[4]||"Unknown"}}return{vendor:"Unknown",product:"Unknown"}}function L(e){var n,o,c;const t=e.cve||{},s=T(t.metrics),i=(s==null?void 0:s.cvssData)||{},r=U(t.configurations||[]);return{id:t.id,description:((o=(n=t.descriptions)==null?void 0:n.find(l=>l.lang==="en"))==null?void 0:o.value)||"No description provided.",published:t.published,lastModified:t.lastModified,severity:i.baseSeverity||(s==null?void 0:s.baseSeverity)||"UNKNOWN",score:i.baseScore||0,vectorString:i.vectorString||"Not listed",cwe:D(t.weaknesses),vendor:r.vendor,product:r.product,referencesCount:((c=t.references)==null?void 0:c.length)||0,sourceIdentifier:t.sourceIdentifier||"Unknown"}}async function g(e){const t=await fetch(e);if(!t.ok)throw new Error(`Request failed with status ${t.status}`);return t.json()}async function P(){try{const e=new Date,t=new Date;t.setDate(e.getDate()-30);const s=new URLSearchParams({pubStartDate:t.toISOString(),pubEndDate:e.toISOString(),resultsPerPage:"24",startIndex:"0"});return((await g(`/api/nvd/cves/2.0?${s.toString()}`)).vulnerabilities||[]).map(L)}catch(e){return console.error("Falling back to mock vulnerability data.",e),V}}async function R(e=""){try{const t=new URLSearchParams({keywordSearch:e,resultsPerPage:"24",startIndex:"0"});return((await g(`/api/nvd/cves/2.0?${t.toString()}`)).vulnerabilities||[]).map(L)}catch(t){return console.error("Search failed. Using mock fallback.",t),V.filter(s=>`${s.id} ${s.description} ${s.vendor} ${s.product}`.toLowerCase().includes(e.toLowerCase()))}}async function H(e){try{const t=new URLSearchParams({cveId:e});return(await g(`/api/nvd/cvehistory/2.0?${t.toString()}`)).cveChanges||[]}catch(t){return console.error("Could not load NVD change history.",t),[]}}async function O(e){const t=await fetch(e);if(!t.ok)throw new Error(`Request failed with status ${t.status}`);return t.json()}function A(e={}){var t,s,i;return{id:e.id||e.cve||"Unknown",summary:e.summary||e.description||"No enrichment summary provided.",cvss:e.cvss||e.cvss3||((i=(s=(t=e.impact)==null?void 0:t.baseMetricV3)==null?void 0:s.cvssV3)==null?void 0:i.baseScore)||0,references:e.references||[],assigner:e.assigner||e["assigner-short-name"]||"Unknown",exploited:!!(e.exploited||e.poc||e["exploit-exists"])}}async function q(e){try{const t=await O(`/api/circl/api/cve/${e}`);return A(t)}catch(t){return console.error("Could not load CIRCL enrichment.",t),M[e]||{id:e,summary:"No extra enrichment found for this CVE right now.",cvss:0,references:[],assigner:"Unknown",exploited:!1}}}function x(e){if(!e)return"Unknown";const t=new Date(e);return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"short",day:"numeric"}).format(t)}function w(e){if(!e)return"Unknown";const t=new Date(e);return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(t)}function W(e){if(!e)return 999;const t=1e3*60*60*24,s=Date.now(),i=new Date(e).getTime();return Math.floor((s-i)/t)}function F(e,t,s){return Math.max(t,Math.min(s,e))}function $(e=""){return e.toLowerCase()}function B(e,t=300){let s;return(...i)=>{clearTimeout(s),s=setTimeout(()=>e(...i),t)}}function j(e){return{CRITICAL:30,HIGH:20,MEDIUM:10,LOW:5,NONE:1,UNKNOWN:0}[e]??0}function G(e){const t=W(e);return t<=7?15:t<=30?10:t<=90?6:2}function Z(e=[]){if(!e.length)return{score:0,label:"Low",explanation:"No matching vulnerabilities in the current result set."};const s=e.reduce((n,o)=>{const c=j(o.severity),l=Number(o.score||0)*2,N=G(o.published);return n+c+l+N},0)/e.length,i=F(Math.round(s*2.2),0,100);let r="Low";return i>=75?r="High":i>=50?r="Elevated":i>=25&&(r="Guarded"),{score:i,label:r,explanation:"Risk score is based on severity, CVSS score, and how recent the matching vulnerabilities are."}}function K(e=[]){const t={total:e.length,critical:0,high:0,medium:0,low:0,averageScore:0};if(!e.length)return t;let s=0;return e.forEach(i=>{const r=i.severity||"UNKNOWN",n=Number(i.score||0);s+=n,r==="CRITICAL"?t.critical+=1:r==="HIGH"?t.high+=1:r==="MEDIUM"?t.medium+=1:t.low+=1}),t.averageScore=Number((s/e.length).toFixed(1)),t}const E="securewatch-settings",b={recentSearch:"",severityFilter:"ALL",sortBy:"published-desc",savedView:"table",lastUpdated:""};function z(){const e=localStorage.getItem(E);if(!e)return b;try{return{...b,...JSON.parse(e)}}catch(t){return console.error("Could not read localStorage settings.",t),b}}function J(e){localStorage.setItem(E,JSON.stringify(e))}function Y(e){e.innerHTML=`
    <div class="page-shell">
      <aside class="side-panel">
        <div class="brand-block">
          <div class="shield-icon">🛡️</div>
          <div>
            <p class="eyebrow">Enterprise Risk Dashboard</p>
            <h1>SecureWatch</h1>
          </div>
        </div>

        <nav class="side-nav">
          <a href="#overview" class="nav-link active">Overview</a>
          <a href="#search" class="nav-link">Search</a>
          <a href="#chart" class="nav-link">Severity Chart</a>
          <a href="#table" class="nav-link">Vulnerability Table</a>
          <a href="#details" class="nav-link">Details</a>
        </nav>

        <div class="side-note">
          <p class="side-note-title">Student project note</p>
          <p>
            This version keeps the code simple and readable on purpose so it is easy to explain.
          </p>
        </div>
      </aside>

      <main class="main-panel">
        <header class="top-bar">
          <div>
            <p class="eyebrow">Threat visibility made simpler</p>
            <h2>SecureWatch Dashboard</h2>
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

        <section class="card details-card" id="details">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Selected vulnerability</p>
              <h3>NVD + CIRCL detail panel</h3>
            </div>
          </div>
          <div id="details-panel" class="details-panel empty-state">
            Click a row or button to load extra details for a CVE.
          </div>
        </section>
      </main>
    </div>
  `}function _(e,t){const s=[{label:"Total CVEs",value:t.total},{label:"Critical",value:t.critical},{label:"High",value:t.high},{label:"Medium",value:t.medium},{label:"Average Score",value:t.averageScore}];e.innerHTML=s.map(i=>`
        <article class="card stat-card hover-lift">
          <p class="stat-label">${i.label}</p>
          <p class="stat-value">${i.value}</p>
        </article>
      `).join("")}function I(e,t,s=!1){if(!t.length){e.innerHTML=`
      <tr>
        <td colspan="7" class="empty-row">No vulnerabilities matched your filters.</td>
      </tr>
    `;return}e.innerHTML=t.map(i=>`
        <tr data-cve-id="${i.id}" class="table-row ${s?"compact-row":""}">
          <td>
            <div class="cell-title">${i.id}</div>
            <div class="cell-subtitle">${s?"":i.description.slice(0,90)}${i.description.length>90?"...":""}</div>
          </td>
          <td>
            <span class="severity-badge ${$(i.severity)}">${i.severity}</span>
          </td>
          <td>${i.score}</td>
          <td>${i.vendor}</td>
          <td>${i.product}</td>
          <td>${x(i.published)}</td>
          <td>
            <button class="tiny-button" data-detail-button="${i.id}">View</button>
          </td>
        </tr>
      `).join("")}function X(e,t,s,i=[]){var o;if(!t){e.className="details-panel empty-state",e.textContent="Click a row or button to load extra details for a CVE.";return}const r=i.length?`<ul class="history-list">
        ${i.slice(0,5).map(c=>{var l;return`
              <li>
                <strong>${w(c.created)}</strong>
                <span>${((l=c.change)==null?void 0:l.description)||"NVD change record available."}</span>
              </li>
            `}).join("")}
      </ul>`:'<p class="muted-copy">No recent NVD history records were returned for this CVE.</p>',n=(o=s.references)!=null&&o.length?`<ul class="reference-list">
        ${s.references.slice(0,5).map(c=>`<li><a href="${c}" target="_blank" rel="noreferrer">${c}</a></li>`).join("")}
      </ul>`:'<p class="muted-copy">No CIRCL references available right now.</p>';e.className="details-panel",e.innerHTML=`
    <div class="detail-top-row">
      <div>
        <h4>${t.id}</h4>
        <p class="muted-copy">${t.description}</p>
      </div>
      <span class="severity-badge ${$(t.severity)}">${t.severity}</span>
    </div>

    <div class="detail-grid">
      <div class="detail-box">
        <p class="detail-label">Score</p>
        <p class="detail-value">${t.score}</p>
      </div>
      <div class="detail-box">
        <p class="detail-label">CWE</p>
        <p class="detail-value">${t.cwe}</p>
      </div>
      <div class="detail-box">
        <p class="detail-label">Vendor / Product</p>
        <p class="detail-value">${t.vendor} / ${t.product}</p>
      </div>
      <div class="detail-box">
        <p class="detail-label">Published</p>
        <p class="detail-value">${x(t.published)}</p>
      </div>
    </div>

    <div class="detail-section">
      <h5>CIRCL enrichment</h5>
      <p class="muted-copy">${s.summary}</p>
      <p class="muted-copy">Assigner: ${s.assigner}</p>
      <p class="muted-copy">Exploit flag: ${s.exploited?"Yes":"No"}</p>
      ${n}
    </div>

    <div class="detail-section">
      <h5>NVD change history</h5>
      ${r}
    </div>
  `}function Q(e){const t=document.querySelector("#risk-score"),s=document.querySelector("#risk-label"),i=document.querySelector("#risk-explanation"),r=document.querySelector("#risk-progress");t.textContent=e.score,s.textContent=e.label,i.textContent=e.explanation,r.style.width=`${e.score}%`}function v(e){const t=document.querySelector("#last-updated-pill");t.textContent=e}const a={allVulnerabilities:[],filteredVulnerabilities:[],selectedVulnerability:null,compactView:!1,settings:z()},ee=document.querySelector("#app");Y(ee);const te=document.querySelector("#stats-grid"),C=document.querySelector("#table-body"),m=document.querySelector("#details-panel"),se=document.querySelector("#table-count"),d=document.querySelector("#keyword-input"),u=document.querySelector("#severity-filter"),p=document.querySelector("#sort-by"),ie=document.querySelector("#search-form"),re=document.querySelector("#clear-button"),ne=document.querySelector("#refresh-button"),ae=document.querySelector("#toggle-view-button"),oe=document.querySelector("#severity-chart");function S(e){return{CRITICAL:4,HIGH:3,MEDIUM:2,LOW:1,UNKNOWN:0}[e]??0}function h(){const e=d.value.trim().toLowerCase(),t=u.value,s=p.value;let i=[...a.allVulnerabilities];e&&(i=i.filter(r=>`${r.id} ${r.description} ${r.vendor} ${r.product} ${r.cwe}`.toLowerCase().includes(e))),t!=="ALL"&&(i=i.filter(r=>r.severity===t)),s==="published-desc"?i.sort((r,n)=>new Date(n.published)-new Date(r.published)):s==="score-desc"?i.sort((r,n)=>n.score-r.score):s==="severity-desc"?i.sort((r,n)=>S(n.severity)-S(r.severity)):s==="id-asc"&&i.sort((r,n)=>r.id.localeCompare(n.id)),a.filteredVulnerabilities=i,ue(),k()}function k(){a.settings={...a.settings,recentSearch:d.value,severityFilter:u.value,sortBy:p.value,savedView:a.compactView?"compact":"table",lastUpdated:new Date().toISOString()},J(a.settings)}function ce(){d.value=a.settings.recentSearch||"",u.value=a.settings.severityFilter||"ALL",p.value=a.settings.sortBy||"published-desc",a.compactView=a.settings.savedView==="compact"}function le(e){const t={Critical:0,High:0,Medium:0,Low:0};return e.forEach(s=>{s.severity==="CRITICAL"?t.Critical+=1:s.severity==="HIGH"?t.High+=1:s.severity==="MEDIUM"?t.Medium+=1:t.Low+=1}),t}function de(e){const t=le(e),s=Object.entries(t),i=Math.max(...Object.values(t),1);oe.innerHTML=s.map(([r,n])=>{const o=Math.max(n/i*100,n>0?10:0),c=r.toLowerCase();return`
        <div class="chart-column">
          <div class="chart-value">${n}</div>
          <div class="chart-bar-shell">
            <div class="chart-bar ${c}" style="height: ${o}%"></div>
          </div>
          <div class="chart-label">${r}</div>
        </div>
      `}).join("")}function ue(){const e=K(a.filteredVulnerabilities),t=Z(a.filteredVulnerabilities);_(te,e),I(C,a.filteredVulnerabilities,a.compactView),Q(t),de(a.filteredVulnerabilities),se.textContent=`${a.filteredVulnerabilities.length} items`,!a.selectedVulnerability&&a.filteredVulnerabilities.length&&(a.selectedVulnerability=a.filteredVulnerabilities[0],y(a.selectedVulnerability.id))}async function y(e){const t=a.allVulnerabilities.find(r=>r.id===e);if(!t)return;a.selectedVulnerability=t,m.className="details-panel loading-state",m.textContent="Loading extra NVD and CIRCL details...";const[s,i]=await Promise.all([q(e),H(e)]);X(m,t,s,i)}async function f(){v("Loading recent CVEs...");const e=await P();a.allVulnerabilities=e,a.filteredVulnerabilities=e,h();const t=w(new Date().toISOString());v(`Last refreshed: ${t}`)}async function pe(){const e=d.value.trim();if(!e){await f();return}v(`Searching NVD for "${e}"...`);const t=await R(e);a.allVulnerabilities=t,a.selectedVulnerability=null,h();const s=w(new Date().toISOString());v(`Search finished: ${s}`)}ie.addEventListener("submit",async e=>{e.preventDefault(),await pe()});ne.addEventListener("click",async()=>{await f()});re.addEventListener("click",async()=>{d.value="",u.value="ALL",p.value="published-desc",await f()});u.addEventListener("change",h);p.addEventListener("change",h);const he=B(()=>{h()},250);d.addEventListener("input",he);ae.addEventListener("click",()=>{a.compactView=!a.compactView,I(C,a.filteredVulnerabilities,a.compactView),k()});C.addEventListener("click",async e=>{const t=e.target.closest("[data-detail-button]"),s=e.target.closest("[data-cve-id]");if(t){await y(t.dataset.detailButton);return}s&&await y(s.dataset.cveId)});ce();f();
