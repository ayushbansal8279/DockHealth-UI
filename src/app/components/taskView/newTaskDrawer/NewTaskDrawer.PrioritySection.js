import React from 'react';

import PriorityFlag from 'img/priority-flag';
import palette from 'styles/palette';

import DropdownInput from './NewTaskDrawer.DropdownInput';
import { PriorityLabelContainer } from './NewTaskDrawer.PrioritySection.Styled';
import {
  AdornmentContainer,
  BlockButton,
  CondensedH4,
} from './NewTaskDrawer.Styled';

const PRIORITIES = [
  {
    value: null,
    label: 'No priority',
    color: 'transparent',
  },
  {
    value: 'LOW',
    label: 'Low',
    color: palette.bananaHammock,
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    color: palette.orange,
  },
  {
    value: 'HIGH',
    label: 'High',
    color: palette.tomatoInYoFace,
  },
];

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

const PrioritySection = () => (
  <DropdownInput
    name="priority"
    label="Priority"
    placeholder="Is there a priority?"
    InputProps={{
      startAdornment: <AdornmentContainer>+</AdornmentContainer>,
    }}
    renderItem={renderDropdownItem}
  >
    {priorityOptions}
  </DropdownInput>
);

export default PrioritySection;
