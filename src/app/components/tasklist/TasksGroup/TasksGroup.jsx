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
import { Grid } from '@mui/material';
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
import ViewTypeSwitch, {
  ViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import palette from 'styles/palette';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';

import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import {
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  GroupNameSectionWrapper,
  TasksGroupLabelName,
  TasksGroupLabelCounter,
  GroupOptionsContainer,
  GroupOpenContainer,
} from './styled';
import TasksHeader from '../TasksHeader/TasksHeader';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupName,
  groupTaskCounts,
  quickAddTask,
  moveGroupUp,
  moveGroupDown,
  tasks,
  isLoadingGroup,
  isCompletedGroup,
  showMoreTasks,
  changingGroupOrderDisabled,
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
}) => {
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

  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState({
    sessionStorageKey: groupSessionStorageKey,
  });
  const highlightTimeoutReference = useRef(null);

  const isFullView = viewType === ViewType.FULL_VIEW;

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
  }, [tasks, isOpen, groupTaskCounts, onSwitchOpen, showMoreTasks]);

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

  const currentUser = useSelector(userProfileSelector);
  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;
  const options = useMemo(
    () =>
      [
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
    ],
  );

  return (
    <TasksGroupContainer>
      <StickyContainer left={0} decreaseWidth={20}>
        <TasksGroupHeader>
          <Spacing horizontal={4} />
          <GroupOpenContainer onClick={onToggleGroupOpen}>
            <RotatableChevron
              alt="arrow"
              rotated={!isOpen}
              color='#8492A4'
            />
          </GroupOpenContainer>
          <Spacing horizontal={1} />
          <GroupNameSectionWrapper>
            <GroupNameSection
              initialValue={groupName}
              onEnterClick={handleEditGroupName}
              closeOnEnter
              disabled={
                isDefaultGroup ||
                isCompletedGroup ||
                restrictions?.editSettings === DISABLED ||
                restrictCustomizationFeatures
              }
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
              
              
            </GroupNameSection>
          </GroupNameSectionWrapper>
          {!changingGroupOrderDisabled && (
            <ViewTypeSwitch value={viewType} onChange={changeViewType} />
          )}
        </TasksGroupHeader>
      </StickyContainer>

      <Tasks timeout={150} in={isOpen}>
        {restrictions?.createTask !== DISABLED &&
          !!quickAddTask &&
          !isSearchApplied &&
          !isCompletedGroup && (
            <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={100}>
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
          <TasksHeader
            bulkEditEnabled={bulkEditEnabled}
            sort={sort}
            onSortChange={onSortChange}
            groupHasMultipleAssignees={groupHasMultipleAssignees}
            isGroupSelected={isGroupSelected}
            onGroupSelect={handleGroupSelect}
          />
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
