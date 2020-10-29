/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo, useCallback, useEffect } from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';

import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
import listSectionSavedState, {
  FULL_VIEW,
  SLIM_VIEW,
} from 'helpers/list-secition-saved-state';
import { checkIfTasksHaveSubtasksOrCommnets } from 'helpers/tasklist-helpers';
import {
  ViewIcon,
  ViewIconBox,
  IconsBox,
  Arrow,
} from 'components/tasklist/DropdownListSection/styled';

import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import DragAndDropGroupList from 'components/tasklist/DragAndDropGroupList/DragAndDropGroupList';
import SingleSkeletonLoader from 'components/tasklist/SingleSkeletonLoader/SingleSkeletonLoader';
import TasksGroupHeaderActionButtons from './TasksGroupHeaderActionButtons';
import {
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  GroupNameSectionWrapper,
  TasksGroupLabelName,
  TasksGroupLabelCounter,
} from './styled';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupId,
  currentUser,
  groupName,
  groupTaskCounts,
  toggleTaskPriority,
  toggleCompleteTask,
  editGroupName,
  quickAddTask,
  deleteGroup,
  moveGroupUp,
  moveGroupDown,
  reorderSubtasksForTask,
  reassignTask,
  tasks,
  isLoadingGroup,
  isCompletedGroup,
  draggedId,
  groupPagination,
  showMoreTasks,
  hasMoreTasks,
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
}) => {
  const groupSessionStorageKey =
    taskGroupIdentifier || `${listUniqueKey}-default`;

  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState({
    sessionStorageKey: groupSessionStorageKey,
  });

  const areViewOptionsVisible = useMemo(() => {
    if (!isOpen) return false;
    return checkIfTasksHaveSubtasksOrCommnets(tasks);
  }, [isOpen, tasks]);

  const isFullView = viewType === FULL_VIEW;

  const onSwitchOpen = useCallback(() => switchOpen(!isOpen), [
    switchOpen,
    isOpen,
  ]);

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
    task =>
      quickAddTask({
        ...task,
        taskGroupIdentifier: groupId,
      }),
    [groupId, quickAddTask],
  );

  const onToggleGroupOpen = useCallback(() => {
    if (!isOpen && groupTaskCounts > 0 && tasks?.length === 0) {
      showMoreTasks();
    }
    onSwitchOpen();
  }, [isOpen, groupTaskCounts, tasks, onSwitchOpen, showMoreTasks]);

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
              {!isSearchApplied && !areFiltersApplied && groupTaskCounts && (
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
              <UniversalTooltipContainer
                placement="top-end"
                label="Slim view. Just the task shows"
              >
                <ViewIcon
                  alt="slim-view"
                  src={isFullView ? SlimViewIcon : SlimViewActiveIcon}
                  onClick={() => setViewType(SLIM_VIEW)}
                />
              </UniversalTooltipContainer>
            </ViewIconBox>
            <ViewIconBox isHidden={!areViewOptionsVisible}>
              <UniversalTooltipContainer
                placement="top-end"
                label="Full view. Task and comments show"
              >
                <ViewIcon
                  alt="full-view"
                  src={isFullView ? FullViewActiveIcon : FullViewIcon}
                  onClick={() => setViewType(FULL_VIEW)}
                />
              </UniversalTooltipContainer>
            </ViewIconBox>
          </IconsBox>
        )}
      </TasksGroupHeader>
      <Tasks timeout={150} in={isOpen}>
        {!!quickAddTask && !isSearchApplied && (
          <QuickAddTaskInput
            quickAddTask={onQuickAddTask}
            validator={value => {
              if ([...value]?.filter(char => char !== ' ').length < 2)
                return 'The task description is too short (min. 2 characters)';

              return null;
            }}
          />
        )}
        <DragAndDropGroupList
          groupId={groupId}
          tasks={tasks}
          currentUser={currentUser}
          isFullView={isFullView}
          toggleCompleteTask={toggleCompleteTask}
          toggleTaskPriority={toggleTaskPriority}
          draggedId={draggedId}
          reorderSubtasksForTask={reorderSubtasksForTask}
          isCompletedGroup={isCompletedGroup}
          reassignTask={reassignTask}
          updateDueDate={updateDueDate}
          updateWorkflowStatus={updateWorkflowStatus}
          dragAndDropDisabled={dragAndDropDisabled}
          listNameVisible={listNameVisible}
          selectedTask={selectedTask}
        />
        {isLoadingGroup && <SingleSkeletonLoader rows={4} />}
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
