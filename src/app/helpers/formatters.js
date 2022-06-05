import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export const formatDate = (
  date,
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'h:mma',
) => {
  let dateLabel = '';

  if (moment(date).isSame(new Date(), 'd')) {
    dateLabel = 'Today';
  } else if (moment(date).isSame(moment().subtract(1, 'days'), 'd')) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = moment(date).format(dateFormat);
  }

  return `${dateLabel} @ ${moment(date).format(timeFormat)}`;
};
