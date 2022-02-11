import React from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import RecurringIcon from 'img/recurring-arrows';
import ReminderIcon from 'img/reminder';
import { DueDateBasicLabel, DateText } from './styled';

const DateLabel = props => {
  const { date, isOverdue, hasReminder, hasRecurringSchedule } = props;
  return (
    <DueDateBasicLabel isOverdue={isOverdue}>
      <DateText>{moment(date).format('MM/DD')}</DateText>
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
  );
};

export default DateLabel;
