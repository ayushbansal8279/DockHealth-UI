import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
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

import { useDispatch } from 'react-redux';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { closeModal, openModal } from 'modal/actions';
import {
  NoteContainer,
  PatientNoteAuthor,
  PatientNoteInformation,
  ButtonContainer,
  ButtonWrapper,
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
  const dispatch = useDispatch();

  const [isEdited, setIsEdited] = useState(false);
  const { patientNoteIdentifier, dateUpdated, creator, pinned } = note;
  const state = convertToEditorState({
    tokenizedText: description,
    rawText: description,
    mentions,
    handleRichText: true,
  });
  const [noteState, setNoteState] = useState(state);
  const editNoteInputReference = useRef(null);

  const isEmpty = useMemo(() => {
    const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    return !tokenizedText.trim().length;
  }, [noteState]);

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

  const handleCancel = useCallback(() => {
    setIsEdited(false);
  }, []);

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
        if (typeof editNoteInputReference.current.focus === 'function')
          editNoteInputReference.current.focus();
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleCancel]);

  const handleBlur = useCallback(() => {
    if (!isEmpty) openDeleteConfirmationModal();
  }, [isEmpty, openDeleteConfirmationModal]);

  const handleFocus = useCallback(() => {
    setIsEdited(true);
  }, []);

  const updateNote = useCallback(async () => {
    setIsEdited(false);
    await onSave({
      ...note,
      description: convertFromEditorStateToOutput(noteState, true)
        .tokenizedText,
    });
  }, [note, noteState, onSave]);

  return (
    <div>
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
            onBlur={handleBlur}
            onFocus={handleFocus}
            state={noteState}
            onChange={newState => setNoteState(newState)}
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
      {isEdited && (
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
              onClick={updateNote}
            >
              Save
            </Button>
          </ButtonWrapper>
        </ButtonContainer>
      )}
    </div>
  );
};

export default PatientNote;
