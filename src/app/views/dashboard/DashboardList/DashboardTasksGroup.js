/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicated-branches */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { pluck } from 'ramda';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import { Collapse } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ArrowIcon from 'img/arrow';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import { Arrow } from 'components/tasklist/DropdownListSection/styled';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import StandardTaskItem from 'components/task/StandardTaskItem/TaskItem';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import DashboardSingleSkeletonLoader from '../DashboardSkeletonLoader/DashboardSingleSkeletonLoader';
import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupLabelName,
  DashboardTasksGroupList,
  DroppableBox,
  DashboardTasksGroupHeader,
  GroupNameSectionWrapper,
  DashboardTaskItemContainer,
} from './styled';

const TODAY_GROUP = 'TODAY';
const NEXT_7_DAYS_GROUP = 'NEXT_7_DAYS';
const NO_DUE_DATE_GROUP = 'NO_DUE_DATE';
const GROUPS_WITH_QUICK_ADD_TASK_INPUT = [
  TODAY_GROUP,
  NEXT_7_DAYS_GROUP,
  NO_DUE_DATE_GROUP,
];
const COMPLETED_TODAY = 'COMPLETED_TODAY';
const COMPLETED_7_DAYS = 'COMPLETED_7_DAYS';
const ORG_COMPLETED_TODAY = 'ORG_COMPLETED_TODAY';
const ORG_COMPLETED_7_DAYS = 'ORG_COMPLETED_7_DAYS';
const GROUPS_WITH_COMPLETED_TASKS = [
  COMPLETED_TODAY,
  COMPLETED_7_DAYS,
  ORG_COMPLETED_TODAY,
  ORG_COMPLETED_7_DAYS,
];

