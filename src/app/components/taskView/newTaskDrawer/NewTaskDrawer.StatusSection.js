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
import SmallSwitchChevron from '../../../img/list-switch-chevron';
import palette from '../../../styles/palette';

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

const onItemSelection = ({ saveTaskStatus }) => value => {
  saveTaskStatus({ newTaskStatus: value });
};

const StatusSection = ({ setAutoSaveVisible }) => {
  const {
    currentStatusFlagColor,
    saveTaskStatus,
  } = initializeStatusSectionHooks({ setAutoSaveVisible });

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
          endAdornment: (
            <AdornmentContainer style={{ paddingBotton: '10px' }}>
              <SmallSwitchChevron color={palette.orangeJulius} />
            </AdornmentContainer>
          ),
          startAdornment: <AdornmentContainer>+</AdornmentContainer>,
        }}
        renderItem={renderDropdownItem}
        onItemSelection={onItemSelection({ saveTaskStatus })}
      >
        {statusOptions}
      </DropdownInput>
    </StatusFieldContainer>
  );
};

export default StatusSection;
