import moment from 'moment';

export const TIME_12H_FORMAT = 'hh:mm A';

export function escapeDueTime(dueDate) {
  const m = moment(dueDate);
  const dueTime = m.format(TIME_12H_FORMAT);
  if (
    dueTime.toLowerCase() === '12:00 am' ||
    dueTime.toLowerCase() === '00:00 am'
  )
    return m.format('YYYY-MM-DD');
  return dueDate;
}

export const transformTaskToEvent = task => ({
  id: task.identifier,
  title: task.description,
  start: escapeDueTime(task.dueDate),
  display: 'block',
});
