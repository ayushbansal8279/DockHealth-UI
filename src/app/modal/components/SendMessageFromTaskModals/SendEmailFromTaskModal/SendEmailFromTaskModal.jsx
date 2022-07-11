import Button from 'components/common/Button/Button';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Input from 'components/common/Input/Input';
import TextEditor from 'components/common/TextEditor/TextEditor';
import React, { useCallback, useState } from 'react';
import { EditorState } from 'draft-js';
import { useDispatch, useSelector } from 'react-redux';
import {
  addStylesToText,
  convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { sendEmailForTask } from 'actions/task-actions';
import { IconButton } from '@material-ui/core';
import { Replay } from '@material-ui/icons';
import palette from 'styles/palette';
import { validateEmail } from 'helpers/validation-helper';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import ReactModal from 'react-modal';

import { CommunicationType } from 'helpers/task-helpers';
import ContactsAutoComplete from 'components/common/ContactsAutoComplete/ContactsAutocomplete';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
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
  AttachmentContainerStyled,
  AttachmentsContainerStyled,
  IncludeContainerStyled,
  InfoHeaderAttachmentsTextStyled,
  InfoHeaderTextStyled,
  InputContainerStyled,
  TextEditorContainerStyled,
} from '../styled';
import AddContactStep from '../../AddContactModal/AddContactModal';
import TaskCheckBoxes from '../TaskCheckBoxes';
import { renderAddOrEdit } from '../helpers';

const SendEmailFromTaskModal = () => {
  const selectedTask = useSelector(selectedTaskSelector);
  const { attachments, identifier, taskMentions } = selectedTask;
  const dispatch = useDispatch();
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

  const handleEmailBlur = useCallback(
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

  const handleTextEditorReset = useCallback(() => {
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
          <ContactsAutoComplete
            type={CommunicationType.EMAIL}
            placeholder="Type the email address"
            onBlur={handleEmailBlur}
            onChange={(_event, newValue, reason) => {
              if (reason === 'clear') {
                setContact(null);
                return;
              }
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
            error={error}
            autoFocus
            disabled={show}
            label="Email"
            errorMessage="Incorrect email"
          />
          {renderAddOrEdit(contact, setShow)}
          {contact?.identifier && (
            <Input
              type="text"
              label="Recipient’s Name"
              disabled
              value={contact.label}
            />
          )}
          <TemplateAutoComplete
            type={CommunicationType.EMAIL}
            placeholder="Pick template"
            onChange={(_event, newValue, reason) => {
              handleTextEditorReset();
              if (reason === 'clear') {
                setSubject('');
                return;
              }
              const text = addStylesToText(newValue?.body ?? '');
              setDetailsState(EditorState.push(detailsState, text));
              setSubject(newValue?.value ?? '');
            }}
            disabled={show}
          />
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
          <IconButton onClick={handleTextEditorReset}>
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
                recipientContact: contact.value,
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
      <ReactModal
        isOpen={show}
        overlayClassName="modal-overlay"
        className="modal-content"
        onRequestClose={() => {
          setShow(false);
        }}
      >
        <AddContactStep
          type={CommunicationType.EMAIL}
          show={show}
          setContactData={setContact}
          handleShow={setShow}
          email={contact?.value}
          name={contact?.label}
          identifier={contact?.identifier}
        />
      </ReactModal>
    </ModalWrapper>
  );
};

export default SendEmailFromTaskModal;
