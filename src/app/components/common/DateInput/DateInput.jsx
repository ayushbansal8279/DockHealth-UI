/* eslint-disable unicorn/consistent-function-scoping */
import React, { useRef, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';
import Input from 'components/common/Input/Input';
import { Box, IconButton, Popover } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from '../../task/DatePicker/DatePicker';
import { useBoolean } from 'hooks/useBoolean';

const CustomDateInput = ({ inputRef, ...otherProps }) => (
  <InputMask inputRef={inputRef} mask="99/99/9999" {...otherProps} />
);

const CustomDateTimeInput = ({ inputRef, ...otherProps }) => (
  <InputMask
    inputRef={inputRef}
    mask="99/99/9999         99:99"
    {...otherProps}
  />
);

const DateInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      readOnly,
      disabled,
      error,
      name,
      maxDate,
      inputRef: outerTextInputReference,
      setError,
      clearErrors,
      showCalanderIcon = true,
      popoverZindex,
      ...otherProps
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const DEFAULT_DATE_TIME_FORMAT = 'MM/DD/YYYY/HH/mm';
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    const [open, setOpen, unsetOpen] = useBoolean(false);
    const [isTime, setTime] = useState(false);
    const innerReference = useRef(null);
    const textFieldReference = reference || innerReference;
    const innerTextInputReference = useRef(null);
    const textInputReference =
      outerTextInputReference || innerTextInputReference;

    const handleClose = useCallback(() => {
      unsetOpen();
      if (textInputReference?.current) textInputReference?.current?.focus();
    }, [textInputReference, unsetOpen]);

    const momentDate = moment(value);
    const dateValue = momentDate.format(DEFAULT_DATE_TIME_FORMAT);
    const time = momentDate.format('HH/mm');

    const handleChange = ({ target: { value: date } }) => {
      onChange({ target: { value: date } });
      onBlur({ target: { value: date } }, true);
    };

    const handleClear = () => {
      clearErrors?.(name);
      onChange({ target: { value: null } });
      setTimeout(() => {
        textInputReference?.current?.focus();
      }, 0);
    };

    const handleDatepickerChange = (isoDate) => {
      const date = moment(isoDate).format(DATE_TIME_FORMAT);
      handleChange({ target: { value: date } });
      setTimeout(() => {
        textInputReference?.current?.focus();
      }, 0);
      clearErrors?.(name);
    };

    useEffect(() => {
      if (time !== 'Invalid date' && time !== '00/00') {
        setTime(true);
      }
    }, [momentDate, time]);

    // const value1 = moment(value).format(DATE_TIME_FORMAT);
    // useEffect(() => {
    //     if (value?.trim() === '' || value === '__/__/____') {
    //         clearErrors?.(name);
    //       } else if (
    //     (name && dateValue === 'Invalid date') ||
    //     value.includes('_')
    //   ) {
    //       if (typeof setError === 'function')
    //       setError(name, { type: 'custom', message: 'Invalid date format' });
    //     } else if (typeof clearErrors === 'function') clearErrors?.(name);
    //   }, [clearErrors, dateValue, name, setError, value]);

    return (
      <>
        <Input
          ref={textFieldReference}
          inputRef={textInputReference}
          value={dateValue}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
          shrink={!!dateValue}
          name={name}
          error={error}
          endAdornment={
            <Box display="flex">
              {showCalanderIcon && (
                <IconButton disabled={readOnly || disabled} onClick={setOpen}>
                  <CalendarTodayIcon />
                </IconButton>
              )}
              <Box mx={0.5} />
              <IconButton disabled={readOnly || disabled} onClick={handleClear}>
                <CloseIcon />
              </IconButton>
            </Box>
          }
          {...otherProps}
          customInputComponent={isTime ? CustomDateTimeInput : CustomDateInput}
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
          sx={{ zIndex: popoverZindex ?? 5000 }}
        >
          <DatePicker
            selectedDate={
              momentDate.isValid() ? momentDate.toISOString() : undefined
            }
            onDateChange={handleDatepickerChange}
          />
        </Popover>
      </>
    );
  },
);

export default DateInput;
