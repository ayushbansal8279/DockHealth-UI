/* eslint-disable unicorn/consistent-function-scoping */
import React, { useRef, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';
import Input from 'components/common/Input/Input';
import { Box, IconButton, Popover } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import { useBoolean } from 'hooks/useBoolean';
import DatePicker from '../../task/DatePicker/DatePicker';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT, getMomenDateFromString } from './helpers';
import { DueDateIntent } from '@/app/helpers/task-helpers';
import { convertForIntent } from '@/app/helpers/date-intent-helpers';

const CustomDateInput = ({ inputRef, ...otherProps }) => (
  <InputMask
    inputRef={inputRef}
    type="text"
    mask="19/29/8999"
    maskChar="_"
    placeholder="mm/dd/yyyy"
    formatChars={{
      1: '[0-1]',
      2: '[0-3]',
      8: '[1-9]',
      9: '[0-9]',
    }}
    autoComplete="off"
    {...otherProps}
  />
);

const CustomDateTimeInput = ({ inputRef, ...otherProps }) => (
  <InputMask
    inputRef={inputRef}
    type="text"
    mask="19/29/8999 19:59 AM"
    formatChars={{
      1: '[0-1]',
      2: '[0-3]',
      8: '[1-9]',
      9: '[0-9]',
      5: '[0-5]',
      A: '[a,A,p,P]',
    }}
    autoComplete="off"
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
      timeEnabled = false,
      dateIntent,
      ...otherProps
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const [open, setOpen, unsetOpen] = useBoolean(false);
    const [isTime, setTime] = useState(() => {
      if (dateIntent === DueDateIntent.DATE) return false;
      if (dateIntent === DueDateIntent.DATETIME_ABSOLUTE) return true;
      return timeEnabled;
    });
    const innerReference = useRef(null);
    const textFieldReference = reference || innerReference;
    const innerTextInputReference = useRef(null);
    const textInputReference =
      outerTextInputReference || innerTextInputReference;

    const handleClose = useCallback(() => {
      unsetOpen();
      if (textInputReference?.current) textInputReference?.current?.focus();
    }, [textInputReference, unsetOpen]);

    const momentDate =
      value && value !== '' && !value.includes('_')
        ? getMomenDateFromString(value)
        : undefined;
    const dateValue =
      value && value !== '' && !value.includes('_')
        ? dateIntent === DueDateIntent.DATE
          ? momentDate?.utc().format(DEFAULT_DATE_FORMAT)
          : momentDate?.format(DEFAULT_DATE_TIME_FORMAT)
        : value;

    const handleChange = ({ target: { value: date } }) => {
      const standardizedDate =
        date && date !== '' && !date.includes('_')
          ? moment(date).toISOString()
          : date;
      onChange({ target: { value: standardizedDate } });
    };

    const handleBlur = ({ target: { value: date } }) => {
      if (typeof onBlur === 'function') {
        const standardizedDate =
          date && date !== '' && !date.includes('_')
            ? moment(date).toISOString()
            : date;
        onBlur({ target: { value: standardizedDate } }, true);
      }
    };

    const handleClear = () => {
      clearErrors?.(name);
      handleChange({ target: { value: null } });
      onBlur({ target: { value: null } }, true);
      setTimeout(() => {
        textInputReference?.current?.focus();
      }, 0);
    };

    const handleDatepickerChange = (isoDate) => {
      const date = convertForIntent(isoDate);
      handleChange({ target: { value: date } });
      handleBlur({ target: { value: date } });
      setTimeout(() => {
        textInputReference?.current?.focus();
      }, 0);
      clearErrors?.(name);
    };

    useEffect(() => {
      if (value?.trim() === '' || value === '__/__/____ __:__ _M') {
        clearErrors?.(name);
      } else if (
        (name && dateValue === 'Invalid date') ||
        value.includes('_')
      ) {
        if (typeof setError === 'function')
          setError(name, { type: 'custom', message: 'Invalid date format' });
      } else if (typeof clearErrors === 'function') clearErrors?.(name);
    }, [clearErrors, dateValue, name, setError, value]);

    useEffect(() => {
      if (dateIntent === DueDateIntent.DATE) setTime(false);
      else if (dateIntent === DueDateIntent.DATETIME_ABSOLUTE) setTime(true);
    }, [dateIntent]);

    return (
      <>
        <Input
          ref={textFieldReference}
          inputRef={textInputReference}
          value={dateValue}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly={readOnly}
          disabled={disabled}
          shrink={!!value}
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
              <IconButton
                disabled={readOnly || disabled}
                onClick={() => handleClear()}
              >
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
              momentDate?.isValid() ? momentDate?.toISOString() : undefined
            }
            onDateChange={handleDatepickerChange}
            showTime={isTime}
            onCloseClick={handleClose}
          />
        </Popover>
      </>
    );
  },
);

export default DateInput;
