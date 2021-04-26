import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import patient from 'img/modals/patient';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
} from '../styled';

const PrimaryText = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: #3d4858;
`;

const UnassignPatientModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={patient} alt="patient" />
          <Typography variant="h2" align="center">
            <PrimaryText>Assign All</PrimaryText>
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Un-assigning the patient from here will update all tasks and
            subtasks in this workflow to:
          </Typography>
          <Typography variant="body1">
            <b>Un-assigned</b>
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <Button
            variant="outlined"
            type="button"
            color="red"
            size="small"
            onClick={closeModal}
          >
            CANCEL
          </Button>
          <Spacing horizontal={4} />
          <Button
            variant="contained"
            type="button"
            size="small"
            color="red"
            onClick={() => {
              confirm();
              closeModal();
            }}
          >
            UN-ASSIGN ALL
          </Button>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default UnassignPatientModal;
