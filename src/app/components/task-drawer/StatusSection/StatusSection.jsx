import React, { useRef } from 'react';
import SmallSwitchChevron from 'img/list-switch-chevron';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import { onTaskDrawerTaskStatusChanged } from 'helpers/ga-event-helper';
import DropdownInput from 'components/common/DropdownInput/DropdownInput';
import initializeStatusSectionHooks, { STATUSES } from './hooks';
import {
  StatusFlag,
  StatusLabelContainer,
  StatusFieldContainer,
  StatusFlagContainer,
} from './styled';
import { EndAdornmentContainer, AdornmentContainer } from '../styled';

const statusOptions = STATUSES.map(({ value, label, color }) => ({
  key: value,
  value,
  label: isHovered => (
    <StatusLabelContainer isHovered={isHovered}>
      <StatusFlag color={color} />
      <RobotoTypography condensed variant="h4">
        {label}
      </RobotoTypography>
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
    onTaskDrawerTaskStatusChanged(value);
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
          startAdornment: <AdornmentContainer>+</AdornmentContainer>,
        }}
        onSelect={selectOption}
      >
        {statusOptions}
      </DropdownInput>
    </StatusFieldContainer>
  );
};

export default StatusSection;
