/* eslint-disable import/extensions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { pluck } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState } from 'draft-js';
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
import { userProfileSelector } from 'selectors/user-selectors';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
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
  checkColumnIsInConfig,
  TaskItemColumn,
  TASK_ITEM_BASE_COLUMN_CONFIG,
} from 'helpers/task-helpers';
import dependencyIcon from 'img/dependency-icon.svg';
import DependencyListPopover from 'components/common/DependencyListPopover/DependencyListPopover';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import { getSubtaskStylingLink } from './helpers';
import {
  CircleIcon,
  MainStandardTaskItemCell,
  StandardTaskItemContainer,
  StandardTaskItemPanel,
  StandardTaskThreeDots,
  PriorityIndicator,
  DependencyIconContainer,
} from '../styled';
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

const STANDARD_TASK_HEIGHT = 35;
const EXTENDED_TASK_HEIGHT = 50;

const DotsContainer = ({ showDraggableDots, dragHandleProps }) => {
  if (showDraggableDots)
    return <StandardTaskThreeDots src={ThreeDotsIcon} {...dragHandleProps} />;

  return null;
};
const TaskItem = ({
  isOpen,
  switchOpen,
  toggleCompleteTask,
  task,
  dragHandleProps,
  isDragging,
  isCompletedGroup,
  onTaskUpdate,
  updateDueDate,
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
  taskItemConfig = {},
  isDashboardTask,
  openPatientPopover,
  templateBundleIdentifier,
  parentTaskGroupIdentifier,
  isSelectedByHighlighted,
}) => {
  const {
    taskIdentifier,
    edited,
    duplicated,
    type,
    assignedToUsers,
    attachments,
    comments,
    description,
    tokenizedDescription,
    taskMentions,
    labels,
    patient,
    workflowStatus,
    completedDt,
    completedBy,
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
    matchDescription,
    matchLabels,
    matchPatient,
    matchPatientMRN,
    matchWorkflowStatus,
  } = searchMetaData;

  const currentUser = useSelector(userProfileSelector);
  const isSelected = useSelector(
    isTaskSelectedSelector(taskIdentifier, isSelectedByHighlighted),
  );
  const [isHovered, setIsHovered] = useState(false);
  const [taskDecisionError, setTaskDecisionError] = useState(false);
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
      handleRichText: false,
    }),
  );
  const [contextMenu, setContextMenu] = useState(null);
  const dispatch = useDispatch();
  const previousDescription = useRef(null);
  const dependencyIconReference = useRef(null);

  const [
    dependencyPopoverOpen,
    openDependencyPopover,
    closeDependencyPopover,
  ] = useBooleanWithTimeout();

  const { bulkEditEnabled } = useContext(BulkEditContext);

  const handleTaskItemRightClick = useCallback(
    event => {
      event.preventDefault();
      setContextMenu({ x: event.pageX, y: event.pageY });
      dispatch(storeAsCurrentTask(task));
    },
    [dispatch, task],
  );

  useEffect(() => {
    if (previousDescription.current !== null) {
      const newContent = createMentionEntities(
        tokenizedDescription,
        description,
        taskMentions,
        false,
      );
      setDescriptionState(EditorState.push(descriptionState, newContent));
    }
    previousDescription.current = description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

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
  const showPriority = task.priority === 'HIGH';
  const showDecisionRow = task.intentType === 'DECISION' && !isTemplateTask;

  const hasParentTaskLabel = isSubtask && !isNestedTask && parentTask;

  const mergedTaskItemConfig = useMemo(
    () => ({
      ...TASK_ITEM_BASE_COLUMN_CONFIG,
      ...taskItemConfig,
    }),
    [taskItemConfig],
  );

  const onClickBulkEdit = () => dispatch(selectTask(taskIdentifier, !selected));
  const onCloseContextMenu = () => {
    setContextMenu(null);
    dispatch(storeAsCurrentTask(null));
  };

  const isEdited = type === 'TEMPLATE' ? false : edited;
  const isDuplicated = type === 'TEMPLATE' ? false : duplicated;

  const {
    descriptionIsInCofnig,
    subtasksIsInConfig,
    patientIsInConfig,
    workflowStatusIsInConfig,
    activityIsInConfig,
    dueDateIsInConfig,
    assignedIsInConfig,
    listNameIsInConfig,
    decisionInConfig,
  } = useMemo(() => {
    return {
      descriptionIsInCofnig: checkColumnIsInConfig(
        TaskItemColumn.DESCRIPTION,
        mergedTaskItemConfig,
      ),
      subtasksIsInConfig: checkColumnIsInConfig(
        TaskItemColumn.SUBTASKS_COUNT,
        mergedTaskItemConfig,
      ),
      patientIsInConfig: checkColumnIsInConfig(
        TaskItemColumn.PATIENT,
        mergedTaskItemConfig,
      ),
      workflowStatusIsInConfig: checkColumnIsInConfig(
        TaskItemColumn.WORKFLOW_STATUS,
        mergedTaskItemConfig,
      ),
      activityIsInConfig: checkColumnIsInConfig(
        TaskItemColumn.ACTIVITY,
        mergedTaskItemConfig,
      ),
      dueDateIsInConfig: checkColumnIsInConfig(
        TaskItemColumn.DUE_DATE,
        mergedTaskItemConfig,
      ),
      assignedIsInConfig: checkColumnIsInConfig(
        TaskItemColumn.ASSIGNED,
        mergedTaskItemConfig,
      ),
      listNameIsInConfig: checkColumnIsInConfig(
        TaskItemColumn.LIST_NAME,
        mergedTaskItemConfig,
      ),
      decisionInConfig: checkColumnIsInConfig(
        TaskItemColumn.DECISION_SELECT,
        mergedTaskItemConfig,
      ),
    };
  }, [mergedTaskItemConfig]);

  return (
    <>
      <StandardTaskItemPanel
        onContextMenu={handleTaskItemRightClick}
        isDragging={isDragging}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <DotsContainer
          showDraggableDots={showDraggableDots}
          dragHandleProps={dragHandleProps}
        />
        <StandardTaskItemContainer
          isSelected={isSelected || selected}
          height={
            hasParentTaskLabel || isCompletedGroup
              ? EXTENDED_TASK_HEIGHT
              : STANDARD_TASK_HEIGHT
          }
        >
          {showPriority && <PriorityIndicator />}
          {showSubtaskStylingLink && getSubtaskStylingLink(isLast)}
          {bulkEditEnabled && (
            <TaskItemBulkEdit isChecked={selected} onClick={onClickBulkEdit} />
          )}
          <MainStandardTaskItemCell
            bolded
            paddingLeft="smallPlus"
            paddingRight="small"
            onClick={onClickTaskItem}
            position="static"
          >
            <CircleIcon
              src={isCompleted ? CircleCompleted : Circle}
              isClickable={
                !isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted
              }
              isCompleted={isCompleted}
              onClick={onCircleClick}
            />

            {!isDependencyEmptyOrCompleted && !isTemplateTask && (
              <>
                <DependencyIconContainer
                  onMouseEnter={openDependencyPopover}
                  onMouseLeave={closeDependencyPopover}
                  ref={dependencyIconReference}
                >
                  <img src={dependencyIcon} alt="search" />
                  <DependencyListPopover
                    anchorElement={dependencyIconReference.current}
                    open={dependencyPopoverOpen}
                    dependencyTasksCount={dependencyTasksCount}
                    task={task}
                  />
                </DependencyIconContainer>
              </>
            )}

            {descriptionIsInCofnig && (
              <TaskItemDescription
                isCompletedGroup={isCompletedGroup}
                isCompleted={isCompleted}
                descriptionState={descriptionState}
                setDescriptionState={setDescriptionState}
                matchDescription={matchDescription}
                highlightedValue={highlightedValue}
                description={description}
                edited={isEdited}
                duplicated={isDuplicated}
                hasParentTaskLabel={hasParentTaskLabel}
                parentTask={parentTask}
                completedByName={completedByName}
                completedDt={completedDt}
                dispatch={dispatch}
              />
            )}
          </MainStandardTaskItemCell>
          {decisionInConfig && showDecisionRow && (
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
          )}
          {subtasksIsInConfig && (
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
            />
          )}
          {patientIsInConfig && (
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
            />
          )}
          {workflowStatusIsInConfig && (
            <TaskItemWorkflowStatus
              task={task}
              updateWorkflowStatus={handleUpdateWorkflowStatus}
              workflowStatus={workflowStatus}
              matchWorkflowStatus={matchWorkflowStatus}
              highlightedValue={highlightedValue}
            />
          )}
          {activityIsInConfig && (
            <TaskItemIcons
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
          )}
          {dueDateIsInConfig && (
            <TaskItemDueDate
              task={task}
              isHovered={isHovered}
              updateDueDate={updateDueDate}
            />
          )}
          {assignedIsInConfig && (
            <TaskItemMembers
              multipleAssigneesContext={multipleAssigneesContext}
              task={task}
              assignedToUsers={assignedToUsers}
              handleReasignTask={handleReasignTask}
              matchAssignedTo={matchAssignedTo}
            />
          )}
          {listNameIsInConfig && (
            <TaskItemList
              listName={listName}
              taskListIdentifier={taskListIdentifier}
              taskStatus={task.status}
            />
          )}
        </StandardTaskItemContainer>
      </StandardTaskItemPanel>
      {contextMenu && (
        <TaskItemContextMenu
          position={contextMenu}
          task={task}
          onClose={onCloseContextMenu}
          subtasksDisabled={subtasksDisabled}
          isDashboardTask={isDashboardTask}
        />
      )}
    </>
  );
};

export default React.memo(TaskItem);
