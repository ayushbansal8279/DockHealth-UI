import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import * as WorkflowActions from 'actions/workflow-actions';
import {
  workflowSelector,
  isFetchingWorkflowDetailsSelector,
} from 'selectors/workflow-drawer-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import DrawerSection from 'components/drawer-common/DrawerSection/DrawerSection';
import DrawerTaskLoader from 'components/drawer-common/DrawerTaskLoader/DrawerTaskLoader';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import DraggableTaskItem from '../../task-drawer/DraggableTaskItem/DraggableTaskItem';

const TasksSection = () => {
  const dispatch = useDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor),
  );
  const workflow = useSelector(workflowSelector);
  const { tasks } = workflow || {};
  const isFetching = useSelector(isFetchingWorkflowDetailsSelector);
  const currentUser = useSelector(userProfileSelector);
  const [activeTask, setActiveTask] = useState(null);
  const dropDirectionRef = useRef(null);

  const handleDragStart = (event) => {
    setActiveTask(event?.active?.data?.current?.task);
  };

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveTask(null);
      const activeIndex = active?.data?.current?.index;
      const overIndex = over?.data?.current?.index;
      if (!over || activeIndex === overIndex) return;

      if (over) {
        const source = { index: activeIndex };
        const destination = {
          index:
            dropDirectionRef?.current === 'top'
              ? 0
              : activeIndex <= overIndex
              ? overIndex
              : overIndex + 1,
        };
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

  return (
    <DrawerSection title="Tasks">
      {!tasks && isFetching ? (
        <>
          <DrawerTaskLoader />
          <DrawerTaskLoader />
          <DrawerTaskLoader />
        </>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {(tasks ?? [])?.map((task, index) => (
            <DraggableTaskItem
              key={task.identifier}
              task={task}
              currentUser={currentUser}
              index={index}
              dropDirectionRef={dropDirectionRef}
            />
          ))}
          <DragOverlay>
            {activeTask ? <Placeholder task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </DrawerSection>
  );
};

const Placeholder = ({ task }) => {
  return (
    // @ts-ignore
    <DraggableTaskItem key={task.identifier} task={task} isDragPreview />
  );
};

export default TasksSection;
