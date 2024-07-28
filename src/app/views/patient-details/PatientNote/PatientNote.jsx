import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import palette from 'styles/palette';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Box, ClickAwayListener } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
// import {
//   convertFromEditorStateToOutput,
//   convertToEditorState,
// } from 'components/common/TextEditor/helpers';
import { useDispatch } from 'react-redux';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { closeModal, openModal } from 'modal/actions';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import {
  NoteContainer,
  PatientNoteAuthor,
  PatientNoteInformation,
  ButtonContainer,
  ButtonWrapper,
} from './styled';
import {
  traverseNodes,
  processMarkdownValue,
} from '../../../components/drawer-common/Comment/helpers';

const PatientNote = ({
  note,
  isEditable,
  onSave,
  onRemove,
  onPinChange,
  // mentions,
  description,
}) => {
  const dispatch = useDispatch();
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isValueReset, setValueReset] = useState(false);
  const {
    patientNoteIdentifier,
    dateCreated,
    dateUpdated,
    creator,
    lastEditor,
    pinned,
  } = note;

  const dateNoteCreated = moment(dateCreated).format('h:mma M/DD/YY');
  const dateNoteUpdated = moment(dateUpdated).format('h:mma M/DD/YY');

  // const initialState = useMemo(
  //   () =>
  //     convertToEditorState({
  //       tokenizedText: description,
  //       rawText: description,
  //       mentions,
  //       handleRichText: true,
  //     }),
  //   [description, mentions],
  // );

  const [noteState, setNoteState] = useState(description);
  const editNoteInputReference = useRef(null);

  const isEmpty = useMemo(() => {
    // const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    // return tokenizedText?.trim()?.length === 0;
    return noteState?.trim()?.length === 0;
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
        onClick: () => {
          setIsEdited(true);
          setValueReset(false);
        },
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
    setValueReset(true);
    setNoteState(description);
  }, [description]);

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
        // dispatch(closeModal());
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleCancel]);

  const handleClickAway = useCallback(() => {
    if (isEdited && !modalIsOpened) {
      if (isEmpty) {
        handleCancel();
      } else {
        setModalIsOpened(true);
        openDeleteConfirmationModal();
      }
    }
  }, [
    handleCancel,
    isEdited,
    isEmpty,
    modalIsOpened,
    openDeleteConfirmationModal,
  ]);

  const handleFocus = useCallback(() => {
    setIsEdited(true);
    setValueReset(false);
  }, []);

  const updateNote = useCallback(async () => {
    setIsEdited(false);
    await onSave({
      ...note,
      description: noteState,
    });
  }, [note, noteState, onSave]);

  const handleTextEditorChange = (value) => {
    setValueReset(false);
    setNoteState(value);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <NoteContainer>
          <UserAvatar user={creator} />
          <Box m={2} />
          <PatientNoteInformation>
            {isEdited ? (
              <RichTextEditor
                readonly={!isEdited}
                showToolbar={isEdited}
                value={noteState}
                onChange={handleTextEditorChange}
                onFocus={handleFocus}
                reset={isValueReset}
                initOnClick
                showCharCount
              />
            ) : (
              <>{traverseNodes(processMarkdownValue(noteState), [])}</>
            )}
            <PatientNoteAuthor>
              {creator?.firstName} {creator?.lastName} {dateNoteCreated}
            </PatientNoteAuthor>
            {dateNoteCreated !== dateNoteUpdated && (
              <PatientNoteAuthor>
                Updated By: {lastEditor?.firstName} {lastEditor?.lastName}{' '}
                {dateNoteUpdated}
              </PatientNoteAuthor>
            )}
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
    </ClickAwayListener>
  );
};

export default PatientNote;
