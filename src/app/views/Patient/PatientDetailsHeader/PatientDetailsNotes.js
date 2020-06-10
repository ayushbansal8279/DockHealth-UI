import React from 'react';
import moment from 'moment';
import { groupBy } from 'ramda';
import {
  PatientDetailsNotesContainer,
  PatientDetailsNotesGroupContainer,
  PatientDetailsNoteDate,
  PatientDetailsNoteDescription,
  PatientNote,
  PatientNoteAuthor,
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

const PatientDetailsNotes = ({ allNotes }) => {
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
    </PatientDetailsNotesContainer>
  );
};

export default PatientDetailsNotes;
