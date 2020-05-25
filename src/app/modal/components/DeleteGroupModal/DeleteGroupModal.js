import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import File from 'img/modals/file';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
} from '../styled';

const DeleteGroupModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={File} alt="file" />
        <Typography color="textPrimary" variant="h2">
          Delete group
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          Are you sure you want to delete this group? If you delete this group
          and there are tasks within the group, the tasks will not be deleted.
        </Typography>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <Button variant="outlined" type="button" onClick={closeModal}>
            No, do not delete
          </Button>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Yes
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default DeleteGroupModal;
