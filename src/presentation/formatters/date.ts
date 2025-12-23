const pad = (value: number | string): string =>
  value.toString().padStart(2, '0');

export const formatDate = (value: Date | string | number): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatTime = (value: Date | string | number): string => {
  if (value instanceof Date || typeof value === 'number') {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  if (typeof value === 'string') {
    const [hours, minutes] = value.split(':');
    if (hours === undefined || minutes === undefined) {
      return '';
    }
    return `${pad(hours)}:${pad(minutes)}`;
  }

  return '';
};

