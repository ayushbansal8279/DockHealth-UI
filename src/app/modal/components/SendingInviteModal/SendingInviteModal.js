import React from 'react';
import SendingInviteIcon from 'img/SendingInviteIcon';
import { ModalWrapper, ModalLabel } from './styled';

const SendingInviteModal = ({ email }) => (
  <ModalWrapper>
    <SendingInviteIcon />
    <ModalLabel>Email sent to {email}</ModalLabel>
  </ModalWrapper>
);

export default SendingInviteModal;
