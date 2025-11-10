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

export function useUnarchivePatient(patientIdentifier) {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(() => {
    if (!patientIdentifier) return;

    const modalProps = {
      confirm: () =>
        dispatch(unarchivePatientAction(patientIdentifier, history)),
    };
    dispatch(openModal('UnarchivePatient', modalProps));
  }, [dispatch, history, patientIdentifier]);
}

export function useDeletePatient(patientIdentifier) {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(() => {
    if (!patientIdentifier) return;

    const modalProps = {
      confirm: () =>
        dispatch(deletePatientArchiveAction(patientIdentifier, history)),
    };
    dispatch(openModal('DeletePatient', modalProps));
  }, [dispatch, history, patientIdentifier]);
}

export function useHandleAddButtonClick() {
  const history = useHistory();

  return useCallback(() => {
    history.push(`${CUSTOM_FIELDS_SETTINGS_PATH}/patients`);
  }, [history]);
}

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