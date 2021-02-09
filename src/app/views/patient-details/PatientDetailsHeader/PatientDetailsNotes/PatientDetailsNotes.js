import React, { useState, useRef } from 'react';
import { Collapse } from '@material-ui/core';

import Arrow from 'components/common/Arrow/Arrow';
import PatientDetailsNoteInput from '../PatientDetailsNoteInput/PatientDetailsNoteInput';
import PatientNote from './PatientNote';
import {
  PatientDetailsNotesContainer,
  PatientDetailsNotesListContainer,
  AddNotePlaceholder,
} from './styled';
import PatientDetailsNotesLoader from '../PatientDetailsNotesLoader/PatientDetailsNotesLoader';

const AddPatientNote = () => (
  <AddNotePlaceholder>+ Add note</AddNotePlaceholder>
);

const PatientDetailsNotes = ({
  allNotes,
  currentUser,
  addPatientNote,
  editPatientNote,
  deletePatientNote,
  isLoadingDetails,
}) => {
  const [isOpenedNotes, setIsOpenedNotes] = useState(true);
  const [editableNote, setEditableNote] = useState(null);
  const listReference = useRef(null);

  return (
    <PatientDetailsNotesContainer>
      {!isLoadingDetails ? (
        <>
          <Arrow
            isOpen={isOpenedNotes}
            setOpen={setIsOpenedNotes}
            showArrow={allNotes?.length > 0}
            justifyContent="flex-start"
          >
            <span>NOTES</span>
          </Arrow>
          <Collapse timeout={150} in={isOpenedNotes}>
            <PatientDetailsNotesListContainer ref={listReference}>
              {allNotes?.map(note => (
                <PatientNote
                  {...note}
                  setEditableNote={setEditableNote}
                  isEditable={note.patientNoteIdentifier === editableNote}
                  editPatientNote={editPatientNote}
                  deletePatientNote={deletePatientNote}
                  currentUser={currentUser}
                />
              ))}
            </PatientDetailsNotesListContainer>
          </Collapse>

          <PatientDetailsNoteInput
            onEnterClick={value => {
              if ([...value]?.filter(char => char !== ' ').length > 0) {
                addPatientNote(value);
                listReference.current.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth',
                });
              }
            }}
            closeOnEnter
            placeholder="Leave a note"
            currentUser={currentUser}
          >
            <AddPatientNote />
          </PatientDetailsNoteInput>
        </>
      ) : (
        <PatientDetailsNotesLoader />
      )}
    </PatientDetailsNotesContainer>
  );
};

export default PatientDetailsNotes;
