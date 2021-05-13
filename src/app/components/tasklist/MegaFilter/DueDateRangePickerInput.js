/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
// import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import Datepicker from 'components/common/Datepicker/Datepicker';
import { ClickAwayListener, Popper } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import { DueDateInput, DueDateInputWrapper, PopperContent } from './styled';

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
  const inputReference = useRef(null);
  const [isCalendarOpen, openCalendar, closeCalendar] = useBoolean(false);

  const formatedDueDate = selectedDueDate
    ? moment(selectedDueDate, DATE_ISO_FORMAT).format(DATE_US_FORMAT)
    : '';

  const [inputDueDate, setInputDueDate] = useState(formatedDueDate);

  useEffect(() => {
    setInputDueDate(formatedDueDate);
  }, [formatedDueDate, setInputDueDate]);

  const validateDueDate = () => {
    if (!inputDueDate || inputDueDate === '__/__/____') return;

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
    <ClickAwayListener onClickAway={closeCalendar}>
      <div>
        <DueDateInputWrapper ref={inputReference}>
          <DueDateInput
            onFocus={openCalendar}
            onChange={event => {
              if (hasError) setErrorMessage(null);
              setInputDueDate(event.target.value);
            }}
            onBlur={validateDueDate}
            mask="99/99/9999"
            value={inputDueDate}
            placeholder="00/00/0000"
            maskPlaceholder="00/00/0000"
            hasError={hasError}
          />
        </DueDateInputWrapper>
        <Popper
          style={{ zIndex: 2001 }}
          anchorEl={inputReference?.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isCalendarOpen}
          onClose={closeCalendar}
        >
          <PopperContent>
            {isCalendarOpen && (
              <Datepicker
                selectedDate={selectedDueDate}
                onDateChange={date => {
                  setErrorMessage(null);
                  dueDateChange(date);
                }}
                minDate={minDate}
                maxDate={maxDate}
              />
            )}
          </PopperContent>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default DueDateRangePickerInput;
