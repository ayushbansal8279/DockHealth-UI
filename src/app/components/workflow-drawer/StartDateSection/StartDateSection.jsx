import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import {
  StartDateContentWrapper,
  StartDateSectionWrapper,
  Title,
  DateViewContainer,
} from './styled';
import AssignMemberIcon from '../../user/AssignMemberIcon/AssingMemberIcon';
import {
  DateViewText,
  SubTitle,
  NoDateContainer,
} from '../DueDateSection/styled';
import { isStartDateValid } from '@/app/helpers/date-validation-helper';
import { openModal } from '@/app/modal/actions';
import { checkDateTimeIntent, DueDateIntent } from '@/app/helpers/task-helpers';
import { adjustUTCDateForDateIntent } from '../../task/DueDatePicker/helpers';
import { formatDateBasedOnIntent, formatDateTime, shouldDisplayTime } from '@/app/helpers/date-intent-helpers';

const StartDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const { identifier, startDateTime, dueDateTime, hasRecurringSchedule, startDateIntent } =
    selectedWorkflow || {};
  const momentStartDate = startDateTime ? moment(startDateTime) : null;

  const handleSave = useCallback(
    (updatedStartDateTime) => {
      const startDateIntent = checkDateTimeIntent(updatedStartDateTime);
      const payload = {
        startDateTime: formatDateTime(updatedStartDateTime, startDateIntent),
        startDateIntent: updatedStartDateTime ? startDateIntent : DueDateIntent.DATE,
      };

      if (!updatedStartDateTime) payload.startDateTimeCleared = true;

      dispatch(updatePartialWorkflow(selectedWorkflow?.identifier, payload));
    },
    [dispatch, selectedWorkflow],
  );

  const handleStartDateSave = useCallback(
    (newStartDate) => {
      const isDateValid = isStartDateValid(dueDateTime, newStartDate);
      if (isDateValid) {
        handleSave(newStartDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'startDate',
            onSave: () => handleSave(newStartDate),
          }),
        );
      }
    },
    [dispatch, selectedWorkflow],
  );

  return (
    <StartDateSectionWrapper>
      <Title>Start date</Title>
      <TaskDrawerPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={identifier}
            selectedDate={adjustUTCDateForDateIntent(startDateTime ? moment(startDateTime).local() : null, startDateIntent)}
            onDateChange={handleStartDateSave}
            recurring={hasRecurringSchedule}
            onCloseClick={closePopover}
            dueDateIntent={startDateIntent}
            dateType="dueDate"
          />
        )}
      >
        <StartDateContentWrapper>
          {momentStartDate ? (
            <>
              <DateViewContainer>
                <DateViewText>
                  {formatDateBasedOnIntent(momentStartDate, startDateIntent)}
                </DateViewText>
              </DateViewContainer>
              {shouldDisplayTime(momentStartDate, startDateIntent) && (
                  <DateViewContainer>
                    <DateViewText>
                      {momentStartDate?.format('hh:mm a')}
                    </DateViewText>
                  </DateViewContainer>
                )
              }
            </>
          ) : (
            <NoDateContainer>
              <AssignMemberIcon /> <SubTitle>Add Date</SubTitle>
            </NoDateContainer>
          )}
        </StartDateContentWrapper>
      </TaskDrawerPopover>
    </StartDateSectionWrapper>
  );
};

export default StartDateSection;
