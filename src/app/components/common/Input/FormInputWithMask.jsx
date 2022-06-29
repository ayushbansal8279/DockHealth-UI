import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import InputMask from 'react-input-mask';
import Input from './Input';

const FormInputWithMask = React.forwardRef(
  (
    { name, onChange, validate, disableClearErrorOnKeyUp, mask, ...restProps },
    reference,
  ) => {
    const {
      register,
      clearErrors,
      formState: { errors },
      inputComponent: InputComponent = Input,
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
      <InputMask
        mask={mask}
        name={name}
        value={value ?? ''}
        alwaysShowMask
        onChange={handleChange}
      >
        {() => (
          <InputComponent
            error={error}
            errors={errors}
            ref={reference}
            setError={setError}
            onKeyUp={() =>
              disableClearErrorOnKeyUp ? null : clearErrors(name)
            }
            clearErrors={clearErrors}
            {...restProps}
          />
        )}
      </InputMask>
    );
  },
);

export default FormInputWithMask;
