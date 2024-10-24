import moment from 'moment';

type InputValue = Date | string | number | null | undefined;

export function dateFormatter(date: InputValue) {
  if (!date) return '';

  const standardDateFormat = 'MMM DD, YYYY';
  const standardDateTimeFormat = 'MMM DD, YYYY @ hh:mm a';
  
  const dateMoment = moment(date);
  const isTimeAvailable = dateMoment.hour() || dateMoment.minute();

  return dateMoment.format(
    isTimeAvailable ? standardDateTimeFormat : standardDateFormat
  );
}
