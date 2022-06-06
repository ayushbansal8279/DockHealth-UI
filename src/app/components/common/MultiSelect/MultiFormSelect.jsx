import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import MultiSelect from './MultiSelect';

const MultiFormSelect = ({ name, onChange, ...restProps }) => {
  const {
    register,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
    unregister,
  } = useFormContext();
  const error = errors?.[name]?.message;

  let value = watch(name) || [];

  if (typeof value === 'string') {
    value = value.includes(',') ? value.split(',') : [value];
  }

  useMount(() => {
    register(name);
  });

  useUnmount(() => {
    unregister(name);
  });

  const handleChange = event => {
    if (error) clearErrors(name);

    // const joinedValues =
    //   event.target.value.length > 0 ? event.target.value.join(',') : null;
    setValue(name, event.target.value);
    if (typeof onChange === 'function') onChange(event.target.value);
  };

  return (
    <MultiSelect
      name={name}
      value={value}
      onChange={handleChange}
      error={error}
      multiple
      {...restProps}
    />
  );
};

export default MultiFormSelect;
