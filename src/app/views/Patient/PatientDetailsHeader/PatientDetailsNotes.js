import React from 'react';
import moment from 'moment';
import { groupBy } from 'ramda';
import {
  PatientDetailsNotesContainer,
  PatientDetailsNotesGroupContainer,
  PatientDetailsNoteDate,
  PatientDetailsNoteDescription,
} from './styled';

const PatientDetailsNotesGroup = ({ date, notes }) => {
  return (
    <PatientDetailsNotesGroupContainer>
      <PatientDetailsNoteDate>{date}</PatientDetailsNoteDate>
      <PatientDetailsNoteDescription>
        {notes?.map(({ description }) => (
          <>
            <span>{description}</span>
          </>
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
