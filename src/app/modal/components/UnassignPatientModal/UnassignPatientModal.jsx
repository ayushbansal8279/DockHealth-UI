import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import patient from 'img/modals/patient.svg';
import { userProfileSelector } from 'selectors/user-selectors';
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

const UnassignPatientModal = ({ closeModal, confirm, isWorkflowModal }) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={patient} alt="patient" />
          <Typography variant="h2" align="center">
            <PrimaryText>Un-Assign All</PrimaryText>
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            {isWorkflowModal
              ? `Un-assigning the ${customerTypeLabel} from here will update all tasks and
            subtasks in this workflow to:`
              : `Un-assigning a ${customerTypeLabel} from this task will update the primary task and related subtasks to:`}
          </Typography>
          <Typography variant="body1">
            <b>Un-assigned</b>
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <Button variant="secondary-red" size="small" onClick={closeModal}>
            CANCEL
          </Button>
          <Spacing horizontal={4} />
          <Button
            variant="primary-red"
            size="small"
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
