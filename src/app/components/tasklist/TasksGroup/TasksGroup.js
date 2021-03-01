/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from 'react';
import { isNil } from 'ramda';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/list/FullViewIcon';
import SlimViewIcon from 'img/list/SlimViewIcon';

import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import Tooltip from 'components/common/Tooltip/Tooltip';
import listSectionSavedState, {
  FULL_VIEW,
  SLIM_VIEW,
} from 'helpers/list-secition-saved-state';
import { checkIfTasksHaveSubtasksOrCommnets } from 'helpers/tasklist-helpers';
import {
  ViewTypeButton,
  ViewIconBox,
  IconsBox,
  Arrow,
} from 'components/tasklist/DropdownListSection/styled';

import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import Checkbox from 'components/common/Checkbox/Checkbox';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import DragAndDropGroupList from 'components/tasklist/DragAndDropGroupList/DragAndDropGroupList';
import SingleSkeletonLoader from 'components/tasklist/SingleSkeletonLoader/SingleSkeletonLoader';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
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
} from './styled';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupId,
  groupName,
  groupTaskCounts,
  toggleCompleteTask,
  editGroupName,
  quickAddTask,
  deleteGroup,
  moveGroupUp,
  moveGroupDown,
  reorderSubtasksForTask,
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
}) => {
  const groupSessionStorageKey =
    taskGroupIdentifier || `${listUniqueKey}-default`;

  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState({
    sessionStorageKey: groupSessionStorageKey,
  });
  const quickAddTaskInputReference = useRef(null);

  const areViewOptionsVisible = useMemo(() => {
    if (!isOpen) return false;
    return checkIfTasksHaveSubtasksOrCommnets(tasks);
  }, [isOpen, tasks]);

  const isFullView =
    viewType === FULL_VIEW || areFiltersApplied || isSearchApplied;

  const onSwitchOpen = useCallback(() => switchOpen(!isOpen), [
    switchOpen,
    isOpen,
  ]);

  const isListFlattened =
    isSearchApplied ||
    areFiltersApplied ||
    (!!sort?.key && !['PATIENT', 'SUBTASK_COUNT'].includes(sort.key));

  const onGroupNameSectionClick = useCallback(
    newGroupName => editGroupName(newGroupName, groupId),
    [editGroupName, groupId],
  );

  const onDeleteGroup = useCallback(() => deleteGroup(groupId), [
    deleteGroup,
    groupId,
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
        taskGroupIdentifier: groupId,
      });
      setTimeout(() => {
        quickAddTaskInputReference.current.focus();
      }, 0);
    },
    [groupId, quickAddTask],
  );

  const onToggleGroupOpen = useCallback(() => {
    if (!isOpen && groupTaskCounts > 0 && tasks?.length === 0) {
      showMoreTasks();
    }
    onSwitchOpen();
  }, [isOpen, groupTaskCounts, tasks, onSwitchOpen, showMoreTasks]);

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
          <IconsBox>
            <ViewIconBox isHidden={!areViewOptionsVisible}>
              <Tooltip placement="top" title="Slim view. Just the task shows">
                <ViewTypeButton
                  type="button"
                  active={!isFullView}
                  onClick={() => {
                    setViewType(SLIM_VIEW);
                    onTaskGroupViewModeChange(SLIM_VIEW);
                  }}
                >
                  <SlimViewIcon />
                </ViewTypeButton>
              </Tooltip>
            </ViewIconBox>
            <ViewIconBox isHidden={!areViewOptionsVisible}>
              <Tooltip
                placement="top"
                title="Full view. Task and comments show"
              >
                <ViewTypeButton
                  type="button"
                  active={isFullView}
                  onClick={() => {
                    setViewType(FULL_VIEW);
                    onTaskGroupViewModeChange(FULL_VIEW);
                  }}
                >
                  <FullViewIcon />
                </ViewTypeButton>
              </Tooltip>
            </ViewIconBox>
          </IconsBox>
        )}
      </TasksGroupHeader>
      <Tasks timeout={150} in={isOpen}>
        {!!quickAddTask && !isSearchApplied && (
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
        )}
        {(tasks?.length > 0 || isLoadingGroup) && (
          <SortHeaderRow>
            {bunchBulkEditTaskActions && (
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
              label="Assign"
              width={100}
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
            groupId={groupId}
            tasks={tasks}
            isFullView={isFullView}
            toggleCompleteTask={toggleCompleteTask}
            draggedId={draggedId}
            reorderSubtasksForTask={reorderSubtasksForTask}
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
          />
        )}
        {(isLoadingGroup || isFetchingMoreTasks) && (
          <SingleSkeletonLoader rows={4} />
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
