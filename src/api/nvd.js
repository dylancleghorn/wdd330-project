import { mockVulnerabilities } from '../mockData.js';

function buildMetricData(metrics = {}) {
  return (
    metrics.cvssMetricV31?.[0] ||
    metrics.cvssMetricV30?.[0] ||
    metrics.cvssMetricV2?.[0] ||
    null
  );
}

function buildCwe(weaknesses = []) {
  return (
    weaknesses?.[0]?.description?.[0]?.value ||
    'Unknown'
  );
}

function buildProductNode(configurations = []) {
  for (const config of configurations) {
    for (const node of config.nodes || []) {
      for (const match of node.cpeMatch || []) {
        const criteria = match.criteria || '';
        const parts = criteria.split(':');
        if (parts.length > 5) {
          return {
            vendor: parts[3] || 'Unknown',
            product: parts[4] || 'Unknown'
          };
        }
      }
    }
  }

  return {
    vendor: 'Unknown',
    product: 'Unknown'
  };
}

function normalizeCve(cveItem) {
  const cve = cveItem.cve || {};
  const metricData = buildMetricData(cve.metrics);
  const cvssData = metricData?.cvssData || {};
  const productNode = buildProductNode(cve.configurations || []);

  return {
    id: cve.id,
    description: cve.descriptions?.find((item) => item.lang === 'en')?.value || 'No description provided.',
    published: cve.published,
    lastModified: cve.lastModified,
    severity: cvssData.baseSeverity || metricData?.baseSeverity || 'UNKNOWN',
    score: cvssData.baseScore || 0,
    vectorString: cvssData.vectorString || 'Not listed',
    cwe: buildCwe(cve.weaknesses),
    vendor: productNode.vendor,
    product: productNode.product,
    referencesCount: cve.references?.length || 0,
    sourceIdentifier: cve.sourceIdentifier || 'Unknown'
  };
}

async function readJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchRecentVulnerabilities() {
  try {
    // grabbing the last 30 days makes the dashboard feel current
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const params = new URLSearchParams({
      pubStartDate: startDate.toISOString(),
      pubEndDate: endDate.toISOString(),
      resultsPerPage: '24',
      startIndex: '0'
    });

    const data = await readJson(`/api/nvd/cves/2.0?${params.toString()}`);
    return (data.vulnerabilities || []).map(normalizeCve);
  } catch (error) {
    console.error('Falling back to mock vulnerability data.', error);
    return mockVulnerabilities;
  }
}

export async function searchVulnerabilities(keyword = '') {
  try {
    const params = new URLSearchParams({
      keywordSearch: keyword,
      resultsPerPage: '24',
      startIndex: '0'
    });

    const data = await readJson(`/api/nvd/cves/2.0?${params.toString()}`);
    return (data.vulnerabilities || []).map(normalizeCve);
  } catch (error) {
    console.error('Search failed. Using mock fallback.', error);

    return mockVulnerabilities.filter((item) => {
      const text = `${item.id} ${item.description} ${item.vendor} ${item.product}`.toLowerCase();
      return text.includes(keyword.toLowerCase());
    });
  }
}

export async function fetchCveHistory(cveId) {
  try {
    const params = new URLSearchParams({ cveId });
    const data = await readJson(`/api/nvd/cvehistory/2.0?${params.toString()}`);
    return data.cveChanges || [];
  } catch (error) {
    console.error('Could not load NVD change history.', error);
    return [];
  }
}
