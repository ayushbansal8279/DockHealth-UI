import React, { useRef, useEffect, useCallback } from 'react';

import ClearLabelIcon from 'img/clear-label-icon.svg';

import useBoolean from 'hooks/useBoolean';
import {
  LabelActionButton,
  LabelContainer,
  EditableLabelContainer,
  LabelInputContainer,
  LabelInput,
} from './NewTaskDrawer.EditableLabel.Styled';
import initializeEditableLabelHooks from './NewTaskDrawer.EditableLabel.Hooks';

const EditableLabel = ({
  option,
  isInbox,
  currentlyEditedOption,
  setCurrentlyEditedOption,
  enableForceOpen,
  disableForceOpen,
}) => {
  const [editingFlag, setEditing, unsetEditing] = useBoolean(false);

  const { onEditClick, onDeleteClick } = initializeEditableLabelHooks({
    option,
    isInbox,
    setCurrentlyEditedOption,
    setEditing,
  });

  const labelContentFieldReference = useRef(null);

  const isEditing =
    editingFlag && option?.value === currentlyEditedOption?.value;

  useEffect(() => {
    if (isEditing) {
      enableForceOpen();
      labelContentFieldReference.current.focus();
    }
  }, [enableForceOpen, isEditing]);

  const onLabelEdited = useCallback(
    event => {
      // console.log(`editing: ${option}`);
      event.preventDefault();
      event.stopPropagation();
      disableForceOpen();
      unsetEditing();
    },
    [disableForceOpen, option, unsetEditing],
  );

  const onLabelEditCancelled = useCallback(
    event => {
      // console.log(`cancelling: ${option}`);
      setCurrentlyEditedOption(null);
      event.preventDefault();
      event.stopPropagation();
    },
    [option, setCurrentlyEditedOption],
  );

  const labelName = option?.displayLabel;

  return (
    <EditableLabelContainer key={option?.displayLabel}>
      {isEditing ? (
        <LabelInputContainer>
          <LabelInput
            ref={labelContentFieldReference}
            contentEditable
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
          <img
            src={ClearLabelIcon}
            alt="clear label"
            onClick={onLabelEditCancelled}
          />
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
