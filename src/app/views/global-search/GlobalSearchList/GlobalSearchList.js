import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ArrowIcon from 'img/arrow';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import {
  Arrow,
  Tasks,
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameSection,
  ListNameContainer,
} from 'components/tasklist/DropdownListSection/styled';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';

const GlobalSearchList = ({
  list,
  currentUser,
  selectedTask,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskStatus,
  onTaskUpdate,
  updateDueDate,
  updateWorkflowStatus,
  highlightedValue,
  isCompletedList,
  getMoreTasksForTaskList,
  isLoadingMore,
}) => {
  const { listName, tasks, hasMore: hasMoreTasks } = list;
  const [isOpen, switchOpen] = useState(true);
  const {
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
  } = useSelector(state => ({
    addingNewSubtask: state.taskState.addingNewSubtask,
    addingNewSubtaskParentId: state.taskState.addingNewSubtaskParentId,
    subtaskShape: state.taskState.subtaskShape,
  }));

  const showMoreTasks = () => {
    getMoreTasksForTaskList(list.taskListIdentifier, list.tasks?.length);
  };

  const containsMultipleAssignees = useMemo(
    () =>
      tasks?.some(
        // eslint-disable-next-line no-shadow
        ({ assignedToUsers, subtasks }) =>
          (assignedToUsers && assignedToUsers.length > 1) ||
          (subtasks &&
            subtasks.length > 0 &&
            subtasks.some(
              ({ assignedToUsers: subtaskAssignedToUsers }) =>
                subtaskAssignedToUsers && subtaskAssignedToUsers.length > 1,
            )),
      ),
    [tasks],
  );

  return (
    <ListDetailsContainer>
      <ListDetailsHeader>
        <ListNameContainer
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Arrow
            alt="arrow"
            isOpen={isOpen}
            onClick={() => switchOpen(!isOpen)}
            src={ArrowIcon}
          />
          <ListNameSection>
            {listName} ({tasks?.length || 0})
          </ListNameSection>
        </ListNameContainer>
      </ListDetailsHeader>
      <Tasks timeout={150} in={isOpen}>
        {tasks?.map(task => (
          <StandardTaskItem
            key={task.taskIdentifier}
            currentUser={currentUser}
            openDrawer={openDrawer}
            storeAsCurrentTask={storeAsCurrentTask}
            task={task}
            isCompletedGroup={isCompletedList}
            toggleCompleteTask={toggleTaskStatus}
            onTaskUpdate={onTaskUpdate}
            updateDueDate={updateDueDate}
            updateWorkflowStatus={updateWorkflowStatus}
            dragAndDropDisabled
            selectedTask={selectedTask}
            isFullView
            highlightedValue={highlightedValue}
            addingNewSubtask={addingNewSubtask}
            addingNewSubtaskParentId={addingNewSubtaskParentId}
            subtaskShape={subtaskShape}
            subtasksDisabled
            multipleAssigneesContext={containsMultipleAssignees}
          />
        ))}
        {isLoadingMore && <TasksSkeletonLoader rows={4} />}
        {hasMoreTasks && (
          <LoadMoreSection>
            {!isLoadingMore && <LoadMoreButton onClick={showMoreTasks} />}
          </LoadMoreSection>
        )}
      </Tasks>
    </ListDetailsContainer>
  );
};

export default GlobalSearchList;
