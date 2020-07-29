import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import {
  PatientNote as StyledPatientNote,
  PatientNoteAuthor,
  PatientNoteDescription,
  PatientNoteTextarea,
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
  const [textareaHeight, setTextareaHeight] = useState(0);
  const descritpionElement = useRef(null);

  useEffect(() => {
    setTextareaHeight(descritpionElement?.current?.offsetHeight);
  }, [descritpionElement, description, updatedDescription]);

  useEffect(() => {
    setUpdatedDescription(description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditable]);

  return (
    <StyledPatientNote isEditable={isEditable}>
      <PatientNoteInformation>
        {!isEditable && (
          <PatientNoteDescription ref={descritpionElement}>
            {description}
          </PatientNoteDescription>
        )}
        {isEditable && (
          <PatientNoteTextarea
            onChange={event => setUpdatedDescription(event.target.value)}
            onKeyDown={async event => {
              if (event.keyCode === 13 && updatedDescription?.length > 0) {
                await editPatientNote({
                  note: updatedDescription,
                  patientNoteIdentifier,
                });
                setEditableNote(null);
              }
            }}
            onBlur={() => setEditableNote(null)}
            value={isEditable ? updatedDescription : description}
            textareaHeight={textareaHeight}
          />
        )}
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
