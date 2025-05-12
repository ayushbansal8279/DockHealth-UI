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

export const calculateDateTimeIntent = (value) => {
  if (value == null || !isISODateAndTime(value)) return null;

  return value.includes('T00:00:00.000Z')
      ? DueDateIntent.DATE
      : DueDateIntent.DATETIME_ABSOLUTE;
}

export const transformMetaData = (dataArray) => {
  return dataArray.map((item) => {
    const dateTimeIntent = calculateDateTimeIntent(item.value);
    if (!dateTimeIntent) return item;

    return {
      ...item,
      value: item.value,
      dateTimeIntent,
    }
  });
};

export const convertForIntent = (date) => {
  if(!date) return null;

  let finalIso;

  const rawInput = date?._i;
  const hasValidTime = rawInput && !rawInput.includes('null');

  if (hasValidTime) {
    finalIso = moment(date).toISOString();
  } else {
    finalIso = `${moment(date).format('YYYY-MM-DD')}T00:00:00.000Z`;
  }

  return finalIso;

}

export const normalizeDateOnlyIntent = (isoDateString) => {
  if (!isoDateString) return null;

  const utcMoment = moment.utc(isoDateString);
  const localMoment = utcMoment.clone().local();

  const isLocalMidnight =
    localMoment.hour() === 0 &&
    localMoment.minute() === 0 &&
    localMoment.second() === 0 &&
    localMoment.millisecond() === 0;

  if (isLocalMidnight) {
    const normalized = moment
      .utc(localMoment.format('YYYY-MM-DD'))
      .toISOString();

    return normalized;
  }

  return isoDateString;
};