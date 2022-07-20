import TextEditor from 'components/common/TextEditor/TextEditor';
import { EditorState } from 'draft-js';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendFaxForTask } from 'actions/task-actions';
import Button from 'components/common/Button/Button';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import Checkbox from 'components/common/Checkbox/Checkbox';

import { closeModal } from 'modal/actions';
import { CommunicationType } from 'helpers/task-helpers';
import ContactsAutoComplete from 'components/common/ContactsAutoComplete/ContactsAutocomplete';
import ReactModal from 'react-modal';
import {
  addStylesToText,
  convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
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
import AddContactStep from '../../AddContactModal/AddContactModal';

const SendFaxFromTaskModal = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(() => EditorState.createEmpty());
  const [faxError, setFaxError] = useState(false);
  const [contact, setContact] = useState(null);
  const [show, setShow] = useState(false);

  const selectedTask = useSelector(selectedTaskSelector);
  const [attachmentsToSend, setAttachmentsToSend] = useState([]);
  const { attachments, identifier } = selectedTask;

  const validAttachments = attachments.filter(attachment => {
    return (
      attachment.contentType === 'application/pdf' ||
      attachment.contentType === 'application/octet-stream'
    );
  });

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

  const handleFaxBlur = event => {
    const faxNumber = event.target.value;
    if (!validateFaxInput(faxNumber)) {
      setFaxError(true);
    } else {
      if (!contact || contact.value !== faxNumber) {
        const [first, middle, last] = makeFaxNumber(faxNumber);
        setContact({ value: `${first}-${middle}-${last}` });
      }
      setFaxError(false);
    }
  };
  const isValidToSend = !!(
    validateFaxInput(contact?.value ?? '') &&
    message.getCurrentContent().hasText()
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
                setMessage(() => EditorState.createEmpty());
                return;
              }
              const text = addStylesToText(newValue?.body ?? '');
              setMessage(EditorState.push(message, text));
            }}
            disabled={show}
          />
          <TextEditorContainerStyled>
            <CustomTextEditor label="Fax Cover Message">
              <TextEditor
                readOnly={false}
                minHeight={100}
                disableMentions
                showToolbar
                state={message}
                onChange={setMessage}
              />
            </CustomTextEditor>
          </TextEditorContainerStyled>
          {validAttachments?.length > 0 && (
            <>
              <InfoHeaderAttachmentsTextStyled>
                Select attachments to include
              </InfoHeaderAttachmentsTextStyled>
              <AttachmentsContainerStyled>
                {validAttachments.map(attachment => {
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
                message: convertFromEditorStateToOutput(message, true)
                  .tokenizedText,
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
