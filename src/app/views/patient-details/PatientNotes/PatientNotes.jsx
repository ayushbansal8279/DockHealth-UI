/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo, useRef } from 'react';
import { compose, descend, prop } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import {
  patientSelector,
  isFetchingNotesSelector,
} from 'selectors/patient-details-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  addPatientNote,
  updatePatientNote,
  removePatientNote,
  changePatientNotePin,
} from 'sagas/patient-details-saga';
import { openModal, closeModal } from 'modal/actions';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { EditorState } from 'draft-js';
// import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import {
  convertFromEditorStateToOutput,
  // convertToEditorState,
} from 'components/common/TextEditor/helpers';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import PatientNote from '../PatientNote/PatientNote';
import PatientNotesLoader from '../PatientNotesLoader/PatientNotesLoader';
import {
  PatientNotesWrapper,
  PinnedNotesWrapper,
  // NoteInput,
  RichTextInputContainer,
} from './styled';

import initializeAddNotesHooks from './hooks';

const PatientNotes = () => {
  const addNoteInputReference = useRef(null);
  // const [newNoteValue, setNewNoteValue] = useState('');
  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  const isFetching = useSelector(isFetchingNotesSelector);
  const currentUser = useSelector(userProfileSelector);
  const { patientIdentifier, allNotes: notes } = patient || {};

  // const handleOnChange = (event, state) => {
  //   setCommentState(state);
  //   // setNewNoteValue(event.target.value);
  // };

  const handleRemoveNote = useCallback(
    patientNoteIdentifier => {
      const modalProps = {
        confirm: () => {
          dispatch(removePatientNote(patientNoteIdentifier));
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteNote', modalProps));
    },
    [dispatch],
  );

  const handleSaveNote = useCallback(compose(dispatch, updatePatientNote), []);

  const handlePinChange = useCallback(
    compose(dispatch, changePatientNotePin),
    [],
  );

  // const handleAddNoteInputKeyDown = event => {
  //   if (event.key === 'Enter' && !event.shiftKey) {
  //     event.preventDefault();
  //     if ([...newNoteValue]?.filter(char => char !== ' ').length > 0) {
  //       dispatch(addPatientNote(patientIdentifier, newNoteValue));
  //       setNewNoteValue('');
  //       addNoteInputReference.current.focus();
  //     }
  //   }

  //   if (event.key === 'Escape') {
  //     setNewNoteValue('');
  //   }
  // };
  const { onNoteChange, noteState, clearNote } = initializeAddNotesHooks();

  const saveNote = state => {
    const { tokenizedText } = convertFromEditorStateToOutput(state, true);
    console.log(`trying to save [${tokenizedText}]`);
    if ([...tokenizedText]?.filter(char => char !== ' ').length > 0) {
      dispatch(addPatientNote(patientIdentifier, tokenizedText));
      clearNote();
      addNoteInputReference.current.clear();
    }
  };

  const [pinnedNotes, unpinnedNotes] = useMemo(
    () =>
      notes?.reduce(
        (accumulator, note) => {
          if (note.pinned) {
            accumulator[0].push(note);
          } else {
            accumulator[1].push(note);
          }
          return accumulator;
        },
        [[], []],
      ) || [null, null],
    [notes],
  );

  // TODO: ~WIKTOR~ it should support TextEditor, connected with todo#1
  const renderPatient = note => {
    const { description, mentions, ...restNotes } = note;
    const state = EditorState.createWithContent(
      createMentionEntities(description, description, mentions || [], true),
    );
    // console.log(
    //   `[${description}], [${note.rawText}], [${note.mentions}], [${
    //     note.tokenizedText
    //   }], [${convertFromEditorStateToOutput(state).rawText}]`,
    // );
    console.log(note);
    return (
      <PatientNote
        key={note.patientNoteIdentifier}
        note={restNotes}
        isEditable={currentUser.userIdentifier === note.creator?.userIdentifier}
        onSave={handleSaveNote}
        onRemove={handleRemoveNote}
        onPinChange={handlePinChange}
        state={state}
      />
    );
  };

  const handleOnFocus = () => {};

  const handleOnBlur = state => {
    // saveComment();
    saveNote(state);
  };

  return (
    <PatientNotesWrapper>
      {!isFetching ? (
        <>
          {pinnedNotes?.length > 0 && (
            <PinnedNotesWrapper>
              {pinnedNotes
                ?.sort(descend(prop('dateUpdated')))
                ?.map(renderPatient)}
            </PinnedNotesWrapper>
          )}
          {unpinnedNotes
            ?.sort(descend(prop('dateUpdated')))
            ?.map(renderPatient)}
          <RichTextInputContainer>
            <TextEditor
              showToolbar
              ref={addNoteInputReference}
              taskListIdentifier={patientIdentifier}
              disableMentions
              placeholder="Leave a NOTE PLEASE and press enter on your keyboard to save"
              isDrawerEditor
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              state={noteState}
              onChange={onNoteChange}
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
                  addNoteInputReference.current.blur();
                  return 'handled';
                }
                return 'not-handled';
              }}
            />
          </RichTextInputContainer>
          {/* <NoteInput
            ref={addNoteInputReference}
            placeholder="Don't add a note"
            value={newNoteValue}
            onKeyDown={handleAddNoteInputKeyDown}
            onChange={event => setNewNoteValue(event.target.value)}
          /> */}
        </>
      ) : (
        <PatientNotesLoader />
      )}
    </PatientNotesWrapper>
  );
};

export default PatientNotes;
