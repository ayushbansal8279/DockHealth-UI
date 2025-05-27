import React, { useEffect, useRef } from 'react';
import { CancelButton, ConfirmationContainer, Image, Description, ModalWrapper, CloseIconContainer, ModalCloseIcon, ModalIconContainer, ModalDescriptionContainer, ButtonsContainer, ConfirmButton } from './styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Spacing from 'components/common/Spacing';

const ConfirmationModal = ({
  icon,
  description,
  iconAlt = '',
  // timeout = 2000,
  closeModal,
  title,
  confirm,
  confirmButtonText = 'Confirm',
}) => {
  // const timeoutReference = useRef(null);

  // useEffect(() => {
  //   timeoutReference.current = setTimeout(() => {
  //     closeModal();
  //   }, timeout);

  //   return () => {
  //     clearTimeout(timeoutReference.current);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <ModalWrapper>
      <CloseIconContainer>
        <ModalCloseIcon/>
      </CloseIconContainer>
      <InfoOutlinedIcon style={{ fontSize: 40 }} />
      <ModalIconContainer>
        {title}
      </ModalIconContainer>
      <ModalDescriptionContainer>{description}</ModalDescriptionContainer>
      <ButtonsContainer>
        <CancelButton onClick={closeModal}>Cancel</CancelButton>
        <Spacing horizontal={4} />
        <ConfirmButton
          onClick={() => {
            confirm();
            closeModal();
          }}
        >
          {confirmButtonText}
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default ConfirmationModal;
