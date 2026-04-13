import { mockCirclDetails } from '../mockData.js';
import { CIRCL_BASE_URL } from '../config/api.js';

async function readJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function normalizeCirclDetail(data = {}) {
  return {
    id: data.id || data.cve || 'Unknown',
    summary: data.summary || data.description || 'No enrichment summary provided.',
    cvss: data.cvss || data.cvss3 || data.impact?.baseMetricV3?.cvssV3?.baseScore || 0,
    references: data.references || [],
    assigner: data.assigner || data['assigner-short-name'] || 'Unknown',
    exploited: Boolean(data.exploited || data.poc || data['exploit-exists'])
  };
}

export async function fetchCirclDetail(cveId) {
  try {
    const data = await readJson(`${CIRCL_BASE_URL}/api/cve/${cveId}`);
    return normalizeCirclDetail(data);
  } catch (error) {
    console.error('Could not load CIRCL enrichment.', error);

    return (
      mockCirclDetails[cveId] || {
        id: cveId,
        summary: 'No extra enrichment found for this CVE right now.',
        cvss: 0,
        references: [],
        assigner: 'Unknown',
        exploited: false
      }
    );
  }
}
