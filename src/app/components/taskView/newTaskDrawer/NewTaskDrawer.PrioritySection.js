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

const renderDropdownItem = ({ setValue, closePopover }) => ({
  label,
  value,
}) => (
  <BlockButton
    type="button"
    onClick={() => {
      setValue(value);
      closePopover();
    }}
  >
    {label}
  </BlockButton>
);

const PrioritySection = ({ selectedTask }) => {
  const { currentPriorityFlagColor } = initializePrioritySectionHooks();

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
          startAdornment:
            selectedTask && selectedTask.priority != null ? (
              ''
            ) : (
              <AdornmentContainer>+</AdornmentContainer>
            ),
        }}
        renderItem={renderDropdownItem}
      >
        {priorityOptions}
      </DropdownInput>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
