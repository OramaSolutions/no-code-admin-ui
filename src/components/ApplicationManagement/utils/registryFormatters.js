export const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

export const formatBytes = (bytes) => {
  if (!bytes) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** unitIndex;
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const formatDateTime = (value) => {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const toLabel = (value) =>
  (value || '')
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getStatusClasses = (status) => {
  const normalizedStatus = (status || '').toLowerCase();

  if (normalizedStatus === 'active' || normalizedStatus === 'success') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (normalizedStatus === 'inactive') {
    return 'bg-amber-100 text-amber-700';
  }

  if (normalizedStatus === 'archived' || normalizedStatus === 'failed') {
    return 'bg-rose-100 text-rose-700';
  }

  return 'bg-slate-100 text-slate-700';
};
