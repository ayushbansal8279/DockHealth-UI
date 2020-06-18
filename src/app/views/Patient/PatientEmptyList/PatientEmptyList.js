import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import Spacing from 'components/common/Spacing';
import { getTaskListForUser } from 'api/tasklist-api';
import { PatientEmptyListContainer } from './styled';

const PatientEmptyList = ({ quickAddTask }) => {
  const dispatch = useDispatch();

  const handleQuickAddTask = taskName => {
    dispatch(
      openModal('ListPicker', {
        fetchMethod: getTaskListForUser,
        confirm: taskListIdentifier =>
          quickAddTask(taskName, taskListIdentifier),
      }),
    );
  };

  return (
    <PatientEmptyListContainer>
      <QuickAddTaskInput quickAddTask={handleQuickAddTask} />
      <Spacing vertical={5} />
      <p>This patient has no tasks</p>
    </PatientEmptyListContainer>
  );
};

export default PatientEmptyList;
