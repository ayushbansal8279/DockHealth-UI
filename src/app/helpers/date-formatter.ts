import moment from 'moment';

type InputValue = Date | string | number | null | undefined;

export function dateFormatter(date: InputValue, newFormat: string) {
  if (!date) return '';

  const standardDateFormat = newFormat || 'MMM DD, YYYY';
  const standardDateTimeFormat = newFormat || 'MMM DD, YYYY @ hh:mm a';

  const dateMoment = moment(date);
  const isTimeAvailable = dateMoment.hour() || dateMoment.minute();

  return dateMoment.format(
    isTimeAvailable ? standardDateTimeFormat : standardDateFormat,
  );
}
