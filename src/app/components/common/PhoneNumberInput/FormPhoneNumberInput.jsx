import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import PhoneNumberInput from './PhoneNumberInput';

const FormPhoneNumberInput = ({ name, ...restProps }) => {
  const {
    register,
    unregister,
    errors,
    watch,
    setValue,
    clearError,
  } = useFormContext();
  const error = errors?.[name]?.message;
  const value = watch(name);

  useMount(() => {
    register({
      name,
    });
  });

  useUnmount(() => {
    unregister(name);
  });

  return (
    <PhoneNumberInput
      value={value}
      error={error}
      onKeyUp={() => clearError(name)}
      onChange={phone => {
        setValue(name, phone);
      }}
      name={name}
      {...restProps}
    />
  );
};

export default FormPhoneNumberInput;
