import React, { useRef } from 'react';

import PriorityFlag from 'img/priority-flag';
import SmallSwitchChevron from 'img/list-switch-chevron';
import palette from 'styles/palette';

import DropdownInput from '../DropdownInput/DropdownInput';
import initializePrioritySectionHooks, { PRIORITIES } from './hooks';
import {
  PriorityLabelContainer,
  PriorityFieldContainer,
  PriorityFlagContainer,
} from './styled';
import {
  EndAdornmentContainer,
  CondensedH4,
  AdornmentContainer,
} from '../NewTaskDrawer.Styled';

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

const PrioritySection = ({ setAutoSaveVisible, onTaskUpdate }) => {
  const reference = useRef(null);
  const {
    currentPriorityFlagColor,
    saveTaskPriority,
    setValue,
  } = initializePrioritySectionHooks({ setAutoSaveVisible, onTaskUpdate });

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
          startAdornment: <AdornmentContainer>+</AdornmentContainer>,
        }}
        onSelect={selectOption}
      >
        {priorityOptions}
      </DropdownInput>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
