import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPatient } from '../actions/patient';

export const usePatient = (patientId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPatient(patientId));
  }, [dispatch, patientId]);

  const {
    details, tasks, completedTasks, selectedTaskId, isLoading, error,
  } = useSelector(state => state.patient);

  const taskId = selectedTaskId != null && selectedTaskId;
  const unfinishedTasks = tasks?.flatMap(task => [task, ...task.subtasks]) || [];
  const finishedTasks = completedTasks?.flatMap(task => [task, ...task.subtasks]) || [];
  const allTasks = [...unfinishedTasks, ...finishedTasks];
  const selectedTask = allTasks.find(t => t.taskId === taskId);

  return {
    details, tasks, completedTasks, selectedTask, isLoading, error,
  };
};
