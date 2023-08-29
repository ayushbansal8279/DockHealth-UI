import Button from 'components/common/Button/Button';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Input from 'components/common/Input/Input';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { sendEmailForTask } from 'actions/task-actions';
import { IconButton } from '@mui/material';
import { Replay } from '@mui/icons-material';
import palette from 'styles/palette';
// import { validateEmail } from 'helpers/validation-helper';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import ReactModal from 'react-modal';
import { getTemplateDetails } from 'api/template-api';
import { CommunicationType } from 'helpers/task-helpers';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
import EmailContactsAutoComplete from 'components/common/EmailContactsAutoComplete/EmailContactsAutoComplete';
import { closeModal } from 'modal/actions';
import AddContactStep from 'modal/components/AddContactModal/AddContactModal';
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
import TaskCheckBoxes from '../TaskCheckBoxes';
import { renderAddOrEdit } from '../helpers';

const SendEmailFromTaskModal = () => {
  const selectedTask = useSelector(selectedTaskSelector);
  const { attachments, identifier } = selectedTask;
  const dispatch = useDispatch();
  const [subject, setSubject] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [newContact, setNewContact] = useState([]);
  const [error] = useState(false);
  const [show, setShow] = useState(false);
  const [isTaskDescriptionIncluded, setIsTaskDescriptionIncluded] =
    useState(false);
  const [isTaskDetailsIncluded, setIsTaskDetailsIncluded] = useState(false);

  const [isTaskCommentsIncluded, setIsTaskCommentsIncluded] = useState(false);

  const [detailsState, setDetailsState] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const [attachmentsToSend, setAttachmentsToSend] = useState([]);
  const insertTextFromTask = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (meta) => {
      // setDetailsState((previous) => `${previous} ${meta.tokenized}`);
      const updatedValue = detailsState
        ? `${detailsState} \n\r ${meta?.tokenized ?? ''}`
        : meta?.tokenized ?? '';
      setDefaultValue(updatedValue);
      setDetailsState(updatedValue);
    },
    [detailsState],
  );

  // const handleEmailBlur = useCallback(
  //   (event) => {
  //     const emailValue = event.target.value;

  //     if (contacts.length === 0) {
  //       setContacts([
  //         ...contacts,
  //         {
  //           value: emailValue,
  //         },
  //       ]);
  //     }
  //     setError(false);
  //   },
  //   [contacts],
  // );

  const handleTextEditorReset = useCallback(() => {
    setIsTaskCommentsIncluded(false);
    setIsTaskDescriptionIncluded(false);
    setIsTaskDetailsIncluded(false);
    setDetailsState('');
    setDefaultValue('');
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

  const handleContactsOnChange = useCallback(
    (_event, newValue, reason) => {
      console.log(newValue);
      if (reason === 'clear') {
        setSelectedContacts([]);
        return;
      }
      if (typeof newValue === 'string') {
        // if (validateEmail(newValue)) {
        setSelectedContacts([...selectedContacts, { value: newValue }]);
        // } else {
        //   setError(true);
        // }
      } else {
        setSelectedContacts([...newValue]);
      }
    },
    [selectedContacts],
  );

  const handleTextEditorChange = (value) => {
    setDetailsState(value);
  };

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
            // onBlur={handleEmailBlur}
            onChange={handleContactsOnChange}
            error={error}
            label="Email"
            errorMessage="Incorrect email"
            disabled={show}
            setShow={setShow}
            newContact={newContact}
            setNewContact={setNewContact}
            patient={selectedTask?.patient}
          />
          <ContactInfoRow>
            <div>
              <LabelName>Recipient: </LabelName>
              {selectedContacts.map(
                (contact, index) =>
                  contact?.identifier && (
                    <LabelValue>
                      {contact.label}{' '}
                      {index < selectedContacts.length - 1 ? ', ' : ' '}
                    </LabelValue>
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
                (data) => {
                  // const text = addStylesToText(data?.details ?? '');
                  // setDetailsState(EditorState.push(detailsState, text));
                  const updatedValue = detailsState
                    ? `${detailsState} ${data?.details ?? ''}`
                    : data?.details ?? '';
                  setDefaultValue(updatedValue);
                  setDetailsState(updatedValue);
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
            <RichTextEditor
              value={detailsState}
              defaultValue={defaultValue}
              readOnly={false}
              placeholder="Email Body"
              onChange={handleTextEditorChange}
              initOnClick
              showCharCount
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
            selectedContacts.length === 0 // || !detailsState.getCurrentContent().hasText()
          }
          onClick={() => {
            dispatch(
              sendEmailForTask({
                message: subject,
                details: detailsState,
                recipientContacts: selectedContacts.map((c) => c.value),
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
          setContactData={(contact) => {
            setSelectedContacts([...selectedContacts, contact]);
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
