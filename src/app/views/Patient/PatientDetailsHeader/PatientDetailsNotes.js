import React from 'react';
import moment from 'moment';
import { groupBy } from 'ramda';
import { MontserratTypography } from 'styles/theme-montserrat';
import PatientDetailsNoteInput from './PatientDetailsNoteInput/PatientDetailsNoteInput';
// import InputWithDynamicText from 'components/common/InputWithDynamicText/InputWithDynamicText';
import {
  PatientDetailsNotesContainer,
  PatientDetailsNotesGroupContainer,
  PatientDetailsNoteDate,
  PatientDetailsNoteDescription,
  PatientNote,
  PatientNoteAuthor,
  AddNotePlaceholder,
} from './styled';

const PatientDetailsNotesGroup = ({ date, notes, dateUpdated }) => {
  return (
    <PatientDetailsNotesGroupContainer>
      <PatientDetailsNoteDate>{date}</PatientDetailsNoteDate>
      <PatientDetailsNoteDescription>
        {notes?.map(({ description, creator: { firstName, lastName } }) => (
          <PatientNote>
            <span>{description}</span>
            <PatientNoteAuthor>
              {firstName} {lastName} {moment(dateUpdated).format('h:mm a')}
            </PatientNoteAuthor>
          </PatientNote>
        ))}
      </PatientDetailsNoteDescription>
    </PatientDetailsNotesGroupContainer>
  );
};

const AddPatientNote = () => (
  <MontserratTypography>
    <AddNotePlaceholder>+ Add note</AddNotePlaceholder>
  </MontserratTypography>
);

const PatientDetailsNotes = ({ allNotes, currentUser, addPatientNote }) => {
  const groupedNotes = groupBy(
    ({ dateCreated }) => moment(dateCreated).format('M/DD/YYYY'),
    allNotes ?? [],
  );

  return (
    <PatientDetailsNotesContainer>
      {Object.keys(groupedNotes)?.map(key => (
        <PatientDetailsNotesGroup
          key={key}
          date={key}
          notes={groupedNotes[key]}
        />
      ))}

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
