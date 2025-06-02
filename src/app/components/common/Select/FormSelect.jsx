import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import Select from './Select';
import { getRegexLabelByValue } from '@/app/helpers/field-type-helpers';

const FormSelect = React.forwardRef(
  ({ name, label, onChange, required, readOnly, ...restProps }, reference) => {
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

    const handleChange = (event) => {
      if (error) clearErrors(name);
      setValue(name, event.target.value);
      if (typeof onChange === 'function') onChange(event.target.value);

      if (name === 'validationRegexSelector') {
        setValue('validationRegex', event.target.value);
        setValue('validationRegexDescription', getRegexLabelByValue(event.target.value));
      }
    };

    return (
      <Select
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        ref={reference}
        required={required}
        readOnly={readOnly}
        {...restProps}
      />
    );
  },
);

export default FormSelect;
