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
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';
import palette from 'styles/palette';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';

const GlobalSearchList = ({
  list,
  currentUser,
  selectedTask,
  storeAsCurrentTask,
  toggleTaskStatus,
  onTaskUpdate,
  updateWorkflowStatus,
  highlightedValue,
  isCompletedList,
  getMoreTasksForTaskList,
  isLoadingMore,
}) => {
  const { listName, tasks, hasMore: hasMoreTasks } = list;
  const [isOpen, switchOpen] = useState(true);
  const addingNewSubtaskParentId = useSelector(
    addingNewSubtaskParentIdSelector,
  );

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
      <StickyContainer left={24} decreaseWidth={2 * 24}>
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
      </StickyContainer>
      <Tasks timeout={150} in={isOpen}>
        {tasks?.map(task => (
          <StandardTaskItem
            pageBackground={palette.blueGrey}
            key={task.taskIdentifier}
            currentUser={currentUser}
            storeAsCurrentTask={storeAsCurrentTask}
            task={task}
            isCompletedGroup={isCompletedList}
            toggleCompleteTask={toggleTaskStatus}
            onTaskUpdate={onTaskUpdate}
            updateWorkflowStatus={updateWorkflowStatus}
            dragAndDropDisabled
            selectedTask={selectedTask}
            isFullView
            highlightedValue={highlightedValue}
            addingNewSubtask={addingNewSubtaskParentId === task.identifier}
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
