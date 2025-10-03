/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isNil from 'ramda/src/isNil';
import { Box, Grid } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import * as TaskActions from 'actions/task-actions';
import { closeModal, openModal } from 'modal/actions';
import {
  changeTaskListGroupName,
  deleteTaskListGroup,
} from 'actions/list-details-actions';
import {
  onSlimViewChanged,
  onTaskGroupCollapsed,
  onTaskGroupExpanded,
} from 'helpers/ga-event-helper';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import listSectionSavedState from 'helpers/list-section-saved-state';
import { isTaskItemsSelectedSelector } from 'selectors/task-items-selectors';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import { ViewType } from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import palette from 'styles/palette';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';

import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { CollapseContext } from 'views/list-details/VirtualTaskList/VirtualTaskList';
import {
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  GroupNameSectionWrapper,
  TasksGroupLabelName,
  GroupOptionsContainer,
  GroupOpenContainer,
  TasksGroupNumericalBadgeContainer,
  TasksGroupTaskCount,
} from './styled';
import TasksHeader from '../TasksHeader/TasksHeader';
import { useVirtualTaskListScrollContext } from '@/app/views/list-details/VirtualTaskList/VirtualTaskListScrollContext';
import { TaskOrigin } from '@/app/helpers/task-helpers';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupName,
  groupTaskCounts,
  quickAddTask,
  moveGroupUp,
  moveGroupDown,
  onTaskGroupRefresh,
  tasks,
  isLoadingGroup,
  isCompletedGroup,
  showMoreTasks,
  areFiltersApplied,
  isSearchApplied,
  taskGroupIdentifier,
  listUniqueKey,
  taskListIdentifier,
  sort,
  onSortChange,
  onTaskGroupViewModeChange,
  applyTemplate,
  groupPagination,
  isFetchingMoreTasks,
  hasMoreTasks,
  children,
  iconColorActive,
  restrictCustomizationFeatures,
  origin,
  tasksCount,
  bgColor,
}) => {
  if (origin === TaskOrigin.PATIENT) {
    return;
  }
  const addingNewSubtaskParentId = useSelector(
    addingNewSubtaskParentIdSelector,
  );

  const [
    highlightedTasksParentIdentifier,
    setHighlightedTasksParentIdentifier,
  ] = useState(null);
  const groupSessionStorageKey =
    taskGroupIdentifier || `${listUniqueKey}-default`;
  const dispatch = useDispatch();
  const { droppableHeaderWidth, visibleWidth } =
    useVirtualTaskListScrollContext();
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const number = droppableHeaderWidth;
  const percentage = ((!!number ? number : 0) / screenWidth) * 100;

  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState({
    sessionStorageKey: groupSessionStorageKey,
  });
  const highlightTimeoutReference = useRef(null);

  const isFullView = viewType === ViewType.FULL_VIEW;

  const collapse = useContext(CollapseContext);
  const onSwitchOpen = useCallback(() => {
    if (isOpen) {
      // eslint-disable-next-line react/destructuring-assignment
      collapse.set(taskGroupIdentifier, false);
      onTaskGroupCollapsed();
    } else {
      // eslint-disable-next-line react/destructuring-assignment
      collapse.set(taskGroupIdentifier, true);
      onTaskGroupExpanded();
    }
    switchOpen(!isOpen);
  }, [isOpen, switchOpen, collapse, taskGroupIdentifier]);

  const isListFlattened =
    isSearchApplied ||
    areFiltersApplied ||
    (!!sort?.key && !['PATIENT', 'SUBTASK_COUNT'].includes(sort.key));

  useEffect(() => {
    if (
      isDefaultGroup ||
      ((groupTaskCounts > 0 || isCompletedGroup) && tasks?.length > 0)
    ) {
      switchOpen(true);
    }
  }, [groupTaskCounts, tasks, isCompletedGroup, isDefaultGroup, switchOpen]);

  const onQuickAddTask = useCallback(
    (task) => {
      quickAddTask({
        ...task,
        taskGroupIdentifier,
      });
    },
    [taskGroupIdentifier, quickAddTask],
  );

  const onToggleGroupOpen = useCallback(() => {
    if (!isOpen && groupTaskCounts > 0 && tasks?.length === 0) {
      showMoreTasks();
    }
    onSwitchOpen();
  }, [isOpen, groupTaskCounts, tasks?.length, onSwitchOpen, showMoreTasks]);

  useEffect(() => {
    if (groupTaskCounts === 0 && !isLoadingGroup) switchOpen(true);
  }, [isLoadingGroup, switchOpen, tasks, groupTaskCounts]);

  const highlightTasksOfTheSameParent = useCallback((parentTaskIdentifier) => {
    if (highlightTimeoutReference.current)
      clearTimeout(highlightTimeoutReference.current);

    setHighlightedTasksParentIdentifier(parentTaskIdentifier);
    highlightTimeoutReference.current = setTimeout(() => {
      setHighlightedTasksParentIdentifier(null);
    }, 3000);
  }, []);

  const { bulkEditEnabled } = useContext(BulkEditContext);

  const groupHasMultipleAssignees = false;

  const isGroupSelected = useSelector(isTaskItemsSelectedSelector(tasks));

  const handleGroupSelect = useCallback(() => {
    const taskIdentifiers = tasks;
    dispatch(
      TaskActions.changeTasksSelectedState(!isGroupSelected, taskIdentifiers),
    );
  }, [dispatch, isGroupSelected, tasks]);

  const handleTemplateSelect = useCallback(
    (template) => {
      applyTemplate({
        taskTemplateIdentifier: template?.identifier,
        taskGroupIdentifier,
      });
    },
    [applyTemplate, taskGroupIdentifier],
  );

  const changeViewType = (value) => {
    setViewType(value);
    if (value === ViewType.SLIM_VIEW) {
      onTaskGroupViewModeChange(ViewType.SLIM_VIEW);
      onSlimViewChanged(true);
    } else {
      onTaskGroupViewModeChange(ViewType.FULL_VIEW);
      onSlimViewChanged(false);
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const quickTaskInputValidator = (value) => {
    if ([...value]?.filter((char) => char !== ' ').length < 2)
      return 'The task description is too short (min. 2 characters)';

    return null;
  };

  const handleDeleteGroup = useCallback(() => {
    const modalProps = {
      title: 'Delete group',
      description:
        'Are you sure you want to delete this group? If you delete this group and there are tasks within the group, the tasks will not be deleted',
      confirm: () => {
        dispatch(closeModal());
        dispatch(deleteTaskListGroup(taskGroupIdentifier));
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, taskGroupIdentifier]);

  const handleEditGroupName = useCallback(
    (newGroupName) => {
      if (newGroupName) {
        dispatch(changeTaskListGroupName(taskGroupIdentifier, newGroupName));
      }
    },
    [dispatch, taskGroupIdentifier],
  );

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const defaultGroupNameItem =
    currentOrganization?.themeSettings?.find(
      (setting) => setting?.name === 'content.label.default.group',
    ) || {};

  const currentUser = useSelector(userProfileSelector);
  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;
  const options = useMemo(
    () =>
      [
        {
          name: 'Refresh',
          onClick: onTaskGroupRefresh,
        },
        !isFirstGroup && {
          name: 'Move up',
          onClick: moveGroupUp,
          disabled: restrictions?.editSettings === DISABLED,
        },
        !isLastGroup && {
          name: 'Move down',
          onClick: moveGroupDown,
          disabled: restrictions?.editSettings === DISABLED,
        },
        !isDefaultGroup && {
          name: 'Delete',
          color: palette.red,
          onClick: handleDeleteGroup,
          disabled:
            restrictions?.editSettings === DISABLED ||
            restrictCustomizationFeatures,
        },
      ].filter((o) => typeof o !== 'boolean'),
    [
      isFirstGroup,
      moveGroupUp,
      restrictions,
      DISABLED,
      isLastGroup,
      moveGroupDown,
      isDefaultGroup,
      handleDeleteGroup,
      restrictCustomizationFeatures,
      onTaskGroupRefresh,
    ],
  );

  const derivedGroupName =
    groupName === 'DEFAULT'
      ? defaultGroupNameItem?.value || 'New Tasks'
      : groupName;

  return (
    <TasksGroupContainer
      $width={percentage > 90 ? `${droppableHeaderWidth + 70}px` : '100%'}
      // $width={droppableHeaderWidth ? `${droppableHeaderWidth}px` : '100%'}
      bgColor={bgColor}
    >
      <TasksGroupHeader
        $left={origin === 'LIST' ? 8 : 24}
        $width={visibleWidth ? `${visibleWidth - 80}px` : '100%'}
      >
        <Spacing horizontal={4} />
        <GroupOpenContainer onClick={onToggleGroupOpen}>
          <RotatableChevron
            alt="arrow"
            rotated={!collapse.get(taskGroupIdentifier)}
            color="#8492A4"
          />
        </GroupOpenContainer>
        <Spacing horizontal={1} />
        <GroupNameSectionWrapper>
          <TasksGroupLabel>
            <GroupNameSection
              initialValue={derivedGroupName}
              onEnterClick={handleEditGroupName}
              closeOnEnter
              disabled={
                isDefaultGroup ||
                isCompletedGroup ||
                restrictions?.editSettings === DISABLED ||
                restrictCustomizationFeatures
              }
              isDefaultInputShown={false}
            >
              <TasksGroupLabelName>{derivedGroupName}</TasksGroupLabelName>
            </GroupNameSection>
            {!isNil(groupTaskCounts) && (
              <TasksGroupNumericalBadgeContainer>
                <TasksGroupTaskCount>
                  {!isSearchApplied && !areFiltersApplied
                    ? groupTaskCounts
                    : tasksCount}
                </TasksGroupTaskCount>
              </TasksGroupNumericalBadgeContainer>
            )}
            <div>
              {!isCompletedGroup && !restrictCustomizationFeatures && (
                <GroupOptionsContainer>
                  <OptionsMenu options={options} placement="bottom-start">
                    <MoreVert color="primary" />
                  </OptionsMenu>
                </GroupOptionsContainer>
              )}
            </div>
          </TasksGroupLabel>
        </GroupNameSectionWrapper>
      </TasksGroupHeader>

      <Tasks timeout={150} in={isOpen}>
        {restrictions?.createTask !== DISABLED &&
          !!quickAddTask &&
          !isSearchApplied &&
          !isCompletedGroup && (
            <StickyContainer left={55} decreaseWidth={80} zIndex={100}>
              <Grid container>
                <Grid item xs>
                  <QuickAddTaskInput
                    taskListIdentifier={taskListIdentifier}
                    quickAddTask={onQuickAddTask}
                    validator={quickTaskInputValidator}
                    iconColorActive={iconColorActive}
                  />
                </Grid>
                {applyTemplate && (
                  <TaskTemplateApplicator
                    onTemplateSelect={handleTemplateSelect}
                    bulkApply={false}
                    iconColorActive={iconColorActive}
                  />
                )}
              </Grid>
            </StickyContainer>
          )}
        {(tasks?.length > 0 || isLoadingGroup) && (
          <Box sx={{ ml: '55px' }}>
            <TasksHeader
              bulkEditEnabled={bulkEditEnabled}
              sort={sort}
              onSortChange={onSortChange}
              groupHasMultipleAssignees={groupHasMultipleAssignees}
              isGroupSelected={isGroupSelected}
              onGroupSelect={handleGroupSelect}
            />
          </Box>
        )}
        {children({
          isFetchingMoreTasks,
          isCompletedGroup,
          isFullView,
          tasks,
          addingNewSubtaskParentId,
          groupHasMultipleAssignees,
          isListFlattened,
          highlightedTasksParentIdentifier,
          highlightTasksOfTheSameParent,
          groupPagination,
          hasMoreTasks,
          showMoreTasks,
        })}
      </Tasks>
    </TasksGroupContainer>
  );
};

export default React.memo(TasksGroup);
