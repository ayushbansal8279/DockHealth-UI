import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';
import * as WorkflowActions from 'actions/workflow-actions';
import {
  workflowSelector,
  isFetchingWorkflowDetailsSelector,
} from 'selectors/workflow-drawer-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import DrawerSection from 'components/drawer-common/DrawerSection/DrawerSection';
import DrawerTaskLoader from 'components/drawer-common/DrawerTaskLoader/DrawerTaskLoader';
import DrawerTask from 'components/drawer-common/DrawerTask/DrawerTask';

const TasksSection = () => {
  const dispatch = useDispatch();
  const workflow = useSelector(workflowSelector);
  const { tasks } = workflow || {};
  const isFetching = useSelector(isFetchingWorkflowDetailsSelector);
  const currentUser = useSelector(userProfileSelector);

  const handleDragEnd = useCallback(
    ({ destination, source }) => {
      if (destination) {
        dispatch(
          WorkflowActions.reorderWorkflowTasks({
            destination,
            source,
            workflow,
            completedTasksShown: true,
            incompleteTasksShown: true,
          }),
        );
      }
    },
    [dispatch, workflow],
  );

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
    <DrawerSection title="Tasks">
      {!tasks && isFetching ? (
        <>
          <DrawerTaskLoader />
          <DrawerTaskLoader />
          <DrawerTaskLoader />
        </>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={workflow?.identifier}>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks?.map((task, index) => (
                  <Draggable
                    key={task.identifier}
                    draggableId={String(task.identifier)}
                    index={index}
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
      )}
    </DrawerSection>
  );
};

export default TasksSection;
