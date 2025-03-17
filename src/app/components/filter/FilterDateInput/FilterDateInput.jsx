/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import moment from 'moment';
import Datepicker from 'components/common/Datepicker/Datepicker';
import { ClickAwayListener, Paper, Popper } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import { DateInput } from './styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const DATE_US_FORMAT = 'MM/DD/YYYY';

const FilterDateInput = ({
  date,
  // onDateChange,
  minDate,
  maxDate,
  setDueDate,
  setStartDate,
  start,
  due,
}) => {
  const inputReference = useRef(null);
  const [isCalendarOpen, openCalendar, closeCalendar] = useBoolean(false);

  const [inputValue, setInputValue] = useState('');
  const momentDate = moment(inputValue, DATE_US_FORMAT);
  const inputValueIso = momentDate.isValid()
    ? momentDate.format(DATE_ISO_FORMAT)
    : null;

  useEffect(() => {
    if (date) {
      setInputValue(moment(date, DATE_ISO_FORMAT).format(DATE_US_FORMAT));
    } else {
      setInputValue('');
    }
  }, [date]);

  useEffect(() => {
    if (due) {
      setDueDate(inputValueIso);
    }
    if (start) {
      setStartDate(inputValueIso);
    }
  }, [inputValue]);

  const hasError = useMemo(() => {
    if (minDate) {
      return moment(minDate, DATE_ISO_FORMAT).isAfter(
        moment(inputValueIso, DATE_ISO_FORMAT),
      );
    }

    if (maxDate) {
      return moment(maxDate, DATE_ISO_FORMAT).isBefore(
        moment(inputValueIso, DATE_ISO_FORMAT),
      );
    }

    return false;
  }, [minDate, maxDate, inputValueIso]);

  const handleClickOutside = useCallback(() => {
    if (isCalendarOpen) {
      closeCalendar();
      if (hasError || date === inputValueIso || (!date && !inputValueIso))
        return;
      // onDateChange(inputValueIso);
    }
  }, [
    closeCalendar,
    date,
    hasError,
    inputValueIso,
    isCalendarOpen,
    // onDateChange,
  ]);

  return (
    <ClickAwayListener onClickAway={handleClickOutside}>
      <div>
        <DateInput
          inputRef={(inputElement) => {
            inputReference.current = inputElement;
          }}
          onFocus={openCalendar}
          onChange={(event) => {
            const { value: v } = event.target;
            setInputValue(v ?? '');
          }}
          mask="99/99/9999"
          value={inputValue}
          placeholder="00/00/0000"
          maskplaceholder="00/00/0000"
          hasError={hasError}
        />
        <Popper
          style={{ zIndex: 2001 }}
          anchorEl={inputReference?.current}
          placement="bottom"
          open={isCalendarOpen}
          onClose={closeCalendar}
        >
          <Paper>
            {isCalendarOpen && (
              <Datepicker
                selectedDate={inputValueIso}
                onDateChange={(d) => {
                  setInputValue(
                    moment(d, DATE_ISO_FORMAT).format(DATE_US_FORMAT),
                  );
                  closeCalendar();
                  // onDateChange(d);
                }}
                minDate={minDate}
                maxDate={minDate ? null : maxDate}
                showRange
              />
            )}
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default FilterDateInput;
