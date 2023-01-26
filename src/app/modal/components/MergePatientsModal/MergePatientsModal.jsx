import React from 'react';
import { Box, Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';

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
          <Typography color="textSecondary" variant="h2">
            MERGE PATIENT
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Please confirm to merge {fromPatient.firstName}{' '}
            {fromPatient.lastName} to this selected patient{' '}
            {toPatient.firstName} {toPatient.lastName}
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
              Cancel
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={confirm}
            >
              Merge
            </Button>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default MergePatientsModal;
