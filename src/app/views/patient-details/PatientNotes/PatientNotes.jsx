/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useMemo, useState } from 'react';
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
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { ClickAwayListener } from '@mui/material';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import PatientNote from '../PatientNote/PatientNote';
import PatientNotesLoader from '../PatientNotesLoader/PatientNotesLoader';
import {
  PatientNotesWrapper,
  PinnedNotesWrapper,
  ButtonContainer,
  ButtonWrapper,
} from './styled';
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';

const PatientNotes = () => {
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

  const isEmpty = useMemo(() => {
    // const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    // return tokenizedText?.trim()?.length === 0;
    return noteState?.trim()?.length === 0;
  }, [noteState]);

  const handleCancel = useCallback(() => {
    setNoteState('');
    setEditMode(false);
  }, []);

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

  const handleTextEditorChange = (value) => {
    setNoteState(value);
    setEditMode(true);
  };

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
          <ClickAwayListener onClickAway={handleClickAway}>
            <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
              <RichTextEditor
                placeholder="Add a new note"
                showToolbar
                value={noteState}
                onChange={handleTextEditorChange}
                onFocus={handleFocus}
                initOnClick={false}
                showCharCount
                disableMentions
              />
            </div>
          </ClickAwayListener>
          {editMode && (
            <ButtonContainer>
              <ButtonWrapper>
                <CancelButton
                  style={{ width: '180px', padding: 0, height: '30px' }}
                  onClick={() => {
                    setEditMode(false);
                    setNoteState('');
                  }}
                >
                  Cancel
                </CancelButton>
                <Spacing horizontal={4} />
                <ConfirmButton
                  style={{ width: '180px', padding: 0, height: '30px' }}
                  disabled={isEmpty}
                  onClick={() => {
                    dispatch(addPatientNote(patientIdentifier, noteState));
                    setEditMode(false);
                    setNoteState('');
                  }}
                >
                  Save
                </ConfirmButton>
              </ButtonWrapper>
            </ButtonContainer>
          )}
        </>
      )}
    </PatientNotesWrapper>
  );
};

export default PatientNotes;
