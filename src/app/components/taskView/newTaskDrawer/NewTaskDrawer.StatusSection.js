import React from 'react';

import palette from 'styles/palette';

import DropdownInput from './NewTaskDrawer.DropdownInput';
import {
  StatusFlag,
  StatusLabelContainer,
} from './NewTaskDrawer.StatusSection.Styled';
import {
  AdornmentContainer,
  BlockButton,
  CondensedH4,
} from './NewTaskDrawer.Styled';

const STATUSES = [
  {
    value: null,
    label: 'No status',
    color: 'transparent',
  },
  {
    value: 'PLANNED',
    label: 'Planned',
    color: palette.brightBlue,
  },
  {
    value: 'IN_PROGRESS',
    label: 'In progress',
    color: palette.keyLimePie,
  },
  {
    value: 'WAITING',
    label: 'Waiting',
    color: palette.coolGrey2,
  },
  {
    value: 'ON_HOLD',
    label: 'On hold',
    color: palette.mediumGrey,
  },
];

const statusOptions = STATUSES.map(({ value, label, color }) => ({
  key: value,
  value,
  label: (
    <StatusLabelContainer>
      <StatusFlag color={color} />
      <CondensedH4>{label}</CondensedH4>
    </StatusLabelContainer>
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

const StatusSection = () => (
  <DropdownInput
    name="workflowStatus"
    label="Status"
    placeholder="Is there a status?"
    InputProps={{
      startAdornment: <AdornmentContainer>+</AdornmentContainer>,
    }}
    renderItem={renderDropdownItem}
  >
    {statusOptions}
  </DropdownInput>
);

export default StatusSection;
