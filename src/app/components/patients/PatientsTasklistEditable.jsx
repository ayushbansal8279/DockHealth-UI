import { ButtonBase } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { selectPatientTask } from '../../actions/patient';
import { markComplete } from '../../actions/task-actions';
import AddTask from '../task/AddTask';
import Task from '../task/Task';

const SHOW_MORE_STEP_COUNT = 100;

const PatientsTasklistCount = styled.div`
  font-size: 16px;
  color: #2e3a43;
  margin-bottom: 11px;
`;

const PatientsTasklistShowCompleted = styled(ButtonBase)`
  && {
    display: block;
    width: 344px;
    height: 37px;
    border-radius: 57.4px;
    background-color: #0ca1c7;

    font-size: 16px;
    color: #ffffff;

    text-align: center;
    margin: 36px auto 0 auto;
    line-height: 36px;
  }
`;

const markAsComplete = ({ dispatch, listType }) => (task, status) => {
  dispatch(markComplete(task, status, listType));
};

const selectCurrentPatientTask = ({ dispatch }) => task => {
  dispatch(selectPatientTask(task));
};

const PatientsTasklistEditable = ({
  tasks = [],
  completedTasks = [],
  selectCurrentTask,
  submitTask,
  isAddTaskEnabled,
  selectedTaskId,
  ...otherProps
}) => {
  const [isShowingCompleted, setShowCompleted] = useState(false);
  const toggleShowCompleted = useCallback(() => {
    setShowCompleted(!isShowingCompleted);
  }, [isShowingCompleted]);

  const dispatch = useDispatch();

  let completedTasksAndSubTasksCount = completedTasks.length;
  completedTasks.forEach(task => {
    completedTasksAndSubTasksCount += task.subtasks?.length ?? 0;
  });

  return (
    <div>
      <PatientsTasklistCount>{`${tasks.length} tasks`}</PatientsTasklistCount>
      {isAddTaskEnabled && submitTask && (
        <AddTask
          storeAsCurrentTask={selectCurrentTask}
          submitBound={submitTask}
          style={{ marginTop: '-11px' }}
        />
      )}
      {tasks.map(task => (
        <Task
          task={task}
          key={task.taskIdentifier}
          hidePatient
          markComplete={markAsComplete({ dispatch, listType: 'INCOMPLETE' })}
          storeAsCurrentTask={selectCurrentPatientTask({ dispatch })}
          selectedTaskId={selectedTaskId}
          {...otherProps}
        />
      ))}
      {completedTasks.length > 0 && (
        <PatientsTasklistShowCompleted onClick={toggleShowCompleted}>
          {`${isShowingCompleted ? 'Hide' : 'Show'} completed tasks (${
            completedTasks.length >= SHOW_MORE_STEP_COUNT
              ? `${SHOW_MORE_STEP_COUNT}+`
              : completedTasksAndSubTasksCount
          })`}
        </PatientsTasklistShowCompleted>
      )}
      {isShowingCompleted && (
        <div style={{ marginTop: '22px' }}>
          {completedTasks.map(task => (
            <Task
              task={task}
              key={task.taskIdentifier}
              hidePatient
              markComplete={markAsComplete({ dispatch, listType: 'COMPLETE' })}
              storeAsCurrentTask={selectCurrentPatientTask({ dispatch })}
              selectedTaskId={selectedTaskId}
              {...otherProps}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsTasklistEditable;
