import { ButtonBase } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { selectPatientTask } from '../../actions/patient';
import { markComplete } from '../../actions/task-actions';
import AddTask from '../home/AddTask';
import PatientsTask from './PatientsTask';

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

const PatientsTasklistEditable = ({
  tasks = [],
  completedTasks = [],
  submitTask,
  selectedTaskId,
}) => {
  const [isShowingCompleted, setShowCompleted] = useState(false);
  const toggleShowCompleted = useCallback(
    () => {
      setShowCompleted(!isShowingCompleted);
    },
    [isShowingCompleted],
  );

  const dispatch = useDispatch();
  const mark = listType => (task, status) => {
    dispatch(markComplete(task, status, listType));
  };
  const select = (task) => {
    dispatch(selectPatientTask(task));
  };

  return (
    <div>
      <PatientsTasklistCount>{`${tasks.length} tasks`}</PatientsTasklistCount>
      {submitTask && <AddTask submit={submitTask} style={{ marginTop: '-11px' }} />}
      {tasks.map(task => (
        <PatientsTask
          task={task}
          key={task.taskId}
          hidePatient
          markComplete={mark('INCOMPLETE')}
          storeAsCurrentTask={select}
          selectedTaskId={selectedTaskId}
        />
      ))}
      {completedTasks.length > 0 && (
        <PatientsTasklistShowCompleted onClick={toggleShowCompleted}>
          {`${isShowingCompleted ? 'Hide' : 'Show'} completed tasks (${completedTasks.length})`}
        </PatientsTasklistShowCompleted>
      )}
      {isShowingCompleted && (
        <div style={{ marginTop: '22px' }}>
          {completedTasks.map(task => (
            <PatientsTask
              task={task}
              key={task.taskId}
              hidePatient
              markComplete={mark('COMPLETE')}
              storeAsCurrentTask={select}
              selectedTaskId={selectedTaskId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsTasklistEditable;
