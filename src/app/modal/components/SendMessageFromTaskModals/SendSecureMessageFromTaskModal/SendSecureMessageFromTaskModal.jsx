import Input from 'components/common/Input/Input';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'components/common/Button/Button';
import { sendSecureMessageForTask } from 'actions/task-actions';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { CommunicationType } from 'helpers/task-helpers';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
import { closeModal } from 'modal/actions';
import {
  CloseIcon,
  CloseIconButton,
  ModalDescription,
  ModalDescriptionContainer,
  ModalFooterStyled,
  ModalHeader,
  ModalHeaderContainerStyled,
  ModalWrapper,
} from '../../styled';
import { InputContainerStyled } from '../styled';

const SendSecureMessageFromTaskModal = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const selectedTask = useSelector(selectedTaskSelector);
  const { identifier } = selectedTask;

  const handleSubmit = useCallback(() => {
    dispatch(
      sendSecureMessageForTask({
        message,
        recipientContact: 'PATIENT',
        taskIdentifier: identifier,
      }),
    );
    dispatch(closeModal());
  }, [dispatch, identifier, message]);

  return (
    <ModalWrapper width="600px">
      <CloseIconButton size="small" onClick={() => dispatch(closeModal())}>
        <CloseIcon htmlColor="#C1CCDA" />
      </CloseIconButton>
      <ModalHeaderContainerStyled>
        <ModalHeader>Send Secure Message</ModalHeader>
        <ModalDescription>Send message to patient</ModalDescription>
      </ModalHeaderContainerStyled>
      <ModalDescriptionContainer>
        <InputContainerStyled>
          <TemplateAutoComplete
            type={CommunicationType.SECURE_MESSAGE}
            placeholder="Pick template"
            onChange={(_, newValue, reason) => {
              if (reason === 'clear') {
                setMessage('');
                return;
              }
              setMessage(newValue?.body || '');
            }}
          />
          <Input
            type="text"
            label="Message"
            value={message}
            onChange={event => {
              setMessage(event.target.value);
            }}
          />
        </InputContainerStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        <Button
          uppercase
          width="150px"
          variant="primary"
          onClick={handleSubmit}
        >
          send
        </Button>
      </ModalFooterStyled>
    </ModalWrapper>
  );
};

export default SendSecureMessageFromTaskModal;
