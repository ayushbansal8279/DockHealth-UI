import Input from 'components/common/Input/Input';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSmsForTask } from 'actions/task-actions';
import Button from 'components/common/Button/Button';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { closeModal } from 'modal/actions';
import { getTemplateDetails } from 'api/template-api';
import { CommunicationType } from 'helpers/task-helpers';
import EmailContactsAutoComplete from 'components/common/EmailContactsAutoComplete/EmailContactsAutoComplete';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
import { IconButton } from '@mui/material';
import { Replay } from '@mui/icons-material';
import palette from 'styles/palette';
import ReactModal from 'react-modal';
import AddContactStep from '../../AddContactModal/AddContactModal';
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
  const [selectedContacts, setSelectedContacts] = useState(null);
  const [newContact, setNewContact] = useState([]);
  const [show, setShow] = useState(false);
  const [isTaskDescriptionIncluded, setIsTaskDescriptionIncluded] =
    useState(false);
  const selectedTask = useSelector(selectedTaskSelector);
  const { identifier } = selectedTask;

  // const handlePhoneBlur = useCallback((event) => {
  //   const phoneNumber = event.target.value;
  //   setPhoneError(phoneNumber?.length < 7);
  // }, []);

  const handleSubmit = useCallback(() => {
    dispatch(
      sendSmsForTask({
        message,
        recipientContact: selectedContacts.map((c) => c.value)[0],
        taskIdentifier: identifier,
      }),
    );
    dispatch(closeModal());
  }, [selectedContacts, dispatch, identifier, message]);

  const handleTextEditorReset = useCallback(() => {
    setIsTaskDescriptionIncluded(false);
    setMessage('');
  }, []);

  const handleContactsOnChange = useCallback(
    (_event, newValue, reason) => {
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
        setSelectedContacts([newValue]);
      }
    },
    [selectedContacts],
  );

  const insertTextFromTask = useCallback(
    (meta) => {
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
          <EmailContactsAutoComplete
            type={CommunicationType.SMS}
            placeholder="Type the phone number or name of the contact"
            // onBlur={handlePhoneBlur}
            // onChange={(_, newValue, reason) => {
            //   if (reason === 'clear') {
            //     setContact(null);
            //     return;
            //   }
            //   setContact(newValue);
            // }}
            onChange={handleContactsOnChange}
            error={PhoneError}
            multiple={false}
            autoFocus
            label="Phone"
            errorMessage="Incorrect phone number"
            // value={contact?.value ?? ''}
            disabled={show}
            setShow={setShow}
            newContact={newContact}
            setNewContact={setNewContact}
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
                (data) => {
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
            onChange={(event) => {
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
          disabled={PhoneError || !selectedContacts?.length > 0 || !message}
          onClick={handleSubmit}
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
          type={CommunicationType.SMS}
          show={show}
          setContactData={(contact) => {
            setSelectedContacts([...selectedContacts, contact]);
            setNewContact(contact);
          }}
          handleShow={setShow}
          phone={newContact?.value}
          name={newContact?.label}
          identifier={newContact?.identifier}
        />
      </ReactModal>
    </ModalWrapper>
  );
};

export default SendSmsFromTaskModal;
