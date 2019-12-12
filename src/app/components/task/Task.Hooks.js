import { Sortable } from '@shopify/draggable';
import insert from 'ramda/es/insert';
import pick from 'ramda/es/pick';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { sortSubtasks } from '../../actions/task-actions';
import { onSubtaskOrderChanged } from '../../helpers/ga-event-helper';
import useConfirmation from '../../hooks/useConfirmation';

export default ({ props, DRAGGABLE_ITEM_CLASS }) => {
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
  const sortableContainer = useRef(null);
  const [sortable, setSortable] = useState(null);
  const dispatch = useDispatch();

  const hasSubtasks = subtasks?.length > 0 && !parentTaskId;

  const onSortableStop = event => {
    const movedSubtask = subtasks[event.data.oldIndex];
    const otherSubtasks = subtasks.filter(
      ({ taskId }) => taskId !== movedSubtask?.taskId,
    );

    onSubtaskOrderChanged();

    const newSubtasks = insert(
      event.data.newIndex,
      movedSubtask,
      otherSubtasks,
    );
    sortSubtasks({ task, subtasks: newSubtasks }, dispatch);
  };

  useEffect(() => {
    if (hasSubtasks) {
      const newSortable = new Sortable(sortableContainer.current, {
        draggable: `.${DRAGGABLE_ITEM_CLASS}`,
      });

      // eslint-disable-next-line no-unused-expressions
      sortable?.off('sortable:stop', onSortableStop);

      setSortable(newSortable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubtasks]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    sortable?.on('sortable:stop', onSortableStop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortable]);

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
    sortableContainer,
    sortable,
    setSortable,
    dispatch,
    hasSubtasks,
    onSortableStop,
    renderedSubtasks,
    isOpen,
    close,
    handleStatusChange,
    confirm,
    isSelfOrSubtaskActive,
  };
};
