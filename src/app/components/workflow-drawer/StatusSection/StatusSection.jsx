/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import palette from 'styles/palette';
import SmallSwitchChevron from 'img/list-switch-chevron';
import { useDispatch, useSelector } from 'react-redux';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import Input from 'components/common/Input/Input';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import {
  StatusFlag,
  StatusFieldContainer,
  StatusFlagContainer,
} from './styled';
import { EndAdornmentContainer, AdornmentClear } from '../styled';

const StatusSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const { workflowStatus, identifier } = selectedWorkflow || {};
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const [status, setStatus] = useState(workflowStatus);

  useEffect(() => {
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.STATUS
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  const updateWorkflowStatus = (newWorkflowStatus) => {
    const clearStatus = true;
    const donotClearStatus = false;
    dispatch(
      updatePartialWorkflow(selectedWorkflow?.identifier, {
        workflowStatusIdentifier: newWorkflowStatus?.identifier,
        workflowStatusCleared: newWorkflowStatus
          ? donotClearStatus
          : clearStatus,
      }),
    );
  };

  const handleUpdateWorkflowStatus = useCallback(
    (newWorkflowStatus) => {
      setStatus(newWorkflowStatus);
      updateWorkflowStatus(newWorkflowStatus);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [identifier],
  );

  const handleClear = () => {
    handleUpdateWorkflowStatus(null);
  };

  return (
    <TaskDrawerPopover
      content={({ closePopover, resetPosition }) =>
        !disabled && (
          <TaskWorkflowStatus
            selectedStatusIdentifier={workflowStatus?.identifier}
            updateWorkflowStatus={handleUpdateWorkflowStatus}
            onClose={closePopover}
            onWidthChange={resetPosition}
          />
        )
      }
    >
      <StatusFieldContainer>
        <StatusFlagContainer>
          <StatusFlag color={status?.color} />
        </StatusFlagContainer>
        <Input
          label="Status"
          disabled={disabled}
          name="workflowStatus"
          placeholder="Is there a status?"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: workflowStatus ? (
              <AdornmentClear onClick={handleClear} />
            ) : (
              <EndAdornmentContainer>
                <SmallSwitchChevron color={palette.orangeJulius} />
              </EndAdornmentContainer>
            ),
          }}
          inputProps={{
            tabIndex: -1,
            readOnly: true,
            value: status?.name || '',
          }}
        />
      </StatusFieldContainer>
    </TaskDrawerPopover>
  );
};

export default StatusSection;
