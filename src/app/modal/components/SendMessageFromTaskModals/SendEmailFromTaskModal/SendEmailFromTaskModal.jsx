import Button from 'components/common/Button/Button';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Input from 'components/common/Input/Input';
import TextEditor from 'components/common/TextEditor/TextEditor';
import React, { useCallback, useRef, useState } from 'react';
import { EditorState } from 'draft-js';
import { useDispatch, useSelector } from 'react-redux';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { sendEmailForTask } from 'actions/task-actions';
import { IconButton } from '@material-ui/core';
import { Replay } from '@material-ui/icons';
import palette from 'styles/palette';
import { validateEmail } from 'helpers/validation-helper';
import CustomTextEditor from 'components/task-drawer/CustomTextEditor/CustomTextEditor';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';

import { CommunicationType } from 'helpers/task-helpers';
import ContactsAutocomplete from 'components/common/ContactsAutoComplete/ContactsAutocomplete';
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
import { closeModal } from '../../../actions';
import {
  AddEditLabelStyled,
  AttachmentContainerStyled,
  AttachmentsContainerStyled,
  IncludeContainerStyled,
  InfoHeaderAttachmentsTextStyled,
  InfoHeaderTextStyled,
  InputContainerStyled,
  TextEditorContainerStyled,
} from '../styled';
import AddContactStep from '../../AddContactStep/AddContactStep';
import TaskCheckBoxes from '../TaskCheckBoxes';

const SendEmailFromTaskModal = () => {
  const selectedTask = useSelector(selectedTaskSelector);
  const { attachments, identifier, taskMentions } = selectedTask;
  const dispatch = useDispatch();
  const portalReference = useRef(null);
  const [subject, setSubject] = useState('');
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
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

  const handleBlur = useCallback(
    event => {
      const emailValue = event.target.value;

      if (!validateEmail(emailValue)) {
        setError(true);
        setContact(null);
      } else {
        if (!contact) {
          setContact({
            value: emailValue,
          });
        }
        setError(false);
      }
    },
    [contact],
  );

  const renderAddOrEdit = () => {
    if (contact && !contact.value && !contact.identifier)
      return (
        <AddEditLabelStyled onClick={() => setShow(true)}>
          Add Contact
        </AddEditLabelStyled>
      );
    if (contact && contact.identifier)
      return (
        <AddEditLabelStyled onClick={() => setShow(true)}>
          Edit Contact
        </AddEditLabelStyled>
      );
    return null;
  };

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
          <ContactsAutocomplete
            type="email"
            placeholder="Type the email address"
            onBlur={handleBlur}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                if (validateEmail(newValue)) {
                  setContact({ value: newValue });
                } else {
                  setError(true);
                }
              } else {
                setContact(newValue);
              }
            }}
            handleCloseIcon={() => setContact(null)}
            error={error}
            autoFocus
          />
          {renderAddOrEdit()}
          {contact?.identifier && (
            <Input
              type="text"
              label="Recipient’s Email"
              disabled
              value={contact.label}
            />
          )}
          <div ref={portalReference}>
            {show && (
              <AddContactStep
                type={CommunicationType.EMAIL}
                show={show}
                setContactData={setContact}
                handleShow={setShow}
                email={contact.value}
                name={contact.label}
                container={portalReference.current}
                identifier={contact.identifier}
              />
            )}
          </div>
          <Input
            type="text"
            label="subject"
            name="email"
            placeholder="Type the email subject"
            shrink
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
        <TaskCheckBoxes
          isTaskDescriptionIncluded={isTaskDescriptionIncluded}
          setIsTaskDescriptionIncluded={setIsTaskDescriptionIncluded}
          isTaskDetailsIncluded={isTaskDetailsIncluded}
          setIsTaskDetailsIncluded={setIsTaskDetailsIncluded}
          isTaskCommentsIncluded={isTaskCommentsIncluded}
          setIsTaskCommentsIncluded={setIsTaskCommentsIncluded}
          insertTextFromTask={insertTextFromTask}
          selectedTask={selectedTask}
        />
        <TextEditorContainerStyled>
          <CustomTextEditor label="Email body">
            <TextEditor
              readOnly={false}
              minHeight={100}
              disableMentions
              showToolbar
              state={detailsState}
              onChange={setDetailsState}
            />
          </CustomTextEditor>
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
            !validateEmail(contact?.value) ||
            !detailsState.getCurrentContent().hasText()
          }
          onClick={() => {
            dispatch(
              sendEmailForTask({
                message: subject,
                details: convertFromEditorStateToOutput(detailsState, true)
                  .tokenizedText,
                recipientContact: contact.email,
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
