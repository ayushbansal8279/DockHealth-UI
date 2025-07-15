import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as TaskActions from 'actions/task-actions';
import { useSelector, useDispatch } from 'react-redux';
import { onSubtaskOrderChanged } from 'helpers/ga-event-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import DrawerTaskLoader from 'components/drawer-common/DrawerTaskLoader/DrawerTaskLoader';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { Container, Title } from './styled';
import QuickAddSubtask from '../QuickAddSubtask/QuickAddSubtask';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import DraggableTaskItem from '../DraggableTaskItem/DraggableTaskItem';

const { READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const SubtasksSection = ({
  selectedTask,
  restrictions: isReadOnly,
  taskRestrictions,
  taskListRestrictions,
}) => {
  const dispatch = useDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor),
  );

  const currentUser = useSelector(userProfileSelector);
  const subtasks = selectedTask?.subtasks;
  const tasksCount = selectedTask.subTasksCount;
  const readOnly = isReadOnly === READ_ONLY;

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      const activeIndex = active?.data?.current?.sortable?.index;
      const overIndex = over?.data?.current?.sortable?.index;
      if (!over || activeIndex === overIndex) return;

      onSubtaskOrderChanged();

      if (over) {
        const source = { index: activeIndex };
        const destination = { index: overIndex };
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

  return (
    <Container>
      <Title>Subtasks</Title>
      {tasksCount > 0 && subtasks.length === 0 ? (
        <DrawerTaskLoader rows={tasksCount || 4} />
      ) : (
        <>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={(subtasks ?? [])?.map((subtask) => subtask?.identifier)}
            >
              {(subtasks ?? [])?.map((task, index) => (
                <DraggableTaskItem
                  key={task?.taskIdentifier}
                  task={task}
                  taskRestrictions={taskRestrictions}
                  taskListRestrictions={taskListRestrictions}
                  currentUser={currentUser}
                  isDragDisabled={restrictions?.createTask === DISABLED}
                />
              ))}
            </SortableContext>
          </DndContext>
        </>
      )}
      {!readOnly && <QuickAddSubtask />}
    </Container>
  );
};

export default SubtasksSection;
