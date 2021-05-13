import moment from 'moment';
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pluck } from 'ramda';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import SimpleArrowRight from 'img/simple-arrow-right';
import {
  onTaskDrawerSubtaskCompleted,
  onTaskDrawerSubtaskReActivated,
  onTaskDrawerSubtaskAssigned,
} from 'helpers/ga-event-helper';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  storeAsCurrentTask,
  toggleCompleteTask,
  updateDueDate,
  partialUpdateTask,
} from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import DueDatePicker from 'components/common/DueDatePicker/DueDatePicker';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import { DueDateBasicLabel } from 'components/task/styled';
import {
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
  getLabelsIconTooltipTitle,
  isDueDateOverdue,
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
} from './styled';

const Subtask = ({ subtask, currentUser }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const {
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
  } = subtask;

  const isCompleted = status === 'COMPLETE';

  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
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

  const handleAttachementIconClick = () => {
    dispatch(openDrawer(DrawerFieldEnum.ATTACHEMENT));
  };

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        storeAsCurrentTask(subtask)(dispatch);
      }}
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
      <DescriptionContainer>
        <Description isCrossedOut={isCompleted}>
          <MentionsEditor
            readOnly
            oneline
            isDrawerEditor
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
            <TaskIcon
              type="comments"
              onClick={handleCommentIconClick}
              isActive={comments?.length > 0}
              isNew={updatedComment}
              isHovered={isHovered}
            />
          </Tooltip>
        </IconContainer>
        <IconContainer>
          <Tooltip
            placement="top"
            title={
              labels?.length > 0 ? getLabelsIconTooltipTitle(labels) : null
            }
          >
            <TaskIcon
              type="labels"
              onClick={handleLabelIconClick}
              isActive={labels?.length > 0}
              isNew={updatedLabel}
              isHovered={isHovered}
            />
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
            <TaskIcon
              type="attachments"
              onClick={handleAttachementIconClick}
              isActive={attachments?.length > 0}
              isNew={updatedAttachment}
              isHovered={isHovered}
            />
          </Tooltip>
        </IconContainer>
      </IconsSection>
      <DueDateContainer>
        <DueDatePicker
          selectedDate={dueDate}
          onDateChange={newDueDate => {
            updateDueDate(subtask, newDueDate, true)(dispatch);
          }}
        >
          {dueDate ? (
            <Tooltip placement="top" title="Edit due date">
              <DueDateBasicLabel isOverdue={isDueDateOverdue(subtask)}>
                {moment(dueDate).format('MM/DD')}
              </DueDateBasicLabel>
            </Tooltip>
          ) : (
            <Tooltip placement="top" title="Add due date">
              <TaskIcon type="calendar" isHovered={isHovered} />
            </Tooltip>
          )}
        </DueDatePicker>
      </DueDateContainer>
      <AssigneeContainer>
        <MultiAssignPopover
          fullWidth
          placement="top"
          taskListIdentifiers={taskList?.taskListIdentifier}
          selectedMembers={assignedToUsers}
          onSelect={handleReassignSubtask}
        >
          {assignedToUsers?.length ? (
            <MemberGroup members={assignedToUsers} />
          ) : (
            <Tooltip placement="top" title="Assign to">
              <AssignMemberIcon />
            </Tooltip>
          )}
        </MultiAssignPopover>
      </AssigneeContainer>
      <GoToParentIconContainer>
        <img src={SimpleArrowRight} alt="Go to parent task" />
      </GoToParentIconContainer>
    </Container>
  );
};

export default Subtask;
