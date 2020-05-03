import React from 'react';

import DropdownInput from './NewTaskDrawer.DropdownInput';
import initializeStatusSectionHooks, {
  STATUSES,
} from './NewTaskDrawer.StatusSection.Hooks';
import {
  StatusFlag,
  StatusLabelContainer,
  StatusFieldContainer,
  StatusFlagContainer,
} from './NewTaskDrawer.StatusSection.Styled';
import {
  AdornmentContainer,
  BlockButton,
  CondensedH4,
} from './NewTaskDrawer.Styled';

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

const StatusSection = ({ selectedTask }) => {
  const { currentStatusFlagColor } = initializeStatusSectionHooks();

  return (
    <StatusFieldContainer>
      <StatusFlagContainer>
        <StatusFlag color={currentStatusFlagColor} />
      </StatusFlagContainer>
      <DropdownInput
        name="workflowStatus"
        label="Status"
        placeholder="Is there a status?"
        InputProps={{
          startAdornment:
            selectedTask && selectedTask.workflowStatus != null ? (
              ''
            ) : (
              <AdornmentContainer>+</AdornmentContainer>
            ),
        }}
        renderItem={renderDropdownItem}
      >
        {statusOptions}
      </DropdownInput>
    </StatusFieldContainer>
  );
};

export default StatusSection;
