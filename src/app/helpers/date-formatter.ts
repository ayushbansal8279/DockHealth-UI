import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

type InputValue = Date | string | number | null | undefined;

/**
 * https://date-fns.org/v3.6.0/docs/format
 * @param date '2023-04-13'
 * @param newFormat 'MM/dd/yyyy, HH:mm'
 * @returns 04/13/2024, 00:00, regardless of local timezone
 */
export function dateFormatter(
  date: InputValue,
  newFormat: string = 'MM/dd/yyyy',
) {
  return date ? format(utcToZonedTime(new Date(date), 'UTC'), newFormat) : '';
}
