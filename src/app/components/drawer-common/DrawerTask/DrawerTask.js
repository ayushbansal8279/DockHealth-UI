/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import moment from 'moment';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pluck } from 'ramda';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import SimpleArrowRight from 'img/simple-arrow-right';
import RecurringIcon from 'img/recurring-arrows';
import ReminderIcon from 'img/reminder';
import {
  onTaskDrawerSubtaskCompleted,
  onTaskDrawerSubtaskReActivated,
  onTaskDrawerSubtaskAssigned,
} from 'helpers/ga-event-helper';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Spacing from 'components/common/Spacing';
import {
  storeAsCurrentTask,
  toggleCompleteTask,
  partialUpdateTask,
  updateTaskDueDate,
} from 'actions/task-actions';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import { openDrawer } from 'actions/task-drawer-actions';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import { DueDateBasicLabel } from 'components/task/styled';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskDragHandle from 'components/task/TaskDragHandle/TaskDragHandle';
import {
  checkIfTemplateTask,
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
  getLabelsIconTooltipTitle,
  isDueDateOverdue,
  ReminderType,
} from 'helpers/task-helpers';
import { userProfileSelector } from 'selectors/user-selectors';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import {
  Container,
  IconsSection,
  CircleIcon,
  Description,
  DescriptionContainer,
  AssigneeContainer,
  GoToParentIconContainer,
  DueDateContainer,
  IconContainer,
  DueDateText,
  DragHandleContainer,
} from './styled';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const DrawerTask = props => {
  const { task, currentUser, dragHandleProps } = props;
  const dispatch = useDispatch();
  const { orgUserRole } = useSelector(userProfileSelector);
  const restrictions = SINGLE_TASK_RESTRICTIONS_PROFILES[orgUserRole];

  const {
    taskIdentifier,
    status,
    description,
    tokenizedDescription,
    taskMentions,
    assignedToUsers,
    dueDate,
    comments,
    updatedComment,
    labels,
    updatedLabel,
    attachments,
    updatedAttachment,
    taskList,
    hasRecurringSchedule,
    reminderType,
    dependencyTasksCompletedCount,
    dependencyTasksCount,
  } = task;

  const isCompleted = status === 'COMPLETE';
  const isTemplateTask = checkIfTemplateTask(task);

  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
      handleRichText: false,
    }),
  );

  const isDecisionTask = task.intentType === 'DECISION';
  const isDecisionSelected = task.taskOutcomes?.reduce(
    (accumulator, currentValue) => accumulator || currentValue.isSelected,
    false,
  );
  const isTaskStatusTogglingDisabled =
    isTemplateTask || (isDecisionTask && !isDecisionSelected);

  const isDependencyEmptyOrCompleted =
    dependencyTasksCount === dependencyTasksCompletedCount;

  const handleGoToChildTask = useCallback(
    childTask => {
      return dispatch(storeAsCurrentTask(childTask));
    },
    [dispatch],
  );

  const handleReassignSubtask = useCallback(
    selectedMembers => {
      onTaskDrawerSubtaskAssigned();
      dispatch(
        partialUpdateTask(task.taskIdentifier, {
          assignedToUsers: selectedMembers,
          assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
          assignedBy: selectedMembers?.length ? currentUser : null,
        }),
      );
    },
    [currentUser, dispatch, task.taskIdentifier],
  );

  const handleCommentIconClick = () => {
    dispatch(openDrawer(DrawerFieldEnum.COMMENT));
  };

  const handleLabelIconClick = () => {
    dispatch(openDrawer(DrawerFieldEnum.LABEL));
  };

  const handleAttachmentIconClick = () => {
    dispatch(openDrawer(DrawerFieldEnum.ATTACHMENT));
  };

  const handleDueDateChange = useCallback(
    newDueDate => {
      dispatch(updateTaskDueDate(task, newDueDate));
    },
    [dispatch, task],
  );

  return (
    <Container>
      {dragHandleProps && (
        <DragHandleContainer>
          <TaskDragHandle {...dragHandleProps} />
        </DragHandleContainer>
      )}
      <CircleIcon
        src={isCompleted ? CircleCompleted : Circle}
        isCompleted={isCompleted}
        isClickable={
          !isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted
        }
        onClick={event => {
          event.stopPropagation();
          if (!isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted) {
            (isCompleted
              ? onTaskDrawerSubtaskReActivated
              : onTaskDrawerSubtaskCompleted)();
            dispatch(toggleCompleteTask(task, currentUser));
          }
        }}
      />
      <DescriptionContainer
        onClick={() => {
          handleGoToChildTask(task);
        }}
      >
        <Description isCrossedOut={isCompleted}>
          <TextEditor
            readOnly
            oneline
            state={descriptionState}
            onChange={setDescriptionState}
          />
        </Description>
      </DescriptionContainer>
      <IconsSection>
        <IconContainer>
          <Tooltip
            placement="top"
            title={
              comments?.length > 0
                ? getCommentsIconTooltipTitle(comments)
                : null
            }
          >
            <button type="button" onClick={handleCommentIconClick}>
              <TaskIcon
                type="comments"
                isActive={comments?.length > 0}
                isNew={updatedComment}
              />
            </button>
          </Tooltip>
        </IconContainer>
        <IconContainer>
          <Tooltip
            placement="top"
            title={
              labels?.length > 0 ? getLabelsIconTooltipTitle(labels) : null
            }
          >
            <button type="button" onClick={handleLabelIconClick}>
              <TaskIcon
                type="labels"
                isActive={labels?.length > 0}
                isNew={updatedLabel}
              />
            </button>
          </Tooltip>
        </IconContainer>
        <IconContainer>
          <Tooltip
            placement="top-end"
            title={
              attachments?.length > 0
                ? getAttachmentsIconTooltipTitle(attachments)
                : ''
            }
          >
            <button type="button" onClick={handleAttachmentIconClick}>
              <TaskIcon
                type="attachments"
                isActive={attachments?.length > 0}
                isNew={updatedAttachment}
              />
            </button>
          </Tooltip>
        </IconContainer>
      </IconsSection>
      {restrictions?.dueDate !== DISABLED && (
        <DueDateContainer>
          <TaskItemPopover
            disabled={isTemplateTask}
            placement="top-end"
            content={({ closePopover }) => (
              <DueDatePicker
                taskIdentifier={taskIdentifier}
                selectedDate={dueDate}
                onDateChange={handleDueDateChange}
                recurring={hasRecurringSchedule}
                onCloseClick={closePopover}
              />
            )}
          >
            {dueDate ? (
              <Tooltip placement="top" title="Edit due date">
                <DueDateBasicLabel isOverdue={isDueDateOverdue(task)}>
                  <DueDateText>{moment(dueDate).format('MM/DD')}</DueDateText>
                  {reminderType && reminderType !== ReminderType.NONE && (
                    <>
                      <Spacing horizontal={2} />
                      <ReminderIcon />
                    </>
                  )}
                  {hasRecurringSchedule && (
                    <>
                      <Spacing horizontal={2} />
                      <RecurringIcon />
                    </>
                  )}
                </DueDateBasicLabel>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="Add due date">
                <div>
                  <TaskIcon type="calendar" />
                </div>
              </Tooltip>
            )}
          </TaskItemPopover>
        </DueDateContainer>
      )}
      <AssigneeContainer>
        <TaskItemPopover
          disabled={restrictions?.assigment === READ_ONLY}
          placement="top-end"
          fullWidth
          content={({ closePopover }) => (
            <MultiAssignMembersList
              fullWidth
              taskListIdentifiers={taskList?.taskListIdentifier}
              selectedMembers={assignedToUsers}
              onSelect={handleReassignSubtask}
              onError={closePopover}
              enableLazyLoading={
                taskList?.listType === 'PUBLIC' ||
                taskList?.listType === 'TEMPLATE'
              }
            />
          )}
        >
          {assignedToUsers?.length ? (
            <MemberGroup members={assignedToUsers} />
          ) : (
            restrictions?.assigment !== READ_ONLY && (
              <Tooltip placement="top" title="Assign to">
                <div>
                  <AssignMemberIcon />
                </div>
              </Tooltip>
            )
          )}
        </TaskItemPopover>
      </AssigneeContainer>
      <GoToParentIconContainer
        onClick={() => {
          handleGoToChildTask(task);
          dispatch(openDrawer());
        }}
      >
        <img src={SimpleArrowRight} alt="Go to parent task" />
      </GoToParentIconContainer>
    </Container>
  );
};

export default DrawerTask;
