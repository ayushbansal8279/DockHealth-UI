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

const DueDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const { identifier, dueDateTime, hasRecurringSchedule } =
    selectedWorkflow || {};
  const momentDueDate = dueDateTime ? moment(dueDateTime) : null;
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    setIsOverdue(momentDueDate.isBefore(moment()));
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.DUE_DATE
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName, momentDueDate]);

  const handleDueDateSave = useCallback(
    (updatedDueDateTime) => {
      const payload = {
        dueDateTime: updatedDueDateTime,
      };

      if (!updatedDueDateTime) payload.dueDateTimeCleared = true;

      dispatch(updatePartialWorkflow(selectedWorkflow?.identifier, payload));
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
            <DateViewContainer isOverdue={isOverdue}>
              <DateViewText>
                {momentDueDate.format('MMM DD, YYYY')}
              </DateViewText>
            </DateViewContainer>
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
