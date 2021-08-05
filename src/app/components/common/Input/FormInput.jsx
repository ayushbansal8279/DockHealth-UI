import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import Input from './Input';

const FormInput = React.forwardRef(
  (
    {
      name,
      onChange,
      inputComponent: InputComponent = Input,
      validate,
      ...restProps
    },
    reference,
  ) => {
    const {
      register,
      errors,
      clearError,
      watch,
      setValue,
      unregister,
    } = useFormContext();
    const error = errors?.[name]?.message;

    const value = watch(name);

    useMount(() => {
      register({ name }, { validate });
    });

    useUnmount(() => {
      unregister(name);
    });

    const handleChange = event => {
      setValue(name, event.target.value);
      if (typeof onChange === 'function') onChange(event);
    };

    return (
      <InputComponent
        ref={reference}
        name={name}
        value={value}
        onChange={handleChange}
        error={error}
        onKeyUp={() => clearError(name)}
        {...restProps}
      />
    );
  },
);

export default FormInput;
