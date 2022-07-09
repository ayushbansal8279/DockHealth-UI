import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import Select from './Select';

const FormSelect = ({ name, onChange, ...restProps }) => {
  const {
    register,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
    unregister,
  } = useFormContext();
  const error = errors?.[name]?.message;

  const value = watch(name) || '';

  useMount(() => {
    register(name);
  });

  useUnmount(() => {
    unregister(name);
  });

  const handleChange = event => {
    if (error) clearErrors(name);
    setValue(name, event.target.value);
    if (typeof onChange === 'function') onChange(event.target.value);
  };

  return (
    <Select
      name={name}
      value={value}
      onChange={handleChange}
      error={error}
      {...restProps}
    />
  );
};

export default FormSelect;
