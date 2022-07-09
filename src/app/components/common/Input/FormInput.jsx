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
      disableClearErrorOnKeyUp,
      ...restProps
    },
    reference,
  ) => {
    const {
      register,
      clearErrors,
      formState: { errors },
      watch,
      setValue,
      unregister,
      setError,
    } = useFormContext();

    const isNested = name.includes('.');
    const nestedParts = name.split('.');

    const error = isNested
      ? errors?.[nestedParts[0]]?.[nestedParts[1]]?.message
      : errors?.[name]?.message;

    const value = watch(name);

    useMount(() => {
      register(name, { validate });
    });

    useUnmount(() => {
      unregister(name);
    });

    const handleChange = event => {
      setValue(name, event.target.value, { shouldDirty: true });
      if (typeof onChange === 'function') onChange(event);
    };

    return (
      <InputComponent
        setError={setError}
        ref={reference}
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        error={error}
        errors={errors}
        onKeyUp={() => (disableClearErrorOnKeyUp ? null : clearErrors(name))}
        {...restProps}
        clearErrors={clearErrors}
      />
    );
  },
);

export default FormInput;
