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
import ArrowIcon from 'img/arrow';
import * as TaskActions from 'actions/task-actions';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
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
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';
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
import TasksHeader from '../TasksHeader/TasksHeader';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupName,
  groupTaskCounts,
  editGroupName,
  quickAddTask,
  deleteGroup,
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
  taskItemConfig,
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
        taskTemplateIdentifier: template?.taskTemplateIdentifier,
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
          <ViewTypeSwitch value={viewType} onChange={changeViewType} />
        )}
      </TasksGroupHeader>
      <Tasks timeout={150} in={isOpen}>
        {!!quickAddTask && !isSearchApplied && (
          <Grid container>
            <Grid item xs>
              <QuickAddTaskInput
                taskListIdentifier={taskListIdentifier}
                quickAddTask={onQuickAddTask}
                validator={quickTaskInputValidator}
              />
            </Grid>
            {applyTemplate && (
              <TaskTemplateApplicator onTemplateSelect={handleTemplateSelect} />
            )}
          </Grid>
        )}
        {(tasks?.length > 0 || isLoadingGroup) && (
          <TasksHeader
            bulkEditEnabled={bulkEditEnabled}
            sort={sort}
            onSortChange={onSortChange}
            taskItemConfig={taskItemConfig}
            groupHasMultipleAssignees={groupHasMultipleAssignees}
            isGroupSelected={isGroupSelected}
            onGroupSelect={handleGroupSelect}
          />
        )}
        {children({
          isLoadingGroup,
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
