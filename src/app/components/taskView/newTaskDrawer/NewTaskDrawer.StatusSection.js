import React, { useRef } from 'react';
import SmallSwitchChevron from 'img/list-switch-chevron';
import palette from 'styles/palette';

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
import { EndAdornmentContainer, CondensedH4 } from './NewTaskDrawer.Styled';

const statusOptions = STATUSES.map(({ value, label, color }) => ({
  key: value,
  value,
  label: isHovered => (
    <StatusLabelContainer isHovered={isHovered}>
      <StatusFlag color={color} />
      <CondensedH4>{label}</CondensedH4>
    </StatusLabelContainer>
  ),
  displayLabel: label,
}));

const STATUS_FIELD_NAME = 'workflowStatus';

const StatusSection = ({ setAutoSaveVisible, onTaskUpdate }) => {
  const reference = useRef(null);
  const {
    currentStatusFlagColor,
    saveTaskStatus,
    setValue,
  } = initializeStatusSectionHooks({
    setAutoSaveVisible,
    onTaskUpdate,
  });

  const selectOption = value => {
    if (value === 'NO_STATUS') {
      setValue(STATUS_FIELD_NAME, null); // default to null since we just clear the selection
    } else {
      setValue(STATUS_FIELD_NAME, value);
    }
    saveTaskStatus({ newTaskStatus: value });
  };

  return (
    <StatusFieldContainer>
      <StatusFlagContainer>
        <StatusFlag color={currentStatusFlagColor} />
      </StatusFlagContainer>
      <DropdownInput
        ref={reference}
        name={STATUS_FIELD_NAME}
        label="Status"
        placeholder="Is there a status?"
        InputProps={{
          endAdornment: (
            <EndAdornmentContainer>
              <SmallSwitchChevron color={palette.orangeJulius} />
            </EndAdornmentContainer>
          ),
        }}
        selectOption={selectOption}
      >
        {statusOptions}
      </DropdownInput>
    </StatusFieldContainer>
  );
};

export default StatusSection;
