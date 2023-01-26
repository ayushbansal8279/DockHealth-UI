import React, { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';
import * as TaskActions from 'actions/task-actions';
import { useSelector, useDispatch } from 'react-redux';
import { onSubtaskOrderChanged } from 'helpers/ga-event-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import DrawerTask from 'components/drawer-common/DrawerTask/DrawerTask';
import DrawerTaskLoader from 'components/drawer-common/DrawerTaskLoader/DrawerTaskLoader';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { Container, Title } from './styled';
import QuickAddSubtask from '../QuickAddSubtask/QuickAddSubtask';

const { READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const SubtasksSection = ({ restrictions: isReadOnly }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const selectedTask = useSelector(selectedTaskSelector) || {};
  const tasks = selectedTask.subtasks;
  const tasksCount = selectedTask.subTasksCount;
  const readOnly = isReadOnly === READ_ONLY;

  const handleDragEnd = useCallback(
    ({ destination, source }) => {
      onSubtaskOrderChanged();

      if (destination) {
        dispatch(
          TaskActions.reorderSubtasks({
            source,
            destination,
            parentTask: selectedTask,
          }),
        );
      }
    },
    [dispatch, selectedTask],
  );

  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

  const renderDraggableItem = ({
    task,
    draggableInnerReference,
    draggableProps,
    dragHandleProps,
  }) => (
    <div ref={draggableInnerReference} {...draggableProps}>
      <DrawerTask
        key={task.taskIdentifier}
        task={task}
        currentUser={currentUser}
        dragHandleProps={dragHandleProps}
      />
    </div>
  );

  return (
    <Container>
      <Title>Subtasks</Title>
      {tasksCount > 0 && (!tasks || tasks.length === 0) ? (
        <DrawerTaskLoader rows={tasksCount || 4} />
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={selectedTask.identifier}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks?.map((task, index) => (
                    <Draggable
                      key={task.identifier}
                      draggableId={String(task.identifier)}
                      index={index}
                      isDragDisabled={restrictions?.createTask === DISABLED}
                    >
                      {(
                        {
                          innerRef: draggableInnerReference,
                          draggableProps,
                          dragHandleProps,
                        },
                        { isDragging },
                      ) =>
                        isDragging
                          ? ReactDOM.createPortal(
                              renderDraggableItem({
                                task,
                                draggableInnerReference,
                                draggableProps,
                                dragHandleProps,
                              }),
                              document.querySelector('body'),
                            )
                          : renderDraggableItem({
                              task,
                              draggableInnerReference,
                              draggableProps,
                              dragHandleProps,
                            })
                      }
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
      {!readOnly && <QuickAddSubtask />}
    </Container>
  );
};

export default SubtasksSection;
