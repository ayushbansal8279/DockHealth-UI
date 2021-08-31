import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import useBoolean from 'hooks/useBoolean';
import { mergeDeepRight } from 'ramda';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { FormContext, useForm } from 'react-hook-form';
import { openModal, closeModal } from 'modal/actions';
import { archivePatient as archivePatientAction } from 'sagas/patient-details-saga';
import { updatePatientDetails } from 'actions/patient-details-actions';
import PatientForm from 'components/patients/PatientForm/PatientForm';
import PatientDrawer from 'components/patients/PatientDrawer/PatientDrawer';
import { validationSchema } from 'components/patients/PatientForm/helpers';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';

const PatientDetailsDrawer = ({
  patient,
  isOpenedDetails,
  editingDisabled,
  closeDetails,
}) => {
  const history = useHistory();
  const { patientIdentifier } = patient;
  const formattedDob = patient?.dob
    ? moment(patient.dob).format('MM/DD/YYYY')
    : null;
  const patientValues = {
    ...patient,
    dob: formattedDob,
  };

  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const [isActive, setActive, unsetActive] = useBoolean(false);
  const [hideEmptyFields, , setShowEmpty, toggleEmpty] = useBoolean(false);
  const formMethods = useForm({
    defaultValues: patientValues,
    reValidateMode: 'onSubmit',
    validationSchema,
  });
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { clearError, reset } = formMethods;
  const formReference = useRef(null);

  const close = () => {
    unsetActive();
    closeDetails();
    clearError(Object.keys(patientValues));
  };

  const handleClose = () => {
    if (isActive) {
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

  useEffect(() => {
    if (!isOpenedDetails) {
      unsetActive();
    } else {
      reset({ ...patientValues });
      clearError(Object.keys(patientValues));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenedDetails]);

  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);

  const archivePatient = useCallback(() => {
    const modalProps = {
      confirm: () => dispatch(archivePatientAction(patientIdentifier, history)),
    };
    dispatch(openModal('ArchivePatient', modalProps));
  }, [dispatch, patientIdentifier, history]);

  const handleFormSubmit = data => {
    unsetActive();
    dispatch(updatePatientDetails(mergeDeepRight(patient, data)));
  };

  const contextMenuOptions = useMemo(() => {
    return [
      {
        name: 'Edit',
        onClick: () => {
          setActive();
          setShowEmpty();
        },
      },
      {
        name: 'Archive',
        onClick: archivePatient,
      },
      {
        name: hideEmptyFields ? 'Show Empty Fields' : 'Hide Empty Fields',
        onClick: toggleEmpty,
      },
    ];
  }, [archivePatient, hideEmptyFields, setActive, setShowEmpty, toggleEmpty]);

  return (
    <FormContext {...formMethods}>
      <PatientDrawer
        isOpen={isOpenedDetails}
        title={`${patient.lastName}, ${patient.firstName} ${
          patient.middleName ? patient.middleName : ''
        }`}
        options={!editingDisabled ? contextMenuOptions : null}
        onClose={handleClose}
      >
        <PatientForm
          ref={formReference}
          patient={patient}
          onSubmit={handleFormSubmit}
          uniqueIdentifierLabel={uniqueIdentifierLabel}
          readOnly={!isActive || editingDisabled}
          customerTypeLabel={customerTypeLabel}
          buttonLabel="SAVE EDITS"
          hideEmpty={hideEmptyFields}
        />
      </PatientDrawer>
    </FormContext>
  );
};
export default PatientDetailsDrawer;
