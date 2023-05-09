/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import compose from 'ramda/src/compose';
import descend from 'ramda/src/descend';
import prop from 'ramda/src/prop';
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
// import { EditorState } from 'draft-js';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
// import { ClickAwayListener } from '@mui/material';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import PatientNote from '../PatientNote/PatientNote';
import PatientNotesLoader from '../PatientNotesLoader/PatientNotesLoader';
import {
  PatientNotesWrapper,
  PinnedNotesWrapper,
  ButtonContainer,
  ButtonWrapper,
} from './styled';
import TextArea from '../../../../ui-toolkit/Form/TextArea/TextArea';

const PatientNotes = () => {
  const addNoteInputReference = useRef(null);
  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  const isFetching = useSelector(isFetchingNotesSelector);
  const currentUser = useSelector(userProfileSelector);
  const { patientIdentifier, allNotes: notes } = patient || {};
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpened, setModalIsOpened] = useState(false);

  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  const handleRemoveNote = useCallback(
    (patientNoteIdentifier) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSaveNote = useCallback(compose(dispatch, updatePatientNote), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePinChange = useCallback(
    compose(dispatch, changePatientNotePin),
    [],
  );

  const [noteState, setNoteState] = useState('');
  const onNoteChange = (state) => setNoteState(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clearNote = useCallback(
    () =>
      // () => setNoteState(EditorState.createEmpty()),
      undefined[setNoteState],
  );

  const isEmpty = useMemo(() => {
    const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    return tokenizedText?.trim()?.length === 0;
  }, [noteState]);

  const saveNote = useCallback(() => {
    const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    if (tokenizedText?.trim()?.length > 0) {
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
        setModalIsOpened(false);
        handleCancel();
        dispatch(closeModal());
      },
      onClose: () => {
        setTimeout(() => setModalIsOpened(false), 0);
        dispatch(closeModal());
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleCancel]);

  const handleClickAway = useCallback(() => {
    if (editMode && !modalIsOpened) {
      if (isEmpty) {
        handleCancel();
      } else {
        setModalIsOpened(true);
        openDeleteConfirmationModal();
      }
    }
  }, [
    editMode,
    modalIsOpened,
    isEmpty,
    handleCancel,
    openDeleteConfirmationModal,
  ]);

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
  const renderNote = (note) => {
    const { description, mentions, ...restNotes } = note;

    return (
      <PatientNote
        key={note.patientNoteIdentifier}
        note={restNotes}
        isEditable={
          currentUser.userIdentifier === note.creator?.userIdentifier ||
          isOrganizationAdmin
        }
        onSave={handleSaveNote}
        onRemove={handleRemoveNote}
        onPinChange={handlePinChange}
        mentions={mentions}
        description={description}
      />
    );
  };

  const handleNoteChange = (value) => {
    setNoteState(value)
    setEditMode(true)
    // dispatch(addPatientNote(patientIdentifier, value))
  }

  const handleTextEditorChange = (_, { value }) => {
    setNoteState(value)
    setEditMode(true)
  }

  return (
    <PatientNotesWrapper>
      {isFetching ? (
        <PatientNotesLoader />
      ) : (
        <>
          {pinnedNotes?.length > 0 && (
            <PinnedNotesWrapper>
              {pinnedNotes?.sort(descend(prop('dateUpdated')))?.map(renderNote)}
            </PinnedNotesWrapper>
          )}
          {unpinnedNotes?.sort(descend(prop('dateUpdated')))?.map(renderNote)}
          {/*<RichTextEditor isToolbarActive onChange={handleNoteChange} value={noteState}/>*/}
          <TextArea value={noteState} onChange={handleTextEditorChange} />
          {editMode && (
            <ButtonContainer>
              <ButtonWrapper>
                <Button
                  color="secondary"
                  variant="secondary"
                  onClick={() => {
                    setEditMode(false);
                    setNoteState('');
                  }}
                  size="small"
                >
                  Cancel
                </Button>
                <Spacing horizontal={4} />
                <Button
                  color="primary"
                  disabled={isEmpty}
                  size="small"
                  onClick={() => {
                    dispatch(addPatientNote(patientIdentifier, noteState))
                  }}
                >
                  Save
                </Button>
              </ButtonWrapper>
            </ButtonContainer>
          )}
          {/*<ClickAwayListener onClickAway={handleClickAway}>*/}
          {/*  <RichTextInputContainer>*/}
          {/*    <TextEditor*/}
          {/*      getFocusFromParent={editMode}*/}
          {/*      showToolbar*/}
          {/*      ref={addNoteInputReference}*/}
          {/*      taskListIdentifier={patientIdentifier}*/}
          {/*      disableMentions*/}
          {/*      placeholder="Leave a note and press enter on your keyboard to save"*/}
          {/*      state={noteState}*/}
          {/*      onChange={onNoteChange}*/}
          {/*      onFocus={handleFocus}*/}
          {/*    />*/}
          {/*    {editMode && (*/}
          {/*      <ButtonContainer>*/}
          {/*        <ButtonWrapper>*/}
          {/*          <Button*/}
          {/*            color="secondary"*/}
          {/*            variant="secondary"*/}
          {/*            onClick={handleCancel}*/}
          {/*            size="small"*/}
          {/*          >*/}
          {/*            Cancel*/}
          {/*          </Button>*/}
          {/*          <Spacing horizontal={4} />*/}
          {/*          <Button*/}
          {/*            color="primary"*/}
          {/*            disabled={isEmpty}*/}
          {/*            size="small"*/}
          {/*            onClick={saveNote}*/}
          {/*          >*/}
          {/*            Save*/}
          {/*          </Button>*/}
          {/*        </ButtonWrapper>*/}
          {/*      </ButtonContainer>*/}
          {/*    )}*/}
          {/*  </RichTextInputContainer>*/}
          {/*</ClickAwayListener>*/}
        </>
      )}
    </PatientNotesWrapper>
  );
};

export default PatientNotes;
