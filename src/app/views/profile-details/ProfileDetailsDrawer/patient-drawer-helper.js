import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openModal } from 'modal/actions';
import {
  archivePatient as archivePatientAction,
  unarchivePatient as unarchivePatientAction,
  deletePatientArchive as deletePatientArchiveAction,
} from 'sagas/patient-details-saga';
import { CUSTOM_FIELDS_SETTINGS_PATH } from 'routing/helpers/paths';

/**
 * Creates menu options for patient drawer
 * @param {Object} params - Configuration object
 * @param {Function} params.dispatch - Redux dispatch function
 * @param {Function} params.history - React Router history object
 * @param {Object} params.patient - Patient object with patientIdentifier and patientStatus
 * @param {boolean} params.isActive - Whether the patient is in edit mode
 * @param {Function} params.setActive - Function to set edit mode
 * @param {boolean} params.patientAddEnabled - Whether patient add is enabled
 * @param {Function} params.archivePatient - Function to archive patient
 * @param {Function} params.unarchivePatient - Function to unarchive patient
 * @param {Function} params.deletePatient - Function to delete patient
 * @param {Function} params.onClose - Function to close the drawer
 * @param {boolean} params.isAdmin - Whether user is admin
 * @param {boolean} params.patientCustomFieldsAvailable - Whether patient custom fields feature is available
 * @param {Function} params.handleAddButtonClick - Function to handle add button click
 * @param {Function} params.handleChangeScopeClick - Function to handle change scope click
 * @returns {Array} Array of menu option objects (filtered to remove falsy values)
 */
export const createPatientMenuOptions = ({
  dispatch,
  history,
  patient,
  isActive,
  setActive,
  patientAddEnabled,
  archivePatient,
  unarchivePatient,
  deletePatient,
  onClose,
  isAdmin,
  patientCustomFieldsAvailable,
  handleAddButtonClick,
  handleChangeScopeClick,
}) => {
  const options = [
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
              patient: patient,
            }),
          );
          onClose();
        },
      },
    patientAddEnabled &&
      patient.patientStatus === 'ACTIVE' && {
        name: 'Archive',
        onClick: archivePatient,
      },
    patient.patientStatus === 'ARCHIVED' && {
      name: 'Restore',
      onClick: unarchivePatient,
    },
    patient.patientStatus === 'ARCHIVED' && {
      name: 'Delete',
      onClick: deletePatient,
    },
    isAdmin &&
      patientCustomFieldsAvailable && {
        name: 'Edit Object Details',
        onClick: handleAddButtonClick,
      },
    isAdmin && {
      name: 'Change Scope',
      onClick: handleChangeScopeClick,
    },
  ];

  return options.filter(Boolean);
};

/**
 * Custom hook for archiving a patient
 * @param {string} patientIdentifier - Patient identifier
 * @returns {Function} Archive patient callback
 */
export function useArchivePatient(patientIdentifier) {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(() => {
    if (!patientIdentifier) return;

    const modalProps = {
      confirm: () => dispatch(archivePatientAction(patientIdentifier, history)),
    };
    dispatch(openModal('ArchivePatient', modalProps));
  }, [dispatch, history, patientIdentifier]);
}

/**
 * Custom hook for unarchiving a patient
 * @param {string} patientIdentifier - Patient identifier
 * @returns {Function} Unarchive patient callback
 */
export function useUnarchivePatient(patientIdentifier) {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(() => {
    if (!patientIdentifier) return;

    const modalProps = {
      confirm: () => dispatch(unarchivePatientAction(patientIdentifier, history)),
    };
    dispatch(openModal('UnarchivePatient', modalProps));
  }, [dispatch, history, patientIdentifier]);
}

/**
 * Custom hook for deleting a patient
 * @param {string} patientIdentifier - Patient identifier
 * @returns {Function} Delete patient callback
 */
export function useDeletePatient(patientIdentifier) {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(() => {
    if (!patientIdentifier) return;

    const modalProps = {
      confirm: () => dispatch(deletePatientArchiveAction(patientIdentifier, history)),
    };
    dispatch(openModal('DeletePatient', modalProps));
  }, [dispatch, history, patientIdentifier]);
}

/**
 * Custom hook for handling add button click (navigate to custom fields)
 * @returns {Function} Handle add button click callback
 */
export function useHandleAddButtonClick() {
  const history = useHistory();

  return useCallback(() => {
    history.push(`${CUSTOM_FIELDS_SETTINGS_PATH}/patients`);
  }, [history]);
}

/**
 * Custom hook for handling change scope click
 * @param {Object} patient - Patient object
 * @param {string} workspaceId - Workspace identifier
 * @returns {Function} Handle change scope click callback
 */
export function useHandleChangeScopeClick(patient, workspaceId) {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(() => {
    if (!patient) return;

    dispatch(
      openModal('ScopeChange', {
        customField: {
          ...patient,
          patientIdentifier: patient.patientIdentifier,
        },
        workspaceIdentifier: workspaceId,
        onScopeChanged: () => {
          if (workspaceId) {
            history.push(`/core/workspace/${workspaceId}/patients/list/all`);
          } else {
            history.push('/core/patients/list/all');
          }
        },
      }),
    );
  }, [dispatch, history, patient, workspaceId]);
}

