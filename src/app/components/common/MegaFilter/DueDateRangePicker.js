import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import {
  DueDateRangePickerRowContainer,
  DueDateInput,
  DueDateRangePickerInputsWrapper,
  OptionLabel,
  DueDateInputWrapper,
  StartDueDateErrorMessage,
  EndDueDateErrorMessage,
} from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const DATE_US_FORMAT = 'MM/DD/YYYY';

const DueDateRangePicker = ({
  label,
  dueDateChange,
  customDueDateEnd,
  customDueDateStart,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const formatedDateStart = customDueDateStart
    ? moment(customDueDateStart, DATE_ISO_FORMAT).format(DATE_US_FORMAT)
    : '';

  const formatedDateEnd = customDueDateEnd
    ? moment(customDueDateEnd, DATE_ISO_FORMAT).format(DATE_US_FORMAT)
    : '';

  const [inputDueDateStart, setInputDueDateStart] = useState(formatedDateStart);
  const [inputDueDateEnd, setInputDueDateEnd] = useState(formatedDateEnd);
  const [startDateErrorMessage, setStartDateErrorMessage] = useState(null);
  const [endDateErrorMessage, setEndDateErrorMessage] = useState(null);

  useEffect(() => {
    setInputDueDateStart(formatedDateStart);
  }, [formatedDateStart, setInputDueDateStart]);

  useEffect(() => {
    setInputDueDateEnd(formatedDateEnd);
  }, [formatedDateEnd, setInputDueDateEnd]);

  const validateDueDateStart = () => {
    const newDate = moment(inputDueDateStart, DATE_US_FORMAT);

    if (!newDate.isValid()) {
      setStartDateErrorMessage('Invalid date');
      return;
    }

    if (newDate.isSame(moment(customDueDateStart, DATE_ISO_FORMAT))) {
      // date not changed
      return;
    }

    if (newDate.isAfter(moment(customDueDateEnd, DATE_ISO_FORMAT))) {
      setStartDateErrorMessage('Date must be before end date');
      return;
    }

    dueDateChange(newDate.format(DATE_ISO_FORMAT), customDueDateEnd);
  };

  const validateDueDateEnd = () => {
    const newDate = moment(inputDueDateEnd, DATE_US_FORMAT);

    if (!newDate.isValid()) {
      setEndDateErrorMessage('Invalid date');
      return;
    }

    if (newDate.isSame(moment(customDueDateEnd, DATE_ISO_FORMAT))) {
      // date not changed
      return;
    }

    if (newDate.isBefore(moment(customDueDateStart, DATE_ISO_FORMAT))) {
      setEndDateErrorMessage('Date must be after start date');
      return;
    }

    dueDateChange(customDueDateStart, newDate.format(DATE_ISO_FORMAT));
  };

  return (
    <DueDateRangePickerRowContainer>
      <OptionLabel>{label}</OptionLabel>
      <DueDateRangePickerInputsWrapper>
        <PopoverDatepicker
          selectedDate={customDueDateStart}
          onBackdrop={validateDueDateStart}
          onDateChange={date => {
            setStartDateErrorMessage(null);
            dueDateChange(date, customDueDateEnd);
          }}
          maxDate={customDueDateEnd}
        >
          {({ elementReference, setIsPopoverOpen }) => (
            <DueDateInputWrapper ref={elementReference}>
              <DueDateInput
                onFocus={() => setIsPopoverOpen(true)}
                onChange={event => {
                  if (startDateErrorMessage) setStartDateErrorMessage(null);
                  setInputDueDateStart(event.target.value);
                }}
                mask="99/99/9999"
                value={inputDueDateStart}
                placeholder="00/00/0000"
                maskPlaceholder="00/00/0000"
                hasError={startDateErrorMessage}
              />
              {startDateErrorMessage && (
                <StartDueDateErrorMessage>
                  {startDateErrorMessage}
                </StartDueDateErrorMessage>
              )}
            </DueDateInputWrapper>
          )}
        </PopoverDatepicker>
        <Spacing horizontal={3} />

        <PopoverDatepicker
          selectedDate={customDueDateEnd}
          onBackdrop={validateDueDateEnd}
          onDateChange={date => {
            setEndDateErrorMessage(null);
            dueDateChange(customDueDateStart, date);
          }}
          minDate={customDueDateStart}
        >
          {({ elementReference, setIsPopoverOpen }) => (
            <DueDateInputWrapper ref={elementReference}>
              <DueDateInput
                onFocus={() => setIsPopoverOpen(true)}
                onChange={event => {
                  if (endDateErrorMessage) setEndDateErrorMessage(null);
                  setInputDueDateEnd(event.target.value);
                }}
                value={inputDueDateEnd}
                placeholder="00/00/0000"
                maskPlaceholder="00/00/0000"
                hasError={endDateErrorMessage}
              />
              {endDateErrorMessage && (
                <EndDueDateErrorMessage>
                  {endDateErrorMessage}
                </EndDueDateErrorMessage>
              )}
            </DueDateInputWrapper>
          )}
        </PopoverDatepicker>
      </DueDateRangePickerInputsWrapper>
    </DueDateRangePickerRowContainer>
  );
};

export default DueDateRangePicker;
