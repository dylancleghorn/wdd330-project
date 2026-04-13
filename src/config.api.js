export const API_BASES = {
  nvd: import.meta.env.DEV ? '/api/nvd' : 'https://services.nvd.nist.gov/rest/json',
  epss: import.meta.env.DEV ? '/api/epss' : 'https://api.first.org/data/v1'
};
