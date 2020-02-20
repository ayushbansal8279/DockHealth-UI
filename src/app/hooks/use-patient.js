import { useSelector } from 'react-redux';

const usePatient = () => {
  const patient = useSelector(state => state.patient);

  const {
    details,
    tasks,
    completedTasks,
    selectedTaskId,
    isLoading,
    error,
  } = patient;

  const taskIdentifier = selectedTaskId != null && selectedTaskId;
  const unfinishedTasks =
    tasks?.flatMap(task => [task, ...task.subtasks]) || [];
  const finishedTasks =
    completedTasks?.flatMap(task => [task, ...task.subtasks]) || [];
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
