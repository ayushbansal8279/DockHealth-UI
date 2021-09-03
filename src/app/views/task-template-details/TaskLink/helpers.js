import { capitalize } from 'helpers/capitalize';

export const DelayPeriodUnit = {
  HOUR: 'HOUR',
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
};

export const DELAY_PERIOD_UNIT_OPTIONS = Object.values(
  DelayPeriodUnit,
).map(value => ({ value, label: capitalize(value.toLowerCase()) }));
