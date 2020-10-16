/* eslint-disable import/prefer-default-export */
import moment from 'moment';

export const getTaskDateLabel = date => {
  if (moment(date).isSame(new Date(), 'd')) return 'Today';

  if (moment(date).isSame(moment().subtract(1, 'days'), 'd'))
    return 'Yesterday';

  return moment(date).format('MM/DD/YYYY');
};
