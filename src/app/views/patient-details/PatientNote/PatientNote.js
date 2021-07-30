import React, { useState, useRef, useMemo } from 'react';
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
  // PatientNoteDescription,
  // PatientNoteTextarea,
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
  const {
    patientNoteIdentifier,
    // description,
    dateUpdated,
    creator,
    pinned,
  } = note;

  // const [text, setText] = useState(description);
  // const [textareaHeight, setTextareaHeight] = useState(0);
  // const descriptionReference = useRef(null);
  const [isEdited, setIsEdited] = useState(false);
  const [noteState, setNoteState] = useState(state);
  const editNoteInputReference = useRef(null);
  // const [toolbarSwitch, setToolbarSwitch] = useState(false);

  // useEffect(() => {
  //   setTextareaHeight(descriptionReference?.current?.offsetHeight);
  // }, [descriptionReference, description, text]);

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
        onClick: () => {
          setIsEdited(true);
          console.log(editNoteInputReference);
          editNoteInputReference.current.focus();
          // setToolbarSwitch(true);
        },
      });
      options.push({
        name: 'Delete',
        onClick: () => onRemove(patientNoteIdentifier),
        color: palette.error,
      });
    }
    return options;
  }, [
    isEditable,
    onPinChange,
    onRemove,
    patientNoteIdentifier,
    pinned,
    editNoteInputReference,
  ]);

  // console.log(description);

  return (
    <NoteContainer>
      <Member member={creator} />
      <Box m={2} />
      <PatientNoteInformation>
        {!isEdited ? (
          // <PatientNoteDescription ref={descriptionReference}>
          //   {description}
          // </PatientNoteDescription>
          <TextEditor
            disableMentions
            readOnly
            placeholder="why empty note? :<"
            state={noteState}
          />
        ) : (
          // TODO: ~WIKTOR~ replace for richtext supporting "TextEditor", connected with todo#2
          // <PatientNoteTextarea
          //   autoFocus
          //   disabled={!isEditable}
          //   onChange={event => setText(event.target.value)}
          //   onKeyDown={async event => {
          //     if (event.key === 'Enter' && text?.length > 0) {
          //       await onSave({
          //         ...note,
          //         description: text,
          //       });
          //       setIsEdited(false);
          //     }
          //   }}
          //   onBlur={() => {
          //     setIsEdited(false);
          //     setText(description);
          //   }}
          //   value={text}
          //   textareaHeight={textareaHeight}
          // />
          <div>
            {/* <Input ref={editNoteInputReference} /> */}
            <TextEditor
              showToolbar
              taskListIdentifier={patientNoteIdentifier}
              disableMentions
              ref={editNoteInputReference}
              placeholder="Leave a NOTE PLEASE and press enter on your keyboard to save"
              isDrawerEditor
              onBlur={async () => {
                setIsEdited(false);
                await onSave({
                  ...note,
                  description: convertFromEditorStateToOutput(noteState, true)
                    .tokenizedText,
                });
                // setToolbarSwitch(false);
              }}
              state={noteState}
              onChange={newState => {
                setNoteState(newState);
                // console.log(
                //   `editing note: ${convertFromEditorStateToOutput(noteState, true)
                //     .tokenizedText
                //   }`,
                // );
              }}
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
          </div>
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
