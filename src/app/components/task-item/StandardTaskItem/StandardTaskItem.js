/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';
import { isEmpty } from 'ramda';
import TaskComments from 'components/tasklist/TaskComments/TaskComments';
import SubtasksSkeletonLoader from '../SubtasksSkeletonLoader/SubtasksSkeletonLoader';
import TaskItem from './TaskItem';
import Subtasks from './Subtasks';
import { getMatchedComments } from './helpers';

const Task = ({
  task,
  isFullView,
  isStartedDnD,
  isDragging,
  draggableProvided,
  groupId,
  currentUser,
  reassignTask,
  isDraggable,
  addingNewSubtask,
  addingNewSubtaskParentId,
  subtaskShape,
  hideSubtasks,
  areFiltersApplied,
  isSearchApplied,
  ...restProps
}) => {
  const [isOpen, switchOpen] = useState(false);
  const {
    comments,
    subtasks,
    patient,
    searchMetaData = {},
    subTasksCount,
  } = task;
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const { highlightedValue } = restProps;
  const { matchingCommentIdentifiers = [] } = searchMetaData;

  const renderedSubtasks =
    addingNewSubtask && addingNewSubtaskParentId === task?.taskIdentifier
      ? [...subtasks, subtaskShape]
      : subtasks;

  const dispatch = useDispatch();

  useEffect(() => {
    const hasNewSubtask = renderedSubtasks.some(
      ({ taskIdentifier }) => !taskIdentifier,
    );
    if (hasNewSubtask) {
      switchOpen(true);
    }
    if (
      (areFiltersApplied || isSearchApplied) &&
      renderedSubtasks?.length > 0
    ) {
      switchOpen(true);
    }
  }, [renderedSubtasks, areFiltersApplied, isSearchApplied]);

  useEffect(() => {
    if (!isFullView) {
      switchOpen(false);
    }
  }, [isFullView]);

  const matchingComments = useMemo(
    () => getMatchedComments(comments, matchingCommentIdentifiers),
    [comments, matchingCommentIdentifiers],
  );

  const showComments = useMemo(
    () => !isEmpty(matchingComments) && !isStartedDnD,
    [matchingComments, isStartedDnD],
  );

  const showSubtasks = useMemo(
    () =>
      (subTasksCount > 0 || !isEmpty(renderedSubtasks)) &&
      !isStartedDnD &&
      (!hideSubtasks ||
        ((areFiltersApplied || isSearchApplied) &&
          renderedSubtasks?.length > 0)),
    [
      subTasksCount,
      renderedSubtasks,
      isStartedDnD,
      hideSubtasks,
      areFiltersApplied,
      isSearchApplied,
    ],
  );

  const onClickComment = useCallback(() => {
    dispatch(openDrawer());
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...draggableProps}>
      <div ref={innerRef}>
        <TaskItem
          task={task}
          isOpen={isOpen}
          switchOpen={switchOpen}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
          currentUser={currentUser}
          reassignTask={reassignTask}
          subtasks={renderedSubtasks}
          subTasksCount={subTasksCount}
          isDraggable={isDraggable}
          hideSubtasks={hideSubtasks}
          {...restProps}
        />
      </div>
      {showComments && (
        <TaskComments
          isOpen={isFullView}
          comments={comments}
          highlightedValue={highlightedValue}
          onClickComment={onClickComment}
        />
      )}
      {task?.isFetchingSubTasks &&
        subTasksCount > 0 &&
        isEmpty(renderedSubtasks) && <SubtasksSkeletonLoader rows={4} />}
      {showSubtasks && (
        <Subtasks
          subtasks={renderedSubtasks}
          subTasksCount={subTasksCount}
          isOpen={isOpen}
          isFullView={isFullView}
          groupId={groupId}
          parentTaskId={task.taskIdentifier}
          currentUser={currentUser}
          reassignTask={reassignTask}
          parentHasPatient={!!patient}
          taskList={task?.taskList}
          isDraggable={isDraggable}
          {...restProps}
        />
      )}
    </div>
  );
};

export default React.memo(Task);
