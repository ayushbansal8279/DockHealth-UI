import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPatient } from '../actions/patient';

const usePatient = (patientIdentifier) => {
  const dispatch = useDispatch();
  useEffect(
    () => {
      dispatch(fetchPatient(patientIdentifier));
    },
    [dispatch, patientIdentifier],
  );

  const {
    details, tasks, completedTasks, selectedTaskId, isLoading, error,
  } = useSelector(
    state => state.patient,
  );

  const taskIdentifier = selectedTaskId != null && selectedTaskId;
  const unfinishedTasks = tasks?.flatMap(task => [task, ...task.subtasks]) || [];
  const finishedTasks = completedTasks?.flatMap(task => [task, ...task.subtasks]) || [];
  const allTasks = [...unfinishedTasks, ...finishedTasks];
  const selectedTask = allTasks.find(t => t.taskIdentifier === taskIdentifier);

  return {
    details,
    tasks,
    completedTasks,
    selectedTask,
    isLoading,
    error,
  };
};

export default usePatient;
