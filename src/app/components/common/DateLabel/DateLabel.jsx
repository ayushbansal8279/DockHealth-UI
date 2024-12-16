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
import Tooltip from '../Tooltip/Tooltip';

const DateLabel = (props) => {
  const {
    date,
    isOverdue,
    hasReminder,
    hasRecurringSchedule,
    format = 'MMM DD, YYYY',
    showTime = true,
    timeFormat = 'hh:mm a',
    timeFormatToCheckSpecifiedTime = 'HH:mm',
    tootipTitle,
    showReminder = true,
    showRecurring = true,
    dueDateIntent
  } = props;
  const dueDate = moment(date);
  const dateFormat = dueDate.isSame(moment(), 'year') ? 'MMM DD, YYYY' : format;
  return (
    <>
      <DueDateBasicLabel isOverdue={isOverdue}>
        <Tooltip placement="top" title={!!tootipTitle ? tootipTitle : ''}>
          <DateTextContainer isOverdue={isOverdue}>
            <DateText>
              {dueDate.format(dateFormat)}
              {(dueDateIntent === 'DATETIME_ABSOLUTE' || 
                (!dueDateIntent && dueDate?.format(timeFormatToCheckSpecifiedTime) !== '00:00')) &&
                  showTime && (
                    <>
                      <Spacing horizontal={1} />@
                      <Spacing horizontal={1} />
                      {dueDate.format(timeFormat)}
                    </>
                  )}
            </DateText>
          </DateTextContainer>
        </Tooltip>
        {showReminder && hasReminder && (
          <ReminderIconContainer isOverdue={isOverdue}>
            <Spacing horizontal={2} />
            <ReminderIcon />
          </ReminderIconContainer>
        )}
        {showRecurring && hasRecurringSchedule && (
          <RecurringIconContainer isOverdue={isOverdue}>
            <Spacing horizontal={2} />
            <RecurringIcon />
          </RecurringIconContainer>
        )}
      </DueDateBasicLabel>
    </>
  );
};

export default DateLabel;
