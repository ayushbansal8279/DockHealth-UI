import moment from 'moment';

export const isDueDateValid = (startDate, newDueDate) => {
  if (!startDate || newDueDate === null) {
    return true;
  }

  return moment(startDate).isSameOrBefore(moment(newDueDate));
};

export const isStartDateValid = (dueDate, newStartDate) => {
  if (!dueDate || newStartDate === null) {
    return true;
  }

  return moment(dueDate).isSameOrAfter(moment(newStartDate));
};
