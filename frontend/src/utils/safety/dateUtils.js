export function formatDate(value) {
  if (!value) return 'Date not listed';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}


/**
 * Format a duration value into a human-readable format.
 *
 * The function expects duration in seconds.
 *
 * Examples:
 *   30      → "30 sec"
 *   90      → "1 min"
 *   3600    → "1 hr"
 *   5400    → "1 hr 30 min"
 */
export function formatDuration(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'Duration not available';
  }

  let seconds;

  // Handle numeric values
  if (typeof value === 'number') {
    seconds = value;
  }

  // Handle strings such as "3600" or "3600s"
  else if (typeof value === 'string') {
    const cleanedValue = value
      .trim()
      .toLowerCase()
      .replace('seconds', '')
      .replace('second', '')
      .replace('secs', '')
      .replace('sec', '')
      .trim();

    seconds = Number(cleanedValue);
  }

  // Handle Google Maps style duration object
  else if (typeof value === 'object') {
    if (typeof value.seconds === 'number') {
      seconds = value.seconds;
    } else if (typeof value.value === 'number') {
      seconds = value.value;
    }
  }

  if (
    seconds === undefined ||
    Number.isNaN(seconds) ||
    !Number.isFinite(seconds)
  ) {
    return 'Duration not available';
  }

  seconds = Math.max(0, Math.round(seconds));

  // Less than one minute
  if (seconds < 60) {
    return `${seconds} sec`;
  }

  const minutes = Math.floor(seconds / 60);

  // Less than one hour
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Exact hours
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}