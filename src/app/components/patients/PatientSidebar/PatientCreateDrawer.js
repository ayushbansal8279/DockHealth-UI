import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import CloseIcon from '@material-ui/icons/Close';
import { object } from 'yup';
import { openModal, closeModal } from 'modal/actions';
import { useDispatch } from 'react-redux';
import * as PatientApi from 'api/patient-api';
import { onPatientAdded as onPatientAddedEvent } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import {
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActinsWrapper,
} from 'views/patient-details/PatientDetailsHeader/PatientDetails/styled.js';
import PatientForm, { validationObjectShape } from '../PatientForm/PatientForm';

const validationSchema = object().shape(validationObjectShape);

const onSubmit = ({
  onCancel,
  onPatientCreated,
  uniqueIdentifierLabel,
}) => data => {
  const patientApiMethod = PatientApi.addPatient(data);

  patientApiMethod
    .then(response => {
      onPatientAddedEvent();
      if (typeof onPatientCreated === 'function') {
        onPatientCreated(response);
      }
      onCancel();
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Potential Duplicate',
        text:
          error?.message ??
          `A patient with this name and ${uniqueIdentifierLabel} already exists!`,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    });
};

const PatientCreateDrawer = ({
  isOpenedDetails,
  editingDisabled,
  uniqueIdentifierLabel,
  customerTypeLabel,
  onPatientCreated,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit, clearError, getValues, reset } = formMethods;
  const formReference = useRef(null);

  const close = () => {
    reset();
    clearError();
    onCancel();
  };

  const handleClose = () => {
    const values = getValues();
    const inProgress = !Object.values(values).every(p => p === undefined);
    if (inProgress) {
      dispatch(
        openModal('InterruptEdit', {
          isWorkflowModal: true,
          confirm: () => {
            formReference.current.dispatchEvent(new Event('submit'));
            dispatch(closeModal());
          },
          onClose: close,
        }),
      );
    } else {
      close();
    }
  };

  const handleFormSubmit = handleSubmit(
    onSubmit({
      onCancel,
      onPatientCreated,
      uniqueIdentifierLabel,
    }),
  );

  return (
    <DrawerWrapper open={isOpenedDetails} anchor="right" onClose={handleClose}>
      <ContentWrapper>
        <StickyHeader>
          <TitleName>Add a {customerTypeLabel}</TitleName>
          <MoreActinsWrapper>
            <button type="button" onClick={handleClose}>
              <CloseIcon />
            </button>
          </MoreActinsWrapper>
        </StickyHeader>
        <PatientForm
          formMethods={formMethods}
          onSubmit={handleFormSubmit}
          uniqueIdentifierLabel={uniqueIdentifierLabel}
          readOnly={editingDisabled}
          customerTypeLabel={customerTypeLabel}
          ref={formReference}
          buttonLabel={`SAVE ${customerTypeLabel}`}
        />
      </ContentWrapper>
    </DrawerWrapper>
  );
};
export default PatientCreateDrawer;
