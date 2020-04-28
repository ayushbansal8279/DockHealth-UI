import React from 'react';
import { RobotoTypography } from 'styles/theme';
import DropdownInput from './NewTaskDrawer.DropdownInput';
import { DueDateLabelContainer } from './NewTaskDrawer.DueDateSection.Styled';
import { AdornmentContainer } from './NewTaskDrawer.Styled';

const dueDateOptions = [
  {
    key: 'today',
    value: 'today',
    label: (
      <DueDateLabelContainer>
        <RobotoTypography condensed variant="h4">
          Today
        </RobotoTypography>
      </DueDateLabelContainer>
    ),
    displayLabel: 'Today',
  },
  {
    key: 'tomorrow',
    value: 'tomorrow',
    label: (
      <DueDateLabelContainer>
        <RobotoTypography condensed variant="h4">
          Tomorrow
        </RobotoTypography>
      </DueDateLabelContainer>
    ),
    displayLabel: 'Tomorrow',
  },
  {
    key: 'set-date',
    value: 'set-date',
    label: (
      <DueDateLabelContainer>
        <RobotoTypography condensed variant="h4">
          Set date
        </RobotoTypography>
      </DueDateLabelContainer>
    ),
    displayLabel: 'Set date',
  },
];

const renderDropdownItem = ({ setValue, closePopover }) => ({
  label,
  value,
}) => (
  <div
    onClick={() => {
      setValue(value);
      closePopover();
    }}
  >
    {label}
  </div>
);

const DueDateSection = () => {
  return (
    <DropdownInput
      name="dueDate"
      label="Due date"
      placeholder="Set a due date?"
      InputProps={{
        startAdornment: <AdornmentContainer>+</AdornmentContainer>,
      }}
      renderItem={renderDropdownItem}
    >
      {dueDateOptions}
    </DropdownInput>
  );
};

export default DueDateSection;
