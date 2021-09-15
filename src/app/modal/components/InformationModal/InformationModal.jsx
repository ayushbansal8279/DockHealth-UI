import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
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
        <ModalDescriptionContainer>
          <Typography variant="body1">{text}</Typography>
        </ModalDescriptionContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default InformationModal;
