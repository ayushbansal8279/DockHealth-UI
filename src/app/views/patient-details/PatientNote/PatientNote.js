import React, { useState, useRef, useMemo, useEffect } from 'react';
import palette from 'styles/palette';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Box } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import moment from 'moment';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import TextEditor from 'components/common/TextEditor/TextEditor';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
} from 'components/common/TextEditor/helpers';

import {
  NoteContainer,
  PatientNoteAuthor,
  PatientNoteInformation,
} from './styled';

const PatientNote = ({
  note,
  isEditable,
  onSave,
  onRemove,
  onPinChange,
  mentions,
  description,
}) => {
  const { patientNoteIdentifier, dateUpdated, creator, pinned } = note;
  const state = convertToEditorState({
    tokenizedText: description,
    rawText: description,
    mentions,
    handleRichText: true,
  });
  const [isEdited, setIsEdited] = useState(false);
  const [noteState, setNoteState] = useState(state);
  const editNoteInputReference = useRef(null);

  useEffect(() => {
    if (isEdited) {
      setTimeout(() => editNoteInputReference.current?.focus(), 0);
    }
  }, [isEdited, editNoteInputReference]);

  const menuOptions = useMemo(() => {
    const options = [
      {
        name: pinned ? 'Un-pin' : 'Pin',
        onClick: () => onPinChange(patientNoteIdentifier, !pinned),
      },
    ];

    if (isEditable) {
      options.unshift({
        name: 'Edit',
        onClick: () => setIsEdited(true),
      });
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
      <UserAvatar user={creator} />
      <Box m={2} />
      <PatientNoteInformation>
        <TextEditor
          readOnly={!isEdited}
          showToolbar
          taskListIdentifier={patientNoteIdentifier}
          disableMentions
          ref={editNoteInputReference}
          placeholder="Leave a note and press enter on your keyboard to save"
          isDrawerEditor
          onBlur={async () => {
            setIsEdited(false);
            await onSave({
              ...note,
              description: convertFromEditorStateToOutput(noteState, true)
                .tokenizedText,
            });
          }}
          state={noteState}
          onChange={newState => setNoteState(newState)}
          keyBindingFn={event => {
            if (event.key === 'Enter' && !event.shiftKey) {
              return 'enter-command';
            }
            return undefined;
          }}
          handleKeyCommand={command => {
            if (command === 'enter-command') {
              editNoteInputReference.current.blur();
              return 'handled';
            }
            return 'not-handled';
          }}
        />
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
