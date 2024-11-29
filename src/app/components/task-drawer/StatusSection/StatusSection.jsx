/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { organizationStatusesSelector } from '@/app/selectors/organization-selectors';
import Tooltip from 'components/common/Tooltip/Tooltip';

const StatusSection = ({
  selectedTask,
  onTaskUpdate,
  disabled = false,
  addTaskDrawer,
  setWorkflowStatusIdentifier,
}) => {
  const dispatch = useDispatch();
  const { workflowStatus, taskIdentifier } = selectedTask || {};
  const statuses = useSelector(organizationStatusesSelector);
  const [status, setStatus] = useState(workflowStatus);

  const setAutoSaveVisible = useCallback(() => {
    dispatch(AlertActions.showSideBarAlert(AlertMessages.SAVED));
  }, [dispatch]);

  const handleUpdateWorkflowStatus = useCallback(
    (newWorkflowStatus) => {
      if (addTaskDrawer) {
        setWorkflowStatusIdentifier(newWorkflowStatus.identifier);
        setStatus(newWorkflowStatus);
      } else {
        if (taskIdentifier) {
          updateWorkflowStatus(
            selectedTask,
            newWorkflowStatus,
          )(dispatch)
            .then((updatedTask) => {
              onTaskDrawerTaskStatusChanged(newWorkflowStatus?.name);
              onTaskUpdate(updatedTask);
              setStatus(newWorkflowStatus);
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
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskIdentifier, selectedTask],
  );

  const handleClear = () => {
    handleUpdateWorkflowStatus(null);
  };

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [status]);

  const TooltipWrapper = isTruncated ? Tooltip : React.Fragment;

  return (
    <StatusContainer>
      <Title>Status</Title>
      <TaskDrawerPopover
        width={statuses?.length > 30 ? 600 : ''}
        height={500}
        horizontalPlacement={statuses?.length > 30 ? 'right' : 'center'}
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
          {status ? (
            <StatusWrapper color={status?.color}>
              <TooltipWrapper {...(isTruncated && { placement: 'top', title: status?.name })}>
                <div
                  ref={textRef}
                  style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  {status?.name}
                </div>
              </TooltipWrapper>
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
                startAdornment: !status ? (
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
                value: status?.name || '',
                style: {
                  cursor: 'pointer',
                },
              }}
            />
          )}
        </StatusFieldContainer>
      </TaskDrawerPopover>
    </StatusContainer>
  );
};

export default StatusSection;
