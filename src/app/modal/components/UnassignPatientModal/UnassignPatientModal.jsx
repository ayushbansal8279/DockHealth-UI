import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
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
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

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
          <ModalHeaderName>Un-Assign All</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          {isWorkflowModal
            ? `Un-assigning the ${customerTypeLabel} from here will update all tasks and
            subtasks in this workflow to:`
            : `Un-assigning a ${customerTypeLabel} from this task will update the primary task and related subtasks to:`}
          <b>Un-assigned</b>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '180px' }}
            onClick={() => {
              confirm();
              closeModal();
            }}
          >
            Un-Assign All
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default UnassignPatientModal;
