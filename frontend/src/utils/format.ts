export const number = (value: number) => new Intl.NumberFormat('en-IN').format(value);
export const money = (value: number | null, currency: string) =>
  value === null
    ? 'Unavailable'
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
export const dateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));
