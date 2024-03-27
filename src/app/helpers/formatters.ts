import moment from 'moment';

export const formatDate = (
  date: string | Date,
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

export const formatEllipsisText = (
  text: string | null,
  { startLen = 3, endLen = 3 } = {},
) => {
  if (!text) {
    return text;
  }
  if (text.length <= startLen + endLen) {
    return text;
  }
  return text.slice(0, startLen) + '...' + text.slice(-endLen);
};
