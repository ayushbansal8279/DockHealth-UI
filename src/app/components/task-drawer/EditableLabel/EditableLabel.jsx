import React, { useRef, useEffect, useCallback } from 'react';

import ClearLabelIcon from 'img/clear-label-icon.svg';

import useBoolean from 'hooks/useBoolean';
import {
  LabelActionButton,
  LabelContainer,
  EditableLabelContainer,
  LabelInputContainer,
  LabelInput,
} from './styled';
import initializeEditableLabelHooks from './hooks';

const EditableLabel = ({
  option,
  isInbox,
  currentlyEditedOption,
  setCurrentlyEditedOption,
  enableForceOpen,
  disableForceOpen,
  saveEditLabel,
  setAutoSaveVisible,
  refreshLabels,
}) => {
  const [editingFlag, setEditing, unsetEditing] = useBoolean(false);

  const { onEditClick, onDeleteClick } = initializeEditableLabelHooks({
    option,
    isInbox,
    setCurrentlyEditedOption,
    setEditing,
    enableForceOpen,
    setAutoSaveVisible,
    refreshLabels,
  });

  const labelContentFieldReference = useRef(null);

  const isEditing =
    editingFlag && option?.value === currentlyEditedOption?.value;

  useEffect(() => {
    if (isEditing) {
      enableForceOpen();

      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(labelContentFieldReference.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      // eslint-disable-next-line no-unused-expressions
      labelContentFieldReference.current.focus();
    }
  }, [enableForceOpen, isEditing]);

  const onLabelEdited = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      disableForceOpen();
      unsetEditing();
      const newValue = event.target.textContent;
      saveEditLabel(option, newValue);
    },
    [disableForceOpen, saveEditLabel, option, unsetEditing],
  );

  const onLabelEditCancelled = useCallback(
    event => {
      setCurrentlyEditedOption(null);
      event.preventDefault();
      event.stopPropagation();
      disableForceOpen();
      disableForceOpen();
      unsetEditing();
    },
    [disableForceOpen, setCurrentlyEditedOption, unsetEditing],
  );

  const labelName = option?.displayLabel;

  return (
    <EditableLabelContainer key={`label_container_${option?.key}`}>
      {isEditing ? (
        <LabelInputContainer key={`label_input_container_${option?.key}`}>
          <LabelInput
            ref={labelContentFieldReference}
            contentEditable
            suppressContentEditableWarning
            onClick={event => {
              // console.log('editable label clicked');
              event.preventDefault();
              event.stopPropagation();
              labelContentFieldReference.current.focus();
            }}
            onBlur={onLabelEdited}
            onKeyDown={event => {
              if (isEditing && event.key === 'Enter') {
                onLabelEdited(event);
              }
            }}
          >
            {labelName}
          </LabelInput>
          <span onClick={onLabelEditCancelled}>
            <img src={ClearLabelIcon} alt="clear label" />
          </span>
        </LabelInputContainer>
      ) : (
        <>
          <LabelContainer>{option?.label}</LabelContainer>
          {/* Not fully-implemented yet */}
          <LabelActionButton onClick={onEditClick}>Edit</LabelActionButton>
          <LabelActionButton onClick={onDeleteClick}>Delete</LabelActionButton>
        </>
      )}
    </EditableLabelContainer>
  );
};

export default EditableLabel;
