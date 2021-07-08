import React, { useState, useCallback } from 'react';
import { compose } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openModal, closeModal } from 'modal/actions';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  patientSelector,
  isFetchingPatientSelector,
} from 'selectors/patient-details-selectors';
import { setPatient as setPatientAction } from 'actions/patient-details-actions';
import { reloadPatient } from 'sagas/patient-details-saga';
import * as PatientApi from 'api/patient-api';
import {
  onPatientNoteAdded,
  onPatientNoteEdited,
} from 'helpers/ga-event-helper';
import PatientDetailsInformation from './PatientDetailsInformation';
import PatientDetailsNotes from './PatientDetailsNotes/PatientDetailsNotes';
import PatientDetails from './PatientDetails/PatientDetails';
import { PatientDetailsContainer } from './styled';

const PatientDetailsHeader = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isOpenedDetails, setIsOpenedDetails] = useState(false);

  const currentUser = useSelector(userProfileSelector);
  const organization = useSelector(organizationSelector);
  const patient = useSelector(patientSelector);
  const isFetchingPatient = useSelector(isFetchingPatientSelector);

  const { emrIntegrationEnabled } = organization || {};
  const { patientIdentifier, allNotes } = patient || {};

  const setPatient = compose(dispatch, setPatientAction);
  const refreshPatient = compose(dispatch, reloadPatient);

  // TODO: move to saga
  const updatePatient = useCallback(
    dataToUpdate => {
      setPatient({ ...patient, ...dataToUpdate });
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
    [dispatch, patient, refreshPatient, setPatient],
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
          });
      },
    };
    dispatch(openModal('ArchivePatient', modalProps));
  }, [dispatch, patientIdentifier, history]);

  // TODO: move to saga
  const addPatientNote = useCallback(
    description => {
      PatientApi.createPatientNote(patientIdentifier, { description })
        .then(addedNote => {
          onPatientNoteAdded();
          dispatch(showGlobalAlert(AlertMessages.CREATED));
          setPatient({
            ...patient,
            allNotes: [addedNote, ...(patient.allNotes || [])],
          });
        })
        .catch(() => {
          refreshPatient();
          dispatch(showGlobalErrorAlert());
        });
    },
    [patientIdentifier, dispatch, setPatient, patient, refreshPatient],
  );

  // TODO: move to saga
  const editPatientNote = useCallback(
    editedNote => {
      setPatient({
        ...patient,
        allNotes: patient.allNotes?.map(note =>
          note.patientNoteIdentifier === editedNote.patientNoteIdentifier
            ? { ...note, description: editedNote.description }
            : note,
        ),
      });

      PatientApi.updatePatientNote(editedNote)
        .then(updatedNote => {
          onPatientNoteEdited();
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
          setPatient({
            ...patient,
            allNotes: patient.allNotes?.map(note =>
              note.patientNoteIdentifier === editedNote.patientNoteIdentifier
                ? { ...note, ...updatedNote }
                : note,
            ),
          });
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
          refreshPatient();
        });
    },
    [dispatch, patient, refreshPatient, setPatient],
  );

  // TODO: move to saga
  const deletePatientNote = useCallback(
    patientNoteIdentifierToDelete => {
      const modalProps = {
        confirm: () => {
          setPatient({
            ...patient,
            allNotes: patient.allNotes.filter(
              ({ patientNoteIdentifier }) =>
                patientNoteIdentifier !== patientNoteIdentifierToDelete,
            ),
          });

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
    [dispatch, patient, refreshPatient, setPatient],
  );

  return (
    <PatientDetailsContainer>
      <PatientDetailsInformation
        {...patient}
        isLoadingDetails={isFetchingPatient || !patient}
        setIsOpenedDetails={setIsOpenedDetails}
        isOpenedDetails={isOpenedDetails}
        currentUser={currentUser}
      />
      {!isFetchingPatient && patient && (
        <PatientDetails
          {...patient}
          isOpenedDetails={isOpenedDetails}
          updatePatient={updatePatient}
          patientIdentifier={patientIdentifier}
          archivePatient={archivePatient}
          editingDisabled={emrIntegrationEnabled}
          currentUser={currentUser}
          closeDetails={() => setIsOpenedDetails(false)}
        />
      )}
      <PatientDetailsNotes
        isLoadingDetails={isFetchingPatient || !patient}
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
