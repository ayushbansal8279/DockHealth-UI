import React, { useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { TaskItemType } from 'helpers/task-helpers';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import * as TaskActions from 'actions/task-actions';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { pluck } from 'ramda';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';

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
  const viewSetup = {
    SHOW_WORKFLOW_DETAILS: false,
    HOW_WORKFLOW_COMPLETED_TASKS: false,
  };
  const dispatch = useDispatch();

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const showMoreTasks = () => {
    getMoreTasksForTaskList(list.taskListIdentifier, list.tasks?.length);
  };

  const isGroupSelected = useMemo(() => checkIfAllTasksSelected(tasks), [
    tasks,
  ]);

  const handleGroupSelect = useCallback(() => {
    const { parentTasks, subtasks } = extractTasksAndSubtasks(tasks);
    const allTasks = [...parentTasks, ...subtasks];
    dispatch(
      TaskActions.changeTasksSelectedState(
        !isGroupSelected,
        pluck('identifier', allTasks),
      ),
    );
  }, [dispatch, isGroupSelected, tasks]);

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
    <BulkEditSection
      allTasks={tasks}
      // refreshTasks={handleRefreshForBulkEdit}
      searchValue={highlightedValue}
      disabled={false}
    >
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
          bulkEditEnabled
          sort={false}
          onGroupSelect={handleGroupSelect}
          groupHasMultipleAssignees={containsMultipleAssignees}
          isGroupSelected={false}
        />
        <Tasks timeout={150} in={isOpen}>
          {tasks?.map(task => (
            <>
              {task?.itemType === TaskItemType.TASK ? (
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
                  addingNewSubtask={
                    addingNewSubtaskParentId === task.identifier
                  }
                  subtasksDisabled
                  multipleAssigneesContext={containsMultipleAssignees}
                  iconColorActive={iconColorActiveItem?.value}
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
    </BulkEditSection>
  );
};

export default GlobalSearchList;
