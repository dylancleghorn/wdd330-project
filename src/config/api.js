const NVD_DEV_BASE = '/api/nvd';
const NVD_PROD_BASE = 'https://services.nvd.nist.gov/rest/json';

const CIRCL_DEV_BASE = '/api/circl';
const CIRCL_PROD_BASE = 'https://cve.circl.lu';

export const NVD_BASE_URL = import.meta.env.DEV ? NVD_DEV_BASE : NVD_PROD_BASE;
export const CIRCL_BASE_URL = import.meta.env.DEV ? CIRCL_DEV_BASE : CIRCL_PROD_BASE;
