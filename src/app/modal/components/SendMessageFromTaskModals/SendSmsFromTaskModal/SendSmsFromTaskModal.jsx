import Input from 'components/common/Input/Input';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSmsForTask } from 'actions/task-actions';
import Button from 'components/common/Button/Button';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { closeModal } from 'modal/actions';
import { getTemplateDetails } from 'api/template-api';
import { CommunicationType } from 'helpers/task-helpers';
import ContactsAutoComplete from 'components/common/ContactsAutoComplete/ContactsAutocomplete';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
import { IconButton } from '@material-ui/core';
import { Replay } from '@material-ui/icons';
import palette from 'styles/palette';
import TaskCheckBoxes from '../TaskCheckBoxes';
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
  IncludeContainerStyled,
  InfoHeaderTextStyled,
} from '../../styled';
import { InputContainerStyled } from '../styled';

const SendSmsFromTaskModal = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [PhoneError, setPhoneError] = useState(false);
  const [contact, setContact] = useState(null);
  const [isTaskDescriptionIncluded, setIsTaskDescriptionIncluded] = useState(
    false,
  );
  const selectedTask = useSelector(selectedTaskSelector);
  const { identifier } = selectedTask;

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

  const handleTextEditorReset = useCallback(() => {
    setIsTaskDescriptionIncluded(false);
    setMessage('');
  }, []);

  const insertTextFromTask = useCallback(
    meta => {
      setMessage(`${message}\n ${meta.meta}`);
    },
    [message],
  );

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
            patient={selectedTask?.patient}
          />
          <TemplateAutoComplete
            type={CommunicationType.SMS}
            placeholder="Pick template"
            onChange={(_, newValue, reason) => {
              if (reason === 'clear') {
                setMessage('');
                return;
              }
              getTemplateDetails(newValue?.identifier, identifier).then(
                data => {
                  setMessage(data?.shortMessage || '');
                },
              );
            }}
          />
          <IncludeContainerStyled>
            <InfoHeaderTextStyled>Include the following</InfoHeaderTextStyled>
            <IconButton onClick={handleTextEditorReset}>
              <Replay htmlColor={palette.coolGrey9} />
            </IconButton>
          </IncludeContainerStyled>
          <TaskCheckBoxes
            isTaskDescriptionIncluded={isTaskDescriptionIncluded}
            setIsTaskDescriptionIncluded={setIsTaskDescriptionIncluded}
            selectedTask={selectedTask}
            insertTextFromTask={insertTextFromTask}
            displayOnlyDescription
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
