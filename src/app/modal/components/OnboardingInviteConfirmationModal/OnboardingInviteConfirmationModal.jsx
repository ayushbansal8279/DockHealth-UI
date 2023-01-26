import React, { useRef, useEffect } from 'react';
import EnvelopeIcon from 'img/modals/envelope.svg';
import { Container, Image, Description } from './styled';

const OnboardingInviteConfirmationModal = ({
  closeModal,
  moreThanOneInvite,
}) => {
  const timeoutReference = useRef();

  useEffect(() => {
    timeoutReference.current = setTimeout(() => {
      closeModal();
    }, 2000);

    return () => {
      clearTimeout(timeoutReference.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Image src={EnvelopeIcon} alt="Invite sent" />
      <Description>{`Sending invite${
        moreThanOneInvite ? 's' : ''
      }`}</Description>
    </Container>
  );
};

export default OnboardingInviteConfirmationModal;
