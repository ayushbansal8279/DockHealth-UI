/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
import listSectionSavedState, {
  FULL_VIEW,
  SLIM_VIEW,
} from 'helpers/list-secition-saved-state';
import {
  ViewIcon,
  Arrow,
} from 'components/tasklist/DropdownListSection/styled';

import GroupNameSection from '../GroupNameSection/GroupNameSection';
import TasksGroupHeaderActionButtons from './TasksGroupHeaderActionButtons';
import DragAndDropGroupList from '../DragAndDropGroupList/DragAndDropGroupList';
import {
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  ViewIconBox,
  GroupNameSectionWrapper,
  TasksGroupLabelName,
  TasksGroupLabelCounter,
  PaginationButton,
  IconsBox,
} from './styled';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupId,
  currentUser,
  groupName,
  openDrawer,
  storeAsCurrentTask,
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
  isCompletedGroup,
  draggedId,
  groupPagination,
  showMoreTasks,
  isFetchingMoreTasks,
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

  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState(
    groupSessionStorageKey,
  );

  const isFullView = viewType === FULL_VIEW;

  return (
    <TasksGroupContainer>
      <TasksGroupHeader>
        <Arrow
          alt="arrow"
          isOpen={isOpen}
          onClick={() => switchOpen(!isOpen)}
          src={ArrowIcon}
        />
        <GroupNameSectionWrapper>
          <GroupNameSection
            initialValue={groupName}
            onEnterClick={newGroupName => editGroupName(newGroupName, groupId)}
            closeOnEnter
            disabled={isDefaultGroup || isCompletedGroup || !editGroupName}
          >
            <TasksGroupLabel>
              <TasksGroupLabelName>{groupName}</TasksGroupLabelName>
              {!isSearchApplied && !areFiltersApplied && (
                <TasksGroupLabelCounter>
                  (
                  {tasks?.reduce(
                    (counter, task) =>
                      counter +
                      task.subtasks?.filter(x =>
                        isCompletedGroup
                          ? x.status === 'COMPLETE'
                          : x.status === 'INCOMPLETE',
                      ).length +
                      1,
                    0,
                  ) || 0}
                  )
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
            deleteGroup={() => deleteGroup(groupId)}
          />
        )}
        {!changingGroupOrderDisabled && (
          <IconsBox>
            <ViewIconBox isHidden={!isOpen || tasks?.length === 0}>
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
            <ViewIconBox isHidden={!isOpen || tasks?.length === 0}>
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
            quickAddTask={taskName => quickAddTask(taskName, groupId)}
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
          openDrawer={openDrawer}
          storeAsCurrentTask={storeAsCurrentTask}
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
        {groupPagination && hasMoreTasks && !areFiltersApplied && (
          <PaginationButton
            disabled={isFetchingMoreTasks}
            type="button"
            onClick={showMoreTasks}
          >
            Show more
            {isFetchingMoreTasks && (
              <>
                <Spacing horizontal={4} />
                <Loader size={LoaderSizes.small} />
              </>
            )}
          </PaginationButton>
        )}
      </Tasks>
    </TasksGroupContainer>
  );
};

export default TasksGroup;
