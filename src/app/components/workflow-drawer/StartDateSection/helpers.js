/* eslint-disable import/prefer-default-export */
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import moment from 'moment';

export const formatDueTime = dueDate => {
  if (!dueDate) return null;

  const dueTime = moment(dueDate).format(TIME_12H_FORMAT);

  if (
    dueTime.toLowerCase() === '12:00 am' ||
    dueTime.toLowerCase() === '00:00 am'
  ) {
    return null;
  }

  return dueTime;
};
