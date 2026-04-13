import { EPSS_BASE_URL } from '../config/api.js';

async function readJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function toPercent(value) {
  const number = Number(value || 0);
  return (number * 100).toFixed(2);
}

function buildLabel(probability) {
  const score = Number(probability || 0);

  if (score >= 0.5) return 'Very high exploit likelihood based on EPSS.';
  if (score >= 0.2) return 'Elevated exploit likelihood based on EPSS.';
  if (score >= 0.05) return 'Moderate exploit likelihood based on EPSS.';
  return 'Lower exploit likelihood based on EPSS.';
}

export async function fetchEpssDetail(cveId) {
  try {
    const params = new URLSearchParams({ cve: cveId });
    const data = await readJson(`${EPSS_BASE_URL}/epss?${params.toString()}`);
    const item = data.data?.[0];

    if (!item) {
      return {
        id: cveId,
        probability: 0,
        probabilityPercent: '0.00',
        percentile: 0,
        percentilePercent: '0.00',
        date: 'Not available',
        label: 'No EPSS result was returned for this CVE.'
      };
    }

    return {
      id: cveId,
      probability: Number(item.epss || 0),
      probabilityPercent: toPercent(item.epss),
      percentile: Number(item.percentile || 0),
      percentilePercent: toPercent(item.percentile),
      date: item.date || 'Not available',
      label: buildLabel(item.epss)
    };
  } catch (error) {
    console.error('Could not load EPSS enrichment.', error);

    return {
      id: cveId,
      probability: 0,
      probabilityPercent: '0.00',
      percentile: 0,
      percentilePercent: '0.00',
      date: 'Unavailable',
      label: 'EPSS enrichment is unavailable right now.'
    };
  }
}
