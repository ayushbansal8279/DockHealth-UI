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
import RichTextEditor from "components/RichTextEditorV2/RichTextEditor";
import TextEditor from "../../../../ui-toolkit/Form/TextEditor/TextEditor";

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
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { patientNoteIdentifier, dateUpdated, creator, pinned } = note;
  const initialState = useMemo(
    () =>
      convertToEditorState({
        tokenizedText: description,
        rawText: description,
        mentions,
        handleRichText: true,
      }),
    [description, mentions],
  );
  const [noteState, setNoteState] = useState(initialState);
  const editNoteInputReference = useRef(null);

  const isEmpty = useMemo(() => {
    const { tokenizedText } = convertFromEditorStateToOutput(noteState, true);
    return tokenizedText?.trim()?.length === 0;
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
    setNoteState(initialState);
  }, [initialState]);

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
  }, []);

  const updateNote = useCallback(async () => {
    setIsEdited(false);
    await onSave({
      ...note,
      description: convertFromEditorStateToOutput(noteState, true)
        .tokenizedText,
    });
  }, [note, noteState, onSave]);

  const handleTextEditorChange = (_, { value }) => {
    setNoteState(value)
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <NoteContainer>
          <UserAvatar user={creator} />
          <Box m={2} />
          <PatientNoteInformation>
            {/*<RichTextEditor readOnly={!isEdited} noStyle={!isEdited} value={description} onChange={(value) => {*/}
            {/*  setNoteState(value)*/}
            {/*}} />*/}
            <TextEditor
                type="textarea"
                readonly={!isEdited}
                value={description}
                onChange={handleTextEditorChange}
                enabled={{
                  toolbar: isEdited
                }}
            />
            {/*<TextEditor*/}
            {/*  getFocusFromParent={isEdited}*/}
            {/*  readOnly={!isEdited}*/}
            {/*  showToolbar*/}
            {/*  taskListIdentifier={patientNoteIdentifier}*/}
            {/*  disableMentions*/}
            {/*  ref={editNoteInputReference}*/}
            {/*  placeholder="Leave a note and press enter on your keyboard to save"*/}
            {/*  isDrawerEditor*/}
            {/*  onFocus={handleFocus}*/}
            {/*  state={noteState}*/}
            {/*  onChange={(newState) => setNoteState(newState)}*/}
            {/*/>*/}
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
                onClick={() => {
                  onSave({
                    ...note,
                    description: noteState,
                  })
                  setIsEdited(false)
                }}
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
