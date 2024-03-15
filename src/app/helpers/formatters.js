import moment from 'moment';

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

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
