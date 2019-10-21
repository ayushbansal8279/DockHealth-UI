import { ButtonBase } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import useConfirmation from '../../hooks/useConfirmation';
import Flag from '../common/Flag';
import { Confirmation } from '../common/TaskCheckbox';
import PatientsTaskBody from '../patients/PatientsTaskBody';
import AddSubtask from './AddSubtask';

const PatientsTasklistTask = styled.div`
  border-radius: 3px;
  border: solid 1px #a6dcea;
  background-color: ${({ isSelected, isCollapsed }) => {
    if (isSelected) {
      return '#ddf2f7';
    }

    return isCollapsed ? '#fff' : '#E6ECF0';
  }};
  margin-left: -20px;
  margin-right: -23px;
  margin-bottom: 4px;
`;

const PatientsTasklistSubtasks = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    height: 44px;
    border-radius: 1px;
    border: solid 3px
      ${({ isCollapsed }) => (isCollapsed ? '#f5f8fa' : 'transparent')};

    font-size: 16px;
    line-height: 38px;
    color: #2e3a43;
    padding-left: 15px;
  }
`;

const usePrevious = value => {
  const ref = useRef();
  useEffect(
    () => {
      ref.current = value;
    },
    [value],
  );
  return ref.current;
};

const Task = props => {
  const {
    style,
    task,
    isSubtask,
    markComplete,
    hideDate,
    hidePriority,
    selectedTaskId,
    disabled,
    hideCheckbox,
    storeAsCurrentTask,
  } = props;
  const { subtasks, priority, taskList } = task;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleIsCollapsed = useCallback(
    () => {
      setIsCollapsed(!isCollapsed);
    },
    [setIsCollapsed, isCollapsed],
  );

  const previousSelectedTaskId = usePrevious(selectedTaskId);

  useEffect(
    () => {
      if (isSubtask) {
        return;
      }

      if (
        selectedTaskId !== previousSelectedTaskId &&
        isCollapsed &&
        subtasks.find(subtask => subtask.taskId === selectedTaskId)
      ) {
        setIsCollapsed(false);
      }
    },
    [isCollapsed, isSubtask, previousSelectedTaskId, selectedTaskId, subtasks],
  );

  // Check all subtasks confirmation dialog
  const { isOpen, close, handleStatusChange, confirm } = useConfirmation(
    task,
    markComplete,
  );

  return (
    <PatientsTasklistTask
      style={style}
      isCollapsed={isCollapsed}
      isSelected={selectedTaskId === task.taskId}
    >
      {!isSubtask && (
        <Confirmation isOpen={isOpen} close={close} confirm={confirm} />
      )}
      <div style={{ display: 'flex' }}>
        <Flag priority={priority} />
        <div style={{ flex: 1 }}>
          <PatientsTaskBody
            {...props}
            handleStatusChange={handleStatusChange}
          />
          {!isSubtask && subtasks.length > 0 && (
            <div
              style={{
                padding: '0 22px',
                margin: '6px auto 12px auto',
              }}
            >
              <PatientsTasklistSubtasks
                onClick={toggleIsCollapsed}
                isCollapsed={isCollapsed}
              >
                {`Subtasks (${subtasks.length}) ${isCollapsed ? '▸' : '▾'}`}
                <div
                  style={{ marginLeft: 'auto' }}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {!disabled && task.status !== 'COMPLETE' && !isCollapsed && (
                    <AddSubtask
                      taskId={task.taskId}
                      disabled={task.status === 'COMPLETE'}
                    />
                  )}
                </div>
              </PatientsTasklistSubtasks>
              {!isCollapsed && (
                <div>
                  {subtasks.map(subtask => (
                    <Task
                      task={{
                        ...subtask,
                        taskList,
                      }}
                      isSubtask
                      isParentComplete={task.status === 'COMPLETE'}
                      selectedTaskId={selectedTaskId}
                      markComplete={markComplete}
                      style={{
                        marginLeft: '14px',
                        marginRight: '4px',
                        border: 'none',
                      }}
                      hideDate={hideDate}
                      hidePriority={hidePriority}
                      hideCheckbox={hideCheckbox}
                      disabled={disabled}
                      storeAsCurrentTask={storeAsCurrentTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PatientsTasklistTask>
  );
};

export default Task;
