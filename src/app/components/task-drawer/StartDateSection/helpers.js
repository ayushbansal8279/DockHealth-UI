/* eslint-disable import/prefer-default-export */
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import moment from 'moment';

export const formatStartTime = startDate => {
  if (!startDate) return null;

  const startTime = moment(startDate).format(TIME_12H_FORMAT);

  if (
    startTime.toLowerCase() === '12:00 am' ||
    startTime.toLowerCase() === '00:00 am'
  ) {
    return null;
  }

  return startTime;
};
