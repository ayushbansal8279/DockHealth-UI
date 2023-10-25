import React from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import RecurringIcon from 'img/recurring-arrows';
import ReminderIcon from 'img/reminder';
import { DueDateBasicLabel, DateText } from './styled';

const DateLabel = (props) => {
  const {
    date,
    isOverdue,
    hasReminder,
    hasRecurringSchedule,
    format = 'MM/DD/YY',
    showTime = false,
    timeFormat = 'HH:mm',
  } = props;
  const dueDate = moment(date);
  const dateFormat = dueDate.isSame(moment(), 'year') ? 'MM/DD' : format;
  return (
    <>
      <DueDateBasicLabel isOverdue={isOverdue}>
        <DateText>{dueDate.format(dateFormat)}</DateText>
        {hasReminder && (
          <>
            <Spacing horizontal={2} />
            <ReminderIcon />
          </>
        )}
        {hasRecurringSchedule && (
          <>
            <Spacing horizontal={2} />
            <RecurringIcon />
          </>
        )}
      </DueDateBasicLabel>
      {showTime && (
        <>
          <Spacing horizontal={1} />
          <DateText>{dueDate.format(timeFormat)}</DateText>
        </>
      )}
    </>
  );
};

export default DateLabel;
