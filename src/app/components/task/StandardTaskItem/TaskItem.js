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
} from 'helpers/task-helpers';
import DependencyIcon from 'img/dependency-icon.svg';
import DependencyListPopover from 'components/common/DependencyListPopover/DependencyListPopover';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import { useColumnsConfig } from 'context-api/columns-config-context';
import TaskItemCustomField from 'components/common/CustomField/TaskItemCustomField';
import StickyMainTaskItemCell from 'components/task/StickyMainTaskItemCell/StickyMainTaskItemCell';
import TaskItemCell from 'components/task/TaskItemCell/TaskItemCell';
import { CustomFieldWidthConfig } from 'helpers/field-type-helpers';
import {
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  SINGLE_TASK_FEATURES,
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
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

    const { columnsConfig, customColumnsConfig } = useColumnsConfig();
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
    const [isHovered, setIsHovered] = useState(false);
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

    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

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

    const onClickBulkEdit = () =>
      dispatch(selectTask(taskIdentifier, !selected));
    const onCloseContextMenu = () => {
      setContextMenu(null);
      dispatch(storeAsCurrentTask(null));
    };

    return (
      <>
        <StandardTaskItemPanel
          onContextMenu={handleTaskItemRightClick}
          isDragging={isDragging}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
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
            <StickyMainTaskItemCell
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
                  isHovered={isHovered}
                />
              )}
              <MainStandardTaskItemCell
                bolded
                paddingLeft="smallPlus"
                paddingRight="small"
                onClick={onClickTaskItem}
                position="static"
                isSubtask={showSubtaskStylingLink}
                isSticky
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
                {columnsConfig[TaskItemColumn.DESCRIPTION] && (
                  <>
                    <TaskItemDescription
                      disableMentions={restrictions?.mentions === DISABLED}
                      disabled={restrictions?.description === READ_ONLY}
                      task={task}
                      isCompletedGroup={isCompletedGroup}
                      highlightedValue={highlightedValue}
                      hasParentTaskLabel={hasParentTaskLabel}
                      isEditing={isEditingDescription}
                      setEditing={setEditingDescription}
                    />
                    <DetailsButton visible={isHovered}>Details</DetailsButton>
                  </>
                )}
              </MainStandardTaskItemCell>
              {columnsConfig[TaskItemColumn.DECISION_SELECT] &&
                showDecisionRow && (
                  <DecisionCellContainer>
                    <TaskItemDecision
                      outcomes={task.taskOutcomes}
                      dispatch={dispatch}
                      onSelect={chooseTaskDecisionOutcome}
                      task={task}
                      templateBundleIdentifier={templateBundleIdentifier}
                      disabled={isCompleted}
                      error={taskDecisionError}
                      clearError={() => setTaskDecisionError(false)}
                    />
                  </DecisionCellContainer>
                )}
            </StickyMainTaskItemCell>
            {columnsConfig[TaskItemColumn.SUBTASKS_COUNT] && (
              <TaskItemCell
                key={`subtask_count_${taskIdentifier}`}
                width={TaskItemColumnWidth[TaskItemColumn.SUBTASKS_COUNT]}
                justify="center"
                paddingLeft="tiny"
                paddingRight="tiny"
              >
                <TaskItemSubtasks
                  isSubtask={isSubtask}
                  subtaskQuickAddOpen={subtaskQuickAddOpen}
                  subtasksDisabled={subtasksDisabled}
                  subTasksCount={subTasksCount}
                  isHovered={isHovered}
                  isOpen={isOpen}
                  isNestedTask={isNestedTask}
                  onSubtaskLabelClick={onSubtaskLabelClick}
                  taskIdentifier={taskIdentifier}
                  openQuickAddSubtask={openQuickAddSubtask}
                  dispatch={dispatch}
                  readOnly={restrictions?.subtasks === READ_ONLY}
                />
              </TaskItemCell>
            )}
            {columnsConfig[TaskItemColumn.PATIENT] && (
              <TaskItemCell
                key={`patient_${taskIdentifier}`}
                width={TaskItemColumnWidth[TaskItemColumn.PATIENT]}
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
              </TaskItemCell>
            )}
            {columnsConfig[TaskItemColumn.WORKFLOW_STATUS] && (
              <TaskItemCell
                key={`task_status_${taskIdentifier}`}
                width={TaskItemColumnWidth[TaskItemColumn.WORKFLOW_STATUS]}
                paddingLeft="smallPlus"
                paddingRight="tiny"
                onContextMenu={event => {
                  event.stopPropagation();
                }}
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
              </TaskItemCell>
            )}
            {columnsConfig[TaskItemColumn.ACTIVITY] && (
              <TaskItemCell
                key={`activity_${taskIdentifier}`}
                width={TaskItemColumnWidth[TaskItemColumn.ACTIVITY]}
              >
                <TaskItemIcons
                  restrictions={restrictions}
                  matchComments={matchComments}
                  comments={comments}
                  isHovered={isHovered}
                  task={task}
                  matchLabels={matchLabels}
                  labels={labels}
                  matchAttachments={matchAttachments}
                  attachments={attachments}
                  dispatch={dispatch}
                />
              </TaskItemCell>
            )}
            {restrictions?.dueDate !== DISABLED && (
              <>
                {columnsConfig[TaskItemColumn.START_DATE] && (
                  <TaskItemCell
                    width={TaskItemColumnWidth[TaskItemColumn.START_DATE]}
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                  />
                )}
                {columnsConfig[TaskItemColumn.DUE_DATE] && !isTemplateTask && (
                  <TaskItemCell
                    key={`due_date_${taskIdentifier}`}
                    width={TaskItemColumnWidth[TaskItemColumn.DUE_DATE]}
                    paddingLeft="tiny"
                    paddingRight="tiny"
                    justify="center"
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                  >
                    <TaskItemDueDate task={task} isHovered={isHovered} />
                  </TaskItemCell>
                )}
              </>
            )}
            {columnsConfig[TaskItemColumn.ASSIGNED] && (
              <TaskItemCell
                key={`assigned_${taskIdentifier}`}
                width={TaskItemColumnWidth[TaskItemColumn.ASSIGNED].WIDE}
                justify={multipleAssigneesContext ? 'flex-start' : 'center'}
                paddingLeft="small"
                paddingRight="small"
                onContextMenu={event => {
                  event.stopPropagation();
                }}
              >
                <TaskItemMembers
                  readOnly={restrictions?.assigment === READ_ONLY}
                  multipleAssigneesContext={multipleAssigneesContext}
                  task={task}
                  assignedToUsers={assignedToUsers}
                  handleReasignTask={handleReasignTask}
                  matchAssignedTo={matchAssignedTo}
                />
              </TaskItemCell>
            )}
            {restrictions?.listName !== DISABLED &&
              columnsConfig[TaskItemColumn.LIST_NAME] && (
                <TaskItemCell
                  key={`list_${taskIdentifier}`}
                  width={TaskItemColumnWidth[TaskItemColumn.LIST_NAME]}
                >
                  <TaskItemList
                    listName={listName}
                    taskListIdentifier={taskListIdentifier}
                    taskStatus={task.status}
                  />
                </TaskItemCell>
              )}
            {restrictions?.customFields !== DISABLED && (
              <>
                {customColumnsConfig
                  .filter(f => f.isChecked)
                  .map(field => (
                    <TaskItemCell
                      key={`custom_${taskIdentifier}_${field.identifier}`}
                      padding="4px"
                      width={CustomFieldWidthConfig[field.fieldType]}
                    >
                      <TaskItemCustomField
                        field={field}
                        readOnly
                        customFieldValue={task?.taskMetaData?.find(
                          f => f.customFieldIdentifier === field.identifier,
                        )}
                        task={task}
                        isHovered={isHovered}
                      />
                    </TaskItemCell>
                  ))}
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
