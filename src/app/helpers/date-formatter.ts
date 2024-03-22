import { DateTime } from 'luxon';

export const dateFormatter = (
  date: string | Date,
  { timezone = 'Etc/UTC', fmt = 'M/d/yyyy' },
): string => {
  const d = new Date(date).toISOString();
  return DateTime.fromISO(d, { zone: timezone }).toFormat(fmt);
};
