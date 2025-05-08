import moment from 'moment';

export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';
export const DEFAULT_DATE_TIME_FORMAT = 'MM/DD/YYYY hh:mm A';

export const getMomenDateFromString = (value: string | null): moment.Moment => {
  if (value != null && value.includes('T')) {
    return moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
  }

  if (
    value != null &&
    (value.toLowerCase().includes('am') || value.toLowerCase().includes('pm'))
  ) {
    return moment(value, 'MM/DD/YYYY hh:mm A');
  }

  if (value === null) {
    return moment(value, DEFAULT_DATE_FORMAT);
  }

  let month = value.slice(0, 2);
  let day = value.slice(3, 5);
  const year = value.slice(6);

  if (month === '1_') {
    // moment formats '1_/__/____' to '01/01/{YEAR}'
    // this is to format it to '10/01/{YEAR}'
    month = '10';
  }

  if (day === '31' && [4, 6, 9, 11].includes(Number(month))) {
    // the default value is '_1', so when input '3', it becomes '31'
    day = '30';
  }

  const newValue = `${month}/${day}/${year}`;

  return moment(newValue, DEFAULT_DATE_FORMAT);
};

export function isValidDateInput(value: string): boolean {
  if (!value || value.trim() === '' || value === '__/__/____ __:__ _M') {
    return false;
  }

  const datePart = value.substring(0, 10);
  const hasValidDate = moment(datePart, ['MM/DD/YYYY', 'YYYY-MM-DD'], true).isValid();

  const hasFullTime = /\d{2}:\d{2} [AP]M$/.test(value); // e.g. 12:12 AM
  const hasMissingTime = /__:__ [AP]_M$|__:__ _M$/.test(value); // __:__ AM or _M
  const hasPartialTime = /(\d{2}:\d{1}_|\d{2}:__|\d_:__)/.test(value); // 12:1_

  if (!hasValidDate || (value.includes('_') && !(hasMissingTime || hasFullTime)) || hasPartialTime) {
    return false;
  }

  return true;
}