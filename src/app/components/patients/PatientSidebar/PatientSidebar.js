import React from 'react';
import { useSelector } from 'react-redux';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import PatientCreateDrawer from './PatientCreateDrawer';

const PatientSidebar = ({ onPatientCreated, onClose, isSidebarOpen }) => {
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);

  return (
    <PatientCreateDrawer
      isOpenedDetails={isSidebarOpen}
      customerTypeLabel={customerTypeLabel}
      uniqueIdentifierLabel={uniqueIdentifierLabel}
      onPatientCreated={onPatientCreated}
      onClose={onClose}
      onCancel={onClose}
    />
  );
};

export default PatientSidebar;
