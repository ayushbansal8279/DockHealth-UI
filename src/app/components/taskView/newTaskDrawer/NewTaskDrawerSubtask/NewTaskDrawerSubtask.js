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
  LABELS,
} from 'components/task-item/icons';
import {
  Container,
  MainSection,
  IconsSection,
  CircleIcon,
  Description,
  DescriptionContainer,
  CompletedBy,
  AssigneeContainer,
  GoToParentButton,
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
    <Container>
      <MainSection>
        <CircleIcon
          src={isCompleted ? CircleCompleted : Circle}
          isCompleted={isCompleted}
          isClickable
          onClick={() => {
            dispatch(toggleCompleteTask(subtask, currentUser));
          }}
        />
        <DescriptionContainer>
          <Description isCrossedOut={isCompleted}>
            <MentionsEditor
              readOnly
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
        <AssigneeContainer>
          {assignedTo && <Member member={assignedTo} size={34} />}
        </AssigneeContainer>
        <GoToParentButton
          onClick={() => {
            storeAsCurrentTask(subtask)(dispatch);
          }}
        >
          <img src={SimpleArrowRight} alt="Go to parent task" />
        </GoToParentButton>
      </MainSection>
      <IconsSection>
        <IconContainer marginTop={updatedComment ? -8 : 2}>
          <img
            alt="comments"
            src={getItemIcon(COMMENTS, comments, true, updatedComment)}
          />
        </IconContainer>
        <IconContainer marginTop={updatedDueDate ? -6 : 0}>
          <DueDateContainer>
            <DueDate>{dueDate && moment(dueDate).format('MM/DD')}</DueDate>
            <img
              alt="due-date"
              src={getCalendarIcon(dueDate, true, isCompleted, updatedDueDate)}
            />
          </DueDateContainer>
        </IconContainer>
        <IconContainer>
          <img
            alt="labels"
            src={getItemIcon(LABELS, labels, true, updatedLabel)}
          />
        </IconContainer>
        <IconContainer marginTop={2}>
          <img
            alt="attachments"
            src={getItemIcon(ATTACHMENTS, attachments, true, updatedAttachment)}
          />
        </IconContainer>
      </IconsSection>
    </Container>
  );
};

export default NewTaskDrawerSubtask;
