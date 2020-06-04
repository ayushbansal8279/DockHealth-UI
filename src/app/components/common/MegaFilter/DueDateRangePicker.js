import React, { useState } from 'react';
import Spacing from 'components/common/Spacing';
import DueDateRangePickerInput from './DueDateRangePickerInput';
import {
  DueDateRangePickerRowContainer,
  DueDateRangePickerInputsWrapper,
  OptionLabel,
  DueDateErrorMessage,
} from './styled';

const DueDateRangePicker = ({
  label,
  dueDateChange,
  customDueDateEnd,
  customDueDateStart,
}) => {
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const setStartDateErrorMessage = error => {
    if (error) {
      setStartDateError(true);
      setErrorMessage(error);
    } else {
      setStartDateError(false);
      setErrorMessage(null);
    }
  };

  const setEndDateErrorMessage = error => {
    if (error) {
      setEndDateError(true);
      setErrorMessage(error);
    } else {
      setEndDateError(false);
      setErrorMessage(null);
    }
  };

  return (
    <DueDateRangePickerRowContainer>
      <OptionLabel>{label}</OptionLabel>
      <DueDateRangePickerInputsWrapper>
        <DueDateRangePickerInput
          selectedDueDate={customDueDateStart}
          maxDate={customDueDateEnd}
          setErrorMessage={setStartDateErrorMessage}
          dueDateChange={newDate => dueDateChange(newDate, customDueDateEnd)}
          hasError={startDateError}
        />

        <Spacing horizontal={3} />

        <DueDateRangePickerInput
          selectedDueDate={customDueDateEnd}
          minDate={customDueDateStart}
          setErrorMessage={setEndDateErrorMessage}
          dueDateChange={newDate => dueDateChange(customDueDateStart, newDate)}
          hasError={endDateError}
        />
        <DueDateErrorMessage alignLeft={startDateError}>
          {errorMessage}
        </DueDateErrorMessage>
      </DueDateRangePickerInputsWrapper>
    </DueDateRangePickerRowContainer>
  );
};

export default DueDateRangePicker;
