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
import {
  TASK_ITEM_DESCRIPTION_COLUMN,
  TASK_ITEM_DUE_DATE_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
  TASK_ITEM_LIST_COLUMN,
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_PATIENT_COLUMN,
  TASK_ITEM_SUBTASKS_COLUMN,
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
} from 'components/task/StandardTaskItem/helpers';
import DashboardColumnSortHeader from '../DashboardColumnSortHeader/DashboardColumnSortHeader';
import DashboardSingleSkeletonLoader from '../DashboardSkeletonLoader/DashboardSingleSkeletonLoader';
import { DashboardColumnKey } from '../config';
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
  [TASK_ITEM_DESCRIPTION_COLUMN]: { paddingLeft: '36px', paddingRight: '8px' },
  [TASK_ITEM_DUE_DATE_COLUMN]: { width: '60px' },
  [TASK_ITEM_WORFKLOW_STATUS_COLUMN]: { width: '120px' },
  [TASK_ITEM_LIST_COLUMN]: { width: '168px' },
  [TASK_ITEM_ICONS_COLUMN]: { width: '150px' },
  [TASK_ITEM_MEMBERS_COLUMN]: { width: '60px', extendedWidth: '90px' },
  [TASK_ITEM_PATIENT_COLUMN]: { width: '164px' },
  [TASK_ITEM_SUBTASKS_COLUMN]: {
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

const DYNAMIC_GRID_CONFIG = {
  [DashboardColumnKey.DESCRIPTION]: {
    key: TASK_ITEM_DESCRIPTION_COLUMN,
    ...TASK_ITEM_COLUMNS_CONFIG[TASK_ITEM_COLUMNS_CONFIG],
  },
  [DashboardColumnKey.DUE_DATE]: {
    key: TASK_ITEM_DUE_DATE_COLUMN,
    ...TASK_ITEM_COLUMNS_CONFIG[TASK_ITEM_DUE_DATE_COLUMN],
  },
  [DashboardColumnKey.WORKFLOW_STATUS]: {
    key: TASK_ITEM_WORFKLOW_STATUS_COLUMN,
    ...TASK_ITEM_COLUMNS_CONFIG[TASK_ITEM_WORFKLOW_STATUS_COLUMN],
  },
  [DashboardColumnKey.LIST_NAME]: {
    key: TASK_ITEM_LIST_COLUMN,
    ...TASK_ITEM_COLUMNS_CONFIG[TASK_ITEM_LIST_COLUMN],
  },
  [DashboardColumnKey.ACTIVITY]: {
    key: TASK_ITEM_ICONS_COLUMN,
    ...TASK_ITEM_COLUMNS_CONFIG[TASK_ITEM_ICONS_COLUMN],
  },
  [DashboardColumnKey.ASSIGNED]: {
    key: TASK_ITEM_MEMBERS_COLUMN,
    ...TASK_ITEM_COLUMNS_CONFIG[TASK_ITEM_MEMBERS_COLUMN],
  },
  [DashboardColumnKey.PATIENT]: {
    key: TASK_ITEM_PATIENT_COLUMN,
    ...TASK_ITEM_COLUMNS_CONFIG[TASK_ITEM_PATIENT_COLUMN],
  },
};

const getTaskItemConfig = dynamicColumns => DYNAMIC_GRID_CONFIG[dynamicColumns];

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
  dynamicColumns,
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

  const taskItemConfig = useMemo(
    () => dynamicColumns?.map(column => getTaskItemConfig(column)),
    [dynamicColumns],
  );

  const taskItemConfigKeys = useMemo(
    () => taskItemConfig?.map(column => column?.key),
    [taskItemConfig],
  );

  const dynamicColumnIsSelected = useCallback(
    column => taskItemConfigKeys?.includes(column),
    [taskItemConfigKeys],
  );

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
                {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_DESCRIPTION_COLUMN}
              >
                <DashboardColumnSortHeader
                  id="DESCRIPTION"
                  label="Task"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              </DashboardSortBarLabelName>
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_SUBTASKS_COLUMN}
              >
                Sub
              </DashboardSortBarLabelName>
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_PATIENT_COLUMN}
              >
                <DashboardColumnSortHeader
                  id="PATIENT"
                  label="Patient"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              </DashboardSortBarLabelName>
              {dynamicColumnIsSelected(TASK_ITEM_WORFKLOW_STATUS_COLUMN) && (
                <DashboardSortBarLabelName
                  {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_WORFKLOW_STATUS_COLUMN}
                >
                  <DashboardColumnSortHeader
                    id="WORKFLOW_STATUS"
                    label="Status"
                    sort={currentSort}
                    onSortChange={onSortChange}
                  />
                </DashboardSortBarLabelName>
              )}
              {dynamicColumnIsSelected(TASK_ITEM_ICONS_COLUMN) && (
                <DashboardSortBarLabelName
                  {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_ICONS_COLUMN}
                />
              )}
              <DashboardSortBarLabelName
                {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_DUE_DATE_COLUMN}
              >
                <DashboardColumnSortHeader
                  id="DUE_DATE"
                  label="Due"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              </DashboardSortBarLabelName>
              {dynamicColumnIsSelected(TASK_ITEM_MEMBERS_COLUMN) && (
                <DashboardSortBarLabelName
                  {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_MEMBERS_COLUMN}
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
                {...TASK_ITEM_COLUMNS_CONFIG.TASK_ITEM_LIST_COLUMN}
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
                                taskItemConfig={[
                                  ...taskItemConfigKeys,
                                  TASK_ITEM_PATIENT_COLUMN,
                                  TASK_ITEM_LIST_COLUMN,
                                ]}
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
