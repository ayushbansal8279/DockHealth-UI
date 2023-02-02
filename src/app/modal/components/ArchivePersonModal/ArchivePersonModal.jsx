import React from 'react';
import { Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import RedFolder from 'img/modals/red-folder.svg';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';

const ArchivePersonModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={RedFolder} alt="red-folder" />
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
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              Do not archive
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={() => {
                confirm();
                closeModal();
              }}
            >
              Archive
            </Button>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ArchivePersonModal;
