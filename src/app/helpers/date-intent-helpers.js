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

export const isISODateAndTime = (value) => {
  if (!value) return false;

  if (typeof value === 'string') {
    return (
      value.includes('-') &&
      value.includes('T') &&
      value.includes(':') &&
      moment(value, 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid()
    );
  }

  if (moment.isMoment(value)) {
    return value.isValid();
  }

  return false;
};

export const determineDateTimeIntent = (value) => {
  if (value == null || !isISODateAndTime(value)) return null;

  const localDate = moment(value);
  const isDateIntent = localDate.hours() === 0 && localDate.minutes() === 0;

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

// for calculating intent from api date response
export const determineDateTimeIntentFromApiDate = (value) => {
  if (!value) return null;

  if (moment.isMoment(value)) {
    const rawInput = value._i;
    if (typeof rawInput === 'string' && rawInput.includes('null')) {
      return DueDateIntent.DATE;
    }
    return DueDateIntent.DATETIME_ABSOLUTE;
  }

  if (typeof value === 'string' && isISODateAndTime(value)) {
    return value.includes('T00:00:00.000Z')
      ? DueDateIntent.DATE
      : DueDateIntent.DATETIME_ABSOLUTE;
  }

  return null;
};

export const transformMetaData = (dataArray) => {
  return dataArray.map((item) => {
    const dateTimeIntent = determineDateTimeIntent(item.value);
    if (!dateTimeIntent) return item;

    return item.isFieldUpdated
      ? {
          ...item,
          dateTimeIntent,
          value: determineDateValueFromIntent(item.value, dateTimeIntent),
        }
      : {
          ...item,
          value: item.value,
          dateTimeIntent: determineDateTimeIntentFromApiDate(item.value),
        };
  });
};

export const getDateTimeIntent = (value) => {
  if (!isISODateAndTime(value)) return {};
  return {
    dateTimeIntent: value.includes('T00:00:00.000Z')
      ? DueDateIntent.DATE
      : DueDateIntent.DATETIME_ABSOLUTE,
  };
};
