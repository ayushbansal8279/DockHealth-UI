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
import { isNil, pluck } from 'ramda';
import { Grid } from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import ArrowIcon from 'img/arrow';
import * as TaskActions from 'actions/task-actions';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
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
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { Arrow } from 'components/tasklist/DropdownListSection/styled';
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
import {
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  GroupNameSectionWrapper,
  TasksGroupLabelName,
  TasksGroupLabelCounter,
  GroupOptionsContainer,
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
  onOrderChange,
  onTaskGroupViewModeChange,
  applyTemplate,
  groupPagination,
  isFetchingMoreTasks,
  hasMoreTasks,
  children,
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

  useEffect(() => {
    if (
      isDefaultGroup ||
      ((groupTaskCounts > 0 || isCompletedGroup) && tasks?.length > 0)
    ) {
      switchOpen(true);
    }
  }, [groupTaskCounts, tasks, isCompletedGroup, isDefaultGroup, switchOpen]);

  const onQuickAddTask = useCallback(
    task => {
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

  const highlightTasksOfTheSameParent = useCallback(parentTaskIdentifier => {
    if (highlightTimeoutReference.current)
      clearTimeout(highlightTimeoutReference.current);

    setHighlightedTasksParentIdentifier(parentTaskIdentifier);
    highlightTimeoutReference.current = setTimeout(() => {
      setHighlightedTasksParentIdentifier(null);
    }, 3000);
  }, []);

  const { bulkEditEnabled } = useContext(BulkEditContext);

  const checkHasMultipleAssignees = useCallback(
    ({ assignedToUsers, subtasks: taskSubtasks }) =>
      (assignedToUsers && assignedToUsers.length > 1) ||
      (taskSubtasks &&
        taskSubtasks.length > 0 &&
        taskSubtasks.some(
          ({ assignedToUsers: subtaskAssignedToUsers }) =>
            subtaskAssignedToUsers && subtaskAssignedToUsers.length > 1,
        )),
    [],
  );

  const groupHasMultipleAssignees = useMemo(
    () =>
      tasks.some(task =>
        task?.itemType === 'BUNDLE'
          ? task.tasks.some(checkHasMultipleAssignees)
          : checkHasMultipleAssignees(task),
      ),
    [checkHasMultipleAssignees, tasks],
  );

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

  const handleTemplateSelect = useCallback(
    template => {
      applyTemplate({
        taskTemplateIdentifier: template?.identifier,
        taskGroupIdentifier,
      });
    },
    [applyTemplate, taskGroupIdentifier],
  );

  const changeViewType = value => {
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
  const quickTaskInputValidator = value => {
    if ([...value]?.filter(char => char !== ' ').length < 2)
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
    newGroupName => {
      if (newGroupName) {
        dispatch(changeTaskListGroupName(taskGroupIdentifier, newGroupName));
      }
    },
    [dispatch, taskGroupIdentifier],
  );

  const options = useMemo(
    () => [
      !isFirstGroup && {
        name: 'Move up',
        onClick: moveGroupUp,
      },
      !isLastGroup && {
        name: 'Move down',
        onClick: moveGroupDown,
      },
      !isDefaultGroup && {
        name: 'Delete',
        color: palette.red,
        onClick: handleDeleteGroup,
      },
    ],
    [
      isDefaultGroup,
      isFirstGroup,
      isLastGroup,
      moveGroupDown,
      moveGroupUp,
      handleDeleteGroup,
    ],
  );

  return (
    <TasksGroupContainer>
      <StickyContainer left={24} decreaseWidth={2 * 24}>
        <TasksGroupHeader>
          {!isCompletedGroup && (
            <GroupOptionsContainer>
              <OptionsMenu options={options} placement="bottom-start">
                <MoreVert color="primary" />
              </OptionsMenu>
            </GroupOptionsContainer>
          )}
          <Arrow
            alt="arrow"
            isOpen={isOpen}
            onClick={onToggleGroupOpen}
            src={ArrowIcon}
          />
          <GroupNameSectionWrapper>
            <GroupNameSection
              initialValue={groupName}
              onEnterClick={handleEditGroupName}
              closeOnEnter
              disabled={isDefaultGroup || isCompletedGroup}
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
          {!changingGroupOrderDisabled && (
            <ViewTypeSwitch value={viewType} onChange={changeViewType} />
          )}
        </TasksGroupHeader>
      </StickyContainer>

      <Tasks timeout={150} in={isOpen}>
        {!!quickAddTask && !isSearchApplied && (
          <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={100}>
            <Grid container>
              <Grid item xs>
                <QuickAddTaskInput
                  taskListIdentifier={taskListIdentifier}
                  quickAddTask={onQuickAddTask}
                  validator={quickTaskInputValidator}
                />
              </Grid>
              {applyTemplate && (
                <TaskTemplateApplicator
                  onTemplateSelect={handleTemplateSelect}
                  bulkApply={false}
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
            onOrderChange={onOrderChange}
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
