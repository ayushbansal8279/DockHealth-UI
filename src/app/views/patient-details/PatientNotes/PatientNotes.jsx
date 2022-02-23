/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import PatientNote from '../PatientNote/PatientNote';
import PatientNotesLoader from '../PatientNotesLoader/PatientNotesLoader';
import {
  PatientNotesWrapper,
  PinnedNotesWrapper,
  RichTextInputContainer,
  ButtonContainer,
  ButtonWrapper,
} from './styled';

const PatientNotes = () => {
  const addNoteInputReference = useRef(null);
  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  const isFetching = useSelector(isFetchingNotesSelector);
  const currentUser = useSelector(userProfileSelector);
  const { patientIdentifier, allNotes: notes } = patient || {};
  const [editMode, setEditMode] = useState(false);

  const handleRemoveNote = useCallback(
    patientNoteIdentifier => {
      const modalProps = {
        title: 'Delete note',
        description:
          'Are you sure you want to delete this note? This action cannot be undone.',
        confirm: () => {
          dispatch(removePatientNote(patientNoteIdentifier));
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
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
  const clearNote = useCallback(() => setNoteState(EditorState.createEmpty()), [
    setNoteState,
  ]);

  const isEmpty = useMemo(() => {
    const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    return !tokenizedText.trim().length;
  }, [noteState]);

  const saveNote = useCallback(() => {
    const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    if (tokenizedText.trim().length > 0) {
      dispatch(addPatientNote(patientIdentifier, tokenizedText));
      clearNote();
      if (typeof addNoteInputReference.current.clear === 'function')
        addNoteInputReference.current.clear();
      setEditMode(false);
    }
  }, [clearNote, dispatch, noteState, patientIdentifier]);

  const handleCancel = useCallback(() => {
    clearNote();
    setEditMode(false);
  }, [clearNote]);

  const openDeleteConfirmationModal = useCallback(() => {
    const modalProps = {
      title: 'You are editing note',
      description:
        'Are you sure you want reject changes? This action cannot be undone.',
      confirmButtonText: 'Quit without saving',
      confirm: () => {
        handleCancel();
        dispatch(closeModal());
      },
      closeModal: () => {
        if (typeof addNoteInputReference.current.focus === 'function')
          addNoteInputReference.current.focus();
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleCancel]);

  const handleBlur = useCallback(() => {
    if (!isEmpty) openDeleteConfirmationModal();
  }, [isEmpty, openDeleteConfirmationModal]);

  const handleFocus = useCallback(() => {
    setEditMode(true);
  }, []);

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
              state={noteState}
              onChange={onNoteChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {editMode && (
              <ButtonContainer>
                <ButtonWrapper>
                  <Button
                    color="secondary"
                    variant="secondary"
                    onClick={handleCancel}
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Spacing horizontal={4} />
                  <Button
                    color="primary"
                    disabled={isEmpty}
                    size="small"
                    onClick={saveNote}
                  >
                    Save
                  </Button>
                </ButtonWrapper>
              </ButtonContainer>
            )}
          </RichTextInputContainer>
        </>
      ) : (
        <PatientNotesLoader />
      )}
    </PatientNotesWrapper>
  );
};

export default PatientNotes;
