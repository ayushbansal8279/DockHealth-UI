import React, { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { openModal, closeModal } from 'modal/actions';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as PatientApi from 'api/patient-api';
import { onPatientAdded as onPatientAddedEvent } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import PatientForm from 'components/patients/PatientForm/PatientForm';
import { validationSchema } from 'components/patients/PatientForm/helpers';
import PatientDrawer from 'components/patients/PatientDrawer/PatientDrawer';


const onSubmit =
  ({ onClose, onPatientCreated, uniqueIdentifierLabel, workspaceIdentifier }) =>
  (data) => {
    PatientApi.addPatient(data, workspaceIdentifier)
      .then((response) => {
        onPatientAddedEvent();
        if (typeof onPatientCreated === 'function') {
          onPatientCreated(response);
        }
        onClose();
      })
      .catch((error) => {
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.message ??
            `A patient with this name and ${uniqueIdentifierLabel} already exists!`,
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      });
  };

const CreatePatientDrawer = ({ isSidebarOpen, onPatientCreated, onClose }) => {
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(
    currentUser,
    currentOrganization,
  );
  const dispatch = useDispatch();
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { clearErrors, getValues } = formMethods;
  const formReference = useRef(null);

  const { workspaceIdentifier } = useParams();

  const close = () => {
    clearErrors();
    onClose();
  };

  const handleClose = () => {
    const values = getValues();
    const inProgress = !Object.values(values).every((p) => p === undefined);
    if (inProgress) {
      dispatch(
        openModal('InterruptEdit', {
          isWorkflowModal: true,
          confirm: () => {
            formReference.current.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            );
            dispatch(closeModal());
          },
          onClose: close,
        }),
      );
    } else {
      close();
    }
  };

  const handleFormSubmit = onSubmit({
    onClose,
    onPatientCreated,
    uniqueIdentifierLabel,
    workspaceIdentifier,
  });

  return (
    <PatientDrawer
      isOpen={isSidebarOpen}
      title={`Add a ${customerTypeLabel}`}
      onClose={handleClose}
    >
      <FormProvider {...formMethods}>
        <PatientForm
          formMethods={formMethods}
          onSubmit={handleFormSubmit}
          uniqueIdentifierLabel={uniqueIdentifierLabel}
          customerTypeLabel={customerTypeLabel}
          ref={formReference}
          buttonLabel="Save"
          patientAddEnabled
        />
      </FormProvider>
    </PatientDrawer>
  );
};

export default CreatePatientDrawer;
