import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import SimpleArrowRight from 'img/simple-arrow-right';
import { storeAsCurrentTask, toggleCompleteTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import Member from 'components/members/Member/Member';
import {
  ATTACHMENTS,
  COMMENTS,
  // getCalendarIcon,
  getItemIcon,
  getToolTipAttachmentsLabelDetails,
  getToolTipMultiLabelDetails,
  LABELS,
  isDueDateOverdue,
} from 'components/task-item/icons';
import { DueDateBasicLabel, CalendarIcon } from 'components/task-item/styled';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
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
        {/* <CompletedBy isCompleted={isCompleted}>
          <span>{`Completed by ${completedByName} ${completedDt &&
            ` on ${
              completedDt
                ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                : ''
            }`}
                `}</span>
        </CompletedBy> */}
      </DescriptionContainer>
      <IconsSection>
        <IconContainer marginTop={updatedComment ? -8 : 0}>
          <button type="button" onClick={handleCommentIconClick}>
            <UniversalTooltipContainer
              placement="top"
              label={
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
            </UniversalTooltipContainer>
          </button>
        </IconContainer>
        <IconContainer>
          <button type="button" onClick={handleLabelIconClick}>
            <UniversalTooltipContainer
              placement="top"
              label={
                labels?.length > 0 ? getToolTipMultiLabelDetails(labels) : null
              }
            >
              <img
                alt="labels"
                src={getItemIcon(LABELS, labels, true, updatedLabel)}
              />
            </UniversalTooltipContainer>
          </button>
        </IconContainer>
        <IconContainer marginTop={0}>
          <button type="button" onClick={handleAttachementIconClick}>
            <UniversalTooltipContainer
              placement="top-end"
              label={
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
            </UniversalTooltipContainer>
          </button>
        </IconContainer>
        <DueDateContainer>
          {dueDate ? (
            <DueDateBasicLabel isOverdue={isDueDateOverdue(dueDate)}>
              {moment(dueDate).format('MM/DD')}
            </DueDateBasicLabel>
          ) : (
            <CalendarIcon src={EmptyCalendarIcon} alt="Due date" />
          )}
        </DueDateContainer>
      </IconsSection>
      <AssigneeContainer
        onClick={event => {
          event.stopPropagation();
        }}
      >
        {assignedTo && (
          <UniversalTooltipContainer
            placement="top-end"
            label={`Assigned to ${assignedTo.userName}`}
          >
            <Member member={assignedTo} size={30} showTooltip={false} />
          </UniversalTooltipContainer>
        )}
      </AssigneeContainer>
      <GoToParentIconContainer>
        <img src={SimpleArrowRight} alt="Go to parent task" />
      </GoToParentIconContainer>
    </Container>
  );
};

export default NewTaskDrawerSubtask;
