/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { pluck } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { isTaskSelectedSelector } from 'selectors/task-drawer-selectors';
import { openTaskDrawerWithContent } from 'actions/task-drawer-actions';
import {
  openQuickAddSubtask,
  selectTask,
  storeAsCurrentTask,
  chooseTaskDecisionOutcome,
} from 'actions/task-actions';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import ThreeDotsIcon from 'img/three-dots.svg';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import {
  onTaskAssigned,
  onTaskCompleted,
  onSubtaskCompleted,
  onTaskReActivated,
  onSubtaskReActivated,
  onTaskStatusChanged,
} from 'helpers/ga-event-helper';
import {
  checkIfTemplateTask,
  TaskItemColumn,
  TaskPriority,
  getPriorityColor,
  TaskItemColumnWidth,
  isColumnChecked,
} from 'helpers/task-helpers';
import DependencyIcon from 'img/dependency-icon.svg';
import DependencyListPopover from 'components/common/DependencyListPopover/DependencyListPopover';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import { useColumnsConfig } from 'context-api/columns-config-context';
import TaskItemCustomField from 'components/common/CustomField/TaskItemCustomField';
import StickyMainTaskItemCell from 'components/task/StickyMainTaskItemCell/StickyMainTaskItemCell';
import TaskItemCell from 'components/task/TaskItemCell/TaskItemCell';
import {
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  SINGLE_TASK_FEATURES,
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { Box } from '@material-ui/core';
import { getSubtaskStylingLink } from './helpers';
import TaskItemContextMenu from '../TaskItemContextMenu/TaskItemContextMenu';
import TaskItemBulkEdit from './TaskItemComponents/TaskItemBulkEdit';
import TaskItemDescription from './TaskItemComponents/TaskItemDescription';
import TaskItemPatient from './TaskItemComponents/TaskItemPatient';
import TaskItemDueDate from './TaskItemComponents/TaskItemDueDate';
import TaskItemSubtasks from './TaskItemComponents/TaskItemSubtasks';
import TaskItemIcons from './TaskItemComponents/TaskItemIcons';
import TaskItemMembers from './TaskItemComponents/TaskItemMembers';
import TaskItemList from './TaskItemComponents/TaskItemList';
import TaskItemWorkflowStatus from './TaskItemComponents/TaskItemWorkflowStatus';
import TaskItemDecision from './TaskItemComponents/TaskItemDecision';
import {
  CircleIcon,
  MainStandardTaskItemCell,
  StandardTaskItemContainer,
  StandardTaskItemPanel,
  StandardTaskThreeDots,
  PriorityIndicator,
  DependencyIconContainer,
  DetailsButton,
  DecisionCellContainer,
} from '../styled';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const STANDARD_TASK_HEIGHT = 35;
const EXTENDED_TASK_HEIGHT = 50;

const DotsContainer = ({ showDraggableDots, dragHandleProps }) => {
  if (showDraggableDots)
    return <StandardTaskThreeDots src={ThreeDotsIcon} {...dragHandleProps} />;

  return null;
};
const TaskItem = React.memo(
  ({
    isOpen,
    switchOpen,
    toggleCompleteTask,
    task,
    dragHandleProps,
    isDragging,
    isCompletedGroup,
    onTaskUpdate,
    updateWorkflowStatus,
    dragAndDropDisabled,
    parentHasPatient,
    highlightedValue,
    isDraggable,
    isLast,
    showSubtaskStylingLink,
    isNestedTask = false,
    subtasksDisabled,
    multipleAssigneesContext,
    highlightTasksOfTheSameParent,
    isDashboardTask,
    openPatientPopover,
    templateBundleIdentifier,
    parentTaskGroupIdentifier,
    isSelectedByHighlighted,
    pageBackground,
    newlyCreated,
    parentContainerReference,
    listContainsWorkflow,
  }) => {
    const {
      taskIdentifier,
      assignedToUsers,
      attachments,
      comments,
      labels,
      patient,
      workflowStatus,
      taskList = {},
      parentTaskIdentifier,
      searchMetaData = {},
      parentTask,
      subtaskQuickAddOpen,
      selected,
      subTasksCount,
      dependencyTasksCompletedCount,
      dependencyTasksCount,
    } = task;

    const { columns } = useColumnsConfig();
    const { listName, taskListIdentifier } = taskList || {};
    const isCompleted = task.status === 'COMPLETE';
    const isTemplateTask = checkIfTemplateTask(task);
    const isSubtask = !!parentTaskIdentifier;
    const isDecisionTask = task.intentType === 'DECISION';
    const isDecisionSelected = task.taskOutcomes?.reduce(
      (accumulator, currentValue) => accumulator || currentValue.isSelected,
      false,
    );

    const isTaskStatusTogglingDisabled =
      isTemplateTask ||
      (isSubtask && isCompletedGroup) ||
      (isDecisionTask && !isDecisionSelected);

    const isDependencyEmptyOrCompleted =
      dependencyTasksCount === dependencyTasksCompletedCount;

    const {
      matchAssignedTo,
      matchAttachments,
      matchComments,
      matchLabels,
      matchPatient,
      matchPatientMRN,
      matchWorkflowStatus,
    } = searchMetaData;

    const currentUser = useSelector(userProfileSelector);
    const restrictions =
      SINGLE_TASK_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
    const isSelected = useSelector(
      isTaskSelectedSelector(taskIdentifier, isSelectedByHighlighted),
    );
    const [taskDecisionError, setTaskDecisionError] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const dispatch = useDispatch();
    const dependencyIconReference = useRef(null);
    const [isEditingDescription, setEditingDescription] = useState(false);
    const [
      dependencyPopoverOpen,
      openDependencyPopover,
      closeDependencyPopover,
    ] = useBooleanWithTimeout(false);
    const { move, duplicate, subtasks, delete: del } = SINGLE_TASK_FEATURES;

    const showContextMenu = [move, duplicate, subtasks, del].reduce(
      (accumulator, element) => {
        if (accumulator) return accumulator;
        if (
          restrictions?.[element] === DISABLED ||
          restrictions?.[element] === READ_ONLY
        )
          return false;
        return true;
      },
      false,
    );

    const { bulkEditEnabled } = useContext(BulkEditContext);

    const selectedOrganization = useSelector(selectedUserOrganizationSelector);

    const handleTaskItemRightClick = useCallback(
      event => {
        event.preventDefault();
        if (showContextMenu) {
          setContextMenu({ x: event.pageX, y: event.pageY });
          dispatch(storeAsCurrentTask(task));
        }
      },
      [dispatch, showContextMenu, task],
    );

    useEffect(() => {
      if (parentContainerReference?.current && newlyCreated) {
        parentContainerReference.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
      }
    }, [newlyCreated, parentContainerReference]);

    const onClickTaskItem = useCallback(
      () =>
        dispatch(
          openTaskDrawerWithContent(
            templateBundleIdentifier
              ? {
                  ...task,
                  taskGroupIdentifier: parentTaskGroupIdentifier,
                  templateBundleIdentifier,
                }
              : task,
          ),
        ),
      [dispatch, parentTaskGroupIdentifier, task, templateBundleIdentifier],
    );

    const onCircleClick = useCallback(
      event => {
        if (!isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted) {
          setTaskDecisionError(false);
          toggleCompleteTask({ ...task, templateBundleIdentifier });
          if (!isSubtask) {
            (isCompleted ? onTaskReActivated : onTaskCompleted)();
          } else {
            (isCompleted ? onSubtaskReActivated : onSubtaskCompleted)();
          }
        } else if (!isDecisionSelected) {
          setTaskDecisionError(true);
        }

        event.stopPropagation();
      },
      [
        templateBundleIdentifier,
        isTaskStatusTogglingDisabled,
        isSubtask,
        isCompleted,
        toggleCompleteTask,
        task,
        isDependencyEmptyOrCompleted,
        isDecisionSelected,
      ],
    );

    const onSubtaskLabelClick = useCallback(
      event => {
        event.stopPropagation();
        if (!subtasksDisabled) {
          if (!isOpen) {
            switchOpen(true);
          } else {
            switchOpen(!isOpen);
          }
        } else {
          highlightTasksOfTheSameParent(
            task.parentTaskIdentifier || task.taskIdentifier,
          );
        }
      },
      [
        subtasksDisabled,
        isOpen,
        switchOpen,
        highlightTasksOfTheSameParent,
        task.parentTaskIdentifier,
        task.taskIdentifier,
      ],
    );

    const handleReasignTask = useCallback(
      selectedMembers => {
        onTaskUpdate(taskIdentifier, {
          assignedToUsers: selectedMembers,
          assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
          assignedBy: selectedMembers?.length ? currentUser : null,
        });
        onTaskAssigned();
      },
      [currentUser, onTaskUpdate, taskIdentifier],
    );

    const handleUpdateWorkflowStatus = useCallback(
      value => {
        updateWorkflowStatus(task, value);
        onTaskStatusChanged(value);
      },
      [updateWorkflowStatus, task],
    );

    const showDraggableDots = !dragAndDropDisabled && isDraggable;
    const showPriority = task.priority && task.priority !== TaskPriority.NONE;
    const showDecisionRow = task.intentType === 'DECISION' && !isTemplateTask;
    const hasParentTaskLabel = isSubtask && !isNestedTask && parentTask;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onClickBulkEdit = () =>
      dispatch(selectTask(taskIdentifier, !selected));
    const onCloseContextMenu = () => {
      setContextMenu(null);
      dispatch(storeAsCurrentTask(null));
    };

    const getColumnOrder = useCallback(
      TaskItemColumnType =>
        columns?.findIndex(c => c.identifier === TaskItemColumnType),
      [columns],
    );

    const randerFirstColumnCoverIfNecessary = useCallback(
      (content, order) => {
        if (order !== 0) return content;
        return (
          <StickyMainTaskItemCell
            customWidthExists
            order={0}
            isSubtask={showSubtaskStylingLink}
            newlyCreated={newlyCreated}
            backgroundColor={pageBackground}
            isSelected={isSelected || selected}
            isEditingDescription={isEditingDescription}
          >
            <DotsContainer
              showDraggableDots={showDraggableDots}
              dragHandleProps={dragHandleProps}
            />
            {showPriority && (
              <PriorityIndicator color={getPriorityColor(task.priority)} />
            )}
            {showSubtaskStylingLink && getSubtaskStylingLink(isLast)}
            {bulkEditEnabled && (
              <TaskItemBulkEdit
                isChecked={selected}
                onClick={onClickBulkEdit}
              />
            )}
            <Box ml={listContainsWorkflow ? '54px' : '0px'} />
            {content}
          </StickyMainTaskItemCell>
        );
      },
      [
        bulkEditEnabled,
        dragHandleProps,
        isEditingDescription,
        isLast,
        isSelected,
        listContainsWorkflow,
        newlyCreated,
        onClickBulkEdit,
        pageBackground,
        selected,
        showDraggableDots,
        showPriority,
        showSubtaskStylingLink,
        task.priority,
      ],
    );

    return (
      <>
        <StandardTaskItemPanel
          onContextMenu={handleTaskItemRightClick}
          isDragging={isDragging}
        >
          <StandardTaskItemContainer
            newlyCreated={newlyCreated}
            isSelected={isSelected || selected}
            height={
              hasParentTaskLabel || isCompletedGroup
                ? EXTENDED_TASK_HEIGHT
                : STANDARD_TASK_HEIGHT
            }
            isAddingTask={false}
          >
            {randerFirstColumnCoverIfNecessary(
              <>
                <MainStandardTaskItemCell
                  width={
                    columns?.find(
                      ({ identifier }) =>
                        identifier === TaskItemColumn.DESCRIPTION,
                    )?.columnWidth
                  }
                  order={getColumnOrder(TaskItemColumn.DESCRIPTION)}
                  bolded
                  paddingLeft="smallPlus"
                  paddingRight="small"
                  onClick={onClickTaskItem}
                  position="static"
                  isSubtask={isSubtask}
                  isSticky
                  printWidth={300}
                >
                  <CircleIcon
                    src={isCompleted ? CircleCompleted : Circle}
                    isClickable={
                      !isTaskStatusTogglingDisabled &&
                      isDependencyEmptyOrCompleted
                    }
                    isCompleted={isCompleted}
                    onClick={onCircleClick}
                  />

                  {!isDependencyEmptyOrCompleted && (
                    <>
                      <DependencyIconContainer
                        onMouseEnter={openDependencyPopover}
                        onMouseLeave={closeDependencyPopover}
                        ref={dependencyIconReference}
                      >
                        <img src={DependencyIcon} alt="search" />
                        {dependencyIconReference.current && (
                          <DependencyListPopover
                            anchorEl={dependencyIconReference.current}
                            open={dependencyPopoverOpen}
                            dependencyTasksCount={dependencyTasksCount}
                            task={task}
                          />
                        )}
                      </DependencyIconContainer>
                    </>
                  )}
                  <TaskItemDescription
                    disableMentions={restrictions?.mentions === DISABLED}
                    disabled={restrictions?.description === READ_ONLY}
                    task={task}
                    isCompletedGroup={isCompletedGroup}
                    highlightedValue={highlightedValue}
                    isSubtask={isSubtask}
                    isEditing={isEditingDescription}
                    setEditing={setEditingDescription}
                  />
                  <DetailsButton>Details</DetailsButton>
                  {showDecisionRow && (
                    <DecisionCellContainer
                      onClick={event => event.stopPropagation()}
                    >
                      <TaskItemDecision
                        outcomes={task.taskOutcomes}
                        dispatch={dispatch}
                        onSelect={chooseTaskDecisionOutcome}
                        task={task}
                        templateBundleIdentifier={templateBundleIdentifier}
                        disabled={isCompleted || !isDependencyEmptyOrCompleted}
                        error={taskDecisionError}
                        clearError={() => setTaskDecisionError(false)}
                      />
                    </DecisionCellContainer>
                  )}
                </MainStandardTaskItemCell>
              </>,
              getColumnOrder(TaskItemColumn.DESCRIPTION),
            )}
            <>
              {randerFirstColumnCoverIfNecessary(
                <TaskItemCell
                  isSubtask={isSubtask}
                  key={`subtask_count_${taskIdentifier}`}
                  width={
                    columns?.find(
                      ({ identifier }) =>
                        identifier === TaskItemColumn.SUBTASKS_COUNT,
                    )?.columnWidth
                  }
                  order={getColumnOrder(TaskItemColumn.SUBTASKS_COUNT)}
                  justify="center"
                  paddingLeft="tiny"
                  paddingRight="tiny"
                >
                  <TaskItemSubtasks
                    isSubtask={isSubtask}
                    subtaskQuickAddOpen={subtaskQuickAddOpen}
                    subtasksDisabled={subtasksDisabled}
                    subTasksCount={subTasksCount}
                    isOpen={isOpen}
                    isNestedTask={isNestedTask}
                    onSubtaskLabelClick={onSubtaskLabelClick}
                    taskIdentifier={taskIdentifier}
                    openQuickAddSubtask={openQuickAddSubtask}
                    dispatch={dispatch}
                    readOnly={restrictions?.subtasks === READ_ONLY}
                  />
                </TaskItemCell>,
                getColumnOrder(TaskItemColumn.SUBTASKS_COUNT),
              )}
            </>

            {isColumnChecked(columns, TaskItemColumn.PATIENT) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.PATIENT,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.PATIENT)}
                  >
                    <TaskItemPatient
                      highlightedValue={highlightedValue}
                      taskStatus={task?.status}
                      isSubtask={isSubtask}
                      parentHasPatient={parentHasPatient}
                      hasParentTaskLabel={hasParentTaskLabel}
                      matchPatientMRN={matchPatientMRN}
                      patient={patient || parentTask?.patient}
                      matchPatient={matchPatient}
                      task={task}
                      openPatientPopover={openPatientPopover}
                      onTaskUpdate={onTaskUpdate}
                      currentUser={currentUser}
                      readOnly={restrictions?.patient === READ_ONLY}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.PATIENT),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.WORKFLOW_STATUS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`task_status_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.WORKFLOW_STATUS,
                      )?.columnWidth
                    }
                    paddingLeft="smallPlus"
                    paddingRight="tiny"
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.WORKFLOW_STATUS)}
                  >
                    <TaskItemWorkflowStatus
                      task={task}
                      updateWorkflowStatus={handleUpdateWorkflowStatus}
                      workflowStatus={workflowStatus}
                      matchWorkflowStatus={matchWorkflowStatus}
                      highlightedValue={highlightedValue}
                      showDefaultTaskStatusCompleted={
                        selectedOrganization?.showDefaultTaskStatusCompleted
                      }
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.WORKFLOW_STATUS),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.ACTIVITY) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`activity_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.ACTIVITY,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.ACTIVITY)}
                  >
                    <TaskItemIcons
                      restrictions={restrictions}
                      matchComments={matchComments}
                      comments={comments}
                      task={task}
                      matchLabels={matchLabels}
                      labels={labels}
                      matchAttachments={matchAttachments}
                      attachments={attachments}
                      dispatch={dispatch}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.ACTIVITY),
                )}
              </>
            )}
            {restrictions?.dueDate !== DISABLED && (
              <>
                {isColumnChecked(columns, TaskItemColumn.START_DATE) && (
                  <>
                    {randerFirstColumnCoverIfNecessary(
                      <TaskItemCell
                        isSubtask={isSubtask}
                        width={
                          columns?.find(
                            ({ identifier }) =>
                              identifier === TaskItemColumn.START_DATE,
                          )?.columnWidth
                        }
                        onContextMenu={event => {
                          event.stopPropagation();
                        }}
                        order={getColumnOrder(TaskItemColumn.START_DATE)}
                      />,
                      getColumnOrder(TaskItemColumn.START_DATE),
                    )}
                  </>
                )}
                {isColumnChecked(columns, TaskItemColumn.DUE_DATE) &&
                  !isTemplateTask && (
                    <>
                      {randerFirstColumnCoverIfNecessary(
                        <TaskItemCell
                          isSubtask={isSubtask}
                          key={`due_date_${taskIdentifier}`}
                          width={
                            columns?.find(
                              ({ identifier }) =>
                                identifier === TaskItemColumn.DUE_DATE,
                            )?.columnWidth
                          }
                          paddingLeft="tiny"
                          paddingRight="tiny"
                          justify="center"
                          onContextMenu={event => {
                            event.stopPropagation();
                          }}
                          order={getColumnOrder(TaskItemColumn.DUE_DATE)}
                        >
                          <TaskItemDueDate task={task} />
                        </TaskItemCell>,
                        getColumnOrder(TaskItemColumn.DUE_DATE),
                      )}
                    </>
                  )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.ASSIGNED) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`assigned_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.ASSIGNED,
                      )?.columnWidth
                    }
                    justify={multipleAssigneesContext ? 'flex-start' : 'center'}
                    paddingLeft="small"
                    paddingRight="small"
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.ASSIGNED)}
                    printWidth={
                      TaskItemColumnWidth[TaskItemColumn.ASSIGNED].PRINT
                    }
                  >
                    <TaskItemMembers
                      readOnly={restrictions?.assigment === READ_ONLY}
                      multipleAssigneesContext={multipleAssigneesContext}
                      task={task}
                      assignedToUsers={assignedToUsers}
                      handleReasignTask={handleReasignTask}
                      matchAssignedTo={matchAssignedTo}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.ASSIGNED),
                )}
              </>
            )}
            {restrictions?.listName !== DISABLED &&
              isColumnChecked(columns, TaskItemColumn.LIST_NAME) && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`list_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.LIST_NAME,
                        )?.columnWidth
                      }
                      order={getColumnOrder(TaskItemColumn.LIST_NAME)}
                    >
                      <TaskItemList
                        listName={listName}
                        taskListIdentifier={taskListIdentifier}
                        taskStatus={task.status}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.LIST_NAME),
                  )}
                </>
              )}
            {restrictions?.customFields !== DISABLED && (
              <>
                {columns
                  .filter(
                    f =>
                      f.isChecked &&
                      f._customFieldType !== CUSTOM_FIELD_TYPES.REGULAR,
                  )
                  .map(field => {
                    const taskCustomFieldValue = task?.taskMetaData?.find(
                      f => f?.customFieldIdentifier === field.identifier,
                    );
                    const patientCustomFieldValue = task?.patient?.patientMetaData?.find(
                      f => f?.customFieldIdentifier === field.identifier,
                    );
                    const customFieldValue =
                      field.targetType === CUSTOM_FIELD_TYPES.PATIENT
                        ? patientCustomFieldValue
                        : taskCustomFieldValue;

                    const hidePatientCustomFields =
                      field.targetType === CUSTOM_FIELD_TYPES.PATIENT &&
                      !task?.patient?.patientIdentifier;
                    return (
                      <>
                        {randerFirstColumnCoverIfNecessary(
                          <TaskItemCell
                            isSubtask={isSubtask}
                            key={`custom_${taskIdentifier}_${field.identifier}`}
                            padding="4px"
                            width={field.columnWidth}
                            order={getColumnOrder(field.identifier)}
                          >
                            {!hidePatientCustomFields && (
                              <TaskItemCustomField
                                field={field}
                                customFieldValue={customFieldValue}
                                task={task}
                              />
                            )}
                          </TaskItemCell>,
                          getColumnOrder(field.identifier),
                        )}
                      </>
                    );
                  })}
              </>
            )}
          </StandardTaskItemContainer>
        </StandardTaskItemPanel>
        {showContextMenu && contextMenu && (
          <TaskItemContextMenu
            restrictions={restrictions}
            position={contextMenu}
            task={task}
            onClose={onCloseContextMenu}
            subtasksDisabled={subtasksDisabled}
            isDashboardTask={isDashboardTask}
            currentList={taskList}
          />
        )}
      </>
    );
  },
);

export default TaskItem;
