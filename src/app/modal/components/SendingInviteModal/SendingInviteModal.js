import React from 'react';
import SendingInviteIcon from 'img/SendingInviteIcon';
import { ModalWrapper, ModalLabel } from './styled';

const SendingInviteModal = ({ firstName, lastName }) => (
  <ModalWrapper>
    <SendingInviteIcon />
    <ModalLabel>
      Thank you for referring{' '}
      <span style={{ fontWeight: 'bold' }}>
        {firstName} {lastName}
      </span>
      !
      <br />
      We will keep you posted once we hear from them.
    </ModalLabel>
  </ModalWrapper>
);

export default SendingInviteModal;
