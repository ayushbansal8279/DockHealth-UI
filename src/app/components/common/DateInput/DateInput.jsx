/* eslint-disable unicorn/consistent-function-scoping */
import React, { useRef, useMemo, useCallback } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';
import Input from 'components/common/Input/Input';
import { Box, IconButton, Popover } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CloseIcon from '@material-ui/icons/Close';
import Datepicker from 'components/common/Datepicker/Datepicker';
import { useBoolean } from 'hooks/useBoolean';

const CustomDateInput = ({ inputRef, ...otherProps }) => (
  <InputMask inputRef={inputRef} mask="99/99/9999" {...otherProps} />
);

const DateInput = ({
  value,
  onChange,
  readOnly,
  disabled,
  error,
  name,
  maxDate,
  inputRef: outerTextInputReference,
  ...otherProps
}) => {
  const [open, setOpen, unsetOpen] = useBoolean(false);
  const textFieldReference = useRef(null);
  const innerTextInputReference = useRef(null);
  const textInputReference = outerTextInputReference || innerTextInputReference;

  const handleClose = useCallback(() => {
    unsetOpen();
    if (textInputReference.current) textInputReference.current.focus();
  }, [textInputReference, unsetOpen]);

  const momentDate = moment(value, 'MM/DD/YYYY');

  const handleChange = ({ target: { value: date } }) => {
    onChange({ target: { value: date } });
  };

  const handleClear = () => {
    onChange({ target: { value: null } });
    setTimeout(() => {
      textInputReference.current.focus();
    }, 0);
  };

  const handleDatepickerChange = isoDate => {
    const date = moment(isoDate).format('MM/DD/YYYY');
    handleChange({ target: { value: date } });
    setTimeout(() => {
      textInputReference.current.focus();
    }, 0);
  };

  const showError = useMemo(() => {
    const noMissingParts = !value.includes('_');
    const validDate = momentDate.isValid();
    if (!value || value === '' || value === '__/__/____') return error;
    return noMissingParts && validDate ? error : 'Invalid date format';
  }, [error, momentDate, value]);

  return (
    <>
      <Input
        ref={textFieldReference}
        inputRef={textInputReference}
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        disabled={disabled}
        shrink={!!value}
        name={name}
        error={showError}
        endAdornment={
          <Box display="flex">
            <IconButton disabled={readOnly || disabled} onClick={setOpen}>
              <CalendarTodayIcon />
            </IconButton>
            <Box mx={0.5} />
            <IconButton disabled={readOnly || disabled} onClick={handleClear}>
              <CloseIcon />
            </IconButton>
          </Box>
        }
        {...otherProps}
        customInputComponent={CustomDateInput}
      />
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={textFieldReference.current}
        open={open}
        onClose={handleClose}
      >
        <Datepicker
          selectedDate={
            momentDate.isValid() ? momentDate.toISOString() : undefined
          }
          onDateChange={handleDatepickerChange}
          maxDate={maxDate}
        />
      </Popover>
    </>
  );
};

export default DateInput;
