import React, { useRef } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';
import Input from 'components/common/Input/Input';
import { IconButton, Popover } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Datepicker from 'components/common/Datepicker/Datepicker';
import useBoolean from 'hooks/useBoolean';

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
  ...otherProps
}) => {
  const [open, setOpen, unsetOpen] = useBoolean(false);
  const textFieldReference = useRef(null);

  const momentDate = moment(value, 'MM/DD/YYYY');

  const handleDatepickerChange = isoDate => {
    const date = moment(isoDate).format('MM/DD/YYYY');
    onChange({ target: { value: date } });
  };

  return (
    <>
      <Input
        ref={textFieldReference}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        shrink={!!value}
        name={name}
        error={
          momentDate.isValid() || !value || value === '__/__/____'
            ? error
            : 'Invalid date format'
        }
        endAdornment={
          <IconButton disabled={readOnly || disabled} onClick={setOpen}>
            <CalendarTodayIcon />
          </IconButton>
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
        onClose={unsetOpen}
      >
        <Datepicker
          selectedDate={
            momentDate.isValid() ? momentDate.toISOString() : undefined
          }
          onDateChange={handleDatepickerChange}
        />
      </Popover>
    </>
  );
};

export default DateInput;
