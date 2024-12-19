import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import {
  DueDateContentWrapper,
  DueDateSectionWrapper,
  Title,
  DateViewContainer,
  DateViewText,
  SubTitle,
  NoDateContainer,
} from './styled';
import AssignMemberIcon from '../../user/AssignMemberIcon/AssingMemberIcon';
import { openModal } from '@/app/modal/actions';
import { isDueDateValid } from '@/app/helpers/date-validation-helper';
import { checkDateTimeIntent, DueDateIntent } from '@/app/helpers/task-helpers';

const DueDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const { identifier, startDateTime, dueDateTime, hasRecurringSchedule, dueDateIntent } =
    selectedWorkflow || {};
  const momentDueDate = dueDateTime ? moment(dueDateTime) : null;
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (momentDueDate) {
      setIsOverdue(momentDueDate.isBefore(moment()));
    }

    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.DUE_DATE
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName, momentDueDate]);

  const handleSave = useCallback(
    (updatedDueDateTime) => {
      const dueDateIntent = checkDateTimeIntent(updatedDueDateTime);
      const payload = {
        dueDateTime: updatedDueDateTime,
        dueDateIntent: updatedDueDateTime ? dueDateIntent : DueDateIntent.DATE,
      };

      if (!updatedDueDateTime) payload.dueDateTimeCleared = true;

      dispatch(updatePartialWorkflow(selectedWorkflow?.identifier, payload));
    },
    [dispatch, selectedWorkflow],
  );

  const handleDueDateSave = useCallback(
    (newDueDate) => {
      const isDateValid = isDueDateValid(startDateTime, newDueDate);
      if (isDateValid) {
        handleSave(newDueDate);
      } else {
        dispatch(
          openModal('DateWarning', {
            type: 'dueDate',
            onSave: () => handleSave(newDueDate),
          }),
        );
      }
    },
    [dispatch, selectedWorkflow],
  );

  return (
    <DueDateSectionWrapper>
      <Title>Due date</Title>
      <TaskDrawerPopover
        disabled={disabled}
        content={({ closePopover }) => (
          <DueDatePicker
            taskIdentifier={identifier}
            selectedDate={dueDateTime}
            onDateChange={handleDueDateSave}
            recurring={hasRecurringSchedule}
            disableRecurring
            onCloseClick={closePopover}
          />
        )}
      >
        <DueDateContentWrapper>
          {momentDueDate ? (
            <>
              <DateViewContainer isOverdue={isOverdue}>
                <DateViewText>
                  {momentDueDate.format('MMM DD, YYYY')}
                </DateViewText>
              </DateViewContainer>
              {(dueDateIntent === DueDateIntent.DATETIME_ABSOLUTE || 
                (!dueDateIntent && momentDueDate?.format('HH:mm') !== '00:00')) && (
                  <DateViewContainer isOverdue={isOverdue}>
                    <DateViewText>
                      {momentDueDate?.format('hh:mm a')}
                    </DateViewText>
                  </DateViewContainer>
              )}
            </>
          ) : (
            <NoDateContainer>
              <AssignMemberIcon /> <SubTitle>Add Date</SubTitle>
            </NoDateContainer>
          )}
        </DueDateContentWrapper>
      </TaskDrawerPopover>
    </DueDateSectionWrapper>
  );
};

export default DueDateSection;
