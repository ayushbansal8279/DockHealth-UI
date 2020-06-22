import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import RedFolder from 'img/modals/red-folder';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
} from '../styled';

const ArchievePatientModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={RedFolder} alt="red-folder" />
        <Typography color="textPrimary" variant="h2">
          Archievie Patient
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          Are you sure you want to delete this patient? This action cannot be
          undone.
        </Typography>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <Button variant="outlined" type="button" onClick={closeModal}>
            No, do not delete
          </Button>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Delete
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ArchievePatientModal;
