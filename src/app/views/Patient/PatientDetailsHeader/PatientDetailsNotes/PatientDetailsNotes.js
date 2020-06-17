import React, { useState, useRef } from 'react';
import { Collapse } from '@material-ui/core';
import { MontserratTypography } from 'styles/theme-montserrat';
import ArrowIcon from 'img/arrow';

import PatientDetailsNoteInput from '../PatientDetailsNoteInput/PatientDetailsNoteInput';
import PatientNote from './PatientNote';
import {
  Arrow,
  PatientDetailsNotesContainer,
  PatientDetailsNotesHeader,
  PatientDetailsNotesListContainer,
  AddNotePlaceholder,
} from './styled';

const AddPatientNote = () => (
  <MontserratTypography>
    <AddNotePlaceholder>+ Add note</AddNotePlaceholder>
  </MontserratTypography>
);

const PatientDetailsNotes = ({
  allNotes,
  currentUser,
  addPatientNote,
  editPatientNote,
  deletePatientNote,
}) => {
  const [isOpenedNotes, setIsOpenedNotes] = useState(true);
  const [editableNote, setEditableNote] = useState(null);
  const listReference = useRef(null);

  return (
    <PatientDetailsNotesContainer>
      <PatientDetailsNotesHeader>
        <span>NOTES</span>
        {allNotes?.length > 0 && (
          <Arrow
            alt="arrow"
            isOpen={isOpenedNotes}
            onClick={() => setIsOpenedNotes(!isOpenedNotes)}
            src={ArrowIcon}
          />
        )}
      </PatientDetailsNotesHeader>
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
          addPatientNote({ note: value });
          listReference.current.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }}
        closeOnEnter
        placeholder="Leave a note"
        currentUser={currentUser}
      >
        <AddPatientNote />
      </PatientDetailsNoteInput>
    </PatientDetailsNotesContainer>
  );
};

export default PatientDetailsNotes;
