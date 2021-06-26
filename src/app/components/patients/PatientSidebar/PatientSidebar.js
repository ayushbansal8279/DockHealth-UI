import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Close } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import CollapseIcon from 'img/collapse.svg';
import themeMontserrat from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import PatientForm from '../PatientForm/PatientForm';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
  PatientsSidebarName,
  PatientsSidebarSectionContainer,
  PatientsSidebarSectionHeader,
  StyledButton,
  StyledCollapse,
} from './styled';

const PatientSidebar = ({
  patient,
  onPatientCreated,
  onPatientEdited,
  onClose,
}) => {
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleIsCollapsed = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const { mrn, firstName, lastName } = patient ?? {};

  const patientHeaderLabel = patient
    ? `${firstName || ''} ${lastName || ''} ${mrn || ''}`.trim()
    : `Add a ${customerTypeLabelCapitalized}`;

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <PatientsSidebarName variant="h4" weight="500">
          {patientHeaderLabel}
        </PatientsSidebarName>
        <PatientsSidebarCloseButton size="small" onClick={onClose}>
          <Close />
        </PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <PatientsSidebarSectionContainer>
        <PatientsSidebarSectionHeader>
          <ThemeProvider theme={themeMontserrat}>
            <Typography color="primary" variant="h3">
              {customerTypeLabelCapitalized} Details
            </Typography>
          </ThemeProvider>
          <StyledButton isCollapsed={isCollapsed} onClick={toggleIsCollapsed}>
            <img src={CollapseIcon} alt="Collapse Details" />
          </StyledButton>
        </PatientsSidebarSectionHeader>
        <StyledCollapse in={!isCollapsed}>
          <Spacing vertical={3} />
          <PatientForm
            patient={patient}
            onPatientCreated={onPatientCreated}
            onPatientEdited={onPatientEdited}
            compact
            onCancel={onClose}
            uniqueIdentifierLabel={uniqueIdentifierLabel}
          />
        </StyledCollapse>
      </PatientsSidebarSectionContainer>
    </PatientsSidebarContainer>
  );
};

export default PatientSidebar;
