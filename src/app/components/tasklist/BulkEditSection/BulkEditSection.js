import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  createContext,
} from 'react';
import BulkEditOptionsBar from './BulkEditOptionsBar/BulkEditOptionsBar';

export const BulkEditContext = createContext({});

const BulkEditSection = ({ children, shouldResetBulkEditTasks }) => {
  const [bulkEditTasks, setBulkEditTasks] = useState([]);

  const onSelectBulkEditTask = useCallback(
    taskIdentifier => setBulkEditTasks([...bulkEditTasks, taskIdentifier]),
    [bulkEditTasks],
  );

  const onUnselectBulkEditTask = useCallback(
    taskIdentifier =>
      setBulkEditTasks(
        bulkEditTasks?.filter(
          bulkTaskIdentifier => bulkTaskIdentifier !== taskIdentifier,
        ),
      ),
    [bulkEditTasks],
  );

  const getTaskIsSelectedInBulkEdit = useCallback(
    taskIdentifier => bulkEditTasks?.includes(taskIdentifier),
    [bulkEditTasks],
  );

  const onClickBulkEditTask = useCallback(
    taskIdentifier =>
      getTaskIsSelectedInBulkEdit(taskIdentifier)
        ? onUnselectBulkEditTask(taskIdentifier)
        : onSelectBulkEditTask(taskIdentifier),
    [getTaskIsSelectedInBulkEdit, onUnselectBulkEditTask, onSelectBulkEditTask],
  );

  const onClearBulkEditTask = useCallback(() => setBulkEditTasks([]), []);

  const bulkEditTaskActions = useMemo(
    () => ({
      getTaskIsSelectedInBulkEdit,
      onClickBulkEditTask,
      onUnselectBulkEditTask,
    }),
    [getTaskIsSelectedInBulkEdit, onClickBulkEditTask, onUnselectBulkEditTask],
  );

  useEffect(() => {
    if (shouldResetBulkEditTasks && bulkEditTasks.length !== 0) {
      onClearBulkEditTask();
    }
  }, [shouldResetBulkEditTasks, bulkEditTasks, onClearBulkEditTask]);

  return (
    <BulkEditContext.Provider value={bulkEditTaskActions}>
      {React.cloneElement(children, { bulkEditTaskActions })}
      <BulkEditOptionsBar
        selectedTasks={bulkEditTasks}
        onClose={onClearBulkEditTask}
      />
    </BulkEditContext.Provider>
  );
};

export default BulkEditSection;
