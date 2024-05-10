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
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const PrimaryText = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: #3d4858;
`;

const AssignPatientModal = ({
  closeModal,
  confirm,
  patientName,
  isWorkflowModal,
}) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={patient} alt="patient" />
          <ModalHeaderName>Assign All</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          {isWorkflowModal
            ? `Only one ${customerTypeLabel} may be assigned per workflow. Assign all tasks in
            this workflow to:`
            : `Assigning a ${customerTypeLabel} from this task will update assignee to the primary task and related subtasks to`}
          <b>{patientName}</b>
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
            Assign All
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default AssignPatientModal;
