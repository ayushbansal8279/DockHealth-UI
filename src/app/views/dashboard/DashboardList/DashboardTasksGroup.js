/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicated-branches */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
} from 'react';
import moment from 'moment';

import { Collapse } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ArrowIcon from 'img/arrow';
import { Arrow } from 'components/tasklist/DropdownListSection/styled';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import Checkbox from 'components/common/Checkbox/Checkbox';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import StandardTaskItem from 'components/task/StandardTaskItem/TaskItem';
import { TaskItemColumn } from 'helpers/task-helpers';
import DashboardColumnSortHeader from '../DashboardColumnSortHeader/DashboardColumnSortHeader';
import DashboardSingleSkeletonLoader from '../DashboardSkeletonLoader/DashboardSingleSkeletonLoader';
import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupLabelName,
  DashboardTasksGroupList,
  DroppableBox,
  DashboardSortBar,
  DashboardSortBarLabelName,
  DashboardTasksGroupHeader,
  GroupNameSectionWrapper,
  BulkContainer,
} from './styled';

const TASK_ITEM_COLUMNS_CONFIG = {
  [TaskItemColumn.DESCRIPTION]: { paddingLeft: '36px', paddingRight: '8px' },
  [TaskItemColumn.DUE_DATE]: { width: '60px' },
  [TaskItemColumn.WORKFLOW_STATUS]: { width: '120px' },
  [TaskItemColumn.LIST_NAME]: { width: '168px' },
  [TaskItemColumn.ACTIVITY]: { width: '150px' },
  [TaskItemColumn.ASSIGNED]: { width: '60px', extendedWidth: '90px' },
  [TaskItemColumn.PATIENT]: { width: '164px' },
  [TaskItemColumn.SUBTASKS_COUNT]: {
    width: '60px',
    paddingLeft: '18px',
    paddingRight: '18px',
  },
};

const TODAY_GROUP = 'TODAY';
const NEXT_7_DAYS_GROUP = 'NEXT_7_DAYS';
const NO_DUE_DATE_GROUP = 'NO_DUE_DATE';
const GROUPS_WITH_QUICK_ADD_TASK_INPUT = [
  TODAY_GROUP,
  NEXT_7_DAYS_GROUP,
  NO_DUE_DATE_GROUP,
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

  const { bunchBulkEditTaskActions } = useContext(BulkEditContext);
  const { groupActions } = bunchBulkEditTaskActions;

  const onClickGroupBulkEdit = useCallback(
    () =>
      groupActions?.onClickBulkEditGroup({
        parentTasks: tasks.filter(t => !t.parentTaskIdentifier),
        subtasks: tasks.filter(t => t.parentTaskIdentifier),
      }),
    [groupActions, tasks],
  );

  const groupIsCheckedByBulkEdit = useMemo(
    () =>
      groupActions?.getGroupIsSelectedInBulkEdit(
        tasks.filter(t => !t.parentTaskIdentifier),
        tasks.filter(t => t.parentTaskIdentifier),
      ),
    [groupActions, tasks],
  );

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
            <DashboardSortBar>
              {bunchBulkEditTaskActions && (
                <BulkContainer>
                  <Checkbox
                    isChecked={groupIsCheckedByBulkEdit}
                    onClick={onClickGroupBulkEdit}
                  />
                </BulkContainer>
              )}
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.DESCRIPTION]}
              >
                <DashboardColumnSortHeader
                  id="DESCRIPTION"
                  label="Task"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              </DashboardSortBarLabelName>
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.SUBTASKS_COUNT]}
              >
                Sub
              </DashboardSortBarLabelName>
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.PATIENT]}
              >
                <DashboardColumnSortHeader
                  id="PATIENT"
                  label="Patient"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              </DashboardSortBarLabelName>
              {columnsConfig[TaskItemColumn.WORKFLOW_STATUS] && (
                <DashboardSortBarLabelName
                  {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.WORKFLOW_STATUS]}
                >
                  <DashboardColumnSortHeader
                    id="WORKFLOW_STATUS"
                    label="Status"
                    sort={currentSort}
                    onSortChange={onSortChange}
                  />
                </DashboardSortBarLabelName>
              )}
              {columnsConfig[TaskItemColumn.ACTIVITY] && (
                <DashboardSortBarLabelName
                  {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.ACTIVITY]}
                />
              )}
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.DUE_DATE]}
              >
                <DashboardColumnSortHeader
                  id="DUE_DATE"
                  label="Due"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              </DashboardSortBarLabelName>
              {columnsConfig[TaskItemColumn.ASSIGNED] && (
                <DashboardSortBarLabelName
                  {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.ASSIGNED]}
                  groupHasMultipleAssignees={groupHasMultipleAssignees}
                >
                  <DashboardColumnSortHeader
                    id="ASSIGNED"
                    sort={currentSort}
                    onSortChange={onSortChange}
                    label={groupHasMultipleAssignees ? 'Assign' : 'Asgn'}
                  />
                </DashboardSortBarLabelName>
              )}
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG[TaskItemColumn.LIST_NAME]}
              >
                <DashboardColumnSortHeader
                  id="LIST_NAME"
                  label="List"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              </DashboardSortBarLabelName>
            </DashboardSortBar>
            <DragDropContext
              onBeforeDragStart={showClearSortFiltersModal}
              onDragEnd={({ destination, source }) => {
                if (!isSortApplied) {
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
                              <StandardTaskItem
                                task={task}
                                toggleTaskComplete={() =>
                                  toggleDashboardTaskComplete(task)
                                }
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
