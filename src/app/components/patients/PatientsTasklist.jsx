import { ButtonBase } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

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

const PatientsTasklist = ({ tasks = [], completedTasks = [], submitTask }) => {
  const [isShowingCompleted, setShowCompleted] = useState(false);
  const toggleShowCompleted = useCallback(() => {
    setShowCompleted(!isShowingCompleted);
  }, [isShowingCompleted]);

  let completedTasksAndSubTasksCount = completedTasks.length;
  completedTasks.forEach(task => {
    completedTasksAndSubTasksCount += task.subtasks?.length ?? 0;
  });

  return (
    <div>
      <PatientsTasklistCount>{`${tasks.length} tasks`}</PatientsTasklistCount>
      {submitTask && (
        <AddTask submit={submitTask} style={{ marginTop: '-11px' }} />
      )}
      {tasks.map(task => (
        <Task task={task} key={task.taskId} hidePatient hideCheckbox readOnly />
      ))}
      {completedTasks.length > 0 && (
        <PatientsTasklistShowCompleted onClick={toggleShowCompleted}>
          {`${isShowingCompleted ? 'Hide' : 'Show'} completed tasks (${
            completedTasks.length >= SHOW_MORE_STEP_COUNT
              ? `${completedTasksAndSubTasksCount}+`
              : completedTasksAndSubTasksCount
          })`}
        </PatientsTasklistShowCompleted>
      )}
      {isShowingCompleted && (
        <div style={{ marginTop: '22px' }}>
          {completedTasks.map(task => (
            <Task task={task} key={task.taskId} readOnly />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsTasklist;
