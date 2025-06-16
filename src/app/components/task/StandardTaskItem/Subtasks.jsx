/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import isEmpty from 'ramda/src/isEmpty';
import * as TaskActions from 'actions/task-actions';
import { onSubtaskOrderChanged } from 'helpers/ga-event-helper';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import TaskComments from 'components/tasklist/TaskComments/TaskComments';
import { Tasks as SubtasksContainer } from 'components/tasklist/TasksGroup/styled';
// eslint-disable-next-line import/no-cycle
import TaskItem from './TaskItem';
import { getMatchedComments } from './helpers';
import { SubtaskItemWrapper } from '../styled';
import { DropDirectionContext } from '@/app/context-api/DropDirectionContext';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const Subtasks = ({
  subtasks,
  isOpen,
  isFullView,
  parentTask,
  parentHasPatient,
  isDraggable,
  subTasksCount,
  isFetchingSubTasks,
  shouldShowBlockModalOnDrag,
  showClearSortFiltersModal,
  origin,
  isWorkflowSubtask,
  isSubtaskOfTask,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const { openDrawer, storeAsCurrentTask, highlightedValue } = restProps;
  const [draggedId, setDraggableId] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const dropDirectionRef = useRef(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const onBeforeCapture = useCallback(({ draggableId }) => {
    setDraggableId(draggableId);
  }, []);

  const handleDragStart = (event) => {
    setDraggableId(event?.active?.id);
    setActiveId(event?.active?.id);
  };

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      const sourceIndex = subtasks?.findIndex(
        (subtask) => subtask?.taskIdentifier === active?.id,
      );
      const destinationIndex = subtasks?.findIndex(
        (subtask) => subtask?.taskIdentifier === over?.id,
      );

      setDraggableId(null);
      setActiveId(null);

      if (over) {
        onSubtaskOrderChanged();
        dispatch(
          TaskActions.reorderSubtasks({
            source: { ...active, index: sourceIndex },
            destination: {
              ...over,
              index:
                dropDirectionRef?.current === 'top'
                  ? 0
                  : sourceIndex <= destinationIndex
                  ? destinationIndex
                  : destinationIndex + 1,
            },
            parentTask,
          }),
        );
      }
    },
    [dispatch, subtasks, parentTask],
  );

  const shouldRenderSubtasks = useMemo(() => !isEmpty(subtasks), [subtasks]);

  const onClickComment = useCallback(
    (subtask) => {
      openDrawer();
      storeAsCurrentTask(subtask);
    },
    [openDrawer, storeAsCurrentTask],
  );

  return (
    <SubtasksContainer in={isOpen}>
      {isFetchingSubTasks ? (
        <Box pl={2}>
          <TasksSkeletonLoader rows={subTasksCount} />
        </Box>
      ) : (
        <>
          <DropDirectionContext.Provider value={dropDirectionRef}>
            <DndContext
              onDragStart={handleDragStart}
              onDragEnd={shouldShowBlockModalOnDrag ? () => {} : onDragEnd}
              sensors={sensors}
            >
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
                    <SubtaskItemWrapper key={subtask.taskIdentifier}>
                      <TaskItem
                        key={subtask.taskIdentifier}
                        taskItemIdentifier={subtask.taskIdentifier}
                        parentHasPatient={parentHasPatient}
                        isDraggable={isDraggable && subtasks?.length > 1}
                        isLast={isLast}
                        showSubtaskStylingLink={!draggedId}
                        isNestedTask
                        {...restProps}
                        patient={parentTask.patient}
                        origin={origin}
                        isWorkflowSubtask={isWorkflowSubtask}
                        isFirstSubtaskOfWorkflowTask={
                          isWorkflowSubtask && index === 0
                        }
                        isFirstSubTaskOfParentTask={
                          isSubtaskOfTask && index === 0
                        }
                        isSubtaskOfTask={isSubtaskOfTask}
                      />
                      {shouldRenderComments &&
                        (subtasks?.length > 0 || subTasksCount === 0) && (
                          <TaskComments
                            isOpen={isFullView}
                            comments={matchedComments}
                            highlightedValue={highlightedValue}
                            showSubtaskStylingLink={!draggedId}
                            isLast={isLast}
                            subtask={subtask}
                            onClickComment={onClickComment}
                          />
                        )}
                    </SubtaskItemWrapper>
                  );
                })}
              <DragOverlay>
                {activeId ? (
                  <Placeholder taskIdentifier={activeId} origin={origin} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </DropDirectionContext.Provider>
        </>
      )}
    </SubtasksContainer>
  );
};

const Placeholder = ({ taskIdentifier, origin }) => {
  return (
    // @ts-ignore
    <TaskItem
      taskItemIdentifier={taskIdentifier}
      isDragPreview
      origin={origin}
    />
  );
};

export default React.memo(Subtasks);
