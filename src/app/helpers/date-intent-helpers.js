import moment from "moment";
import { DueDateIntent } from "./task-helpers";

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

export const isDate = (value) => moment(value, moment.ISO_8601, true).isValid();

export const getDateTimeIntent = (value) => {
  if (!isDate(value)) return {};
  return {
    dateTimeIntent: value.includes("T00:00:00.000Z")
      ? DueDateIntent.DATE
      : DueDateIntent.DATETIME_ABSOLUTE,
  };
};