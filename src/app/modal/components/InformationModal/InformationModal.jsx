import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
} from '../styled';

const InformationModal = ({ text }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <InfoOutlinedIcon style={{ fontSize: 40 }} />
        </ModalIconContainer>
        <ModalDescriptionContainer>{text}</ModalDescriptionContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default InformationModal;
