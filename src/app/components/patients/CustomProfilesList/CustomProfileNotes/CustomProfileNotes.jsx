/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
// import ProfileNote from '../ProfileNote/ProfileNote';
// import ProfileNotesLoader from '../ProfileNotesLoader/ProfileNotesLoader';
import ProfileNote from 'components/patients/CustomProfilesList/CustomProfileNotes/ProfileNote/ProfileNote';
import { note } from 'api/profile-api';
import {
  PatientNotesWrapper,
  PinnedNotesWrapper,
  ButtonContainer,
  ButtonWrapper,
} from './styled';

const CustomProfileNotes = ({ profileIdentifier }) => {
  const dispatch = useDispatch();
  const isFetching = useSelector(isFetchingNotesSelector);
  const currentUser = useSelector(userProfileSelector);
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpened, setModalIsOpened] = useState(false);

  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    note.getAll(profileIdentifier).then((data) => setNotes(data));
  }, [profileIdentifier]);

  const handleRemoveNote = useCallback(
    (profileNoteIdentifier) => {
      const modalProps = {
        title: 'Delete note',
        description:
          'Are you sure you want to delete this note? This action cannot be undone.',
        confirm: () => {
          note.delete(profileNoteIdentifier);
          setNotes(
            notes.filter((note) => note.identifier !== profileIdentifier),
          );
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
    },
    [dispatch, notes, profileIdentifier],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps,unicorn/consistent-function-scoping
  const handleSaveNote = ({ identifier, description }) => {
    note.update(identifier, { description });
  };

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
      <ProfileNote
        key={note.profileNoteIdentifier}
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
      {isFetching ? null : ( // <ProfileNotesLoader />
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
              />
            </div>
          </ClickAwayListener>
          {editMode && (
            <ButtonContainer>
              <ButtonWrapper>
                <Button
                  color="secondary"
                  variant="secondary"
                  onClick={() => {
                    setNoteState('');
                    setEditMode(false);
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
                    note.create(profileIdentifier, { description: noteState });
                    setNoteState('');
                    setEditMode(false);
                  }}
                >
                  Save
                </Button>
              </ButtonWrapper>
            </ButtonContainer>
          )}
        </>
      )}
    </PatientNotesWrapper>
  );
};

export default CustomProfileNotes;
