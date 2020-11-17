import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import SimpleArrowRight from 'img/simple-arrow-right';
import { storeAsCurrentTask, toggleCompleteTask } from 'actions/task-actions';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import Member from 'components/members/Member/Member';
import {
  ATTACHMENTS,
  COMMENTS,
  getCalendarIcon,
  getItemIcon,
  getToolTipAttachmentsLabelDetails,
  getToolTipMultiLabelDetails,
  LABELS,
} from 'components/task-item/icons';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
import {
  Container,
  MainSection,
  IconsSection,
  CircleIcon,
  Description,
  DescriptionContainer,
  CompletedBy,
  AssigneeContainer,
  GoToParentIconContainer,
  DueDate,
  DueDateContainer,
  IconContainer,
} from './styled';

const NewTaskDrawerSubtask = ({ subtask, currentUser }) => {
  const dispatch = useDispatch();

  const {
    status,
    edited,
    description,
    tokenizedDescription,
    taskMentions,
    completedBy,
    completedDt,
    assignedTo,
    comments,
    updatedComment,
    dueDate,
    updatedDueDate,
    labels,
    updatedLabel,
    attachments,
    updatedAttachment,
  } = subtask;

  const isCompleted = status === 'COMPLETE';

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
    }),
  );

  return (
    <Container
      onClick={() => {
        storeAsCurrentTask(subtask)(dispatch);
      }}
    >
      <MainSection>
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
              isDrawerEditor
              withEditedLabel={edited}
              state={descriptionState}
              onChange={setDescriptionState}
            />
          </Description>
          <CompletedBy isCompleted={isCompleted}>
            <span>{`Completed by ${completedByName} ${completedDt &&
              ` on ${
                completedDt
                  ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                  : ''
              }`}
                `}</span>
          </CompletedBy>
        </DescriptionContainer>
        <IconsSection>
          <IconContainer marginTop={updatedComment ? -8 : 2}>
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
          </IconContainer>
          <IconContainer marginTop={updatedDueDate ? -6 : 0}>
            <DueDateContainer>
              <DueDate>{dueDate && moment(dueDate).format('MM/DD')}</DueDate>
              <img
                alt="due-date"
                src={getCalendarIcon(
                  dueDate,
                  true,
                  isCompleted,
                  updatedDueDate,
                )}
              />
            </DueDateContainer>
          </IconContainer>
          <IconContainer>
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
          </IconContainer>
          <IconContainer marginTop={2}>
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
          </IconContainer>
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
              <Member member={assignedTo} size={34} showTooltip={false} />
            </UniversalTooltipContainer>
          )}
        </AssigneeContainer>
        <GoToParentIconContainer>
          <img src={SimpleArrowRight} alt="Go to parent task" />
        </GoToParentIconContainer>
      </MainSection>
    </Container>
  );
};

export default NewTaskDrawerSubtask;
