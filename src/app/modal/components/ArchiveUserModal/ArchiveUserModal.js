import React from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import folderUser from 'img/modals/user-folder';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  FixedWidthButtonWrapper,
} from '../styled';

const ArchiveUserModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={folderUser} alt="folder_user" />
          <Typography color="textPrimary" variant="h2">
            Archive user
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Are you sure you want to archive this user? This action cannot be
            undone.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="outlined"
              type="button"
              color="red"
              size="small"
              onClick={closeModal}
            >
              Do not archive
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={124}>
            <Button
              fullWidth
              variant="contained"
              type="button"
              size="small"
              color="red"
              onClick={() => {
                confirm();
                closeModal();
              }}
            >
              Archive
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ArchiveUserModal;
