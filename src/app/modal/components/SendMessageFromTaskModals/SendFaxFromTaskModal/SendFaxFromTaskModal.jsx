import Input from 'components/common/Input/Input';
import InputMask from 'react-input-mask';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendFaxForTask } from 'actions/task-actions';
import Button from 'components/common/Button/Button';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import Checkbox from 'components/common/Checkbox/Checkbox';

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
  TextWaringStyled,
} from '../../styled';
import {
  AttachmentContainerStyled,
  AttachmentsContainerStyled,
  InfoHeaderAttachmentsTextStyled,
  InputContainerStyled,
} from '../styled';

const SendFaxFromTaskModal = () => {
  const dispatch = useDispatch();
  const [faxNumber, setFaxNumber] = useState('___-___-____');
  const [message, setMessage] = useState('');
  const [faxError, setFaxError] = useState(false);
  const [isInvalidToSend, setIsInvalidToSend] = useState(true);
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

  const handleFaxBlur = () => {
    return faxNumber.includes('_') ? setFaxError(true) : setFaxError(false);
  };

  useEffect(() => {
    if (
      !faxNumber.includes('_') &&
      ((validAttachments.length > 0 && attachmentsToSend.length > 0) || message)
    ) {
      setIsInvalidToSend(false);
    } else {
      setIsInvalidToSend(true);
    }
  }, [message, attachmentsToSend, validAttachments, faxNumber, faxError]);

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
          <InputMask
            mask="999-999-9999"
            value={faxNumber}
            onChange={event => setFaxNumber(event.target.value)}
            onBlur={handleFaxBlur}
            alwaysShowMask
          >
            {() => (
              <Input
                type="tel"
                label="fax"
                name="fax"
                placeholder="type the fax number"
                autoFocus
                helperText={faxError ? 'Incorrect fax' : null}
                error={faxError}
              />
            )}
          </InputMask>
          <Input
            multiline
            placeholder="type message"
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          {validAttachments?.length > 0 && (
            <>
              <InfoHeaderAttachmentsTextStyled>
                Select attachments to include
              </InfoHeaderAttachmentsTextStyled>
              <AttachmentsContainerStyled>
                {validAttachments.map(attachment => {
                  return (
                    <AttachmentContainerStyled key={attachment.attachmentId}>
                      <Checkbox
                        size={18}
                        onClick={() =>
                          addAttachmentHandler(attachment.attachmentId)
                        }
                        isChecked={attachmentsToSend.includes(
                          attachment.attachmentId,
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
          disabled={isInvalidToSend}
          onClick={() => {
            dispatch(
              sendFaxForTask({
                message,
                recipientContact: faxNumber.replace(/\D/g, ''),
                taskAttachmentIdentifiers: attachments,
                taskIdentifier: identifier,
              }),
            );
            dispatch(closeModal());
          }}
        >
          send
        </Button>
      </ModalFooterStyled>
    </ModalWrapper>
  );
};

export default SendFaxFromTaskModal;