const DashboardTasksGroup = ({
  dashboardTasksGroup,
  toggleDashboardTaskComplete,
  redirectToParentTask,
  storeAsCurrentTask,
  sortDashboardTasks,
  openDrawer,
  isTaskDrawerOpen,
  selectedTaskIdentifier,
  currentSortMethod,
  currentSort,
  onSortChange,
  showClearSortFiltersModal,
  isSortApplied,
  isAllTasksTab,
  columnsConfig,
  updateDueDate,
  currentUser,
  onTaskUpdate,
  updateWorkflowStatus,
  fetchImplicitGroup,
  isSearching,
  closeDrawer,
  handleQuickAddTask,
  openModal,
}) => {
  const {
    groupName,
    groupType,
    metricValue,
    defaultOpen,
    isLoadingGroup,
    isLoadingMore,
    tasks: dashboardTasks,
  } = dashboardTasksGroup;

  const [tasks, setNewTasks] = useState(dashboardTasks);
  const [groupIsOpen, setGroupIsOpen] = useState(defaultOpen);
  const quickAddTaskInputReference = useRef(null);
  const dispatch = useDispatch();

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

  const onSwitchGroup = useCallback(() => {
    if (!groupIsOpen && dashboardTasks?.length === 0 && !isSearching) {
      fetchImplicitGroup(dashboardTasksGroup);
    }
    setGroupIsOpen(!groupIsOpen);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTasksGroup, fetchImplicitGroup, groupIsOpen, isSearching]);

  useEffect(() => {
    setNewTasks(dashboardTasks);

    if (dashboardTasks?.length === 0) {
      setGroupIsOpen(false);
    }
  }, [dashboardTasks]);

  const groupHasMultipleAssignees = useMemo(
    () => tasks.some(({ assignedToUsers }) => assignedToUsers?.length > 1),
    [tasks],
  );

  const dueDateForQuickAdd = useMemo(() => {
    if (groupType === TODAY_GROUP)
      return moment()
        .startOf('day')
        .toISOString();

    if (groupType === NEXT_7_DAYS_GROUP)
      return moment()
        .add(7, 'days')
        .startOf('day')
        .toISOString();

    return null;
  }, [groupType]);

  const isCompletedGroup = !!GROUPS_WITH_COMPLETED_TASKS.includes(groupType);

  return (
    <DashboardTasksGroupContainer>
      <DashboardTasksGroupHeader>
        <Arrow
          alt="arrow"
          isOpen={groupIsOpen}
          onClick={onSwitchGroup}
          src={ArrowIcon}
        />
        <GroupNameSectionWrapper>
          <DashboardTasksGroupLabel>
            <DashboardTasksGroupLabelName>
              {groupName}
            </DashboardTasksGroupLabelName>
            ({metricValue})
          </DashboardTasksGroupLabel>
        </GroupNameSectionWrapper>
      </DashboardTasksGroupHeader>
      {isLoadingGroup && <DashboardSingleSkeletonLoader rows={4} />}
      {!isLoadingGroup && (
        <Collapse timeout={500} in={groupIsOpen}>
          <DashboardTasksGroupList>
            {GROUPS_WITH_QUICK_ADD_TASK_INPUT.includes(groupType) && (
              <QuickAddTaskInput
                ref={quickAddTaskInputReference}
                quickAddTask={payload =>
                  handleQuickAddTask(
                    quickAddTaskInputReference,
                    payload,
                    dueDateForQuickAdd,
                  )
                }
                onFocus={() => {
                  if (isTaskDrawerOpen) {
                    closeDrawer();
                    storeAsCurrentTask(null);
                  }
                }}
                validator={value => {
                  if ([...value]?.filter(char => char !== ' ').length < 2)
                    return 'The task description is too short (min. 2 characters)';

                  return null;
                }}
              />
            )}
            <TasksHeader
              bulkEditEnabled
              taskItemConfig={columnsConfig}
              isGroupSelected={isGroupSelected}
              onGroupSelect={handleGroupSelect}
              sort={currentSort}
              onSortChange={onSortChange}
              groupHasMultipleAssignees={groupHasMultipleAssignees}
            />
            <DragDropContext
              onBeforeDragStart={showClearSortFiltersModal}
              onDragEnd={({ destination, source }) => {
                if (!isSortApplied) {
                  if (!destination) {
                    openModal('HomeScreenDragDrop');
                  } else {
                    const { index: destinationIndex } = destination;
                    const { index: sourceIndex } = source;
                    const newTasks = [...tasks];
                    newTasks.splice(
                      destinationIndex,
                      0,
                      newTasks.splice(sourceIndex, 1)[0],
                    );

                    setNewTasks(newTasks);

                    const newTasksOrder = newTasks.map(
                      ({ taskIdentifier }) => taskIdentifier,
                    );
                    sortDashboardTasks(groupType, newTasksOrder);
                  }
                }
              }}
            >
              <Droppable droppableId={groupName}>
                {providedDroppable => {
                  return (
                    <DroppableBox
                      ref={providedDroppable.innerRef}
                      {...providedDroppable.droppableProps}
                    >
                      {currentSortMethod(tasks)?.map((task, index) => (
                        <Draggable
                          key={task.taskIdentifier}
                          draggableId={String(task.taskIdentifier)}
                          index={index}
                          isDragDisabled={isTaskDrawerOpen || tasks?.length < 2}
                        >
                          {(draggableProvided, { isDragging }) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                            >
                              <DashboardTaskItemContainer>
                                <StandardTaskItem
                                  task={task}
                                  toggleCompleteTask={() =>
                                    toggleDashboardTaskComplete(task)
                                  }
                                  isCompletedGroup={isCompletedGroup}
                                  redirectToParentTask={redirectToParentTask}
                                  storeAsCurrentTask={storeAsCurrentTask}
                                  isDragging={isDragging}
                                  dragHandleProps={
                                    draggableProvided.dragHandleProps
                                  }
                                  isDraggable={
                                    !isTaskDrawerOpen && tasks?.length > 1
                                  }
                                  openDrawer={openDrawer}
                                  isSelected={
                                    selectedTaskIdentifier ===
                                    task?.taskIdentifier
                                  }
                                  showAssignedPerson={isAllTasksTab}
                                  updateDueDate={updateDueDate}
                                  currentUser={currentUser}
                                  onTaskUpdate={onTaskUpdate}
                                  updateWorkflowStatus={updateWorkflowStatus}
                                  taskItemConfig={columnsConfig}
                                  multipleAssigneesContext={
                                    groupHasMultipleAssignees
                                  }
                                  subtasksDisabled
                                  isDashboardTask
                                />
                              </DashboardTaskItemContainer>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {providedDroppable.placeholder}
                    </DroppableBox>
                  );
                }}
              </Droppable>
            </DragDropContext>
            {!isLoadingMore && dashboardTasksGroup?.hasMore && (
              <LoadMoreSection>
                <LoadMoreButton
                  onClick={() => fetchImplicitGroup(dashboardTasksGroup, true)}
                />
              </LoadMoreSection>
            )}
            {isLoadingMore && <DashboardSingleSkeletonLoader rows={3} />}
          </DashboardTasksGroupList>
        </Collapse>
      )}
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
