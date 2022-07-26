import Input from 'components/common/Input/Input';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSmsForTask } from 'actions/task-actions';
import Button from 'components/common/Button/Button';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { closeModal } from 'modal/actions';
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
import { InputContainerStyled } from '../styled';

const SendSmsFromTaskModal = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [PhoneError, setPhoneError] = useState(false);
  const [contact, setContact] = useState(null);
  const { identifier } = useSelector(selectedTaskSelector);

  const handlePhoneBlur = useCallback(event => {
    const phoneNumber = event.target.value;
    setPhoneError(phoneNumber?.length < 7);
  }, []);

  const handleSubmit = useCallback(() => {
    dispatch(
      sendSmsForTask({
        message,
        recipientContact: contact.value,
        taskIdentifier: identifier,
      }),
    );
    dispatch(closeModal());
  }, [contact, dispatch, identifier, message]);

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>Send sms</ModalHeader>
        <ModalDescription>Send a SMS for this task</ModalDescription>
      </ModalHeaderContainerStyled>
      <ModalDescriptionContainer>
        <InputContainerStyled>
          <ContactsAutoComplete
            type={CommunicationType.SMS}
            placeholder="Type the phone number or name of the contact"
            onBlur={handlePhoneBlur}
            onChange={(_, newValue, reason) => {
              if (reason === 'clear') {
                setContact(null);
                return;
              }
              setContact(newValue);
            }}
            error={PhoneError}
            autoFocus
            label="Phone"
            errorMessage="Incorrect phone number"
            value={contact?.value ?? ''}
          />
          <TemplateAutoComplete
            type={CommunicationType.SMS}
            placeholder="Pick template"
            onChange={(_, newValue, reason) => {
              if (reason === 'clear') {
                setMessage('');
                return;
              }
              setMessage(newValue?.value || '');
            }}
          />
          <Input
            type="text"
            label="Message"
            value={message}
            onChange={event => {
              setPhoneError(false);
              setMessage(event.target.value);
            }}
          />
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
          disabled={PhoneError}
          onClick={handleSubmit}
        >
          send
        </Button>
      </ModalFooterStyled>
    </ModalWrapper>
  );
};

export default SendSmsFromTaskModal;
