/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'ramda';
import * as TaskActions from 'actions/task-actions';
import { onSubtaskOrderChanged } from 'helpers/ga-event-helper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskComments from 'components/tasklist/TaskComments/TaskComments';
import { Tasks as SubtasksContainer } from 'components/tasklist/TasksGroup/styled';
import TaskItem from './TaskItem';
import { getMatchedComments } from './helpers';
import { SubtaskItemWrapper } from '../styled';
import SubtasksSkeletonLoader from '../SubtasksSkeletonLoader/SubtasksSkeletonLoader';

const Subtasks = ({
  subtasks,
  isOpen,
  isFullView,
  parentTask,
  parentHasPatient,
  taskList,
  isDraggable,
  subTasksCount,
  isFetchingSubTasks,
  shouldShowBlockModalOnDrag,
  showClearSortFiltersModal,
  selectedTaskIdentifier,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const { openDrawer, storeAsCurrentTask, highlightedValue } = restProps;
  const [draggedId, setDraggableId] = useState(false);

  const onBeforeCapture = useCallback(({ draggableId }) => {
    setDraggableId(draggableId);
  }, []);

  const onDragEnd = useCallback(
    ({ destination, source }) => {
      onSubtaskOrderChanged();
      setDraggableId(null);

      if (destination) {
        dispatch(
          TaskActions.reorderSubtasks({
            source,
            destination,
            parentTask,
          }),
        );
      }
    },
    [dispatch, parentTask],
  );

  const shouldRenderSubtasks = useMemo(() => !isEmpty(subtasks), [subtasks]);

  return (
    <SubtasksContainer in={isOpen}>
      {!isFetchingSubTasks ? (
        <DragDropContext
          onBeforeCapture={onBeforeCapture}
          onBeforeDragStart={showClearSortFiltersModal}
          onDragEnd={!shouldShowBlockModalOnDrag ? onDragEnd : () => {}}
        >
          <Droppable droppableId={parentTask.taskIdentifier}>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {shouldRenderSubtasks &&
                  subtasks?.map((subtask, index) => {
                    const {
                      comments = [],
                      searchMetaData = {},
                      taskIdentifier,
                      description,
                    } = subtask;
                    const { matchingCommentIdentifiers } = searchMetaData;
                    const matchedComments = getMatchedComments(
                      comments,
                      matchingCommentIdentifiers,
                    );
                    const shouldRenderComments =
                      draggedId !== String(taskIdentifier) &&
                      !isEmpty(matchedComments) &&
                      description !== '';
                    const isLast = index + 1 === subtasks.length;

                    return (
                      <Draggable
                        key={subtask.taskIdentifier}
                        draggableId={String(subtask.taskIdentifier)}
                        index={index}
                        isDragDisabled={!isDraggable}
                      >
                        {(
                          { innerRef, draggableProps, dragHandleProps },
                          { isDragging: isDraggingSubtask },
                        ) => (
                          <SubtaskItemWrapper
                            ref={innerRef}
                            {...draggableProps}
                          >
                            <TaskItem
                              dragHandleProps={dragHandleProps}
                              key={subtask.taskIdentifier}
                              task={{ ...subtask, taskList }}
                              isDragging={isDraggingSubtask}
                              parentHasPatient={parentHasPatient}
                              isDraggable={isDraggable && subtasks?.length > 1}
                              isLast={isLast}
                              showSubtaskStylingLink={!draggedId}
                              isNestedTask
                              subTasksCount={subTasksCount}
                              isSelected={
                                selectedTaskIdentifier ===
                                subtask?.taskIdentifier
                              }
                              {...restProps}
                            />
                            {shouldRenderComments &&
                              (subtasks?.length > 0 || subTasksCount === 0) && (
                                <TaskComments
                                  isOpen={isFullView}
                                  comments={matchedComments}
                                  highlightedValue={highlightedValue}
                                  showSubtaskStylingLink={!draggedId}
                                  isLast={isLast}
                                  onClickComment={() => {
                                    openDrawer();
                                    storeAsCurrentTask(subtask);
                                  }}
                                />
                              )}
                          </SubtaskItemWrapper>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <SubtasksSkeletonLoader rows={subTasksCount} />
      )}
    </SubtasksContainer>
  );
};

export default React.memo(Subtasks);
