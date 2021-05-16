import React from 'react';
import { DateInputMask } from './styled';

const SecondaryDateInput = ({ value, disabled, onChange, onBlur, error }) => {
  return (
    <DateInputMask
      type="text"
      mask="18/28/8999"
      maskChar="_"
      placeholder="mm/dd/yyyy"
      formatChars={{
        '1': '[0-1]',
        '2': '[0-3]',
        '8': '[1-9]',
        '9': '[0-9]',
        a: '[APap]',
        m: '[Mm]',
      }}
      value={value}
      onBlur={typeof onBlur === 'function' && onBlur}
      onChange={onChange}
      error={error}
      autoComplete="off"
      disabled={disabled}
    />
  );
};

export default SecondaryDateInput;
