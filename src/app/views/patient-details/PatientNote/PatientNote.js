import React, { useState, useEffect, useRef, useMemo } from 'react';
import palette from 'styles/palette';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Box } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import moment from 'moment';
import Member from 'components/members/Member/Member';
import {
  NoteContainer,
  PatientNoteAuthor,
  PatientNoteDescription,
  PatientNoteTextarea,
  PatientNoteInformation,
} from './styled';

const PatientNote = ({ note, isEditable, onSave, onRemove, onPinChange }) => {
  const {
    patientNoteIdentifier,
    description,
    dateUpdated,
    creator,
    pinned,
  } = note;

  const [text, setText] = useState(description);
  const [textareaHeight, setTextareaHeight] = useState(0);
  const descriptionReference = useRef(null);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setTextareaHeight(descriptionReference?.current?.offsetHeight);
  }, [descriptionReference, description, text]);

  const menuOptions = useMemo(() => {
    const options = [
      {
        name: pinned ? 'Un-pin' : 'Pin',
        onClick: () => onPinChange(patientNoteIdentifier, !pinned),
      },
    ];

    if (isEditable) {
      options.unshift({ name: 'Edit', onClick: () => setIsEdited(true) });
      options.push({
        name: 'Delete',
        onClick: () => onRemove(patientNoteIdentifier),
        color: palette.error,
      });
    }
    return options;
  }, [isEditable, onPinChange, onRemove, patientNoteIdentifier, pinned]);

  return (
    <NoteContainer>
      <Member member={creator} />
      <Box m={2} />
      <PatientNoteInformation>
        {!isEdited ? (
          <PatientNoteDescription ref={descriptionReference}>
            {description}
          </PatientNoteDescription>
        ) : (
          // TODO: ~WIKTOR~ replace for richtext supporting "TextEditor", connected with todo#2
          <PatientNoteTextarea
            autoFocus
            disabled={!isEditable}
            onChange={event => setText(event.target.value)}
            onKeyDown={async event => {
              if (event.key === 'Enter' && text?.length > 0) {
                await onSave({
                  ...note,
                  description: text,
                });
                setIsEdited(false);
              }
            }}
            onBlur={() => {
              setIsEdited(false);
              setText(description);
            }}
            value={text}
            textareaHeight={textareaHeight}
          />
        )}
        <PatientNoteAuthor>
          {creator.firstName} {creator.lastName}{' '}
          {moment(dateUpdated).format('h:mma M/DD/YY')}
        </PatientNoteAuthor>
      </PatientNoteInformation>
      {menuOptions.length > 0 && (
        <>
          <Box m={2} />
          <OptionsMenu options={menuOptions}>
            <MoreVert />
          </OptionsMenu>
        </>
      )}
    </NoteContainer>
  );
};

export default PatientNote;
