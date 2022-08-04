import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box } from '@material-ui/core';
import RecurringIcon from 'img/recurring-arrows';
import { isWorkflowDueDateOverdue } from 'helpers/workflow-helpers';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import Spacing from 'components/common/Spacing';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Input from 'components/common/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { formatDueTime } from './helpers';
import { AdornmentClear } from '../styled';
import {
  DueDateContentWrapper,
  DueDateContent,
  DueDateSectionWrapper,
  Placeholder,
  DueDateText,
} from './styled';

const DueDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const { identifier, dueDateTime, hasRecurringSchedule } =
    selectedWorkflow || {};
  const momentDueDate = dueDateTime ? moment(dueDateTime) : null;

  useEffect(() => {
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.DUE_DATE
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  const handleDueDateSave = useCallback(
    updatedDueDateTime => {
      const payload = {
        dueDateTime: updatedDueDateTime,
      };

      if (!updatedDueDateTime) payload.dueDateTimeCleared = true;

      dispatch(updatePartialWorkflow(selectedWorkflow?.identifier, payload));
    },
    [dispatch, selectedWorkflow],
  );

  return (
    <DueDateSectionWrapper disabled={disabled}>
      <Input
        inputRef={inputReference}
        label="Due date"
        shrink
        customInputComponent={() => (
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
                <DueDateContent
                  error={isWorkflowDueDateOverdue(selectedWorkflow)}
                >
                  <DueDateText>
                    {momentDueDate.format('MM/DD/YY')}
                    {hasRecurringSchedule && (
                      <>
                        <Spacing horizontal={3} />
                        <Tooltip title="Recurring Task" placement="right">
                          <Box display="inline-block">
                            <RecurringIcon />
                          </Box>
                        </Tooltip>
                      </>
                    )}
                  </DueDateText>
                  <DueDateText>{formatDueTime(dueDateTime)}</DueDateText>
                  {!disabled && (
                    <AdornmentClear
                      style={{ position: 'relative', top: '-6px' }}
                      onClick={() => handleDueDateSave(null)}
                    />
                  )}
                </DueDateContent>
              ) : (
                <Placeholder>
                  {!disabled
                    ? 'Set a due date?'
                    : 'Not available when creating a template'}
                </Placeholder>
              )}
            </DueDateContentWrapper>
          </TaskDrawerPopover>
        )}
      />
    </DueDateSectionWrapper>
  );
};

export default DueDateSection;
