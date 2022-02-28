import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box } from '@material-ui/core';
import RecurringIcon from 'img/recurring-arrows';
import { isDueDateOverdue } from 'helpers/task-helpers';
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
  StartDateContentWrapper,
  StartDateContent,
  StartDateSectionWrapper,
  Placeholder,
  DueDateText,
} from './styled';

const StartDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const inputReference = useRef(null);
  const selectedWorkflow = useSelector(workflowSelector);
  const { identifier, startDateTime, hasRecurringSchedule } =
    selectedWorkflow || {};
  const momentDueDate = startDateTime ? moment(startDateTime) : null;
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);

  const handleStartDateSave = useCallback(
    date => {
      dispatch(
        updatePartialWorkflow(selectedWorkflow?.identifier, {
          startDateTime: date,
        }),
      );
    },
    [dispatch, selectedWorkflow],
  );

  useEffect(() => {
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.START_DATE
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  return (
    <StartDateSectionWrapper disabled={disabled}>
      <Input
        inputRef={inputReference}
        label="Start date"
        shrink
        customInputComponent={() => (
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
              {momentDueDate ? (
                <StartDateContent error={isDueDateOverdue(selectedWorkflow)}>
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
                  <DueDateText>{formatDueTime(startDateTime)}</DueDateText>
                  {!disabled && (
                    <AdornmentClear
                      style={{ position: 'relative', top: '-6px' }}
                      onClick={() => handleStartDateSave(null)}
                    />
                  )}
                </StartDateContent>
              ) : (
                <Placeholder>
                  {!disabled
                    ? 'Set a start date?'
                    : 'Not available when creating a template'}
                </Placeholder>
              )}
            </StartDateContentWrapper>
          </TaskDrawerPopover>
        )}
      />
    </StartDateSectionWrapper>
  );
};

export default StartDateSection;
