/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateWorkflowStatus } from 'actions/task-actions';
import * as AlertActions from 'alert/actions';
import { onTaskDrawerTaskStatusChanged } from 'helpers/ga-event-helper';
import TaskWorkflowStatus from 'components/task/TaskWorkflowStatus/TaskWorkflowStatus';
import TaskDrawerPopover from 'components/task-drawer/TaskDrawerPopover/TaskDrawerPopover';
import Input from 'components/common/Input/Input';
import AlertMessages from 'alert/AlertMessages';
import {
  StatusFieldContainer,
  StatusContainer,
  Title,
  StatusWrapper,
} from './styled';
import { IconButton, InputAdornment } from '@mui/material';
import PrioritySelectIcon from '@/app/img/PrioritySelectIcon';

const StatusSection = ({ selectedTask, onTaskUpdate, disabled = false }) => {
  const dispatch = useDispatch();
  const { workflowStatus, taskIdentifier } = selectedTask || {};

  const setAutoSaveVisible = useCallback(() => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  }, [dispatch]);

  const handleUpdateWorkflowStatus = useCallback(
    (newWorkflowStatus) => {
      if (taskIdentifier) {
        updateWorkflowStatus(
          selectedTask,
          newWorkflowStatus,
        )(dispatch)
          .then((updatedTask) => {
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
    [taskIdentifier, selectedTask],
  );

  const handleClear = () => {
    handleUpdateWorkflowStatus(null);
  };

  return (
    <StatusContainer>
      <Title>Status</Title>
      <TaskDrawerPopover
        width={245}
        disabled={disabled}
        content={({ closePopover, resetPosition }) => (
          <TaskWorkflowStatus
            selectedStatusIdentifier={workflowStatus?.identifier}
            updateWorkflowStatus={handleUpdateWorkflowStatus}
            onClose={closePopover}
            onWidthChange={resetPosition}
          />
        )}
      >
        <StatusFieldContainer>
          {workflowStatus ? (
            <StatusWrapper color={workflowStatus?.color}>
              {workflowStatus?.name}
            </StatusWrapper>
          ) : (
            <Input
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                },
                width: '200px',
                marginLeft: '5px',
              }}
              name="workflowStatus"
              placeholder="--"
              disabled={disabled}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: !workflowStatus ? (
                  <InputAdornment position="start">
                    <IconButton aria-label="status">
                      <PrioritySelectIcon />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ''
                ),
              }}
              inputProps={{
                tabIndex: -1,
                readOnly: true,
                value: workflowStatus?.name || '',
              }}
            />
          )}
        </StatusFieldContainer>
      </TaskDrawerPopover>
    </StatusContainer>
  );
};

export default StatusSection;
