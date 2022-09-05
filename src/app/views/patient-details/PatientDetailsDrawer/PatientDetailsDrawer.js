import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import mergeDeepRight from 'ramda/src/prop';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { organizationSelector } from 'selectors/organization-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { FormProvider, useForm } from 'react-hook-form';
import { openModal, closeModal } from 'modal/actions';
import { createPatientDetailsPath } from 'routing/helpers/paths';
import {
  archivePatient as archivePatientAction,
  unarchivePatient as unarchivePatientAction,
} from 'sagas/patient-details-saga';

import {
  mergePatient,
  updatePatientDetails,
} from 'actions/patient-details-actions';
import PatientForm from 'components/patients/PatientForm/PatientForm';
import PatientDrawer from 'components/patients/PatientDrawer/PatientDrawer';
import { validationSchema } from 'components/patients/PatientForm/helpers';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import PatientLabels from '../PatientLabels/PatientLabels';

const PatientDetailsDrawer = ({ patient, isOpenedDetails, closeDetails }) => {
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
  const formMethods = useForm({
    defaultValues: patientValues,
    reValidateMode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { reset, clearErrors } = formMethods;
  const formReference = useRef(null);
  const organization = useSelector(organizationSelector);
  const { emrIntegrationEnabled } = organization || {};

  const close = () => {
    unsetActive();
    closeDetails();
    clearErrors(Object.keys(patientValues));
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
      clearErrors(Object.keys(patientValues));
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

  const unarchivePatient = useCallback(() => {
    const modalProps = {
      confirm: () =>
        dispatch(unarchivePatientAction(patientIdentifier, history)),
    };
    dispatch(openModal('UnarchivePatient', modalProps));
  }, [dispatch, history, patientIdentifier]);

  const handleFormSubmit = data => {
    unsetActive();
    const updateData = mergeDeepRight(patient, data);
    updateData.allNotes = undefined;
    updateData.patientLabels = undefined;
    updateData.createdDateTime = undefined;
    updateData.updatedDateTime = undefined;
    dispatch(updatePatientDetails(patientIdentifier, updateData));
  };

  const contextMenuOptions = useMemo(
    () => [
      !isActive && {
        name: 'Edit',
        onClick: setActive,
      },
      !emrIntegrationEnabled &&
        !isActive && {
          name: 'Merge',
          onClick: () => {
            dispatch(
              openModal('PatientPicker', {
                patientIdentifiersToExclude: [patient.patientIdentifier],
                onSelect: selectedPatient => {
                  dispatch(
                    openModal('MergePatients', {
                      toPatient: selectedPatient,
                      fromPatient: patient,
                      confirm: () => {
                        dispatch(closeModal());
                        dispatch(
                          mergePatient(patient, selectedPatient, () => {
                            history.push(
                              createPatientDetailsPath(
                                selectedPatient.patientIdentifier,
                              ),
                            );
                          }),
                        );
                      },
                    }),
                  );
                },
              }),
            );
            closeDetails();
          },
        },
      !emrIntegrationEnabled &&
        !patient.archived && {
          name: 'Archive',
          onClick: archivePatient,
        },
      patient.archived && {
        name: 'Restore',
        onClick: unarchivePatient,
      },
    ],
    [
      setActive,
      emrIntegrationEnabled,
      isActive,
      archivePatient,
      patient,
      unarchivePatient,
      dispatch,
      closeDetails,
      history,
    ],
  );

  return (
    <FormProvider {...formMethods}>
      <PatientDrawer
        isOpen={isOpenedDetails}
        title={`${patient.lastName}, ${patient.firstName} ${
          patient.middleName ? patient.middleName : ''
        }`}
        options={contextMenuOptions}
        onClose={handleClose}
      >
        <PatientLabels disableFocusOnRender />
        <Box py={1.5} />
        <PatientForm
          ref={formReference}
          patient={patient}
          onSubmit={handleFormSubmit}
          uniqueIdentifierLabel={uniqueIdentifierLabel}
          emrIntegrationEnabled={emrIntegrationEnabled}
          edited={isActive}
          customerTypeLabel={customerTypeLabel}
          buttonLabel="SAVE EDITS"
        />
      </PatientDrawer>
    </FormProvider>
  );
};

export default PatientDetailsDrawer;
