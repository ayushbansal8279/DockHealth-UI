import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import { StyledDropdownInput } from './FormDropdownInput.styled';

const FormDropdownInput = React.forwardRef(
  (
    {
      name,
      onSelect,
      validate,
      disableClearErrorOnKeyUp,
      required,
      ...restProps
    },
    reference,
  ) => {
    const {
      register,
      formState: { errors },
      watch,
      setValue,
      unregister,
      clearErrors,
    } = useFormContext();

    const isNested = name?.includes('.');
    const nestedParts = name?.split('.');

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

    const handleSelect = (v) => {
      setValue(name, v, { shouldDirty: true });
      onSelect?.(v);
    };

    return (
      <StyledDropdownInput
        ref={reference}
        name={name}
        value={value ?? ''}
        onSelect={handleSelect}
        error={error}
        errors={errors}
        required={required}
        onKeyUp={() => (disableClearErrorOnKeyUp ? null : clearErrors(name))}
        {...restProps}
      />
    );
  },
);

export default FormDropdownInput;
