import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  PatientNote as StyledPatientNote,
  PatientNoteAuthor,
  PatientNoteDescription,
  PatientNoteOption,
  PatientNoteOptions,
  PatientNoteInformation,
} from './styled';

const PatientNote = ({
  currentUser: { userIdentifier: currentUserIdentifier },
  patientNoteIdentifier,
  description,
  creator: { firstName, lastName, userIdentifier: creatorUserIdentifier },
  setEditableNote,
  isEditable = false,
  dateUpdated,
  editPatientNote,
  deletePatientNote,
}) => {
  const [updatedDescription, setUpdatedDescription] = useState(description);

  useEffect(() => {
    setUpdatedDescription(description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditable]);

  return (
    <StyledPatientNote isEditable={isEditable}>
      <PatientNoteInformation>
        <PatientNoteDescription
          onChange={event => setUpdatedDescription(event.target.value)}
          onKeyDown={async event => {
            if (event.keyCode === 13) {
              await editPatientNote({
                note: updatedDescription,
                patientNoteIdentifier,
              });
              setEditableNote(null);
            }
          }}
          value={isEditable ? updatedDescription : description}
          disabled={!isEditable}
        />
        <PatientNoteAuthor>
          {firstName} {lastName} {moment(dateUpdated).format('h:mma M/DD/YY')}
        </PatientNoteAuthor>
      </PatientNoteInformation>
      {currentUserIdentifier === creatorUserIdentifier && (
        <PatientNoteOptions>
          <PatientNoteOption
            onClick={() => {
              setEditableNote(isEditable ? null : patientNoteIdentifier);
            }}
          >
            {isEditable ? 'Cancel' : 'Edit'}
          </PatientNoteOption>
          <PatientNoteOption
            onClick={() => deletePatientNote(patientNoteIdentifier)}
          >
            Delete
          </PatientNoteOption>
        </PatientNoteOptions>
      )}
    </StyledPatientNote>
  );
};

export default PatientNote;
