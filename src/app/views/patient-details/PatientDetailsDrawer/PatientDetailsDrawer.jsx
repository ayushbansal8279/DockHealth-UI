import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import mergeDeepRight from 'ramda/src/mergeDeepRight';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { FormProvider, useForm } from 'react-hook-form';
import { openModal, closeModal } from 'modal/actions';
import {
  createPatientDetailsPath,
  CUSTOM_FIELDS_SETTINGS_PATH,
} from 'routing/helpers/paths';
import {
  archivePatient as archivePatientAction,
  unarchivePatient as unarchivePatientAction,
  deletePatientArchive as deletePatientArchiveAction,
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
  const { patientIdentifier, patientStatus } = patient;
  const formattedDob = patient?.dob
    ? moment(patient.dob).format('MM/DD/YYYY')
    : null;
  const patientValues = {
    ...patient,
    dob: formattedDob,
  };

  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const [isActive, setActive, unsetActive] = useBoolean(false);
  const formMethods = useForm({
    defaultValues: patientValues,
    reValidateMode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { reset, clearErrors } = formMethods;
  const formReference = useRef(null);

  const { emrIntegrationEnabled } = currentOrganization || {};
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.add.enabled',
    ) || {};
  const patientAddEnabled =
    !emrIntegrationEnabled ||
    (emrIntegrationEnabled && quickAddPatientEnabledItem?.value === 'true');

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
            formReference.current.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            );
            // formReference.current.requestSubmit(); -- alternative
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
    if (isOpenedDetails) {
      reset({ ...patientValues });
      clearErrors(Object.keys(patientValues));
    } else {
      unsetActive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenedDetails]);

  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(
    currentUser,
    currentOrganization,
  );

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

  const deletePatient = useCallback(() => {
    const modalProps = {
      confirm: () =>
        dispatch(deletePatientArchiveAction(patientIdentifier, history)),
    };
    dispatch(openModal('DeletePatient', modalProps));
  }, [dispatch, history, patientIdentifier]);

  const handleFormSubmit = (data) => {
    if (data.phoneHome === undefined) {
      data.phoneHome = '';
    }
    if (data.phoneMobile === undefined) {
      data.phoneMobile = '';
    }
    unsetActive();
    const updateData = mergeDeepRight(patient, data);
    updateData.allNotes = undefined;
    updateData.patientLabels = undefined;
    updateData.createdDateTime = undefined;
    updateData.updatedDateTime = undefined;
    dispatch(updatePatientDetails(patientIdentifier, updateData));
  };

  const handleAddButtonClick = useCallback(() => {
    history.push(`${CUSTOM_FIELDS_SETTINGS_PATH}/patients`);
  }, [history]);

  const contextMenuOptions = useMemo(
    () => [
      !isActive && {
        name: 'Edit',
        onClick: setActive,
      },
      patientAddEnabled &&
        !isActive && {
          name: 'Merge',
          onClick: () => {
            dispatch(
              openModal('PatientPicker', {
                patientIdentifiersToExclude: [patient.patientIdentifier],
                onSelect: (selectedPatient) => {
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
      patientAddEnabled &&
        patientStatus === 'ACTIVE' && {
          name: 'Archive',
          onClick: archivePatient,
        },
      patientStatus === 'ARCHIVED' && {
        name: 'Restore',
        onClick: unarchivePatient,
      },
      patientStatus === 'ARCHIVED' && {
        name: 'Delete',
        onClick: deletePatient,
      },
      {
        name: 'Edit Profile Details',
        onClick: handleAddButtonClick,
      },
    ],
    [
      isActive,
      setActive,
      patientAddEnabled,
      patient,
      archivePatient,
      unarchivePatient,
      patientStatus,
      deletePatient,
      dispatch,
      closeDetails,
      history,
      handleAddButtonClick,
    ],
  );

  return (
    <FormProvider {...formMethods}>
      <PatientDrawer
        isOpen={isOpenedDetails}
        title={`${patient.lastName}, ${patient.firstName} ${
          patient.middleName ?? ''
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
          patientAddEnabled={patientAddEnabled}
          edited={isActive}
          customerTypeLabel={customerTypeLabel}
          buttonLabel="Save Edits"
        />
      </PatientDrawer>
    </FormProvider>
  );
};

export default PatientDetailsDrawer;
