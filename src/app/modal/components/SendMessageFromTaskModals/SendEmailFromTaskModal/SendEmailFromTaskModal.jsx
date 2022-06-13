/* eslint-disable @typescript-eslint/camelcase */
import Button from 'components/common/Button/Button';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Input from 'components/common/Input/Input';
import TextEditor from 'components/common/TextEditor/TextEditor';
import React, { useCallback, useState } from 'react';
import { EditorState } from 'draft-js';

import { useDispatch, useSelector } from 'react-redux';
import {
  convertFromEditorStateToOutput,
  substituteNameForIdInTokenizedText,
} from 'components/common/TextEditor/helpers';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { sendEmailForTask } from 'actions/task-actions';
import { IconButton } from '@material-ui/core';
import { Replay } from '@material-ui/icons';
import palette from 'styles/palette';
import { validateEmail } from 'helpers/validation-helper';
import { formatDate } from 'helpers/formatters';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import {
  CloseIcon,
  CloseIconButton,
  ModalDescription,
  ModalDescriptionContainer,
  ModalFooterStyled,
  ModalHeader,
  ModalHeaderContainerStyled,
  ModalWrapper,
  TextWaringStyled,
} from '../../styled';
import {
  CheckboxContainerStyled,
  IncludeContainerStyled,
  InfoHeaderTextStyled,
  TextEditorContainerStyled,
} from './styled';
import { closeModal } from '../../../actions';
import {
  AttachmentContainerStyled,
  AttachmentsContainerStyled,
  InfoHeaderAttachmentsTextStyled,
  InputContainerStyled,
} from '../styled';

const SendEmailFromTaskModal = () => {
  const selectedTask = useSelector(selectedTaskSelector);
  const {
    details,
    comments,
    attachments,
    identifier,
    description,
    tokenizedDescription,
    taskMentions,
    tokenizedDetails,
  } = selectedTask;
  const dispatch = useDispatch();
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

  const [attachmentsToSend, setAttachmentsToSend] = useState([]);

  const insertTextFromTask = useCallback(
    meta => {
      const currentState = convertFromEditorStateToOutput(detailsState, true);
      const newState = createMentionEntities(
        `${currentState.meta}\n ${meta.meta}`,
        `${currentState.tokenizedText}\n${meta.tokenized}`,
        [...currentState.mentions, taskMentions],
        true,
      );

      setDetailsState(EditorState.push(detailsState, newState));
    },
    [detailsState, taskMentions],
  );

  const includeCheckBoxes = [
    {
      label: 'Task Description',
      value: isTaskDescriptionIncluded,
      onClick: () => {
        const flag = !isTaskDescriptionIncluded;
        if (flag) {
          setIsTaskDescriptionIncluded(flag);
          insertTextFromTask({
            meta: description,
            name: '_DESCRIPTION_',
            tokenized: substituteNameForIdInTokenizedText(
              tokenizedDescription,
              taskMentions,
            ),
          });
        }
      },
    },
    {
      label: 'Task Details',
      value: isTaskDetailsIncluded,
      onClick: () => {
        const flag = !isTaskDetailsIncluded;
        if (flag) {
          setIsTaskDetailsIncluded(flag);
          insertTextFromTask({
            meta: details,
            tokenized: substituteNameForIdInTokenizedText(
              tokenizedDetails,
              taskMentions,
            ),
          });
        }
      },
    },
    {
      label: 'Task Comments',
      value: isTaskCommentsIncluded,
      onClick: () => {
        const flag = !isTaskCommentsIncluded;
        if (flag) {
          setIsTaskCommentsIncluded(flag);
          const commentsContent = comments
            .map(comment => {
              return `Comment by ${comment.creator.name} at ${formatDate(
                comment.dateCreated,
              )} \n ${comment.tokenizedComment}`;
            })
            .join('\n');
          insertTextFromTask({
            meta: commentsContent,
            tokenized: commentsContent,
            name: '_COMMENTS_',
          });
        }
      },
    },
  ];

  const handleBlur = useCallback(event => {
    const emailValue = event.target.value;
    if (!validateEmail(emailValue)) {
      setError(true);
    } else {
      setError(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setIsTaskCommentsIncluded(false);
    setIsTaskDescriptionIncluded(false);
    setIsTaskDetailsIncluded(false);
    setDetailsState(EditorState.createEmpty());
  }, []);

  const addAttachmentHandler = useCallback(
    id => {
      if (attachmentsToSend.includes(id)) {
        const newAttachments = attachmentsToSend.filter(
          attachment => attachment !== id,
        );
        setAttachmentsToSend(newAttachments);
      } else {
        setAttachmentsToSend([...attachmentsToSend, id]);
      }
    },
    [attachmentsToSend],
  );

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
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
            placeholder="Type the email address"
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
            placeholder="Type the email subject"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={event => setSubject(event.target.value)}
            value={subject}
          />
        </InputContainerStyled>
        <IncludeContainerStyled>
          <InfoHeaderTextStyled>Include the following</InfoHeaderTextStyled>
          <IconButton onClick={handleReset}>
            <Replay htmlColor={palette.coolGrey9} />
          </IconButton>
        </IncludeContainerStyled>
        {includeCheckBoxes.map(checkbox => {
          return (
            <CheckboxContainerStyled key={checkbox.label}>
              <Checkbox
                size={18}
                onClick={checkbox.onClick}
                isChecked={checkbox.value}
                isDisabled={checkbox.value}
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
            state={detailsState}
            onChange={setDetailsState}
            placeholder=" Email body"
          />
        </TextEditorContainerStyled>
        {attachments?.length > 0 && (
          <>
            <InfoHeaderAttachmentsTextStyled>
              Select attachments to include
            </InfoHeaderAttachmentsTextStyled>
            <AttachmentsContainerStyled>
              {attachments.map(attachment => {
                return (
                  <AttachmentContainerStyled
                    key={attachment.attachmentIdentifier}
                  >
                    <Checkbox
                      size={18}
                      onClick={() =>
                        addAttachmentHandler(attachment.attachmentIdentifier)
                      }
                      isChecked={attachmentsToSend.includes(
                        attachment.attachmentIdentifier,
                      )}
                    />
                    <span>{attachment.fileName}</span>
                  </AttachmentContainerStyled>
                );
              })}
            </AttachmentsContainerStyled>
          </>
        )}
        <TextWaringStyled>
          Disclaimer: Please be aware, you may be sharing protected health
          information outside of your organization
        </TextWaringStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        <Button
          uppercase
          width="150px"
          variant="primary"
          disabled={
            !validateEmail(email) || !detailsState.getCurrentContent().hasText()
          }
          onClick={() => {
            dispatch(
              sendEmailForTask({
                message: subject,
                details: convertFromEditorStateToOutput(detailsState, true)
                  .tokenizedText,
                recipientContact: email,
                taskAttachmentIdentifiers: attachmentsToSend,
                taskIdentifier: identifier,
              }),
            );
            dispatch(closeModal());
          }}
        >
          send
        </Button>
      </ModalFooterStyled>
    </ModalWrapper>
  );
};

export default SendEmailFromTaskModal;
