import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'components/common/Button/Button';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { sendESignForTask } from 'actions/task-actions';
import { closeModal } from 'modal/actions';
import { CommunicationType } from 'helpers/task-helpers';
import Spacing from 'components/common/Spacing';
import ContactsAutoComplete from 'components/common/ContactsAutoComplete/ContactsAutocomplete';
import ReactModal from 'react-modal';
import ESignatureTemplateAutoComplete from 'components/integration/ESignatureTemplateAutoComplete/ESignatureTemplateAutoComplete';
import { validateEmail } from 'helpers/validation-helper';
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
  InputContainerStyled,
  LabelName,
  LabelValue,
  ContactInfoRow,
  AddEditContactLink,
} from '../styled';
import { renderAddOrEdit } from '../helpers';
import { ConfirmButton } from '../../ModalButton/ModalButtons';

const SendESignFromTaskModal = () => {
  const dispatch = useDispatch();
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [templateId, setTemplateId] = useState(false);
  const [templateName, setTemplateName] = useState(false);

  const selectedTask = useSelector(selectedTaskSelector);

  const handleEmailBlur = useCallback(
    (event) => {
      const emailValue = event.target.value;

      if (validateEmail(emailValue)) {
        if (!contact) {
          setContact({
            value: emailValue,
          });
        }
        setError(false);
      } else {
        setError(true);
        setContact(null);
      }
    },
    [contact],
  );

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>Send for E-Signature</ModalHeader>
        <ModalDescription>
          Send a templated document for e-signature
        </ModalDescription>
      </ModalHeaderContainerStyled>
      <ModalDescriptionContainer>
        <InputContainerStyled>
          <ContactsAutoComplete
            type={CommunicationType.EMAIL}
            placeholder="Type the email address or name of the contact"
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
            disabled={show}
            label="Email"
            errorMessage="Incorrect email"
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
          <ESignatureTemplateAutoComplete
            type={CommunicationType.EMAIL}
            placeholder="Pick template"
            onChange={(event, newValue, reason) => {
              if (reason === 'clear') {
                setTemplateId(null);
                setTemplateName(null);
                return;
              }
              setTemplateId(newValue.identifier);
              setTemplateName(newValue.label);
            }}
            disabled={show}
          />
        </InputContainerStyled>
        <Spacing vertical={4} />
        <TextWaringStyled>
          Disclaimer: Please be aware, you may be sharing protected health
          information outside of your organization
        </TextWaringStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        <ConfirmButton
          disabled={!validateEmail(contact?.value)}
          style={{ width: '270px' }}
          onClick={() => {
            dispatch(
              sendESignForTask({
                templateIdentifier: templateId,
                message: templateName,
                taskIdentifier: selectedTask?.identifier,
                recipientContact: contact.value,
                recipientName: contact.label,
              }),
            );
            dispatch(closeModal());
          }}
        >
          Send
        </ConfirmButton>
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

export default SendESignFromTaskModal;
