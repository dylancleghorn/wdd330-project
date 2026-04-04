// small fallback set so the project still has something to show in class
// if one of the public APIs has a rough day.
export const mockVulnerabilities = [
  {
    id: 'CVE-2024-10001',
    description: 'Sample remote code execution vulnerability in a fictional web service.',
    published: '2026-03-21T10:00:00.000Z',
    lastModified: '2026-03-25T12:00:00.000Z',
    severity: 'CRITICAL',
    score: 9.8,
    cwe: 'CWE-94',
    vendor: 'Acme',
    product: 'PortalX',
    referencesCount: 5,
    sourceIdentifier: 'sample-source'
  },
  {
    id: 'CVE-2024-10002',
    description: 'Sample authentication bypass issue in a cloud admin panel.',
    published: '2026-03-19T13:30:00.000Z',
    lastModified: '2026-03-26T08:15:00.000Z',
    severity: 'HIGH',
    score: 8.1,
    cwe: 'CWE-287',
    vendor: 'SkyNetics',
    product: 'AdminHub',
    referencesCount: 3,
    sourceIdentifier: 'sample-source'
  },
  {
    id: 'CVE-2024-10003',
    description: 'Sample denial of service issue caused by malformed request handling.',
    published: '2026-03-14T09:00:00.000Z',
    lastModified: '2026-03-18T11:20:00.000Z',
    severity: 'MEDIUM',
    score: 6.4,
    cwe: 'CWE-400',
    vendor: 'Northwind',
    product: 'FlowAPI',
    referencesCount: 2,
    sourceIdentifier: 'sample-source'
  },
  {
    id: 'CVE-2024-10004',
    description: 'Sample info disclosure weakness in a reporting endpoint.',
    published: '2026-03-11T07:45:00.000Z',
    lastModified: '2026-03-11T07:45:00.000Z',
    severity: 'LOW',
    score: 3.7,
    cwe: 'CWE-200',
    vendor: 'BlueMesa',
    product: 'InsightPro',
    referencesCount: 1,
    sourceIdentifier: 'sample-source'
  }
];

export const mockCirclDetails = {
  'CVE-2024-10001': {
    summary: 'Sample CIRCL enrichment showing exploit references and vendor context.',
    cvss: 9.8,
    references: ['https://example.com/advisory-1', 'https://example.com/exploit-1'],
    exploited: true,
    assigner: 'Sample CNA'
  },
  'CVE-2024-10002': {
    summary: 'Sample CIRCL enrichment with a product-focused description.',
    cvss: 8.1,
    references: ['https://example.com/advisory-2'],
    exploited: false,
    assigner: 'Sample CNA'
  }
};
