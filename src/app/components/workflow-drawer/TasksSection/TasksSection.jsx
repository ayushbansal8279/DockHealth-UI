import React, { useCallback } from 'react';
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
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import DraggableTaskItem from '../../task-drawer/DraggableTaskItem/DraggableTaskItem';
import { SortableContext } from '@dnd-kit/sortable';

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

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      const activeIndex = active?.data?.current?.sortable?.index;
      const overIndex = over?.data?.current?.sortable?.index;
      if (!over || activeIndex === overIndex) return;

      if (over) {
        const source = { index: activeIndex };
        const destination = { index: overIndex };
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
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={(tasks ?? [])?.map((task) => task.identifier)}
          >
            {(tasks ?? [])?.map((task, index) => (
              <DraggableTaskItem
                key={task.identifier}
                task={task}
                currentUser={currentUser}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </DrawerSection>
  );
};

export default TasksSection;
