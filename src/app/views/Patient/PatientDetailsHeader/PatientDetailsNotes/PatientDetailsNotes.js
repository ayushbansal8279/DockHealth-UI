import React, { useState } from 'react';
import moment from 'moment';
import { groupBy } from 'ramda';
import { MontserratTypography } from 'styles/theme-montserrat';
import PatientDetailsNoteInput from '../PatientDetailsNoteInput/PatientDetailsNoteInput';
import PatientNote from './PatientNote';
import {
  PatientDetailsNotesContainer,
  PatientDetailsNotesGroupContainer,
  PatientDetailsNotesGroups,
  PatientDetailsNoteDate,
  PatientDetailsNoteDescription,
  AddNotePlaceholder,
} from './styled';

const PatientDetailsNotesGroup = ({
  date,
  notes,
  setEditableNote,
  editableNote,
  editPatientNote,
  deletePatientNote,
  currentUser,
}) => (
  <PatientDetailsNotesGroupContainer>
    <PatientDetailsNoteDate>{date}</PatientDetailsNoteDate>
    <PatientDetailsNoteDescription>
      {notes?.map(note => (
        <PatientNote
          {...note}
          setEditableNote={setEditableNote}
          isEditable={note.patientNoteIdentifier === editableNote}
          editPatientNote={editPatientNote}
          deletePatientNote={deletePatientNote}
          currentUser={currentUser}
        />
      ))}
    </PatientDetailsNoteDescription>
  </PatientDetailsNotesGroupContainer>
);

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
  const [editableNote, setEditableNote] = useState(null);

  const groupedNotes = groupBy(
    ({ dateCreated }) => moment(dateCreated).format('M/DD/YYYY'),
    allNotes ?? [],
  );

  return (
    <PatientDetailsNotesContainer>
      {allNotes?.length > 0 && (
        <PatientDetailsNotesGroups>
          {Object.keys(groupedNotes)?.map(key => (
            <PatientDetailsNotesGroup
              key={key}
              date={key}
              notes={groupedNotes[key]}
              setEditableNote={setEditableNote}
              editableNote={editableNote}
              editPatientNote={editPatientNote}
              deletePatientNote={deletePatientNote}
              currentUser={currentUser}
            />
          ))}
        </PatientDetailsNotesGroups>
      )}
      <PatientDetailsNoteInput
        onEnterClick={value => addPatientNote({ note: value })}
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
