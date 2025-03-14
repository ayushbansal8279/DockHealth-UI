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

const MergeDataModal = ({
  closeModal,
  from,
  to,
  type,
  confirm,
}) => {
  const profileType = type.charAt(0).toUpperCase()+type.slice(1);
  
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <Box mb={1}>
            <MergeTypeIcon fontSize="large" />
          </Box>
          <ModalHeaderName>Merge {profileType}</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography style={{ fontFamily: 'Outfit' }}>
            Please confirm to merge{' '}
            <span style={{ fontWeight: 'bold' }}>
              {from}
            </span>{' '}
            to this selected {type}{' '}
            <span style={{ fontWeight: 'bold' }}>
              {to}
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

export default MergeDataModal;
