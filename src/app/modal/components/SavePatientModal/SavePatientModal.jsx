import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import DownArrow from 'img/modals/down-arrow.svg';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const SavePatientModal = ({
  closeModal,
  confirm,
  profileTypeName = null,
}) => {

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
            <ModalMainIcon src={DownArrow} alt="Task" />
            <ModalHeaderName>
                Do you want to save these changes?
            </ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer />
        <ButtonsContainer>
            <ConfirmButton style={{ width: '180px' }} onClick={confirm}>
                Save Changes
            </ConfirmButton>
            <Spacing horizontal={4} />
            <CancelButton style={{ width: '180px' }} onClick={closeModal}>
                Don't Save
            </CancelButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default SavePatientModal;
