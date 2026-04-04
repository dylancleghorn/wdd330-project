export function formatDate(dateString) {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

export function daysAgo(dateString) {
  if (!dateString) return 999;

  const oneDay = 1000 * 60 * 60 * 24;
  const now = Date.now();
  const then = new Date(dateString).getTime();

  return Math.floor((now - then) / oneDay);
}

export function clamp(number, min, max) {
  return Math.max(min, Math.min(max, number));
}

export function createSeverityClass(severity = '') {
  return severity.toLowerCase();
}

export function debounce(callback, delay = 300) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}
