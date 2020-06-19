import React from 'react';
import {
  Input,
  InputLabel,
  InputErrorLabel,
  InputWrapper,
  RequiredLabel,
} from './styled';

const ModalFormInput = ({
  errors,
  label,
  name,
  initialValue,
  disabled,
  register,
  placeholder,
  required,
}) => (
  <InputWrapper>
    <InputLabel hasError={errors}>
      {label}
      {required && <RequiredLabel>(required)</RequiredLabel>}
    </InputLabel>
    <Input
      name={name}
      placeholder={placeholder}
      defaultValue={initialValue}
      disabled={disabled}
      ref={register({ required })}
      hasError={errors}
    />
    {errors?.type === 'required' && (
      <InputErrorLabel>This field is required</InputErrorLabel>
    )}
  </InputWrapper>
);

export default ModalFormInput;
