/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback } from 'react';
import palette from 'styles/palette';
import SmallSwitchChevron from 'img/list-switch-chevron';
import { useDispatch } from 'react-redux';
import { updateWorkflowStatus } from 'actions/task-actions';
import * as AlertActions from 'alert/actions';
import { onTaskDrawerTaskStatusChanged } from 'helpers/ga-event-helper';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import TextInput from 'components/common/TextInput/TextInput';
import {
  StatusFlag,
  StatusFieldContainer,
  StatusFlagContainer,
} from './styled';
import {
  EndAdornmentContainer,
  AdornmentContainer,
  AdornmentClear,
} from '../styled';

const StatusSection = ({ selectedTask, setAutoSaveVisible, onTaskUpdate }) => {
  const dispatch = useDispatch();
  const { workflowStatus, taskIdentifier } = selectedTask || {};

  const handleUpdateWorkflowStatus = useCallback(
    newWorkflowStatus => {
      if (taskIdentifier) {
        updateWorkflowStatus(
          selectedTask,
          newWorkflowStatus,
        )(dispatch)
          .then(updatedTask => {
            onTaskDrawerTaskStatusChanged(newWorkflowStatus?.name);
            onTaskUpdate(updatedTask);
            setAutoSaveVisible();
          })
          .catch(() => {
            dispatch(
              AlertActions.showGlobalAlert(
                'Error updating status, please try again later',
                'error',
              ),
            );
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskIdentifier],
  );

  const handleClear = () => {
    handleUpdateWorkflowStatus(null);
  };

  return (
    <TaskDrawerPopover
      content={({ closePopover }) => (
        <TaskWorkflowStatus
          selectedStatusIdentifier={workflowStatus?.identifier}
          updateWorkflowStatus={handleUpdateWorkflowStatus}
          onClose={closePopover}
        />
      )}
    >
      <StatusFieldContainer>
        <StatusFlagContainer>
          <StatusFlag color={workflowStatus?.color} />
        </StatusFlagContainer>
        <TextInput
          label="Status"
          name="workflowStatus"
          placeholder="Is there a status?"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: !workflowStatus && (
              <AdornmentContainer>+</AdornmentContainer>
            ),
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
            value: workflowStatus?.name || '',
          }}
        />
      </StatusFieldContainer>
    </TaskDrawerPopover>
  );
};

export default StatusSection;
