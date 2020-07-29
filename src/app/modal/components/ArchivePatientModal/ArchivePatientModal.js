import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import RedFolder from 'img/modals/red-folder';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  ConfirmButton,
} from '../styled';

const ArchivePatientModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={RedFolder} alt="red-folder" />
          <Typography color="textPrimary" variant="h2">
            Archive Patient
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Are you sure you want to archive this patient? This action cannot be
            undone.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <Button variant="outlined" type="button" onClick={closeModal}>
            No, do not archive
          </Button>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Archive
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ArchivePatientModal;
