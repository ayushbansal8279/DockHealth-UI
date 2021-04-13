/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';
import { isNil } from 'ramda';
import ArrowIcon from 'img/arrow';

import {
  onSlimViewChanged,
  onTaskGroupCollapsed,
  onTaskGroupExpanded,
} from 'helpers/ga-event-helper';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import listSectionSavedState from 'helpers/list-secition-saved-state';
import { checkIfTasksHaveSubtasksOrCommnets } from 'helpers/tasklist-helpers';
import { Arrow } from 'components/tasklist/DropdownListSection/styled';

import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import Checkbox from 'components/common/Checkbox/Checkbox';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import DragAndDropGroupList from 'components/tasklist/DragAndDropGroupList/DragAndDropGroupList';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import ViewTypeSwitch, {
  ViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import TasksGroupHeaderActionButtons from './TasksGroupHeaderActionButtons';
import {
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  GroupNameSectionWrapper,
  TasksGroupLabelName,
  TasksGroupLabelCounter,
  BulkContainer,
  TaskGroupOptionsHeader,
} from './styled';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupName,
  groupTaskCounts,
  toggleCompleteTask,
  editGroupName,
  quickAddTask,
  deleteGroup,
  moveGroupUp,
  moveGroupDown,
  onTaskUpdate,
  tasks,
  isLoadingGroup,
  isCompletedGroup,
  draggedId,
  groupPagination,
  showMoreTasks,
  hasMoreTasks,
  isFetchingMoreTasks,
  updateDueDate,
  updateWorkflowStatus,
  dragAndDropDisabled,
  listNameVisible,
  changingGroupOrderDisabled,
  areFiltersApplied,
  isSearchApplied,
  selectedTask,
  taskGroupIdentifier,
  listUniqueKey,
  taskListIdentifier,
  sort,
  onSortChange,
  onTaskGroupViewModeChange,
  shouldShowBlockModalOnDrag,
  showClearSortFiltersModal,
  taskItemConfig,
  disableBulkEdit = false,
}) => {
  const [
    highlightedTasksParentIdenditifer,
    setHighlightedTasksParentIdenditifer,
  ] = useState(null);
  const groupSessionStorageKey =
    taskGroupIdentifier || `${listUniqueKey}-default`;

  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState({
    sessionStorageKey: groupSessionStorageKey,
  });
  const highlightTimeoutReference = useRef(null);
  const quickAddTaskInputReference = useRef(null);

  const areViewOptionsVisible = useMemo(() => {
    if (!isOpen) return false;
    return checkIfTasksHaveSubtasksOrCommnets(tasks);
  }, [isOpen, tasks]);

  const isFullView =
    viewType === ViewType.FULL_VIEW || areFiltersApplied || isSearchApplied;

  const onSwitchOpen = useCallback(() => {
    if (isOpen) {
      onTaskGroupCollapsed();
    } else {
      onTaskGroupExpanded();
    }
    switchOpen(!isOpen);
  }, [switchOpen, isOpen]);

  const isListFlattened =
    isSearchApplied ||
    areFiltersApplied ||
    (!!sort?.key && !['PATIENT', 'SUBTASK_COUNT'].includes(sort.key));

  const onGroupNameSectionClick = useCallback(
    newGroupName => editGroupName(newGroupName, taskGroupIdentifier),
    [editGroupName, taskGroupIdentifier],
  );

  const onDeleteGroup = useCallback(() => deleteGroup(taskGroupIdentifier), [
    deleteGroup,
    taskGroupIdentifier,
  ]);

  useEffect(() => {
    // default close if lazy loaded and open if tasks
    if (groupTaskCounts > 0 && tasks?.length === 0) {
      switchOpen(false);
    }
    if (groupTaskCounts > 0 && tasks?.length > 0) {
      switchOpen(true);
    }
  }, [groupTaskCounts, tasks, switchOpen]);

  const onQuickAddTask = useCallback(
    task => {
      quickAddTask({
        ...task,
        taskGroupIdentifier,
      });
      setTimeout(() => {
        quickAddTaskInputReference.current.focus();
      }, 0);
    },
    [taskGroupIdentifier, quickAddTask],
  );

  const onToggleGroupOpen = useCallback(() => {
    if (!isOpen && groupTaskCounts > 0 && tasks?.length === 0) {
      showMoreTasks();
    }
    onSwitchOpen();
  }, [isOpen, groupTaskCounts, tasks, onSwitchOpen, showMoreTasks]);

  const highlightTasksOfTheSameParent = useCallback(parentTaskIdentifier => {
    if (highlightTimeoutReference.current)
      clearTimeout(highlightTimeoutReference.current);

    setHighlightedTasksParentIdenditifer(parentTaskIdentifier);
    highlightTimeoutReference.current = setTimeout(() => {
      setHighlightedTasksParentIdenditifer(null);
    }, 3000);
  }, []);

  const { bunchBulkEditTaskActions = {} } = useContext(BulkEditContext);
  const { groupActions } = bunchBulkEditTaskActions;

  const subtasks = useMemo(
    () =>
      tasks && tasks?.length > 0
        ? tasks?.reduce(
            (previousSubtasks, currentTask) =>
              currentTask?.subtasks?.length > 0
                ? [...previousSubtasks, ...currentTask?.subtasks]
                : previousSubtasks,
            [],
          )
        : [],
    [tasks],
  );

  const groupHasMultipleAssignees = useMemo(
    () =>
      tasks.some(
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
    <TasksGroupContainer>
      <TasksGroupHeader>
        <Arrow
          alt="arrow"
          isOpen={isOpen}
          onClick={onToggleGroupOpen}
          src={ArrowIcon}
        />
        <GroupNameSectionWrapper>
          <GroupNameSection
            initialValue={groupName}
            onEnterClick={onGroupNameSectionClick}
            closeOnEnter
            disabled={isDefaultGroup || isCompletedGroup || !editGroupName}
          >
            <TasksGroupLabel>
              <TasksGroupLabelName>{groupName}</TasksGroupLabelName>
              {!isSearchApplied &&
                !areFiltersApplied &&
                !isNil(groupTaskCounts) && (
                  <TasksGroupLabelCounter>
                    ({groupTaskCounts})
                  </TasksGroupLabelCounter>
                )}
            </TasksGroupLabel>
          </GroupNameSection>
        </GroupNameSectionWrapper>
        {!isCompletedGroup && (
          <TasksGroupHeaderActionButtons
            isDefaultGroup={isDefaultGroup}
            isFirstGroup={isFirstGroup}
            isLastGroup={isLastGroup}
            moveGroupUp={moveGroupUp}
            moveGroupDown={moveGroupDown}
            deleteGroup={onDeleteGroup}
          />
        )}
        {!changingGroupOrderDisabled && (
          <ViewTypeSwitch
            isHidden={!areViewOptionsVisible}
            value={viewType}
            onChange={value => {
              setViewType(value);
              if (value === ViewType.SLIM_VIEW) {
                onTaskGroupViewModeChange(ViewType.SLIM_VIEW);
                onSlimViewChanged(true);
              } else {
                onTaskGroupViewModeChange(ViewType.FULL_VIEW);
                onSlimViewChanged(false);
              }
            }}
          />
        )}
      </TasksGroupHeader>
      <Tasks timeout={150} in={isOpen}>
        {!!quickAddTask && !isSearchApplied && (
          <TaskGroupOptionsHeader>
            <QuickAddTaskInput
              ref={quickAddTaskInputReference}
              taskListIdentifier={taskListIdentifier}
              quickAddTask={onQuickAddTask}
              validator={value => {
                if ([...value]?.filter(char => char !== ' ').length < 2)
                  return 'The task description is too short (min. 2 characters)';

                return null;
              }}
            />
            <TaskTemplateApplicator
              taskGroupIdentifier={taskGroupIdentifier}
              taskListIdentifier={taskListIdentifier}
            />
          </TaskGroupOptionsHeader>
        )}
        {(tasks?.length > 0 || isLoadingGroup) && (
          <SortHeaderRow>
            {bunchBulkEditTaskActions && !disableBulkEdit && (
              <BulkContainer>
                <Checkbox
                  isChecked={groupActions?.getGroupIsSelectedInBulkEdit(
                    tasks,
                    subtasks,
                  )}
                  onClick={() =>
                    groupActions?.onClickBulkEditGroup({
                      parentTasks: tasks,
                      subtasks,
                    })
                  }
                />
              </BulkContainer>
            )}
            <ColumnSortHeader width={bunchBulkEditTaskActions ? 36 : 60} />
            <ColumnSortHeader
              id="TASK_DESCRIPTION"
              label="Tasks"
              sort={sort}
              onSortChange={onSortChange}
            />
            <ColumnSortHeader
              id="SUBTASK_COUNT"
              label="Sub"
              width={60}
              sort={sort}
              onSortChange={onSortChange}
            />
            <ColumnSortHeader
              id="PATIENT"
              label="Patient"
              width={164}
              sort={sort}
              onSortChange={onSortChange}
            />
            <ColumnSortHeader
              id="WORKFLOW_STATUS"
              label="Status"
              width={120}
              sort={sort}
              onSortChange={onSortChange}
            />
            <ColumnSortHeader width={150} />
            <ColumnSortHeader
              id="DUE_DT"
              label="Date"
              width={60}
              sort={sort}
              onSortChange={onSortChange}
            />
            <ColumnSortHeader
              id="ASSIGNED_TO"
              label={groupHasMultipleAssignees ? 'Assign' : 'Asgn'}
              width={groupHasMultipleAssignees ? 90 : 60}
              sort={sort}
              onSortChange={onSortChange}
            />
            {listNameVisible && (
              <ColumnSortHeader
                id="LISTNAME"
                label="List"
                width={168}
                sort={sort}
                onSortChange={onSortChange}
              />
            )}
          </SortHeaderRow>
        )}
        {(!isLoadingGroup || isFetchingMoreTasks) && (
          <DragAndDropGroupList
            taskGroupIdentifier={taskGroupIdentifier}
            tasks={tasks}
            isFullView={isFullView}
            toggleCompleteTask={toggleCompleteTask}
            draggedId={draggedId}
            isCompletedGroup={isCompletedGroup}
            onTaskUpdate={onTaskUpdate}
            updateDueDate={updateDueDate}
            updateWorkflowStatus={updateWorkflowStatus}
            dragAndDropDisabled={dragAndDropDisabled}
            listNameVisible={listNameVisible}
            selectedTask={selectedTask}
            subtasksDisabled={isListFlattened}
            areFiltersApplied={areFiltersApplied}
            isSearchApplied={isSearchApplied}
            shouldShowBlockModalOnDrag={shouldShowBlockModalOnDrag}
            showClearSortFiltersModal={showClearSortFiltersModal}
            groupHasMultipleAssignees={groupHasMultipleAssignees}
            highlightedTasksParentIdenditifer={
              highlightedTasksParentIdenditifer
            }
            highlightTasksOfTheSameParent={highlightTasksOfTheSameParent}
            taskItemConfig={taskItemConfig}
          />
        )}
        {(isLoadingGroup || isFetchingMoreTasks) && (
          <TasksSkeletonLoader rows={4} />
        )}
        {groupPagination && hasMoreTasks && !areFiltersApplied && (
          <LoadMoreSection>
            {!isLoadingGroup && <LoadMoreButton onClick={showMoreTasks} />}
          </LoadMoreSection>
        )}
      </Tasks>
    </TasksGroupContainer>
  );
};

export default React.memo(TasksGroup);
