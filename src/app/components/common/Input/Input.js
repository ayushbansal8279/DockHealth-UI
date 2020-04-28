import React from 'react';
import { InputBox, InputField, InputLabel, InputError, RedDot } from './styled';

const Input = React.forwardRef(
  (
    {
      disabled,
      error,
      fullWidth,
      label,
      name,
      onChange,
      placeholder,
      required,
      showError,
      type,
      value,
    },
    reference,
  ) => {
    const hasError = showError && error;
    return (
      <InputBox fullWidth={fullWidth}>
        <InputLabel htmlFor={name}>
          {label}
          {required && <RedDot>*</RedDot>}
        </InputLabel>
        <InputField
          id={name}
          name={name}
          type={type}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          ref={reference}
        />
        {hasError && <InputError>{error}</InputError>}
      </InputBox>
    );
  },
);

export default Input;
