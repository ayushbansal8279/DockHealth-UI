/* eslint-disable import/extensions */
import moment from 'moment';
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
  updateDueDate,
  partialUpdateTask,
} from 'actions/task-actions';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import { openDrawer } from 'actions/task-drawer-actions';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import { DueDateBasicLabel } from 'components/task/styled';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import {
  checkIfTemplateTask,
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
  getLabelsIconTooltipTitle,
  isDueDateOverdue,
  ReminderType,
} from 'helpers/task-helpers';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
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
  DescriptionLabel,
  DueDateText,
} from './styled';

const Subtask = ({ subtask, currentUser }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const {
    taskIdentifier,
    status,
    description,
    edited,
    duplicated,
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
  } = subtask;

  const isCompleted = status === 'COMPLETE';
  const isTemplateTask = checkIfTemplateTask(subtask);

  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
      handleRichText: false,
    }),
  );

  const handleReassignSubtask = useCallback(
    selectedMembers => {
      onTaskDrawerSubtaskAssigned();
      dispatch(
        partialUpdateTask(subtask.taskIdentifier, {
          assignedToUsers: selectedMembers,
          assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
          assignedBy: selectedMembers?.length ? currentUser : null,
        }),
      );
    },
    [currentUser, dispatch, subtask.taskIdentifier],
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
      updateDueDate(subtask, newDueDate, true)(dispatch);
    },
    [dispatch, subtask],
  );

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CircleIcon
        src={isCompleted ? CircleCompleted : Circle}
        isCompleted={isCompleted}
        isClickable
        onClick={event => {
          event.stopPropagation();
          (isCompleted
            ? onTaskDrawerSubtaskReActivated
            : onTaskDrawerSubtaskCompleted)();
          dispatch(toggleCompleteTask(subtask, currentUser));
        }}
      />
      <DescriptionContainer
        onClick={() => {
          storeAsCurrentTask(subtask)(dispatch);
        }}
      >
        <Description isCrossedOut={isCompleted}>
          <TextEditor
            readOnly
            oneline
            state={descriptionState}
            onChange={setDescriptionState}
          />
          {edited && <DescriptionLabel>(edited)</DescriptionLabel>}
          {duplicated && <DescriptionLabel>(duplicated)</DescriptionLabel>}
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
            <div>
              <TaskIcon
                type="comments"
                onClick={handleCommentIconClick}
                isActive={comments?.length > 0}
                isNew={updatedComment}
                isHovered={isHovered}
              />
            </div>
          </Tooltip>
        </IconContainer>
        <IconContainer>
          <Tooltip
            placement="top"
            title={
              labels?.length > 0 ? getLabelsIconTooltipTitle(labels) : null
            }
          >
            <div>
              <TaskIcon
                type="labels"
                onClick={handleLabelIconClick}
                isActive={labels?.length > 0}
                isNew={updatedLabel}
                isHovered={isHovered}
              />
            </div>
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
            <div>
              <TaskIcon
                type="attachments"
                onClick={handleAttachmentIconClick}
                isActive={attachments?.length > 0}
                isNew={updatedAttachment}
                isHovered={isHovered}
              />
            </div>
          </Tooltip>
        </IconContainer>
      </IconsSection>
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
              <DueDateBasicLabel isOverdue={isDueDateOverdue(subtask)}>
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
                <TaskIcon type="calendar" isHovered={isHovered} />
              </div>
            </Tooltip>
          )}
        </TaskItemPopover>
      </DueDateContainer>
      <AssigneeContainer>
        <TaskItemPopover
          placement="top-end"
          fullWidth
          content={({ closePopover }) => (
            <MultiAssignMembersList
              fullWidth
              taskListIdentifiers={taskList?.taskListIdentifier}
              selectedMembers={assignedToUsers}
              onSelect={handleReassignSubtask}
              onError={closePopover}
            />
          )}
        >
          {assignedToUsers?.length ? (
            <MemberGroup members={assignedToUsers} />
          ) : (
            <Tooltip placement="top" title="Assign to">
              <div>
                <AssignMemberIcon />
              </div>
            </Tooltip>
          )}
        </TaskItemPopover>
      </AssigneeContainer>
      <GoToParentIconContainer
        onClick={() => {
          storeAsCurrentTask(subtask)(dispatch);
        }}
      >
        <img src={SimpleArrowRight} alt="Go to parent task" />
      </GoToParentIconContainer>
    </Container>
  );
};

export default Subtask;
