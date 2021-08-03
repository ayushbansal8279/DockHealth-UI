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

import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import PatientNote from '../PatientNote/PatientNote';
import PatientNotesLoader from '../PatientNotesLoader/PatientNotesLoader';
import {
  PatientNotesWrapper,
  PinnedNotesWrapper,
  RichTextInputContainer,
} from './styled';

const PatientNotes = () => {
  const addNoteInputReference = useRef(null);
  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  const isFetching = useSelector(isFetchingNotesSelector);
  const currentUser = useSelector(userProfileSelector);
  const { patientIdentifier, allNotes: notes } = patient || {};

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

  const [noteState, setNoteState] = useMentionsEditorState();
  const onNoteChange = state => setNoteState(state);
  const clearNote = () => setNoteState(EditorState.createEmpty());

  const saveNote = state => {
    const { tokenizedText } = convertFromEditorStateToOutput(state, true);
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
  const renderPatient = note => {
    const { description, mentions, ...restNotes } = note;

    return (
      <PatientNote
        key={note.patientNoteIdentifier}
        note={restNotes}
        isEditable={currentUser.userIdentifier === note.creator?.userIdentifier}
        onSave={handleSaveNote}
        onRemove={handleRemoveNote}
        onPinChange={handlePinChange}
        mentions={mentions}
        description={description}
      />
    );
  };

  const handleOnFocus = () => {};

  const handleOnBlur = state => {
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
              placeholder="Leave a note and press enter on your keyboard to save"
              isDrawerEditor
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              state={noteState}
              onChange={onNoteChange}
              keyBindingFn={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
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
        </>
      ) : (
        <PatientNotesLoader />
      )}
    </PatientNotesWrapper>
  );
};

export default PatientNotes;
