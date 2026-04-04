import { clamp, daysAgo } from '../utils/helpers.js';

function severityWeight(severity) {
  const weights = {
    CRITICAL: 30,
    HIGH: 20,
    MEDIUM: 10,
    LOW: 5,
    NONE: 1,
    UNKNOWN: 0
  };

  return weights[severity] ?? 0;
}

function recencyWeight(publishedDate) {
  const age = daysAgo(publishedDate);

  if (age <= 7) return 15;
  if (age <= 30) return 10;
  if (age <= 90) return 6;
  return 2;
}

export function calculateRiskScore(vulnerabilities = []) {
  if (!vulnerabilities.length) {
    return {
      score: 0,
      label: 'Low',
      explanation: 'No matching vulnerabilities in the current result set.'
    };
  }

  // this is meant to be easy to explain in class.
  // no fancy math here. just a simple weighted score.
  const totalPoints = vulnerabilities.reduce((sum, item) => {
    const severityPoints = severityWeight(item.severity);
    const scorePoints = Number(item.score || 0) * 2;
    const freshPoints = recencyWeight(item.published);
    return sum + severityPoints + scorePoints + freshPoints;
  }, 0);

  const averagePoints = totalPoints / vulnerabilities.length;
  const normalizedScore = clamp(Math.round(averagePoints * 2.2), 0, 100);

  let label = 'Low';
  if (normalizedScore >= 75) label = 'High';
  else if (normalizedScore >= 50) label = 'Elevated';
  else if (normalizedScore >= 25) label = 'Guarded';

  return {
    score: normalizedScore,
    label,
    explanation:
      'Risk score is based on severity, CVSS score, and how recent the matching vulnerabilities are.'
  };
}

export function summarizeStats(vulnerabilities = []) {
  const stats = {
    total: vulnerabilities.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    averageScore: 0
  };

  if (!vulnerabilities.length) {
    return stats;
  }

  let scoreTotal = 0;

  vulnerabilities.forEach((item) => {
    const severity = item.severity || 'UNKNOWN';
    const score = Number(item.score || 0);

    scoreTotal += score;

    if (severity === 'CRITICAL') stats.critical += 1;
    else if (severity === 'HIGH') stats.high += 1;
    else if (severity === 'MEDIUM') stats.medium += 1;
    else stats.low += 1;
  });

  stats.averageScore = Number((scoreTotal / vulnerabilities.length).toFixed(1));

  return stats;
}
