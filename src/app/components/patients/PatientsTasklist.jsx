import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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
        <Task
          task={task}
          key={task.taskIdentifier}
          hidePatient
          hideCheckbox
          readOnly
        />
      ))}
      <Grid container justify="center">
        {completedTasks.length > 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={toggleShowCompleted}
          >
            {`${isShowingCompleted ? 'Hide' : 'Show'} completed tasks (${
              completedTasks.length >= SHOW_MORE_STEP_COUNT
                ? `${completedTasksAndSubTasksCount}+`
                : completedTasksAndSubTasksCount
            })`}
          </Button>
        )}
      </Grid>
      {isShowingCompleted && (
        <div style={{ marginTop: '22px' }}>
          {completedTasks.map(task => (
            <Task task={task} key={task.taskIdentifier} readOnly />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsTasklist;
