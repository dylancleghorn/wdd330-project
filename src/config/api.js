export const NVD_BASE_URL = import.meta.env.DEV
  ? '/api/nvd'
  : 'https://services.nvd.nist.gov/rest/json';

export const EPSS_BASE_URL = import.meta.env.DEV
  ? '/api/epss'
  : 'https://api.first.org/data/v1';
