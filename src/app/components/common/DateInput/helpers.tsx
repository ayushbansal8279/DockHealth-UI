import moment from 'moment';

export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';

export const getMomenDateFromString = (value: string | null): moment.Moment => {
  if (value != null && value.includes('T')) {
    return moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
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
