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
    timeFormatForHours = 'HH',
  } = props;
  const dueDate = moment(date);
  const dateFormat = dueDate.isSame(moment(), 'year') ? 'MMM DD, YYYY' : format;
  return (
    <>
      <DueDateBasicLabel isOverdue={isOverdue}>
        <DateTextContainer isOverdue={isOverdue}>
          <DateText>
            {dueDate.format(dateFormat)}
            {showTime && (
              <>
                <Spacing horizontal={1} />@
                <Spacing horizontal={1} />
                {dueDate.format(timeFormat)}
                <Spacing horizontal={1} />
                {dueDate.format(timeFormatForHours) >= 12 ? 'pm' : 'am'}
              </>
            )}
          </DateText>
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
      {/* {showTime && (
        <>
          <Spacing horizontal={0} />
          <DateText>
            @ {dueDate.format(timeFormat)}
            <Spacing horizontal={1} />
            {dueDate.format(timeFormatForHours) > 12 ? 'pm' : 'am'}
          </DateText>
        </>
      )} */}
    </>
  );
};

export default DateLabel;
