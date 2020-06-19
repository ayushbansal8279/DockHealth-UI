import React from 'react';
import { Input, InputLabel, InputErrorLabel, InputWrapper } from './styled';

const ModalFormInput = ({
  errors,
  label,
  name,
  initialValue,
  disabled,
  reference,
  placeholder,
}) => (
  <InputWrapper>
    <InputLabel hasError={errors}>{label}</InputLabel>
    <Input
      name={name}
      placeholder={placeholder}
      defaultValue={initialValue}
      disabled={disabled}
      ref={reference}
      hasError={errors}
    />
    {errors?.type === 'required' && (
      <InputErrorLabel>This field is required</InputErrorLabel>
    )}
  </InputWrapper>
);

export default ModalFormInput;
