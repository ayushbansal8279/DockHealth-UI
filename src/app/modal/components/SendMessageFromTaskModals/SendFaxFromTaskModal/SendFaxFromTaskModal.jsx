import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendFaxForTask } from 'actions/task-actions';
import Button from 'components/common/Button/Button';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { getTemplateDetails } from 'api/template-api';
import { closeModal } from 'modal/actions';
import { CommunicationType } from 'helpers/task-helpers';
import ContactsAutoComplete from 'components/common/ContactsAutoComplete/ContactsAutocomplete';
import ReactModal from 'react-modal';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
import AddContactStep from 'modal/components/AddContactModal/AddContactModal';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
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
  InfoHeaderAttachmentsTextStyled,
  InputContainerStyled,
  TextEditorContainerStyled,
  LabelName,
  LabelValue,
  ContactInfoRow,
  AddEditContactLink,
} from '../styled';
import { makeFaxNumber, renderAddOrEdit, validateFaxInput } from '../helpers';

const SendFaxFromTaskModal = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);
  const [faxError, setFaxError] = useState(false);
  const [contact, setContact] = useState(null);
  const [show, setShow] = useState(false);

  const selectedTask = useSelector(selectedTaskSelector);
  const [attachmentsToSend, setAttachmentsToSend] = useState([]);
  const { attachments, identifier } = selectedTask;

  const validAttachments = attachments.filter((attachment) => {
    return (
      attachment.contentType === 'application/pdf' ||
      attachment.contentType === 'application/octet-stream'
    );
  });

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

  const handleFaxBlur = (event) => {
    const faxNumber = event.target.value;
    if (validateFaxInput(faxNumber)) {
      if (!contact || contact.value !== faxNumber) {
        const [first, middle, last] = makeFaxNumber(faxNumber);
        setContact({ value: `${first}-${middle}-${last}` });
      }
      setFaxError(false);
    } else {
      setFaxError(true);
    }
  };
  const isValidToSend = !!(
    validateFaxInput(contact?.value ?? '') &&
    message &&
    message !== ''
  );

  const handleMessageChange = useCallback(
    (paramters, { value }) => {
      setMessage(value);
    },
    [setMessage],
  );

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>Send fax</ModalHeader>
        <ModalDescription>Send a fax for this task</ModalDescription>
      </ModalHeaderContainerStyled>
      <ModalDescriptionContainer>
        <InputContainerStyled>
          <ContactsAutoComplete
            type={CommunicationType.FAX}
            placeholder="Type the fax number or name of the contact"
            onBlur={handleFaxBlur}
            onChange={(event, newValue, reason) => {
              if (reason === 'clear') {
                setContact(null);
                return;
              }
              if (typeof newValue === 'string') {
                if (validateFaxInput(newValue)) {
                  const [first, middle, last] = makeFaxNumber(newValue);
                  setContact({ value: `${first}-${middle}-${last}` });
                } else {
                  setFaxError(true);
                }
              } else {
                setContact(newValue);
              }
            }}
            error={faxError}
            autoFocus
            label="Fax"
            errorMessage="Incorrect fax number"
            disabled={show}
            value={contact?.value ?? ''}
            patient={selectedTask?.patient}
          />
          <ContactInfoRow>
            {contact?.identifier && (
              <div>
                <LabelName>Recipient: </LabelName>
                <LabelValue>{contact.label}</LabelValue>
              </div>
            )}
            <AddEditContactLink>
              {renderAddOrEdit(contact, setShow)}
            </AddEditContactLink>
          </ContactInfoRow>
          <TemplateAutoComplete
            type={CommunicationType.FAX}
            placeholder="Pick template"
            onChange={(event, newValue, reason) => {
              if (reason === 'clear') {
                setMessage('');
                setMessage('');
              }
              getTemplateDetails(newValue?.identifier, identifier).then(
                (data) => {
                  setMessage((previous) => `${previous} ${data?.details}`);
                },
              );
            }}
            disabled={show}
          />
          <TextEditorContainerStyled>
            <CustomTextEditor label="Fax Cover Message">
              <RichTextEditor
                value={message}
                placeholder="Fax Message"
                onChange={setMessage}
                onBlur={setMessage}
                initOnClick
                showCharCount
              />
            </CustomTextEditor>
          </TextEditorContainerStyled>
          {validAttachments?.length > 0 && (
            <>
              <InfoHeaderAttachmentsTextStyled>
                Select attachments to include
              </InfoHeaderAttachmentsTextStyled>
              <AttachmentsContainerStyled>
                {validAttachments.map((attachment) => {
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
        </InputContainerStyled>
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
          disabled={faxError || !isValidToSend}
          onClick={() => {
            dispatch(
              sendFaxForTask({
                message,
                recipientContact: contact?.value.replace(/\D/g, ''),
                // taskAttachmentIdentifiers: attachments,
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
          type={CommunicationType.FAX}
          show={show}
          setContactData={setContact}
          handleShow={setShow}
          fax={contact?.value}
          name={contact?.label}
          identifier={contact?.identifier}
        />
      </ReactModal>
    </ModalWrapper>
  );
};

export default SendFaxFromTaskModal;
