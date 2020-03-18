import { pick } from 'ramda';
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
  const {
    subtasks,
    priority,
    taskList,
    isNewSubtask,
    parentTaskIdentifier,
  } = task;

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

  const hasSubtasks = subtasks?.length > 0 && !parentTaskIdentifier;

  const isSelfOrSubtaskActive =
    selectedTaskId === task.taskIdentifier ||
    Boolean(
      !isSubtask &&
        subtasks.find(
          ({ taskIdentifier }) => taskIdentifier === selectedTaskId,
        ),
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
        subtasks.find(
          ({ taskIdentifier }) => taskIdentifier === selectedTaskId,
        ) &&
        !isSelfOrSubtaskActive
      ) {
        storeAsCurrentTask(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slimView],
  );

  const renderedSubtasks =
    addingNewSubtask && addingNewSubtaskParentId === task?.taskIdentifier
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
    parentTaskIdentifier,
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
