import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/cross';
import Tooltip from 'components/common/Tooltip/Tooltip';
import SimpleArrowRight from 'img/simple-arrow-right';
import {
  storeAsCurrentTask,
  toggleCompleteTask,
  assignOrReassignTask,
  updateDueDate,
} from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import Member from 'components/members/Member/Member';
import TaskAssignMember from 'components/tasklist/TaskAssignMember/TaskAssignMember';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import { DueDateBasicLabel, AddCrossIcon } from 'components/task/styled';
import {
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
  getLabelsIconTooltipTitle,
  isDueDateOverdue,
} from 'helpers/task-helpers';
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
import { FocusDrawerFieldEnum } from '../helpers';

const DUE_DATE_PICKER_OPTIONS = [
  {
    label: 'Today',
    date: moment(),
  },
  {
    label: 'Tomorrow',
    date: moment().add(1, 'days'),
  },
];

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
    assignedTo,
    dueDate,
    comments,
    updatedComment,
    labels,
    updatedLabel,
    attachments,
    updatedAttachment,
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
    (task, selectedMember) => {
      assignOrReassignTask(task, selectedMember?.userIdentifier)(dispatch);
    },
    [dispatch],
  );

  const handleCommentIconClick = () => {
    dispatch(openDrawer(FocusDrawerFieldEnum.COMMENT));
  };

  const handleLabelIconClick = () => {
    dispatch(openDrawer(FocusDrawerFieldEnum.LABEL));
  };

  const handleAttachementIconClick = () => {
    dispatch(openDrawer(FocusDrawerFieldEnum.ATTACHEMENT));
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
        <PopoverDatepicker
          selectedDate={dueDate}
          onDateChange={date => {
            const existingTime = dueDate ? moment(dueDate).format('HH:mm') : '';
            updateDueDate(
              subtask,
              moment(`${date} ${existingTime}`),
              true,
            )(dispatch);
          }}
          quickSelectOptions={DUE_DATE_PICKER_OPTIONS}
        >
          {({ elementReference, setIsPopoverOpen, isPopoverOpen }) => (
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                setIsPopoverOpen(!isPopoverOpen);
              }}
              ref={elementReference}
            >
              {dueDate ? (
                <Tooltip placement="top" title="Edit due date">
                  <DueDateBasicLabel isOverdue={isDueDateOverdue(dueDate)}>
                    {moment(dueDate).format('MM/DD')}
                  </DueDateBasicLabel>
                </Tooltip>
              ) : (
                <Tooltip placement="top" title="Add due date">
                  <TaskIcon type="calendar" isHovered={isHovered} />
                </Tooltip>
              )}
            </button>
          )}
        </PopoverDatepicker>
      </DueDateContainer>
      <AssigneeContainer>
        <TaskAssignMember
          currentUser={currentUser}
          reassignTask={handleReassignSubtask}
          task={subtask}
        >
          {assignedTo ? (
            <Tooltip
              placement="top-end"
              title={`Assigned to ${assignedTo.userName}`}
            >
              <Member member={assignedTo} size={30} showTooltip={false} />
            </Tooltip>
          ) : (
            <Tooltip placement="top" title="Assign to">
              <AddCrossIcon src={CrossIcon} size="28px" />
            </Tooltip>
          )}
        </TaskAssignMember>
      </AssigneeContainer>
      <GoToParentIconContainer>
        <img src={SimpleArrowRight} alt="Go to parent task" />
      </GoToParentIconContainer>
    </Container>
  );
};

export default Subtask;
