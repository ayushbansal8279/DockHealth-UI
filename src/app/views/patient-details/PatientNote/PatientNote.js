import React, { useState, useRef, useMemo, useEffect } from 'react';
import palette from 'styles/palette';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Box } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import moment from 'moment';
import Member from 'components/members/Member/Member';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
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
  state,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { patientNoteIdentifier, dateUpdated, creator, pinned } = note;

  const [isEdited, setIsEdited] = useState(false);
  const [noteState, setNoteState] = useState(state);
  const editNoteInputReference = useRef(null);

  useEffect(() => {
    if (isEdited) {
      // eslint-disable-next-line no-unused-expressions
      editNoteInputReference?.current?.focus();
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
      <Member member={creator} />
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
            if (event.keyCode === 13 && event.shiftKey) {
              return undefined;
            }
            if (event.keyCode === 13) {
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
