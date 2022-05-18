import Button from 'components/common/Button/Button';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Input from 'components/common/Input/Input';
import TextEditor from 'components/common/TextEditor/TextEditor';
import React, { useCallback, useState } from 'react';
import { EditorState, SelectionState, Modifier } from 'draft-js';
import moment from 'moment';

import {
  CloseIcon,
  CloseIconButton,
  ModalDescription,
  ModalDescriptionContainer,
  ModalFooterStyled,
  ModalHeader,
  ModalHeaderContainerStyled,
  ModalWrapper,
} from '../styled';
import {
  AttachmentContainerStyled,
  AttachmentsContainerStyled,
  CheckboxContainerStyled,
  InfoHeaderTextStyled,
  InputContainerStyled,
  TextEditorContainerStyled,
  TextWaringStyled,
} from './styled';

const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(/^\S+@\S+$/i);
};

const calculateDate = date => {
  let dateLabel = '';

  if (moment(date).isSame(new Date(), 'd')) {
    dateLabel = 'Today';
  } else if (moment(date).isSame(moment().subtract(1, 'days'), 'd')) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = moment(date).format('MM/DD/YYYY');
  }

  return `${dateLabel} @ ${moment(date).format('h:mma')}`;
};

const SendEmailFromTaskModal = ({
  closeModalHandler,
  taskDescription,
  taskDetails,
  taskComments,
  taskAttachments,
}) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState(false);
  const [isTaskDescriptionIncluded, setIsTaskDescriptionIncluded] = useState(
    false,
  );
  const [isTaskDetailsIncluded, setIsTaskDetailsIncluded] = useState(false);

  const [isTaskCommentsIncluded, setIsTaskCommentsIncluded] = useState(false);

  const [detailsState, setDetailsState] = useState(() =>
    EditorState.createEmpty(),
  );
  const newLocal = 'insert-characters';
  const includeCheckBoxes = [
    {
      label: 'Task Description',
      value: isTaskDescriptionIncluded,
      onClick: () => {
        const flag = !isTaskDescriptionIncluded;
        setIsTaskDescriptionIncluded(flag);
        if (flag) {
          const currentContent = detailsState.getCurrentContent();
          const blockMap = currentContent.getBlockMap();
          const key = blockMap.last().getKey();
          const length = blockMap.last().getLength();
          const selection = new SelectionState({
            anchorKey: key,
            anchorOffset: length,
            focusKey: key,
            focusOffset: length,
          });
          const textWithInsert = Modifier.insertText(
            currentContent,
            selection,
            `${taskDescription}\n`,
            null,
          );

          const editorWithInsert = EditorState.push(
            detailsState,
            textWithInsert,
            newLocal,
          );
          const newEditorState = EditorState.moveSelectionToEnd(
            editorWithInsert,
            textWithInsert.getSelectionAfter(),
          );
          setDetailsState(newEditorState);
        }
      },
    },
    {
      label: 'Task Details',
      value: isTaskDetailsIncluded,
      onClick: () => {
        const flag = !isTaskDetailsIncluded;
        setIsTaskDetailsIncluded(flag);
        if (flag) {
          const currentContent = detailsState.getCurrentContent();
          const blockMap = currentContent.getBlockMap();
          const key = blockMap.last().getKey();
          const length = blockMap.last().getLength();
          const selection = new SelectionState({
            anchorKey: key,
            anchorOffset: length,
            focusKey: key,
            focusOffset: length,
          });
          const textWithInsert = Modifier.insertText(
            currentContent,
            selection,
            `${taskDetails}\n`,
            null,
          );
          const editorWithInsert = EditorState.push(
            detailsState,
            textWithInsert,
            newLocal,
          );
          const newEditorState = EditorState.moveSelectionToEnd(
            editorWithInsert,
            textWithInsert.getSelectionAfter(),
          );
          setDetailsState(newEditorState);
        }
      },
    },
    {
      label: 'Task Comments',
      value: isTaskCommentsIncluded,
      onClick: () => {
        const flag = !isTaskCommentsIncluded;
        setIsTaskCommentsIncluded(flag);
        if (flag) {
          const currentContent = detailsState.getCurrentContent();
          const blockMap = currentContent.getBlockMap();
          const key = blockMap.last().getKey();
          const length = blockMap.last().getLength();
          const selection = new SelectionState({
            anchorKey: key,
            anchorOffset: length,
            focusKey: key,
            focusOffset: length,
          });
          const textWithInsert = Modifier.insertText(
            currentContent,
            selection,
            taskComments
              .map(comment => {
                return `Comment by ${comment.creator.name} at ${calculateDate(
                  comment.dateCreated,
                )}`;
              })
              .join('\n'),
            null,
          );
          const editorWithInsert = EditorState.push(
            detailsState,
            textWithInsert,
            newLocal,
          );
          const newEditorState = EditorState.moveSelectionToEnd(
            editorWithInsert,
            textWithInsert.getSelectionAfter(),
          );
          setDetailsState(newEditorState);
        }
      },
    },
  ];

  const [attachments, setAttachments] = useState([]);

  const handleBlur = event => {
    const emailValue = event.target.value;
    if (!validateEmail(emailValue)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const addAttachmentHandler = id => {
    if (attachments.includes(id)) {
      setAttachments(attachments.filter(attachment => attachment !== id));
    } else {
      setAttachments([...attachments, id]);
    }
  };

  const onChangeDetailsEditor = useCallback(
    state => {
      setDetailsState(state);
    },
    [setDetailsState],
  );

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={closeModalHandler}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>Send email</ModalHeader>
        <ModalDescription>Send an email for this task</ModalDescription>
      </ModalHeaderContainerStyled>
      <ModalDescriptionContainer>
        <InputContainerStyled>
          <Input
            type="email"
            label="email"
            name="email"
            placeholder="type the email address"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event => setEmail(event.target.value)}
            onBlur={handleBlur}
            value={email}
            autoFocus
            helperText={error ? 'Incorrect email' : null}
            error={error}
          />
          <Input
            type="text"
            label="subject"
            name="email"
            placeholder="type the email subject"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event => setSubject(event.target.value)}
            value={subject}
          />
        </InputContainerStyled>
        <InfoHeaderTextStyled>Include the following</InfoHeaderTextStyled>
        {includeCheckBoxes.map(checkbox => {
          return (
            <CheckboxContainerStyled key={checkbox.label}>
              <Checkbox
                size={18}
                onClick={checkbox.onClick}
                isChecked={checkbox.value}
              />
              <span>{checkbox.label}</span>
            </CheckboxContainerStyled>
          );
        })}
        <TextEditorContainerStyled>
          <TextEditor
            readOnly={false}
            minHeight={100}
            disableMentions
            showToolbar
            placeholder="Add a message to your invitation add copy instructions here."
            state={detailsState}
            onChange={onChangeDetailsEditor}
          />
        </TextEditorContainerStyled>
        {taskAttachments && (
          <>
            <InfoHeaderTextStyled>
              Select attachments to include
            </InfoHeaderTextStyled>
            <AttachmentsContainerStyled>
              {taskAttachments?.map(attachment => {
                return (
                  <AttachmentContainerStyled key={attachment.attachmentId}>
                    <Checkbox
                      size={18}
                      onClick={() =>
                        addAttachmentHandler(attachment.attachmentId)
                      }
                      isChecked={attachments.includes(attachment.attachmentId)}
                    />
                    <span>{attachment.fileName}</span>
                  </AttachmentContainerStyled>
                );
              })}
            </AttachmentsContainerStyled>
          </>
        )}
        <TextWaringStyled>
          Disclaimer / Explainer - that PHI is being shared external to their
          team / organization
        </TextWaringStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        <Button
          uppercase
          width="150px"
          variant="primary"
          onClick={() => {
            closeModalHandler();
          }}
        >
          send
        </Button>
      </ModalFooterStyled>
    </ModalWrapper>
  );
};

export default SendEmailFromTaskModal;
