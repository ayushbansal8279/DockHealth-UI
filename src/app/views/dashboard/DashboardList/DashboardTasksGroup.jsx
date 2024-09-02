/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import compose from 'ramda/src/compose';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import { Collapse } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import TaskItem from 'components/task/StandardTaskItem/TaskItem';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import { isTaskItemsSelectedSelector } from 'selectors/task-items-selectors';
import palette from 'styles/palette';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import {
  dashboardLastCreatedTaskIdentifierSelector,
  dashboardLoadingGroupsSelector,
  dashboardTasksMapSelector,
} from 'selectors/dashboard-selectors';
import { usePrevious } from 'react-use';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { MoreVert } from '@mui/icons-material';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import { TaskOrigin } from 'helpers/task-helpers';
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
  GroupOptionsContainer,
  GroupOpenContainer,
  NumericalBadgeContainer,
  TaskCount,
} from './styled';

const DashboardTasksGroup = ({
  dashboardTasksGroup,
  storeAsCurrentTask,
  isTaskDrawerOpen,
  currentSortMethod,
  currentSort,
  onSortChange,
  showClearSortFiltersModal,
  isSortApplied,
  currentUser,
  updateWorkflowStatus,
  isSearching,
  closeDrawer,
  openModal,
  isFirstGroup,
  isLastGroup,
  moveGroupUp,
  moveGroupDown,
  iconColorActive,
  backgroundColor,
  showHeader,
}) => {
  const {
    groupName,
    groupType,
    taskGroupIdentifier,
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

  const isGroupLoading = useSelector((state) =>
    dashboardLoadingGroupsSelector(state, groupName),
  );

  const [tasks, setNewTasks] = useState(dashboardTasks);
  const [tasksIdentifiers, setTasksIdentifiers] = useState([]);
  const [groupIsOpen, setGroupIsOpen] = useState(defaultOpen);
  const quickAddTaskInputReference = useRef(null);
  const parentContainerReference = useRef(null);
  const dispatch = useDispatch();

  const currentTaskLength = dashboardTasks?.length || 0;
  const previousTaskLength = usePrevious(currentTaskLength) || 0;

  useEffect(() => {
    if (currentTaskLength > 0 && previousTaskLength === 0) {
      setGroupIsOpen(true);
    }
  }, [currentTaskLength, previousTaskLength]);

  useEffect(() => {
    if (dashboardTasks?.length === 0 && metricValue > 0 && !isLoading) {
      setGroupIsOpen(false);
    }
  }, [dashboardTasks, isLoading, metricValue]);

  const isGroupSelected = useSelector(
    isTaskItemsSelectedSelector(tasksIdentifiers),
  );

  const handleGroupSelect = useCallback(() => {
    const taskIdentifiers =
      tasks && typeof tasks[0] === 'string'
        ? tasks
        : tasks.map((item) => item.identifier);
    setTasksIdentifiers(taskIdentifiers);
    dispatch(
      TaskActions.changeTasksSelectedState(!isGroupSelected, taskIdentifiers),
    );
  }, [dispatch, isGroupSelected, tasks]);

  const onSwitchGroup = useCallback(() => {
    if (!groupIsOpen && !isSearching) {
      dispatch(getDashboardTasksForGroup(groupType, taskGroupIdentifier));
    }
    setGroupIsOpen(!groupIsOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTasksGroup, groupIsOpen, isSearching]);

  useEffect(() => {
    setNewTasks(dashboardTasks);
  }, [dashboardTasks]);

  const tasksMap = useSelector((state) => dashboardTasksMapSelector(state));

  useEffect(() => {
    if (currentSort && currentSort.key && dashboardTasks) {
      const tasksWithDetails = dashboardTasks?.map(
        (task) => tasksMap[task?.identifier || task],
      );
      let renderedTasks = currentSortMethod(tasksWithDetails);
      renderedTasks = renderedTasks.map((t) => t?.identifier);
      setNewTasks(renderedTasks);
    }
  }, [currentSort, currentSortMethod, dashboardTasks, tasksMap]);

  const groupHasMultipleAssignees = false;

  const dueDateForQuickAdd = useMemo(() => {
    if (groupType === DashboardGroup.TODAY)
      return moment().startOf('day').toISOString();

    if (groupType === DashboardGroup.NEXT_7_DAYS)
      return moment().add(7, 'days').startOf('day').toISOString();

    return null;
  }, [groupType]);

  const handleQuickAddTask = ({ description, patientIdentifier }) => {
    dispatch(
      openModal('ListPicker', {
        enableSelectingGroupStep: true,
        fetchMethod: () => getSharedTaskListsWithCurrentUser(userIdentifier),
        listCreationPayload: {
          adminIdentifiers:
            currentUser.userIdentifier === userIdentifier
              ? []
              : [userIdentifier],
        },
        confirm: (taskListIdentifier, taskGroupIdentifier) => {
          dispatch(
            TaskActions.saveTask({
              description,
              taskListIdentifier,
              taskGroupIdentifier,
              assignedToIdentifier: userIdentifier,
              patientIdentifier,
              dueDate: dueDateForQuickAdd,
            }),
          );
          quickAddTaskInputReference?.current?.focus();
        },
      }),
    );
  };

  const isCompletedGroup = !!GROUPS_WITH_COMPLETED_TASKS.includes(groupType);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateTask = useCallback(
    compose(dispatch, TaskActions.partialUpdateTask),
    [dispatch],
  );

  const isDragAndDropDisabled = !tasks || tasks.length < 2;

  const options = useMemo(() => {
    const optionsArray = [];
    if (!isFirstGroup)
      optionsArray.push({
        name: 'Move up',
        onClick: moveGroupUp,
      });
    if (!isLastGroup)
      optionsArray.push({
        name: 'Move down',
        onClick: moveGroupDown,
      });

    return optionsArray;
  }, [isFirstGroup, isLastGroup, moveGroupDown, moveGroupUp]);

  const handleOrderChange = useCallback(
    (listDisplayColumns) => {
      dispatch(
        updateCurrentUserPreferences({
          listDisplayColumns,
        }),
      );
    },
    [dispatch],
  );

  return (
    <DashboardTasksGroupContainer
      ref={parentContainerReference}
      backgroundColor={backgroundColor}
      height={150 + tasks?.length * 40}
    >
      <StickyContainer left={24} decreaseWidth={2 * 24}>
        {showHeader && (
          <StickyElement
            origin={TaskOrigin.DASHBOARD}
            backgroundColor={
              backgroundColor ? palette.aliceBlue : palette.white
            }
          >
            <DashboardTasksGroupHeader backgroundColor={backgroundColor}>
              <Spacing horizontal={2} />
              <GroupOpenContainer onClick={onSwitchGroup}>
                <RotatableChevron
                  alt="arrow"
                  rotated={groupIsOpen}
                  color={palette.shadowBlue}
                />
              </GroupOpenContainer>
              <Spacing horizontal={1} />
              <GroupNameSectionWrapper>
                <DashboardTasksGroupLabel>
                  <DashboardTasksGroupLabelName>
                    {groupName}
                    {tasks?.length > 0 && (
                      <NumericalBadgeContainer>
                        <TaskCount>{tasks?.length}</TaskCount>
                      </NumericalBadgeContainer>
                    )}
                  </DashboardTasksGroupLabelName>
                </DashboardTasksGroupLabel>
                <GroupOptionsContainer>
                  <OptionsMenu options={options} placement="bottom-start">
                    <MoreVert color="primary" />
                  </OptionsMenu>
                </GroupOptionsContainer>
              </GroupNameSectionWrapper>
            </DashboardTasksGroupHeader>
          </StickyElement>
        )}
      </StickyContainer>
      {isGroupLoading || !tasks ? (
        <DashboardTasksGroupList>
          <TasksSkeletonLoader rows={4} />
        </DashboardTasksGroupList>
      ) : (
        <Collapse timeout={500} in={groupIsOpen}>
          <DashboardTasksGroupList>
            {/* {GROUPS_WITH_QUICK_ADD_TASK_INPUT.includes(groupType) && (
              <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={100}>
                <StickyElement
                  zIndex={101}
                  origin={TaskOrigin.DASHBOARD}
                  backgroundColor={
                    backgroundColor ? palette.aliceBlue : palette.white
                  }
                >
                  <QuickAddTaskInput
                    ref={quickAddTaskInputReference}
                    quickAddTask={handleQuickAddTask}
                    onFocus={() => {
                      if (isTaskDrawerOpen) {
                        closeDrawer();
                        storeAsCurrentTask(null);
                      }
                    }}
                    validator={(value) => {
                      if ([...value]?.filter((char) => char !== ' ').length < 2)
                        return 'The task description is too short (min. 2 characters)';

                      return null;
                    }}
                    iconColorActive={iconColorActive}
                  />
                </StickyElement>
              </StickyContainer>
            )} */}
            <TasksHeader
              onOrderChange={handleOrderChange}
              pageBackground={
                backgroundColor ? palette.aliceBlue : palette.white
              }
              bulkEditEnabled
              isGroupSelected={isGroupSelected}
              onGroupSelect={handleGroupSelect}
              sort={currentSort}
              onSortChange={onSortChange}
              groupHasMultipleAssignees={groupHasMultipleAssignees}
              origin={TaskOrigin.DASHBOARD}
            />
            <DragDropContext
              onBeforeDragStart={showClearSortFiltersModal}
              onDragEnd={({ destination, source }) => {
                if (!isSortApplied) {
                  if (destination) {
                    const { index: destinationIndex } = destination;
                    const { index: sourceIndex } = source;
                    const newTaskIdentifiers = [...tasks];
                    newTaskIdentifiers.splice(
                      destinationIndex,
                      0,
                      newTaskIdentifiers.splice(sourceIndex, 1)[0],
                    );

                    setNewTasks(newTaskIdentifiers);

                    const newTasksOrder = newTaskIdentifiers.map(
                      (taskIdentifier) => taskIdentifier,
                    );
                    dispatch(
                      reorderDashboardTasks(
                        groupType,
                        taskGroupIdentifier,
                        newTasksOrder,
                      ),
                    );
                  } else {
                    openModal('HomeScreenDragDrop');
                  }
                }
              }}
            >
              <Droppable droppableId={groupName} key={groupName}>
                {(providedDroppable) => {
                  return (
                    <DroppableBox
                      ref={providedDroppable.innerRef}
                      {...providedDroppable.droppableProps}
                    >
                      {tasks &&
                        tasks.map((task, index) => (
                          <Draggable
                            key={task?.taskIdentifier || task}
                            draggableId={String(task?.taskIdentifier || task)}
                            index={index}
                            isDragDisabled={isDragAndDropDisabled}
                          >
                            {(draggableProvided, { isDragging }) => (
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                              >
                                <DashboardTaskItemContainer>
                                  <TaskItem
                                    parentContainerReference={
                                      parentContainerReference
                                    }
                                    newlyCreated={
                                      (task?.taskIdentifier || task) ===
                                      lastCreatedTaskId
                                    }
                                    pageBackground={
                                      backgroundColor
                                        ? palette.aliceBlue
                                        : palette.white
                                    }
                                    taskItemIdentifier={task}
                                    isCompletedGroup={isCompletedGroup}
                                    isDragging={isDragging}
                                    dragHandleProps={
                                      draggableProvided.dragHandleProps
                                    }
                                    isDraggable={!isDragAndDropDisabled}
                                    onTaskUpdate={handleUpdateTask}
                                    updateWorkflowStatus={updateWorkflowStatus}
                                    multipleAssigneesContext={
                                      groupHasMultipleAssignees
                                    }
                                    subtasksDisabled
                                    isDashboardTask
                                    iconColorActive={iconColorActive}
                                    origin={TaskOrigin.DASHBOARD}
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
              <StickyContainer left={24} decreaseWidth={2 * 24}>
                <LoadMoreSection>
                  {dashboardTasksGroup?.moreTasksIndex &&
                    dashboardTasksGroup?.moreTasksIndex !== 0 && (
                      <LoadMoreButton
                        onClick={() =>
                          dispatch(
                            loadMoreDashboardTasksForGroup(
                              groupType,
                              taskGroupIdentifier,
                              currentSort?.key,
                              currentSort?.order,
                            ),
                          )
                        }
                      />
                    )}
                  {(!dashboardTasksGroup?.moreTasksIndex ||
                    dashboardTasksGroup?.moreTasksIndex === 0) && (
                    <span>Limiting results. Please refine filter.</span>
                  )}
                </LoadMoreSection>
              </StickyContainer>
            )}
            {isLoadingMore && <TasksSkeletonLoader rows={3} />}
          </DashboardTasksGroupList>
        </Collapse>
      )}
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
