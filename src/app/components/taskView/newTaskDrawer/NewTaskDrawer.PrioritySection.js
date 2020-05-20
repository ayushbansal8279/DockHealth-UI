import React from 'react';

import PriorityFlag from 'img/priority-flag';

import DropdownInput from './NewTaskDrawer.DropdownInput';
import initializePrioritySectionHooks, {
  PRIORITIES,
} from './NewTaskDrawer.PrioritySection.Hooks';
import {
  PriorityLabelContainer,
  PriorityFieldContainer,
  PriorityFlagContainer,
} from './NewTaskDrawer.PrioritySection.Styled';
import {
  AdornmentContainer,
  BlockButton,
  CondensedH4,
} from './NewTaskDrawer.Styled';
import SmallSwitchChevron from '../../../img/list-switch-chevron';
import palette from '../../../styles/palette';

const priorityOptions = PRIORITIES.map(({ value, label, color }) => ({
  key: value,
  value,
  label: (
    <PriorityLabelContainer>
      <PriorityFlag color={color} />
      <CondensedH4>{label}</CondensedH4>
    </PriorityLabelContainer>
  ),
  displayLabel: label,
}));

const renderDropdownItem = ({ setValue, closePopover, onItemSelection }) => ({
  label,
  value,
}) => (
  <BlockButton
    type="button"
    onClick={() => {
      if (value === 'NONE') {
        setValue(null); // default to null since we just clear the selection
      } else {
        setValue(value);
      }
      onItemSelection(value);
      closePopover();
    }}
  >
    {label}
  </BlockButton>
);

const onItemSelection = ({ saveTaskPriority }) => value => {
  saveTaskPriority({ newTaskPriority: value });
};

const PrioritySection = ({ setAutoSaveVisible }) => {
  const {
    currentPriorityFlagColor,
    saveTaskPriority,
  } = initializePrioritySectionHooks({ setAutoSaveVisible });

  return (
    <PriorityFieldContainer>
      <PriorityFlagContainer>
        <PriorityFlag color={currentPriorityFlagColor} />
      </PriorityFlagContainer>
      <DropdownInput
        name="priority"
        label="Priority"
        placeholder="Is there a priority?"
        InputProps={{
          endAdornment: (
            <AdornmentContainer style={{ paddingBotton: '10px' }}>
              <SmallSwitchChevron color={palette.orangeJulius} />
            </AdornmentContainer>
          ),
          // startAdornment: <AdornmentContainer>+</AdornmentContainer>,
        }}
        renderItem={renderDropdownItem}
        onItemSelection={onItemSelection({ saveTaskPriority })}
      >
        {priorityOptions}
      </DropdownInput>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
