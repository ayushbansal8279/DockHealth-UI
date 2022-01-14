/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { compose, pluck } from 'ramda';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import { Collapse } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ArrowIcon from 'img/arrow';
import { getSharedTaskListsWithCurrentUser } from 'api/task-list-api';
import {
  DashboardGroup,
  GROUPS_WITH_COMPLETED_TASKS,
  GROUPS_WITH_QUICK_ADD_TASK_INPUT,
} from 'helpers/dashboard-helpers';
import {
  getDashboardTasksForGroup,
  loadMoreDashboardTasksForGroup,
  reorderDashboardTasks,
} from 'actions/dashboard-actions';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import { Arrow } from 'components/tasklist/DropdownListSection/styled';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import StandardTaskItem from 'components/task/StandardTaskItem/TaskItem';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import palette from 'styles/palette';
import { dashboardLastCreatedTaskIdentifierSelector } from 'selectors/dashboard-selectors';

import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupLabelName,
  DashboardTasksGroupList,
  DroppableBox,
  DashboardTasksGroupHeader,
  GroupNameSectionWrapper,
  DashboardTaskItemContainer,
  StickyElement,
} from './styled';

const DashboardTasksGroup = ({
  dashboardTasksGroup,
  storeAsCurrentTask,
  openDrawer,
  isTaskDrawerOpen,
  selectedTaskIdentifier,
  currentSortMethod,
  currentSort,
  onSortChange,
  showClearSortFiltersModal,
  isSortApplied,
  isAllTasksTab,
  currentUser,
  updateWorkflowStatus,
  isSearching,
  closeDrawer,
  openModal,
}) => {
  const {
    groupName,
    groupType,
    metricValue,
    defaultOpen,
    isLoading,
    isLoadingMore,
    tasks: dashboardTasks,
  } = dashboardTasksGroup;
  const { userIdentifier } = currentUser;

  const lastCreatedTaskId = useSelector(
    dashboardLastCreatedTaskIdentifierSelector,
  );

  const [tasks, setNewTasks] = useState(dashboardTasks);
  const [groupIsOpen, setGroupIsOpen] = useState(defaultOpen);
  const quickAddTaskInputReference = useRef(null);
  const parentContainerReference = useRef(null);
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
    if (!groupIsOpen && !isSearching) {
      dispatch(getDashboardTasksForGroup(groupType));
    }
    setGroupIsOpen(!groupIsOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTasksGroup, groupIsOpen, isSearching]);

  useEffect(() => {
    setNewTasks(dashboardTasks);

    if (dashboardTasks?.length === 0) {
      setGroupIsOpen(false);
    }
  }, [dashboardTasks]);

  const groupHasMultipleAssignees = useMemo(
    () => tasks?.some(({ assignedToUsers }) => assignedToUsers?.length > 1),
    [tasks],
  );

  const dueDateForQuickAdd = useMemo(() => {
    if (groupType === DashboardGroup.TODAY)
      return moment()
        .startOf('day')
        .toISOString();

    if (groupType === DashboardGroup.NEXT_7_DAYS)
      return moment()
        .add(7, 'days')
        .startOf('day')
        .toISOString();

    return null;
  }, [groupType]);

  const handleQuickAddTask = ({ description, patientIdentifier }) => {
    dispatch(
      openModal('ListPicker', {
        fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
        listCreationPayload: {
          adminIdentifiers:
            currentUser.userIdentifier !== userIdentifier
              ? [userIdentifier]
              : [],
        },
        confirm: taskListIdentifier => {
          dispatch(
            TaskActions.saveTask({
              description,
              taskListIdentifier,
              assignedToIdentifier: userIdentifier,
              patientIdentifier,
              dueDate: dueDateForQuickAdd,
            }),
          );
          quickAddTaskInputReference.current.focus();
        },
      }),
    );
  };

  const isCompletedGroup = !!GROUPS_WITH_COMPLETED_TASKS.includes(groupType);

  const handleUpdateTask = useCallback(
    compose(dispatch, TaskActions.partialUpdateTask),
    [dispatch],
  );

  return (
    <DashboardTasksGroupContainer ref={parentContainerReference}>
      <StickyElement>
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
      </StickyElement>
      {isLoading && !tasks ? (
        <DashboardTasksGroupList>
          <TasksSkeletonLoader rows={4} />
        </DashboardTasksGroupList>
      ) : (
        <Collapse timeout={500} in={groupIsOpen}>
          <DashboardTasksGroupList>
            {GROUPS_WITH_QUICK_ADD_TASK_INPUT.includes(groupType) && (
              <StickyElement zIndex={101}>
                <QuickAddTaskInput
                  ref={quickAddTaskInputReference}
                  quickAddTask={handleQuickAddTask}
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
              </StickyElement>
            )}
            <TasksHeader
              pageBackground={palette.white}
              bulkEditEnabled
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
                    dispatch(reorderDashboardTasks(groupType, newTasksOrder));
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
                      {tasks &&
                        currentSortMethod(tasks)?.map((task, index) => (
                          <Draggable
                            key={task.taskIdentifier}
                            draggableId={String(task.taskIdentifier)}
                            index={index}
                            isDragDisabled={
                              isTaskDrawerOpen || tasks?.length < 2
                            }
                          >
                            {(draggableProvided, { isDragging }) => (
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                              >
                                <DashboardTaskItemContainer>
                                  <StandardTaskItem
                                    parentContainerReference={
                                      parentContainerReference
                                    }
                                    newlyCreated={
                                      task.identifier === lastCreatedTaskId
                                    }
                                    pageBackground={palette.white}
                                    task={task}
                                    toggleCompleteTask={() =>
                                      dispatch(
                                        TaskActions.toggleCompleteTask(task),
                                      )
                                    }
                                    isCompletedGroup={isCompletedGroup}
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
                                    currentUser={currentUser}
                                    onTaskUpdate={handleUpdateTask}
                                    updateWorkflowStatus={updateWorkflowStatus}
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
                  onClick={() =>
                    dispatch(loadMoreDashboardTasksForGroup(groupType))
                  }
                />
              </LoadMoreSection>
            )}
            {isLoadingMore && <TasksSkeletonLoader rows={3} />}
          </DashboardTasksGroupList>
        </Collapse>
      )}
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
