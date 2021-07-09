/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { compose, descend, prop } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import {
  patientSelector,
  isFetchingNotesSelector,
} from 'selectors/patient-details-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  addPatientNote,
  updatePatientNote,
  removePatientNote,
  changePatientNotePin,
} from 'sagas/patient-details-saga';
import { openModal, closeModal } from 'modal/actions';
import PatientNote from '../PatientNote/PatientNote';
import PatientNotesLoader from '../PatientNotesLoader/PatientNotesLoader';
import { PatientNotesWrapper, PinnedNotesWrapper, NoteInput } from './styled';

const PatientNotes = () => {
  const addNoteInputReference = useRef(null);
  const [newNoteValue, setNewNoteValue] = useState('');
  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  const isFetching = useSelector(isFetchingNotesSelector);
  const currentUser = useSelector(userProfileSelector);
  const { patientIdentifier, allNotes: notes } = patient || {};

  const handleRemoveNote = useCallback(
    patientNoteIdentifier => {
      const modalProps = {
        confirm: () => {
          dispatch(removePatientNote(patientNoteIdentifier));
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteNote', modalProps));
    },
    [dispatch],
  );

  const handleSaveNote = useCallback(compose(dispatch, updatePatientNote), []);

  const handlePinChange = useCallback(
    compose(dispatch, changePatientNotePin),
    [],
  );

  const handleAddNoteInputKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if ([...newNoteValue]?.filter(char => char !== ' ').length > 0) {
        dispatch(addPatientNote(patientIdentifier, newNoteValue));
        setNewNoteValue('');
        addNoteInputReference.current.focus();
      }
    }

    if (event.key === 'Escape') {
      setNewNoteValue('');
    }
  };

  const [pinnedNotes, unpinnedNotes] = useMemo(
    () =>
      notes?.reduce(
        (accumulator, note) => {
          if (note.pinned) {
            accumulator[0].push(note);
          } else {
            accumulator[1].push(note);
          }
          return accumulator;
        },
        [[], []],
      ) || [null, null],
    [notes],
  );

  const renderPatient = note => (
    <PatientNote
      key={note.patientNoteIdentifier}
      note={note}
      isEditable={currentUser.userIdentifier === note.creator?.userIdentifier}
      onSave={handleSaveNote}
      onRemove={handleRemoveNote}
      onPinChange={handlePinChange}
    />
  );

  return (
    <PatientNotesWrapper>
      {!isFetching ? (
        <>
          {pinnedNotes?.length > 0 && (
            <PinnedNotesWrapper>
              {pinnedNotes
                ?.sort(descend(prop('dateUpdated')))
                ?.map(renderPatient)}
            </PinnedNotesWrapper>
          )}
          {unpinnedNotes
            ?.sort(descend(prop('dateUpdated')))
            ?.map(renderPatient)}
          <NoteInput
            ref={addNoteInputReference}
            placeholder="Leave a comment"
            value={newNoteValue}
            onKeyDown={handleAddNoteInputKeyDown}
            onChange={event => setNewNoteValue(event.target.value)}
          />
        </>
      ) : (
        <PatientNotesLoader />
      )}
    </PatientNotesWrapper>
  );
};

export default PatientNotes;
