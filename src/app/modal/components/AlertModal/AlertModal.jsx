import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  ConfirmButton,
  CloseIconContainer,
  ModalCloseIcon
} from './styled'

const AlertModal = ({
  title,
  description,
  confirm,
  confirmButtonText = 'Agree',
}) => {
  return (
    <ModalWrapper>
       <CloseIconContainer>
        <ModalCloseIcon/>
      </CloseIconContainer>
      <ModalIconContainer>
        <InfoOutlinedIcon style={{ fontSize: 40 }} />
          {title}
      </ModalIconContainer>
      <ModalDescriptionContainer>{description}</ModalDescriptionContainer>
      <ButtonsContainer>
        <ConfirmButton
          onClick={() => {
            confirm();
          }}
        >
          {confirmButtonText}
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default AlertModal;
