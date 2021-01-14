import moment from 'moment';
import React, { useCallback } from 'react';
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
import {
  ATTACHMENTS,
  COMMENTS,
  getItemIcon,
  getToolTipAttachmentsLabelDetails,
  getToolTipMultiLabelDetails,
  LABELS,
  isDueDateOverdue,
} from 'components/task-item/icons';
import {
  DueDateBasicLabel,
  CalendarIcon,
  AddCrossIcon,
} from 'components/task-item/styled';
import EmptyCalendarIcon from 'img/calendar-dim.svg';
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
import { FocusDrawerFieldEnum } from '../NewTaskDrawer.Utilities';

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

const NewTaskDrawerSubtask = ({ subtask, currentUser }) => {
  const dispatch = useDispatch();

  const {
    status,
    description,
    edited,
    duplicated,
    tokenizedDescription,
    taskMentions,
    assignedTo,
    comments,
    updatedComment,
    dueDate,
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
        <IconContainer marginTop={updatedComment ? -8 : 0}>
          <button type="button" onClick={handleCommentIconClick}>
            <Tooltip
              placement="top"
              title={
                comments?.length > 0
                  ? `${comments?.length} comment${
                      comments?.length > 1 ? 's' : ''
                    }`
                  : null
              }
            >
              <img
                alt="comments"
                src={getItemIcon(COMMENTS, comments, true, updatedComment)}
              />
            </Tooltip>
          </button>
        </IconContainer>
        <IconContainer>
          <button type="button" onClick={handleLabelIconClick}>
            <Tooltip
              placement="top"
              title={
                labels?.length > 0 ? getToolTipMultiLabelDetails(labels) : null
              }
            >
              <img
                alt="labels"
                src={getItemIcon(LABELS, labels, true, updatedLabel)}
              />
            </Tooltip>
          </button>
        </IconContainer>
        <IconContainer marginTop={2}>
          <button type="button" onClick={handleAttachementIconClick}>
            <Tooltip
              placement="top-end"
              title={
                attachments?.length > 0
                  ? getToolTipAttachmentsLabelDetails(attachments)
                  : ''
              }
            >
              <img
                alt="attachments"
                src={getItemIcon(
                  ATTACHMENTS,
                  attachments,
                  true,
                  updatedAttachment,
                )}
              />
            </Tooltip>
          </button>
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
                  <CalendarIcon src={EmptyCalendarIcon} alt="Due date" />
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

export default NewTaskDrawerSubtask;
