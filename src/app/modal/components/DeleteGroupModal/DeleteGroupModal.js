import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import Folder from 'img/modals/folder';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  ConfirmButton,
  CancelButton,
} from '../styled';

const DeleteGroupModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={Folder} alt="Task Group" />
          <Typography color="textPrimary" variant="h2">
            DELETE GROUP
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Are you sure you want to delete this group? If you delete this group
            and there are tasks within the group, the tasks will not be deleted.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton variant="outlined" type="button" onClick={closeModal}>
            No, do not delete
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

export default DeleteGroupModal;
