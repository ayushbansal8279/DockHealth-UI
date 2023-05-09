import Button from 'components/common/Button/Button';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Input from 'components/common/Input/Input';
import TextEditor from 'components/common/TextEditor/TextEditor';
import React, { useCallback, useState } from 'react';
// import { EditorState } from 'draft-js';
import { useDispatch, useSelector } from 'react-redux';
import {
  // addStylesToText,
  convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { sendEmailForTask } from 'actions/task-actions';
import { IconButton } from '@mui/material';
import { Replay } from '@mui/icons-material';
import palette from 'styles/palette';
import { validateEmail } from 'helpers/validation-helper';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import ReactModal from 'react-modal';
import { getTemplateDetails } from 'api/template-api';
import { CommunicationType } from 'helpers/task-helpers';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
import EmailContactsAutoComplete from 'components/common/EmailContactsAutoComplete/EmailContactsAutoComplete';
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
  LabelName,
  LabelValue,
  ContactInfoRow,
  AddEditContactLink,
} from '../styled';
import AddContactStep from '../../AddContactModal/AddContactModal';
import TaskCheckBoxes from '../TaskCheckBoxes';
import { renderAddOrEdit } from '../helpers';

const SendEmailFromTaskModal = () => {
  const selectedTask = useSelector(selectedTaskSelector);
  const { attachments, identifier, taskMentions } = selectedTask;
  const dispatch = useDispatch();
  const [subject, setSubject] = useState('');
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState([]);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [isTaskDescriptionIncluded, setIsTaskDescriptionIncluded] =
    useState(false);
  const [isTaskDetailsIncluded, setIsTaskDetailsIncluded] = useState(false);

  const [isTaskCommentsIncluded, setIsTaskCommentsIncluded] = useState(false);

  const [detailsState, setDetailsState] = useState(() =>
    // EditorState.createEmpty(),
    {},
  );

  const [attachmentsToSend, setAttachmentsToSend] = useState([]);
  const insertTextFromTask = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (meta) => {
      // const currentState = convertFromEditorStateToOutput(detailsState, true);
      // const newState = createMentionEntities(
      //   `${currentState.meta}\n ${meta.meta}`,
      //   `${currentState.tokenizedText}\n${meta.tokenized}`,
      //   [...currentState.mentions, taskMentions],
      //   true,
      // );
      // setDetailsState(EditorState.push(detailsState, newState));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [detailsState, taskMentions],
  );

  const handleEmailBlur = useCallback(
    (event) => {
      const emailValue = event.target.value;

      if (contacts.length === 0) {
        setContacts([
          ...contacts,
          {
            value: emailValue,
          },
        ]);
      }
      setError(false);
    },
    [contacts],
  );

  const handleTextEditorReset = useCallback(() => {
    setIsTaskCommentsIncluded(false);
    setIsTaskDescriptionIncluded(false);
    setIsTaskDetailsIncluded(false);
    // setDetailsState(EditorState.createEmpty());
  }, []);

  const addAttachmentHandler = useCallback(
    (id) => {
      if (attachmentsToSend.includes(id)) {
        const newAttachments = attachmentsToSend.filter(
          (attachment) => attachment !== id,
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
          <EmailContactsAutoComplete
            type={CommunicationType.EMAIL}
            placeholder="Type the email address or name of the contact"
            onBlur={handleEmailBlur}
            onChange={(_event, newValue, reason) => {
              if (reason === 'clear') {
                setContacts([]);
                return;
              }
              if (typeof newValue === 'string') {
                if (validateEmail(newValue)) {
                  setContacts([...contacts, { value: newValue }]);
                } else {
                  setError(true);
                }
              } else {
                setContacts([...newValue]);
              }
            }}
            error={error}
            disabled={show}
            label="Email"
            errorMessage="Incorrect email"
            setShow={setShow}
            newContact={newContact}
            setNewContact={setNewContact}
            patient={selectedTask?.patient}
          />
          <ContactInfoRow>
            <div>
              <LabelName>Recipient: </LabelName>
              {contacts.map(
                contact =>
                  contact?.identifier && (
                    <LabelValue>{contact.label}</LabelValue>
                  ),
              )}
            </div>
            <AddEditContactLink>
              {renderAddOrEdit(null, setShow)}
            </AddEditContactLink>
          </ContactInfoRow>
          <TemplateAutoComplete
            type={CommunicationType.EMAIL}
            placeholder="Pick template"
            onChange={(_event, newValue, reason) => {
              handleTextEditorReset();
              if (reason === 'clear') {
                setSubject('');
                return;
              }
              getTemplateDetails(newValue?.identifier, identifier).then(
                data => {
                  const text = addStylesToText(data?.details ?? '');
                  setDetailsState(EditorState.push(detailsState, text));
                  setSubject(data?.shortMessage ?? '');
                },
              );
            }}
            disabled={show}
          />
          <Input
            type="text"
            label="subject"
            name="email"
            placeholder="Type the email subject"
            shrink
            onChange={(event) => setSubject(event.target.value)}
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
              maxHeight={200}
            />
          </CustomTextEditor>
        </TextEditorContainerStyled>
        {attachments?.length > 0 && (
          <>
            <InfoHeaderAttachmentsTextStyled>
              Select attachments to include
            </InfoHeaderAttachmentsTextStyled>
            <AttachmentsContainerStyled>
              {attachments.map((attachment) => {
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
            // !validateEmail(contact?.value) ||
            contacts.length === 0 || !detailsState.getCurrentContent().hasText()
          }
          onClick={() => {
            dispatch(
              sendEmailForTask({
                message: subject,
                details: convertFromEditorStateToOutput(detailsState, true)
                  .tokenizedText,
                recipientContacts: contacts.map(c => c.value),
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
        overlayClassName="bring-to-front modal-overlay"
        className="modal-content"
        onRequestClose={() => {
          setShow(false);
        }}
        style={{ zIndex: '6001 !important' }}
      >
        <AddContactStep
          type={CommunicationType.EMAIL}
          show={show}
          setContactData={contact => {
            setContacts([...contacts, contact]);
            setNewContact(contact);
          }}
          handleShow={setShow}
          email={newContact?.value}
          name={newContact?.label}
          identifier={newContact?.identifier}
        />
      </ReactModal>
    </ModalWrapper>
  );
};

export default SendEmailFromTaskModal;
