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
              {!(dueDate.format(timeFormatToCheckSpecifiedTime) === '00:00') &&
                showTime && (
                  <>
                    <Spacing horizontal={1} />@
                    <Spacing horizontal={1} />
                    {dueDate.format(timeFormat)}
                    {/* <Spacing horizontal={1} /> */}
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
