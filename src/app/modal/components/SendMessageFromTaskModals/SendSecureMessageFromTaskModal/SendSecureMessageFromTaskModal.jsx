import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'components/common/Button/Button';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { sendSecureMessageForTask } from 'actions/task-actions';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { CommunicationType } from 'helpers/task-helpers';
import TemplateAutoComplete from 'components/common/TemplateAutoComplete/TemplateAutoComplete';
import { closeModal } from 'modal/actions';
import { getTemplateDetails } from 'api/template-api';
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
import { ConfirmButton } from '../../ModalButton/ModalButtons';

const SendSecureMessageFromTaskModal = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [templateIdentifier, setTemplateIdentifier] = useState('');
  const [isValueReset, setValueReset] = useState(false);

  const selectedTask = useSelector(selectedTaskSelector);
  const { identifier } = selectedTask;

  const handleSubmit = useCallback(() => {
    dispatch(
      sendSecureMessageForTask({
        message,
        recipientContact: 'PATIENT',
        taskIdentifier: identifier,
        templateIdentifier,
      }),
    );
    dispatch(closeModal());
  }, [dispatch, identifier, message]);

  const handleTextEditorChange = (value) => {
    setValueReset(false);
    setMessage(value);
  };

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
                setValueReset(true);
                setMessage('');
                return;
              }
              getTemplateDetails(newValue?.identifier, identifier).then(
                (data) => {
                  setValueReset(true);
                  setMessage(data?.details ?? '');
                  setTemplateIdentifier(data?.identifier);
                },
              );
            }}
          />
          <RichTextEditor
            value={message}
            reset={isValueReset}
            readOnly={false}
            placeholder="Message"
            onChange={handleTextEditorChange}
            showCharCount
          />
        </InputContainerStyled>
      </ModalDescriptionContainer>
      <ModalFooterStyled>
        {/* <Button
          uppercase
          width="150px"
          variant="primary"
          onClick={handleSubmit}
        >
          send
        </Button> */}
        <ConfirmButton style={{ width: '270px' }} onClick={handleSubmit}>
          Send
        </ConfirmButton>
      </ModalFooterStyled>
    </ModalWrapper>
  );
};

export default SendSecureMessageFromTaskModal;
