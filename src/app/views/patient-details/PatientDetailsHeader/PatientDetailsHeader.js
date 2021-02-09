import React, { useState, useCallback } from 'react';
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
  patient,
  isLoadingPatient,
  organization,
  setPatient,
  refreshPatient,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isOpenedDetails, setIsOpenedDetails] = useState(false);

  const currentUser = useSelector(userProfileSelector);

  const { emrIntegrationEnabled } = organization || {};
  const { patientIdentifier } = patient;
  const { allNotes } = patient;

  const updatePatient = useCallback(
    dataToUpdate => {
      setPatient(previousPatient => ({ ...previousPatient, ...dataToUpdate }));
      PatientApi.updatePatient(dataToUpdate)
        .then(updatedPatient => {
          setPatient(updatedPatient);
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          refreshPatient();
        });
    },
    [dispatch, refreshPatient, setPatient],
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
            refreshPatient();
          });
      },
    };
    dispatch(openModal('ArchivePatient', modalProps));
  }, [dispatch, patientIdentifier, history, refreshPatient]);

  const addPatientNote = useCallback(
    description => {
      PatientApi.createPatientNote(patientIdentifier, { description })
        .then(addedNote => {
          dispatch(showGlobalAlert(AlertMessages.CREATED));
          setPatient(previousPatient => ({
            ...previousPatient,
            allNotes: [addedNote, ...(previousPatient.allNotes || [])],
          }));
        })
        .catch(() => {
          refreshPatient();
          dispatch(showGlobalErrorAlert());
        });
    },
    [patientIdentifier, dispatch, setPatient, refreshPatient],
  );

  const editPatientNote = useCallback(
    editedNote => {
      setPatient(previousPatient => ({
        ...previousPatient,
        allNotes: previousPatient.allNotes?.map(note =>
          note.patientNoteIdentifier === editedNote.patientNoteIdentifier
            ? { ...note, description: editedNote.description }
            : note,
        ),
      }));

      PatientApi.updatePatientNote(editedNote)
        .then(updatedNote => {
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
          setPatient(previousPatient => ({
            ...previousPatient,
            allNotes: previousPatient.allNotes?.map(note =>
              note.patientNoteIdentifier === editedNote.patientNoteIdentifier
                ? { ...note, ...updatedNote }
                : note,
            ),
          }));
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          refreshPatient();
        });
    },
    [dispatch, refreshPatient, setPatient],
  );

  const deletePatientNote = useCallback(
    patientNoteIdentifierToDelete => {
      const modalProps = {
        confirm: () => {
          setPatient(previousPatient => ({
            ...previousPatient,
            allNotes: previousPatient.allNotes.filter(
              ({ patientNoteIdentifier }) =>
                patientNoteIdentifier !== patientNoteIdentifierToDelete,
            ),
          }));

          PatientApi.deletePatientNote(patientNoteIdentifierToDelete)
            .then(() => {
              dispatch(showGlobalAlert(AlertMessages.DELETED));
            })
            .catch(() => {
              dispatch(showGlobalErrorAlert());
              refreshPatient();
            });
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteNote', modalProps));
    },
    [dispatch, refreshPatient, setPatient],
  );

  return (
    <PatientDetailsContainer>
      <PatientDetailsInformation
        {...patient}
        isLoadingDetails={isLoadingPatient}
        setIsOpenedDetails={setIsOpenedDetails}
        isOpenedDetails={isOpenedDetails}
      />
      {!isLoadingPatient && (
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
        isLoadingDetails={isLoadingPatient}
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
