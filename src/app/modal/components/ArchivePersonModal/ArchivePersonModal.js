import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import RedFolder from 'img/modals/red-folder';
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
              color="red"
              size="small"
              variant="outlined"
              type="button"
              onClick={closeModal}
            >
              Do not archive
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={127}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="contained"
              type="button"
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

export default ArchivePersonModal;
