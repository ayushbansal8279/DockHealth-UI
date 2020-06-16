import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import Attachment from 'img/modals/attachment';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
  CancelButton,
} from '../styled';

const DuplicateTaskModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={Attachment} alt="Attachment" />
        <Typography color="textSecondary" variant="h2">
          DUPLICATE ATTACHMENT
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          Would you like to duplicate attachments?
        </Typography>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <CancelButton variant="outlined" type="button" onClick={closeModal}>
            No, Do Not Duplicate
          </CancelButton>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Yes
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default DuplicateTaskModal;
