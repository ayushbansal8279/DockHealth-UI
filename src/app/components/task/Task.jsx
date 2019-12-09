import { Sortable } from '@shopify/draggable';
import insert from 'ramda/es/insert';
import pick from 'ramda/es/pick';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { sortSubtasks } from '../../actions/task-actions';
import { onSubtaskOrderChanged } from '../../helpers/ga-event-helper';
import useConfirmation from '../../hooks/useConfirmation';
import Flag from '../common/Flag';
import AddSubtask from './AddSubtask';
import ConfirmationDialog from './ConfirmationDialog';
import {
  TaskAnimationContainer,
  TaskContainer,
  TaskSelectionContainer,
} from './Task.styled';
import TaskBody from './TaskBody';

const DRAGGABLE_ITEM_CLASS = 'draggable-item';

const Task = props => {
  const {
    task,
    isSubtask,
    markComplete,
    selectedTaskId,
    storeAsCurrentTask,
    slimView,
    taskDrawerOpen,
  } = props;
  const { subtasks, priority, taskList, isNewSubtask } = task;

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

  const hasSubtasks = subtasks?.length > 0;

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

  return (
    <>
      <TaskAnimationContainer
        isNewSubtask={isNewSubtask}
        isSubtask={isSubtask}
        drawerOpen={taskDrawerOpen}
        ref={animationContainer}
        className={DRAGGABLE_ITEM_CLASS}
      >
        <TaskContainer isSubtask={isSubtask} hasSubtasks={hasSubtasks}>
          {!isSubtask && (
            <ConfirmationDialog
              isOpen={isOpen}
              close={close}
              confirm={confirm}
            />
          )}
          <TaskSelectionContainer isSelected={selectedTaskId === task.taskId}>
            <Flag priority={priority} />
            <TaskBody {...props} handleStatusChange={handleStatusChange} />
          </TaskSelectionContainer>
        </TaskContainer>
      </TaskAnimationContainer>
      <div ref={sortableContainer}>
        {(!slimView || (slimView && isSelfOrSubtaskActive)) &&
          renderedSubtasks.map((subtask, index) => (
            <Task
              key={subtask.taskId}
              {...props}
              task={{
                ...subtask,
                taskList,
              }}
              isSubtask
              isParentComplete={task.status === 'COMPLETE'}
              subtaskIndex={index + 1}
              isNewSubtask={subtask.isNewSubtask}
            />
          ))}
      </div>
      {!isSubtask && isSelfOrSubtaskActive && task.status !== 'COMPLETE' && (
        <AddSubtask padded taskId={task.taskId} />
      )}
    </>
  );
};

export default Task;
