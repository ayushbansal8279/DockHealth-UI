import moment from 'moment';
import { DueDateIntent } from './task-helpers';

export const UTC_DATE_ONLY = 'YYYY-MM-DDT00:00:00.000[Z]';
export const UTC_DATE_TIME = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';

export function formatDateBasedOnIntent(date, intent) {
  return intent === DueDateIntent.DATE
    ? moment(date).utc().format('MMM DD, YYYY')
    : moment(date).format('MMM DD, YYYY');
}

export function shouldDisplayTime(date, intent) {
  return (
    intent === DueDateIntent.DATETIME_ABSOLUTE ||
    (!intent && moment(date).format('HH:mm') !== '00:00')
  );
}

export function formatDateTime(date, intent) {
  if (!date) return null;

  return intent === DueDateIntent.DATE
    ? moment.utc(date).startOf('day').toISOString()
    : moment(date).toISOString();
}

export const isISODateAndTime = (value) =>
  value.includes('-') &&
  value.includes('T') &&
  value.includes(':') &&
  moment(value, 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid();

export const determineDateTimeIntent = (value) => {
  if (value == null || !isISODateAndTime(value)) return null;

  const localDate = moment(value);
  const recalculatedUtcMidnight = moment(localDate).startOf('day').utc();
  const isDateIntent = value === recalculatedUtcMidnight.format(UTC_DATE_TIME);

  const dateTimeIntent = isDateIntent
    ? DueDateIntent.DATE
    : DueDateIntent.DATETIME_ABSOLUTE;
  return dateTimeIntent;
};

export const determineDateValueFromIntent = (value, dateIntent) => {
  if (dateIntent == null) return value;
  return dateIntent === DueDateIntent.DATE
    ? moment(value).format(UTC_DATE_ONLY)
    : moment.utc(value).format(UTC_DATE_TIME);
};

export const getDateTimeIntent = (value) => {
  if (!isISODateAndTime(value)) return {};
  return {
    dateTimeIntent: value.includes('T00:00:00.000Z')
      ? DueDateIntent.DATE
      : DueDateIntent.DATETIME_ABSOLUTE,
  };
};
