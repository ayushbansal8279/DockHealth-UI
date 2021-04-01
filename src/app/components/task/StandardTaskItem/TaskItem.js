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
import { openDrawer } from 'actions/task-drawer-actions';
import { openQuickAddSubtask, storeAsCurrentTask } from 'actions/task-actions';
import debounce from 'lodash.debounce';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import ThreeDotsIcon from 'img/three-dots';
import { userProfileSelector } from 'selectors/user-selectors';

import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
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
  getSubtaskStylingLink,
  checkColumnIsInConfig,
  TASK_ITEM_ICONS_COLUMN,
  TASK_ITEM_LIST_COLUMN,
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_PATIENT_COLUMN,
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
} from './helpers';
import {
  CircleIcon,
  MainStandardTaskItemCell,
  StandardTaskItemContainer,
  StandardTaskItemPanel,
  StandardTaskThreeDots,
  PriorityIndicator,
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

const STANDARD_TASK_HEIGHT = 35;
const EXTENDED_TASK_HEIGHT = 50;

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
  subTasksCount,
  dragAndDropDisabled,
  isSelected,
  parentHasPatient,
  highlightedValue,
  isDraggable,
  isLast,
  showSubtaskStylingLink,
  isNestedTask = false,
  subtasksDisabled,
  multipleAssigneesContext,
  highlightTasksOfTheSameParent,
  taskItemConfig = [],
  isDashboardTask,
}) => {
  const {
    taskIdentifier,
    edited,
    duplicated,
    assignedToUsers,
    attachments,
    comments,
    description,
    tokenizedDescription,
    taskMentions,
    dueDate,
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
  } = task;

  const { listName, taskListIdentifier } = taskList;

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
  const [isHovered, setIsHoverd] = useState(false);
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
    }),
  );
  const [contextMenu, setContextMenu] = useState(null);
  const [
    isDescriptionTooltipVisible,
    setIsDescriptionTooltipVisible,
  ] = useState(false);
  const dispatch = useDispatch();
  const previousDescription = useRef(null);
  const descriptionReference = useRef(null);

  const isSubtask = !!parentTaskIdentifier;

  const { bulkEditIsActive, bunchBulkEditTaskActions } = useContext(
    BulkEditContext,
  );

  const bulkEditTaskActions = useMemo(
    () =>
      isSubtask
        ? bunchBulkEditTaskActions?.subtaskActions
        : bunchBulkEditTaskActions?.parentActions,
    [bunchBulkEditTaskActions, isSubtask],
  );

  const previousSubtasksCount = useRef(subTasksCount);
  const previousAttachmentsLength = useRef(attachments?.length);
  const previousAssignedToUsers = useRef(assignedToUsers);
  const hasAttachments = useMemo(() => attachments?.length > 0, [attachments]);

  const bulkEditActionPayload = useMemo(
    () =>
      isSubtask
        ? {
            parentTaskIdentifier,
            taskIdentifier,
            hasAttachments,
            taskList,
            assignedToUsers,
          }
        : {
            taskIdentifier,
            subTasksCount,
            hasAttachments,
            taskList,
            assignedToUsers,
          },
    [
      isSubtask,
      parentTaskIdentifier,
      taskIdentifier,
      hasAttachments,
      taskList,
      assignedToUsers,
      subTasksCount,
    ],
  );

  const isCheckedByBulkEdit = useMemo(
    () =>
      bulkEditTaskActions?.getTaskIsSelectedInBulkEdit(bulkEditActionPayload),
    [bulkEditTaskActions, bulkEditActionPayload],
  );

  useEffect(() => {
    if (subTasksCount !== previousSubtasksCount?.current) {
      previousSubtasksCount.current = subTasksCount;

      if (
        !isSubtask &&
        bulkEditTaskActions?.onUpdateSelectedBulkEditTask &&
        isCheckedByBulkEdit
      ) {
        bulkEditTaskActions.onUpdateSelectedBulkEditTask({
          taskIdentifier,
          subTasksCount,
        });
      }
    }

    if (
      attachments?.length !== previousAttachmentsLength?.current ||
      assignedToUsers !== previousAssignedToUsers?.current
    ) {
      previousAttachmentsLength.current = attachments?.length;
      previousAssignedToUsers.current = assignedToUsers;

      if (
        isCheckedByBulkEdit &&
        bulkEditTaskActions?.onUpdateSelectedBulkEditTask
      )
        bulkEditTaskActions.onUpdateSelectedBulkEditTask({
          taskIdentifier,
          hasAttachments: attachments?.length > 0,
          assignedToUsers,
        });
    }
  }, [
    attachments,
    bulkEditTaskActions,
    isSubtask,
    subTasksCount,
    taskIdentifier,
    isCheckedByBulkEdit,
    assignedToUsers,
  ]);

  const checkIfShouldDisplayTooltip = useCallback(() => {
    const descriptionTextElement = descriptionReference.current?.querySelector(
      '.public-DraftStyleDefault-block',
    );
    if (
      descriptionTextElement &&
      descriptionTextElement.scrollWidth > descriptionTextElement.offsetWidth
    ) {
      setIsDescriptionTooltipVisible(true);
    } else {
      setIsDescriptionTooltipVisible(false);
    }
  }, []);

  const handleResize = useCallback(
    debounce(() => {
      checkIfShouldDisplayTooltip();
    }, 1000),
    [],
  );

  const handleTaskItemRightClick = useCallback(event => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY });
  }, []);

  useEffect(() => {
    if (descriptionReference.current) {
      checkIfShouldDisplayTooltip();
    }
  }, [checkIfShouldDisplayTooltip]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (previousDescription.current !== null) {
      const newContent = createMentionEntities(
        tokenizedDescription,
        description,
        taskMentions,
      );
      setDescriptionState(EditorState.push(descriptionState, newContent));
    }
    previousDescription.current = description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const isCompleted = task.status === 'COMPLETE';
  const isTaskStatusTogglingEnabled = !(isCompletedGroup && isSubtask);

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  const onMouseEnter = () => setIsHoverd(true);
  const onMouseLeave = () => setIsHoverd(false);

  const onClickTaskItem = useCallback(() => {
    dispatch(openDrawer());
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onCircleClick = useCallback(
    event => {
      if (
        isTaskStatusTogglingEnabled &&
        (isSubtask ||
          (isCompletedGroup && isCompleted) ||
          (!isCompletedGroup && !isCompleted))
      ) {
        toggleCompleteTask(task);
      }

      if (!isSubtask) {
        (isCompleted ? onTaskReActivated : onTaskCompleted)();
      } else {
        (isCompleted ? onSubtaskReActivated : onSubtaskCompleted)();
      }

      if (isCheckedByBulkEdit && bulkEditTaskActions?.onUnselectBulkEditTask) {
        bulkEditTaskActions.onUnselectBulkEditTask(bulkEditActionPayload);
      }
      event.stopPropagation();
    },
    [
      isTaskStatusTogglingEnabled,
      isSubtask,
      isCompletedGroup,
      isCompleted,
      isCheckedByBulkEdit,
      bulkEditTaskActions,
      toggleCompleteTask,
      task,
      bulkEditActionPayload,
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

  const showDraggableDots =
    !dragAndDropDisabled && isDraggable && !bulkEditIsActive;
  const showPriority = task.priority === 'HIGH';

  const hasParentTaskLabel = isSubtask && !isNestedTask && parentTask;

  return (
    <>
      <StandardTaskItemPanel
        onContextMenu={handleTaskItemRightClick}
        isDragging={isDragging}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {showDraggableDots && (
          <StandardTaskThreeDots src={ThreeDotsIcon} {...dragHandleProps} />
        )}
        <StandardTaskItemContainer
          isSelected={isSelected || isCheckedByBulkEdit}
          height={
            hasParentTaskLabel || isCompletedGroup
              ? EXTENDED_TASK_HEIGHT
              : STANDARD_TASK_HEIGHT
          }
        >
          {showPriority && <PriorityIndicator />}
          {showSubtaskStylingLink && getSubtaskStylingLink(isLast)}
          {bulkEditTaskActions && (
            <TaskItemBulkEdit
              isCheckedByBulkEdit={isCheckedByBulkEdit}
              bulkEditTaskActions={bulkEditTaskActions}
              bulkEditActionPayload={bulkEditActionPayload}
            />
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
              isClickable={isTaskStatusTogglingEnabled}
              isCompleted={isCompleted}
              onClick={onCircleClick}
            />
            <TaskItemDescription
              descriptionReference={descriptionReference}
              isCompletedGroup={isCompletedGroup}
              isCompleted={isCompleted}
              descriptionState={descriptionState}
              setDescriptionState={setDescriptionState}
              matchDescription={matchDescription}
              highlightedValue={highlightedValue}
              isDescriptionTooltipVisible={isDescriptionTooltipVisible}
              description={description}
              edited={edited}
              duplicated={duplicated}
              hasParentTaskLabel={hasParentTaskLabel}
              parentTask={parentTask}
              completedByName={completedByName}
              completedDt={completedDt}
              dispatch={dispatch}
            />
          </MainStandardTaskItemCell>
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
          {checkColumnIsInConfig(TASK_ITEM_PATIENT_COLUMN, taskItemConfig) && (
            <TaskItemPatient
              highlightedValue={highlightedValue}
              taskStatus={task?.status}
              isSubtask={isSubtask}
              parentHasPatient={parentHasPatient}
              matchPatientMRN={matchPatientMRN}
              patient={patient}
              matchPatient={matchPatient}
              dispatch={dispatch}
            />
          )}
          {checkColumnIsInConfig(
            TASK_ITEM_WORFKLOW_STATUS_COLUMN,
            taskItemConfig,
          ) && (
            <TaskItemWorkflowStatus
              task={task}
              isCompletedGroup={isCompletedGroup}
              updateWorkflowStatus={handleUpdateWorkflowStatus}
              workflowStatus={workflowStatus}
              matchWorkflowStatus={matchWorkflowStatus}
              highlightedValue={highlightedValue}
            />
          )}
          {checkColumnIsInConfig(TASK_ITEM_ICONS_COLUMN, taskItemConfig) && (
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
          <TaskItemDueDate
            dueDate={dueDate}
            task={task}
            isHovered={isHovered}
            updateDueDate={updateDueDate}
          />
          {checkColumnIsInConfig(TASK_ITEM_MEMBERS_COLUMN, taskItemConfig) && (
            <TaskItemMembers
              multipleAssigneesContext={multipleAssigneesContext}
              task={task}
              assignedToUsers={assignedToUsers}
              handleReasignTask={handleReasignTask}
              matchAssignedTo={matchAssignedTo}
            />
          )}
          {checkColumnIsInConfig(TASK_ITEM_LIST_COLUMN, taskItemConfig) && (
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
          onClose={() => setContextMenu(null)}
          subtasksDisabled={subtasksDisabled}
          isDashboardTask={isDashboardTask}
        />
      )}
    </>
  );
};

export default React.memo(TaskItem);
