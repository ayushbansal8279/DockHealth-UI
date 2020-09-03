import React, { useEffect, useRef } from 'react';
import { ConfirmationContainer, Image, Description } from './styled';

const ConfirmationModal = ({
  icon,
  description,
  iconAlt = '',
  timeout = 2000,
  closeModal,
}) => {
  const timeoutReference = useRef(null);

  useEffect(() => {
    timeoutReference.current = setTimeout(() => {
      closeModal();
    }, timeout);

    return () => {
      clearTimeout(timeoutReference.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfirmationContainer>
      {icon && <Image src={icon} alt={iconAlt} />}
      <Description>{description}</Description>
    </ConfirmationContainer>
  );
};

export default ConfirmationModal;
