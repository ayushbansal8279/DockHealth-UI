import React from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import RecurringIcon from 'img/recurring-arrows';
import ReminderIcon from 'img/reminder';
import {
  DueDateBasicLabel,
  DateText,
  DateTextContainer,
  ReminderIconContainer,
  RecurringIconContainer,
} from './styled';

const DateLabel = (props) => {
  const {
    date,
    isOverdue,
    hasReminder,
    hasRecurringSchedule,
    format = 'MMM DD, YYYY',
    showTime = false,
    timeFormat = 'HH:mm',
  } = props;
  return (
    <>
      <DueDateBasicLabel isOverdue={isOverdue}>
        <DateTextContainer isOverdue={isOverdue}>
          <DateText>{moment(date).format(format)}</DateText>
        </DateTextContainer>
        {hasReminder && (
          <ReminderIconContainer isOverdue={isOverdue}>
            <Spacing horizontal={2} />
            <ReminderIcon />
          </ReminderIconContainer>
        )}
        {hasRecurringSchedule && (
          <RecurringIconContainer isOverdue={isOverdue}>
            <Spacing horizontal={2} />
            <RecurringIcon />
          </RecurringIconContainer>
        )}
      </DueDateBasicLabel>
      {showTime && (
        <>
          <Spacing horizontal={1} />
          <DateText>{moment(date).format(timeFormat)}</DateText>
        </>
      )}
    </>
  );
};

export default DateLabel;
