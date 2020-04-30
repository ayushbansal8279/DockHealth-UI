import React from 'react';

import ClearLabelIcon from 'img/clear-label-icon.svg';

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
}) => {
  const { onDeleteClick } = initializeEditableLabelHooks({
    option,
    isInbox,
    setCurrentlyEditedOption,
  });

  const isEditing = option?.value === currentlyEditedOption?.value;

  return (
    <EditableLabelContainer>
      {isEditing ? (
        <LabelInputContainer>
          <LabelInput
            onClick={event => {
              event.stopPropagation();
              event.stopPropagation();
            }}
          >
            <span>{option?.displayLabel}</span>
          </LabelInput>
          <img src={ClearLabelIcon} alt="clear label" />
        </LabelInputContainer>
      ) : (
        <>
          <LabelContainer>{option?.label}</LabelContainer>
          {/* Not fully-implemented yet */}
          {/* <LabelActionButton onClick={onEditClick}>Edit</LabelActionButton> */}
          <LabelActionButton onClick={onDeleteClick}>Delete</LabelActionButton>
        </>
      )}
    </EditableLabelContainer>
  );
};

export default EditableLabel;
