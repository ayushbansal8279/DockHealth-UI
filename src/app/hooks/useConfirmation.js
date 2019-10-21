import { useCallback } from 'react';

import useBoolean from './useBoolean';

const useConfirmation = (task, markComplete) => {
  const { status, subtasks } = task;

  const [isOpen, open, close] = useBoolean(false);
  const confirm = useCallback(
    () => {
      const updatedStatus = status === 'COMPLETE' ? 'COMPLETE' : 'INCOMPLETE';
      markComplete(task, updatedStatus);
      close();
    },
    [status, markComplete, task, close],
  );

  const handleStatusChange = () => {
    const hasSubtasks = subtasks?.length > 0;
    if (
      status === 'COMPLETE' ||
      !hasSubtasks ||
      subtasks.every(subtask => subtask.status === 'COMPLETE')
    ) {
      confirm();
      return;
    }
    open();
  };

  return {
    handleStatusChange,
    isOpen,
    close,
    confirm,
  };
};

export default useConfirmation;
