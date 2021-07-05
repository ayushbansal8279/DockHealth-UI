import React from 'react';
import InputMask from 'react-input-mask';
import Input from 'components/common/Input/Input';

const CustomDateInput = ({ inputRef, ...otherProps }) => (
  <InputMask {...otherProps} ref={inputRef} mask="99/99/9999" />
);

const DateInput = props => (
  <Input {...props} customInputComponent={CustomDateInput} />
);

export default DateInput;
