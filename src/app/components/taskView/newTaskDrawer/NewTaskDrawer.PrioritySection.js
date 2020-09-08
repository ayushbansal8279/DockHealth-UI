import React, { useRef } from 'react';

import PriorityFlag from 'img/priority-flag';
import SmallSwitchChevron from 'img/list-switch-chevron';
import palette from 'styles/palette';

import DropdownInput from './NewTaskDrawer.DropdownInput';
import initializePrioritySectionHooks, {
  PRIORITIES,
} from './NewTaskDrawer.PrioritySection.Hooks';
import {
  PriorityLabelContainer,
  PriorityFieldContainer,
  PriorityFlagContainer,
} from './NewTaskDrawer.PrioritySection.Styled';
import { EndAdornmentContainer, CondensedH4 } from './NewTaskDrawer.Styled';

const priorityOptions = PRIORITIES.map(({ value, label, color }) => ({
  key: value,
  value,
  label: isHovered => (
    <PriorityLabelContainer isHovered={isHovered}>
      <PriorityFlag color={color} />
      <CondensedH4>{label}</CondensedH4>
    </PriorityLabelContainer>
  ),
  displayLabel: label,
}));

const PRIORITY_FIELD_NAME = 'priority';

const PrioritySection = ({ setAutoSaveVisible }) => {
  const reference = useRef(null);
  const {
    currentPriorityFlagColor,
    saveTaskPriority,
    setValue,
  } = initializePrioritySectionHooks({ setAutoSaveVisible });

  const selectOption = value => {
    if (value === 'NONE') {
      setValue(PRIORITY_FIELD_NAME, null); // default to null since we just clear the selection
    } else {
      setValue(PRIORITY_FIELD_NAME, value);
    }

    saveTaskPriority({ newTaskPriority: value });
  };

  return (
    <PriorityFieldContainer>
      <PriorityFlagContainer>
        <PriorityFlag color={currentPriorityFlagColor} />
      </PriorityFlagContainer>
      <DropdownInput
        ref={reference}
        name={PRIORITY_FIELD_NAME}
        label="Priority"
        placeholder="Is there a priority?"
        InputProps={{
          endAdornment: (
            <EndAdornmentContainer>
              <SmallSwitchChevron color={palette.orangeJulius} />
            </EndAdornmentContainer>
          ),
        }}
        selectOption={selectOption}
      >
        {priorityOptions}
      </DropdownInput>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
