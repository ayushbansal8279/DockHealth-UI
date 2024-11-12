import React from 'react';
import { Box, Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const MergePatientsModal = ({
  closeModal,
  fromPatient,
  toPatient,
  confirm,
}) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <Box mb={1}>
            <MergeTypeIcon fontSize="large" />
          </Box>
          <ModalHeaderName>Merge Patient</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography style={{ fontFamily: 'Outfit' }}>
            Please confirm to merge{' '}
            <span style={{ fontWeight: 'bold' }}>
              {fromPatient.firstName} {fromPatient.lastName}
            </span>{' '}
            to this selected patient{' '}
            <span style={{ fontWeight: 'bold' }}>
              {toPatient.firstName} {toPatient.lastName}
            </span>
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton style={{ width: '180px' }} onClick={confirm}>
            Merge
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default MergePatientsModal;
