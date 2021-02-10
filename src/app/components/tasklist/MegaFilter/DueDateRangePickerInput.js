/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import { DueDateInput, DueDateInputWrapper } from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const DATE_US_FORMAT = 'MM/DD/YYYY';

const DueDateRangePickerInput = ({
  selectedDueDate,
  setErrorMessage,
  hasError,
  minDate,
  maxDate,
  dueDateChange,
}) => {
  const formatedDueDate = selectedDueDate
    ? moment(selectedDueDate, DATE_ISO_FORMAT).format(DATE_US_FORMAT)
    : '';

  const [inputDueDate, setInputDueDate] = useState(formatedDueDate);

  useEffect(() => {
    setInputDueDate(formatedDueDate);
  }, [formatedDueDate, setInputDueDate]);

  const validateDueDate = () => {
    const newDate = moment(inputDueDate, DATE_US_FORMAT);

    if (!newDate.isValid()) {
      setErrorMessage('Invalid date format');
      return;
    }

    if (newDate.isSame(moment(selectedDueDate, DATE_ISO_FORMAT))) {
      // date not changed
      return;
    }

    if (maxDate !== undefined) {
      if (newDate.isAfter(moment(maxDate, DATE_ISO_FORMAT))) {
        setErrorMessage('Date must be before end date');
        return;
      }

      dueDateChange(newDate.format(DATE_ISO_FORMAT), maxDate);
    }

    if (minDate !== undefined) {
      if (newDate.isBefore(moment(minDate, DATE_ISO_FORMAT))) {
        setErrorMessage('Date must be after start date');
        return;
      }

      dueDateChange(newDate.format(DATE_ISO_FORMAT));
    }
  };

  return (
    <PopoverDatepicker
      selectedDate={selectedDueDate}
      onBackdrop={validateDueDate}
      onDateChange={date => {
        setErrorMessage(null);
        dueDateChange(date);
      }}
      maxDate={maxDate}
      minDate={minDate}
    >
      {({ elementReference, setIsPopoverOpen }) => (
        <DueDateInputWrapper ref={elementReference}>
          <DueDateInput
            onFocus={() => setIsPopoverOpen(true)}
            onChange={event => {
              if (hasError) setErrorMessage(null);
              setInputDueDate(event.target.value);
            }}
            mask="99/99/9999"
            value={inputDueDate}
            placeholder="00/00/0000"
            maskPlaceholder="00/00/0000"
            hasError={hasError}
          />
        </DueDateInputWrapper>
      )}
    </PopoverDatepicker>
  );
};

export default DueDateRangePickerInput;
