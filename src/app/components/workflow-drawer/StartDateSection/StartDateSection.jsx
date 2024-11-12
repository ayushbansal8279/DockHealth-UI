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

const StartDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const { identifier, startDateTime, dueDateTime, hasRecurringSchedule } =
    selectedWorkflow || {};
  const momentStartDate = startDateTime ? moment(startDateTime) : null;
  const [isTimeAvailable, setIsTimeAvailable] = useState(false);

  const handleSave = useCallback(
    (updatedStartDateTime) => {
      if (updatedStartDateTime === null) {
        setIsTimeAvailable(false);
      }
      const payload = {
        startDateTime: updatedStartDateTime,
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

  useEffect(() => {
    if (
      momentStartDate &&
      (momentStartDate.hour() || momentStartDate.minute())
    ) {
      setIsTimeAvailable(true);
    }
  }, [momentStartDate]);

  return (
    <StartDateSectionWrapper>
      <Title>Start date</Title>
      <TaskDrawerPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={identifier}
            selectedDate={startDateTime}
            onDateChange={handleStartDateSave}
            recurring={hasRecurringSchedule}
            onCloseClick={closePopover}
          />
        )}
      >
        <StartDateContentWrapper>
          {momentStartDate ? (
            <>
              <DateViewContainer>
                <DateViewText>
                  {momentStartDate.format('MMM DD, YYYY')}
                </DateViewText>
              </DateViewContainer>
              {isTimeAvailable && (
                <DateViewContainer>
                  <DateViewText>
                    {momentStartDate?.format('hh:mm a')}
                  </DateViewText>
                </DateViewContainer>
              )}
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
