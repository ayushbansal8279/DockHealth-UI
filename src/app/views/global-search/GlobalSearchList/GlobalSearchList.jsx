import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import {
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
import { TaskItemType, TaskOrigin } from 'helpers/task-helpers';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import {
  userSetupClientViewSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';

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
  const viewSetup = useSelector(userSetupClientViewSelector);

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

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
            <Spacing horizontal={2} />
            <RotatableChevron
              alt="arrow"
              rotated={!isOpen}
              onClick={() => switchOpen(!isOpen)}
              color={iconColorActiveItem?.value}
            />
            <Spacing horizontal={3} />
            <ListNameSection>
              {listName} ({tasks?.length || 0})
            </ListNameSection>
          </ListNameContainer>
        </ListDetailsHeader>
      </StickyContainer>
      <TasksHeader
        bulkEditEnabled={false}
        sort={false}
        groupHasMultipleAssignees={containsMultipleAssignees}
        isGroupSelected={false}
      />
      <Tasks timeout={150} in={isOpen}>
        {tasks?.map((task) => (
          <>
            {task?.itemType === TaskItemType.TASK ? (
              <StandardTaskItem
                pageBackground={palette.blueGrey}
                key={task.taskIdentifier}
                currentUser={currentUser}
                storeAsCurrentTask={storeAsCurrentTask}
                taskIdentifier={task.taskIdentifier}
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
                iconColorActive={iconColorActiveItem?.value}
                origin={TaskOrigin.TEMPLATE}
              />
            ) : (
              <TaskTemplateGroup
                isCompletedTab={false}
                viewSetup={viewSetup}
                templateGroup={task}
                groupHasMultipleAssignees={containsMultipleAssignees}
                isFullView
                dragAndDropDisabled
                showTasksWithGroup={false}
                iconColorActive={iconColorActiveItem?.value}
                origin={TaskOrigin.TEMPLATE}
              />
            )}
          </>
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
