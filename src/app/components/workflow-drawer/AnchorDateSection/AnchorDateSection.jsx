import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
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
import { openModal, closeModal } from 'modal/actions';
import { formatDueTime } from './helpers';
import { AdornmentClear } from '../styled';
import {
  AnchorDateContentWrapper,
  AnchorDateContent,
  AnchorDateSectionWrapper,
  Placeholder,
  DueDateText,
} from './styled';

const AnchorDateSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const inputReference = useRef(null);
  const selectedWorkflow = useSelector(workflowSelector);
  const { identifier, anchorDateTime, hasRecurringSchedule } =
    selectedWorkflow || {};
  const momentDueDate = anchorDateTime ? moment(anchorDateTime) : null;
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);

  const handleAnchorDateSave = useCallback(
    (date) => {
      const payload = {
        anchorDateTime: date,
      };

      const modalProps = {
        confirm: async () => {
          if (!date) payload.anchorDateTimeCleared = true;
          dispatch(
            updatePartialWorkflow(selectedWorkflow?.identifier, payload),
          );

          dispatch(closeModal());
        },
      };
      dispatch(openModal('AnchorDateChangeConfirmation', modalProps));
    },
    [dispatch, selectedWorkflow],
  );

  useEffect(() => {
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.ANCHOR_DATE
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  return (
    <AnchorDateSectionWrapper disabled={disabled}>
      <Input
        inputRef={inputReference}
        label="Anchor date"
        shrink
        customInputComponent={() => (
          <TaskDrawerPopover
            disabled={disabled}
            content={({ closePopover }) => (
              <DueDatePicker
                taskIdentifier={identifier}
                selectedDate={anchorDateTime}
                onDateChange={handleAnchorDateSave}
                recurring={hasRecurringSchedule}
                disableRecurring
                onCloseClick={closePopover}
              />
            )}
          >
            <AnchorDateContentWrapper>
              {momentDueDate ? (
                <AnchorDateContent error={isDueDateOverdue(selectedWorkflow)}>
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
                  <DueDateText>{formatDueTime(anchorDateTime)}</DueDateText>
                  {!disabled && (
                    <AdornmentClear
                      style={{ position: 'relative', top: '-6px' }}
                      onClick={() => handleAnchorDateSave(null)}
                    />
                  )}
                </AnchorDateContent>
              ) : (
                <Placeholder>
                  {disabled
                    ? 'Not available when creating a template'
                    : 'Set a Anchor date?'}
                </Placeholder>
              )}
            </AnchorDateContentWrapper>
          </TaskDrawerPopover>
        )}
      />
    </AnchorDateSectionWrapper>
  );
};

export default AnchorDateSection;
