import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openModal, closeModal } from 'modal/actions';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { userProfileSelector } from 'selectors/user-selectors';
import * as PatientApi from 'api/patient-api';

import PatientDetailsInformation from './PatientDetailsInformation';
import PatientDetailsNotes from './PatientDetailsNotes/PatientDetailsNotes';
import PatientDetails from './PatientDetails/PatientDetails';
import { PatientDetailsContainer } from './styled';

const PatientDetailsHeader = ({
  patientIdentifier,
  organization,
  onPatientUpdate,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [patient, setPatient] = useState({});
  const [patientIsLoading, setPatientIsLoading] = useState(false);
  const [isOpenedDetails, setIsOpenedDetails] = useState(false);

  const currentUser = useSelector(userProfileSelector);

  const { emrIntegrationEnabled } = organization || {};
  const { allNotes } = patient;

  const fetchPatient = useCallback(
    () =>
      PatientApi.getPatientById(patientIdentifier)
        .then(fetchedPatient => {
          setPatient(fetchedPatient);
          onPatientUpdate(fetchedPatient);
          return fetchedPatient;
        })
        .catch(() => {}),
    [onPatientUpdate, patientIdentifier],
  );

  useEffect(() => {
    if (patientIdentifier) {
      setPatientIsLoading(true);
      fetchPatient().then(() => {
        setPatientIsLoading(false);
      });
    }
  }, [patientIdentifier, fetchPatient]);

  const updatePatient = useCallback(
    patientToUpdate => {
      PatientApi.updatePatient(patientToUpdate)
        .then(updatedPatient => {
          setPatient(updatedPatient);
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          fetchPatient();
        });
    },
    [dispatch, fetchPatient],
  );

  const archivePatient = useCallback(() => {
    const modalProps = {
      confirm: () => {
        PatientApi.archivePatient(patientIdentifier)
          .then(() => {
            dispatch(closeModal());
            dispatch(showGlobalAlert(AlertMessages.PATIENT_ARCHIVED));
            history.push('/core/patients');
          })
          .catch(() => {
            dispatch(showGlobalErrorAlert());
            dispatch(closeModal());
            fetchPatient();
          });
      },
    };
    dispatch(openModal('ArchivePatient', modalProps));
  }, [dispatch, patientIdentifier, history, fetchPatient]);

  const addPatientNote = useCallback(
    description => {
      PatientApi.createPatientNote(patientIdentifier, { description })
        .then(() => {
          dispatch(showGlobalAlert(AlertMessages.CREATED));
          fetchPatient();
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
        });
    },
    [dispatch, fetchPatient, patientIdentifier],
  );

  const editPatientNote = useCallback(
    newNote => {
      PatientApi.updatePatientNote(newNote)
        .then(() => {
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
          fetchPatient();
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          fetchPatient();
        });
    },
    [dispatch, fetchPatient],
  );

  const deletePatientNote = useCallback(
    patientNoteIdentifier => {
      const modalProps = {
        confirm: () => {
          PatientApi.deletePatientNote(patientNoteIdentifier)
            .then(() => {
              dispatch(showGlobalAlert(AlertMessages.DELETED));
              fetchPatient();
            })
            .catch(() => {
              dispatch(showGlobalErrorAlert());
              fetchPatient();
            });
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteNote', modalProps));
    },
    [dispatch, fetchPatient],
  );

  return (
    <PatientDetailsContainer>
      <PatientDetailsInformation
        {...patient}
        isLoadingDetails={patientIsLoading}
        setIsOpenedDetails={setIsOpenedDetails}
        isOpenedDetails={isOpenedDetails}
      />
      {!patientIsLoading && (
        <PatientDetails
          {...patient}
          isOpenedDetails={isOpenedDetails}
          updatePatient={updatePatient}
          patientIdentifier={patientIdentifier}
          archivePatient={archivePatient}
          editingDisabled={emrIntegrationEnabled}
        />
      )}
      <PatientDetailsNotes
        isLoadingDetails={patientIsLoading}
        allNotes={allNotes}
        currentUser={currentUser}
        addPatientNote={addPatientNote}
        editPatientNote={editPatientNote}
        deletePatientNote={deletePatientNote}
      />
    </PatientDetailsContainer>
  );
};

export default PatientDetailsHeader;
