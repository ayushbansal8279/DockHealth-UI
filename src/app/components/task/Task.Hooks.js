import pick from 'ramda/es/pick';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConfirmation from '../../hooks/useConfirmation';

export default ({ props }) => {
  const {
    task,
    isSubtask,
    markComplete,
    selectedTaskId,
    storeAsCurrentTask,
    slimView,
    subtaskIndex,
    taskDrawerOpen,
  } = props;
  const { subtasks, priority, taskList, isNewSubtask, parentTaskId } = task;

  const {
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
  } = useSelector(state =>
    pick(['addingNewSubtask', 'addingNewSubtaskParentId', 'subtaskShape'])(
      state.taskState,
    ),
  );
  const animationContainer = useRef(null);
  const dispatch = useDispatch();

  const hasSubtasks = subtasks?.length > 0 && !parentTaskId;

  const isSelfOrSubtaskActive =
    selectedTaskId === task.taskId ||
    Boolean(
      !isSubtask && subtasks.find(({ taskId }) => taskId === selectedTaskId),
    );

  useEffect(() => {
    if (isNewSubtask) {
      animationContainer.current.style.height =
        animationContainer.current.scrollHeight;
    }
  }, [isNewSubtask]);

  useEffect(
    () => {
      if (
        slimView &&
        subtasks.find(({ taskId }) => taskId === selectedTaskId) &&
        !isSelfOrSubtaskActive
      ) {
        storeAsCurrentTask(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slimView],
  );

  const renderedSubtasks =
    addingNewSubtask && addingNewSubtaskParentId === task?.taskId
      ? [...subtasks, subtaskShape]
      : subtasks;

  // Check all subtasks confirmation dialog
  const { isOpen, close, handleStatusChange, confirm } = useConfirmation(
    task,
    markComplete,
  );

  return {
    task,
    isSubtask,
    markComplete,
    selectedTaskId,
    storeAsCurrentTask,
    slimView,
    subtaskIndex,
    taskDrawerOpen,
    subtasks,
    priority,
    taskList,
    isNewSubtask,
    parentTaskId,
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
    animationContainer,
    dispatch,
    hasSubtasks,
    renderedSubtasks,
    isOpen,
    close,
    handleStatusChange,
    confirm,
    isSelfOrSubtaskActive,
  };
};
