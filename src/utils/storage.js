const STORAGE_KEY = 'securewatch-settings';

const defaultSettings = {
  recentSearch: '',
  severityFilter: 'ALL',
  sortBy: 'published-desc',
  savedView: 'table',
  lastUpdated: ''
};

export function getSettings() {
  const rawSettings = localStorage.getItem(STORAGE_KEY);

  if (!rawSettings) {
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(rawSettings)
    };
  } catch (error) {
    console.error('Could not read localStorage settings.', error);
    return defaultSettings;
  }
}

export function saveSettings(nextSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
}
