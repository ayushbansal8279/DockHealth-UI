/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import pluck from 'ramda/src/pluck';
import { useDispatch, useSelector } from 'react-redux';
import { isTaskSelectedSelector } from 'selectors/task-drawer-selectors';
import { openTaskDrawerWithContent } from 'actions/task-drawer-actions';
import {
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
  getPriorityHighlighColor,
  TaskItemColumnWidth,
  isColumnChecked,
  PatientTaskItemColumn,
} from 'helpers/task-helpers';
import DependencyIcon from 'img/dependency-icon.svg';
import DependencyListPopover from 'components/common/DependencyListPopover/DependencyListPopover';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import TaskItemCustomField from 'components/common/CustomField/TaskItemCustomField';
import StickyMainTaskItemCell from 'components/task/StickyMainTaskItemCell/StickyMainTaskItemCell';
import TaskItemCell from 'components/task/TaskItemCell/TaskItemCell';
import {
  SINGLE_TASK_RESTRICTIONS_PROFILES,
  SINGLE_TASK_FEATURES,
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { Box } from '@material-ui/core';
import { updatePatientDetails } from 'actions/patient-details-actions';
import { getSubtaskStylingLink } from './helpers';
import TaskItemContextMenu from '../TaskItemContextMenu/TaskItemContextMenu';
import TaskItemBulkEdit from './TaskItemComponents/TaskItemBulkEdit';
import TaskItemDescription from './TaskItemComponents/TaskItemDescription';
import TaskItemPatient from './TaskItemComponents/TaskItemPatient';
import TaskItemStartDate from './TaskItemComponents/TaskItemStartDate';
import TaskItemDueDate from './TaskItemComponents/TaskItemDueDate';
import TaskItemDetails from './TaskItemComponents/TaskItemDetails';
import TaskItemCreatedDate from './TaskItemComponents/TaskItemCreatedDate';
import TaskItemCompletedDate from './TaskItemComponents/TaskItemCompletedDate';
import TaskItemElapsedTime from './TaskItemComponents/TaskItemElapsedTime';
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
  ActionIconsContainer,
} from '../styled';
import TaskItemText from './customFieldsTaskItemComponents/TaskItemText/TaskItemText';
import TaskItemDropdown from './customFieldsTaskItemComponents/TaskItemDropdown/TaskItemDropdown';
import TaskItemDate from './customFieldsTaskItemComponents/TaskItemDate';

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
    taskGroupIdentifier,
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
    highlightTasksOfTheSameParent,
    multipleAssigneesContext,
    isDashboardTask,
    openPatientPopover,
    templateBundleIdentifier,
    parentTaskGroupIdentifier,
    isSelectedByHighlighted,
    pageBackground,
    newlyCreated,
    parentContainerReference,
    patient: parentPatient,
    iconColorActive,
  }) => {
    const {
      taskIdentifier,
      assignedToUsers,
      creator,
      completedBy,
      completedDate,
      attachments,
      comments,
      labels,
      patient: taskPatient,
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
      hasEscalations,
      priority,
    } = task;

    const patient = taskPatient ?? parentTask?.patient ?? parentPatient;

    const { columns } = useTaskListColumnsConfig();
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
    const taskListRestrictions =
      TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
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

    const customHighlightItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) =>
          name === `list.taskgroup.highlight.color-${taskGroupIdentifier}`,
      ) || {};
    const customHighlightColor = customHighlightItem?.value || '';

    const hasPriorityHighlightItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.priority.highlighting.enabled',
      ) || {};
    const hasPriorityHighlight =
      hasPriorityHighlightItem && hasPriorityHighlightItem?.value === 'true';

    const customHighlight =
      customHighlightColor !== ''
        ? customHighlightColor
        : // eslint-disable-next-line unicorn/no-nested-ternary
        hasPriorityHighlight
        ? getPriorityHighlighColor(priority)
        : undefined;

    const [isPatientDataReadOnly] = useState(true);

    const handlePatientUpdate = useCallback(
      field => value => {
        const { patientIdentifier } = patient;
        dispatch(updatePatientDetails(patientIdentifier, { [field]: value }));
      },
      [dispatch, patient],
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

    const handlePriorityChange = useCallback(
      taskPriority => {
        onTaskUpdate(taskIdentifier, {
          priority: taskPriority.toUpperCase(),
        });
      },
      [onTaskUpdate, taskIdentifier],
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

    const handleReasignTask = useCallback(
      selectedMembers => {
        onTaskUpdate(taskIdentifier, {
          assignedToUsers: selectedMembers,
          assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
        });
        onTaskAssigned();
      },
      [onTaskUpdate, taskIdentifier],
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
    const hasParentTaskLabel = isSubtask && !isNestedTask && !!parentTask;

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
            hasEscalations={hasEscalations}
            customHighlight={customHighlight}
            isEditingDescription={isEditingDescription}
          >
            {taskListRestrictions?.createTask !== DISABLED && (
              <DotsContainer
                showDraggableDots={showDraggableDots}
                dragHandleProps={dragHandleProps}
              />
            )}
            {showPriority && (
              <PriorityIndicator color={getPriorityColor(task.priority)} />
            )}
            {showSubtaskStylingLink && getSubtaskStylingLink(isLast)}
            <ActionIconsContainer>
              {taskListRestrictions?.createTask !== DISABLED &&
                bulkEditEnabled && (
                  <TaskItemBulkEdit
                    isChecked={selected}
                    onClick={onClickBulkEdit}
                  />
                )}
              <Box ml="10px" />
              <CircleIcon
                src={isCompleted ? CircleCompleted : Circle}
                isClickable={
                  !isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted
                }
                isCompleted={isCompleted}
                onClick={
                  taskListRestrictions?.createTask !== DISABLED
                    ? onCircleClick
                    : () => {}
                }
              />
            </ActionIconsContainer>
            {content}
          </StickyMainTaskItemCell>
        );
      },
      [
        bulkEditEnabled,
        dragHandleProps,
        isCompleted,
        isDependencyEmptyOrCompleted,
        isEditingDescription,
        isLast,
        isSelected,
        hasEscalations,
        customHighlight,
        isTaskStatusTogglingDisabled,
        newlyCreated,
        onCircleClick,
        onClickBulkEdit,
        pageBackground,
        selected,
        showDraggableDots,
        showPriority,
        showSubtaskStylingLink,
        task.priority,
        taskListRestrictions,
      ],
    );

    const descriptionColumnOrder = getColumnOrder(TaskItemColumn.DESCRIPTION);
    return (
      <>
        <StandardTaskItemPanel
          onContextMenu={handleTaskItemRightClick}
          isDragging={isDragging}
        >
          <StandardTaskItemContainer
            newlyCreated={newlyCreated}
            isSelected={isSelected || selected}
            hasEscalations={hasEscalations}
            customHighlight={customHighlight}
            height={
              hasParentTaskLabel || isCompletedGroup
                ? EXTENDED_TASK_HEIGHT
                : STANDARD_TASK_HEIGHT
            }
            isAddingTask={false}
            iconColorActive={iconColorActive}
          >
            {randerFirstColumnCoverIfNecessary(
              <>
                <MainStandardTaskItemCell
                  width={
                    columns?.find(
                      ({ identifier }) =>
                        identifier === TaskItemColumn.DESCRIPTION,
                    )?.columnWidth -
                    (isSubtask &&
                    !hasParentTaskLabel &&
                    descriptionColumnOrder === 0
                      ? 36
                      : 0)
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
                    hasParentTaskLabel={hasParentTaskLabel}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.DESCRIPTION,
                      )?.columnWidth -
                      (isSubtask &&
                      !hasParentTaskLabel &&
                      descriptionColumnOrder === 0
                        ? 106
                        : 70)
                    }
                  />
                  {!isSubtask && (
                    <TaskItemSubtasks
                      isSubtask={isSubtask}
                      subtaskQuickAddOpen={subtaskQuickAddOpen}
                      subtasksDisabled={subtasksDisabled}
                      subTasksCount={subTasksCount}
                      isOpen={isOpen}
                      isNestedTask={isNestedTask}
                      onSubtaskLabelClick={onSubtaskLabelClick}
                      taskIdentifier={taskIdentifier}
                      // openQuickAddSubtask={openQuickAddSubtask}
                      dispatch={dispatch}
                      readOnly={restrictions?.subtasks === READ_ONLY}
                    />
                  )}
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
                        iconColorActive={iconColorActive}
                      />
                    </DecisionCellContainer>
                  )}
                </MainStandardTaskItemCell>
              </>,
              getColumnOrder(TaskItemColumn.DESCRIPTION),
            )}
            {/* <>
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
            </> */}

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
                      patient={patient || parentTask?.patient || parentPatient}
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
            {isColumnChecked(columns, PatientTaskItemColumn.GENDER) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`gender_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.GENDER,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.GENDER)}
                  >
                    <TaskItemDropdown
                      readOnly={isPatientDataReadOnly}
                      value={patient?.gender}
                      onChange={handlePatientUpdate('gender')}
                      field={{
                        options: [
                          {
                            identifier: 'male',
                            name: 'male',
                            color: '#00A2E5',
                          },
                          {
                            identifier: 'female',
                            name: 'female',
                            color: '#00A2E5',
                          },
                        ],
                        displayOptions: ['TASK_REQUIRED'],
                      }}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.GENDER),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.DOB) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_dob_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.DOB,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.DOB)}
                  >
                    <TaskItemDate
                      value={patient?.dob}
                      onChange={handlePatientUpdate('dob')}
                      readOnly={isPatientDataReadOnly}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.DOB),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.EMAIL) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_email_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.EMAIL,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.EMAIL)}
                  >
                    <TaskItemText
                      readOnly={isPatientDataReadOnly}
                      value={patient?.email}
                      onChange={handlePatientUpdate('email')}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.EMAIL),
                )}
              </>
            )}
            {isColumnChecked(columns, PatientTaskItemColumn.MRN) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`patient_MRN_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === PatientTaskItemColumn.MRN,
                      )?.columnWidth
                    }
                    order={getColumnOrder(PatientTaskItemColumn.MRN)}
                  >
                    <TaskItemText
                      readOnly={isPatientDataReadOnly}
                      value={patient?.mrn}
                      onChange={handlePatientUpdate('mrn')}
                    />
                  </TaskItemCell>,
                  getColumnOrder(PatientTaskItemColumn.MRN),
                )}
              </>
            )}

            {isColumnChecked(columns, TaskItemColumn.PRIORITY) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`priority_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.PRIORITY,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.PRIORITY)}
                  >
                    <TaskItemDropdown
                      value={task.priority}
                      onChange={handlePriorityChange}
                      field={{
                        options: [
                          {
                            identifier: 'HIGH',
                            name: 'High',
                            color: getPriorityColor('HIGH'),
                          },
                        ],
                        displayOptions: [],
                      }}
                      readOnly={false}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.PRIORITY),
                )}
              </>
            )}

            {isColumnChecked(columns, TaskItemColumn.WORKFLOW_STATUS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
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
                      readOnly={restrictions?.status === READ_ONLY}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.WORKFLOW_STATUS),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.COMMENTS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`comments_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.COMMENTS,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.COMMENTS)}
                  >
                    <TaskItemIcons
                      restrictions={restrictions}
                      matchComments={matchComments}
                      comments={comments}
                      task={task}
                      dispatch={dispatch}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.COMMENTS),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.LABELS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`labels_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.LABELS,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.LABELS)}
                  >
                    <TaskItemIcons
                      restrictions={restrictions}
                      task={task}
                      matchLabels={matchLabels}
                      labels={labels}
                      dispatch={dispatch}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.LABELS),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.FILES) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`files_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) => identifier === TaskItemColumn.FILES,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.FILES)}
                  >
                    <TaskItemIcons
                      restrictions={restrictions}
                      task={task}
                      matchAttachments={matchAttachments}
                      attachments={attachments}
                      dispatch={dispatch}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.FILES),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.START_DATE) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`start_date_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.START_DATE,
                      )?.columnWidth
                    }
                    paddingLeft="tiny"
                    paddingRight="tiny"
                    justify="center"
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.START_DATE)}
                  >
                    <TaskItemStartDate
                      task={task}
                      disabled={restrictions?.startDate === DISABLED}
                    />
                  </TaskItemCell>,
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
                      <TaskItemDueDate
                        task={task}
                        disabled={restrictions?.dueDate === DISABLED}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.DUE_DATE),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.ANCHOR_DATE) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.ANCHOR_DATE,
                      )?.columnWidth
                    }
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.ANCHOR_DATE)}
                  />,
                  getColumnOrder(TaskItemColumn.ANCHOR_DATE),
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
                    // eslint-disable-next-line sonarjs/no-duplicate-string
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
            {isColumnChecked(columns, TaskItemColumn.CREATED_BY) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`created_by_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.CREATED_BY,
                      )?.columnWidth
                    }
                    justify={multipleAssigneesContext ? 'flex-start' : 'center'}
                    paddingLeft="small"
                    paddingRight="small"
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.CREATED_BY)}
                    printWidth={
                      TaskItemColumnWidth[TaskItemColumn.CREATED_BY].PRINT
                    }
                  >
                    <TaskItemMembers
                      readOnly
                      multipleAssigneesContext={multipleAssigneesContext}
                      task={task}
                      assignedToUsers={[creator]}
                      handleReasignTask={null}
                      matchAssignedTo={matchAssignedTo}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.CREATED_BY),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.CREATED_DATE) &&
              !isTemplateTask && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`created_date_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.CREATED_DATE,
                        )?.columnWidth
                      }
                      paddingLeft="tiny"
                      paddingRight="tiny"
                      justify="center"
                      onContextMenu={event => {
                        event.stopPropagation();
                      }}
                      order={getColumnOrder(TaskItemColumn.CREATED_DATE)}
                    >
                      <TaskItemCreatedDate
                        task={task}
                        disabled={restrictions?.createdDate === DISABLED}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.CREATED_DATE),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.COMPLETED_DATE) &&
              !isTemplateTask && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`completed_date_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.COMPLETED_DATE,
                        )?.columnWidth
                      }
                      paddingLeft="tiny"
                      paddingRight="tiny"
                      justify="center"
                      onContextMenu={event => {
                        event.stopPropagation();
                      }}
                      order={getColumnOrder(TaskItemColumn.COMPLETED_DATE)}
                    >
                      <TaskItemCompletedDate
                        task={task}
                        disabled={restrictions?.completedDate === DISABLED}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.COMPLETED_DATE),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.COMPLETED_BY) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`completed_by_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.COMPLETED_BY,
                      )?.columnWidth
                    }
                    justify={multipleAssigneesContext ? 'flex-start' : 'center'}
                    paddingLeft="small"
                    paddingRight="small"
                    onContextMenu={event => {
                      event.stopPropagation();
                    }}
                    order={getColumnOrder(TaskItemColumn.COMPLETED_BY)}
                    printWidth={
                      TaskItemColumnWidth[TaskItemColumn.COMPLETED_BY].PRINT
                    }
                  >
                    <>
                      {completedDate && completedBy && (
                        <TaskItemMembers
                          readOnly
                          multipleAssigneesContext={multipleAssigneesContext}
                          task={task}
                          assignedToUsers={[completedBy]}
                          handleReasignTask={null}
                          matchAssignedTo={matchAssignedTo}
                        />
                      )}
                    </>
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.COMPLETED_BY),
                )}
              </>
            )}
            {isColumnChecked(columns, TaskItemColumn.ELAPSED_TIME) &&
              !isTemplateTask && (
                <>
                  {randerFirstColumnCoverIfNecessary(
                    <TaskItemCell
                      isSubtask={isSubtask}
                      key={`elapsed_time_${taskIdentifier}`}
                      width={
                        columns?.find(
                          ({ identifier }) =>
                            identifier === TaskItemColumn.ELAPSED_TIME,
                        )?.columnWidth
                      }
                      paddingLeft="tiny"
                      paddingRight="tiny"
                      justify="center"
                      onContextMenu={event => {
                        event.stopPropagation();
                      }}
                      order={getColumnOrder(TaskItemColumn.ELAPSED_TIME)}
                    >
                      <TaskItemElapsedTime
                        task={task}
                        disabled={restrictions?.elapsedTime === DISABLED}
                      />
                    </TaskItemCell>,
                    getColumnOrder(TaskItemColumn.ELAPSED_TIME),
                  )}
                </>
              )}
            {isColumnChecked(columns, TaskItemColumn.LIST_NAME) && (
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
            {isColumnChecked(columns, TaskItemColumn.TASK_DETAILS) && (
              <>
                {randerFirstColumnCoverIfNecessary(
                  <TaskItemCell
                    isSubtask={isSubtask}
                    key={`task_details_${taskIdentifier}`}
                    width={
                      columns?.find(
                        ({ identifier }) =>
                          identifier === TaskItemColumn.TASK_DETAILS,
                      )?.columnWidth
                    }
                    order={getColumnOrder(TaskItemColumn.TASK_DETAILS)}
                  >
                    <TaskItemDetails
                      task={task}
                      fieldIdentifier={TaskItemColumn.TASK_DETAILS}
                      onClick={onClickTaskItem}
                      readOnly={restrictions?.taskDetails === READ_ONLY}
                    />
                  </TaskItemCell>,
                  getColumnOrder(TaskItemColumn.TASK_DETAILS),
                )}
              </>
            )}
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
                              readOnly={
                                restrictions?.customFields === READ_ONLY
                              }
                            />
                          )}
                        </TaskItemCell>,
                        getColumnOrder(field.identifier),
                      )}
                    </>
                  );
                })}
            </>
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
