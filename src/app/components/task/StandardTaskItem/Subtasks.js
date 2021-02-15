/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { isEmpty } from 'ramda';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskComments from 'components/tasklist/TaskComments/TaskComments';
import { onDragEndSubtask } from 'components/tasklist/DragDrop.helpers';
import { Tasks as SubtasksContainer } from 'components/tasklist/TasksGroup/styled';
import TaskItem from './TaskItem';
import { getMatchedComments } from './helpers';
import { SubtaskItemWrapper } from '../styled';
import SubtasksSkeletonLoader from '../SubtasksSkeletonLoader/SubtasksSkeletonLoader';

const Subtasks = ({
  subtasks,
  isOpen,
  isFullView,
  groupId,
  parentTaskId,
  reorderSubtasksForTask,
  reassignTask,
  currentUser,
  parentHasPatient,
  taskList,
  isDraggable,
  subTasksCount,
  isFetchingSubTasks,
  shouldShowBlockModalOnDrag,
  showClearSortFiltersModal,
  ...restProps
}) => {
  const { openDrawer, storeAsCurrentTask, highlightedValue } = restProps;
  const [draggedId, setDraggableId] = useState(false);
  const [orderedSubtasks, reorderSubtasksInState] = useState(subtasks);

  useEffect(() => {
    reorderSubtasksInState(subtasks);
  }, [subtasks]);

  const onBeforeCapture = useCallback(({ draggableId }) => {
    setDraggableId(draggableId);
  }, []);

  const onDragEnd = useCallback(
    eventBundle =>
      onDragEndSubtask({
        eventBundle,
        reorderSubtasksForTask,
        groupId,
        parentTaskId,
        orderedSubtasks,
        reorderSubtasksInState,
        setDraggableId,
      }),
    [groupId, orderedSubtasks, parentTaskId, reorderSubtasksForTask],
  );

  const shouldRenderSubtasks = useMemo(() => !isEmpty(orderedSubtasks), [
    orderedSubtasks,
  ]);

  return (
    <SubtasksContainer in={isOpen}>
      {!isFetchingSubTasks ? (
        <DragDropContext
          onBeforeCapture={onBeforeCapture}
          onBeforeDragStart={showClearSortFiltersModal}
          onDragEnd={!shouldShowBlockModalOnDrag ? onDragEnd : () => {}}
        >
          <Droppable droppableId="droppable">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {shouldRenderSubtasks &&
                  orderedSubtasks?.map((subtask, index) => {
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
                    const isLast = index + 1 === orderedSubtasks.length;

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
                              currentUser={currentUser}
                              reassignTask={reassignTask}
                              parentHasPatient={parentHasPatient}
                              isDraggable={isDraggable && subtasks?.length > 1}
                              isLast={isLast}
                              showSubtaskStylingLink={!draggedId}
                              isNestedTask
                              subTasksCount={subTasksCount}
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
