import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import Select from './Select';
import { getRegexLabelByValue } from '@/app/helpers/field-type-helpers';

const FormSelect = React.forwardRef(
  (
    {
      name,
      label,
      onChange,
      required,
      readOnly,
      formMethods,
      options,
      ...restProps
    },
    reference,
  ) => {
    const formContext = useFormContext();
    const {
      register,
      clearErrors,
      formState: { errors },
      watch,
      setValue,
      unregister,
    } = formMethods || formContext;
    const isNested = name?.includes('.');
    const nestedParts = name?.split('.');

    const error = isNested
      ? errors?.[nestedParts[0]]?.[nestedParts[1]]?.message
      : errors?.[name]?.message;

    const value = watch(name) || '';

    useMount(() => {
      if (required) {
        register(name, {
          required: 'This field is required',
          validate: (value) => {
            return value && value !== '' ? true : 'This field is required';
          },
        });
      } else {
        register(name);
      }
    });

    useUnmount(() => {
      unregister(name);
    });

    const handleChange = (event) => {
      if (error) clearErrors(name);

      const newValue = event?.target?.value || event;

      setValue(name, newValue, {
        shouldValidate: false,
        shouldDirty: true,
      });

      if (typeof onChange === 'function') onChange(newValue);

      if (name === 'validationRegexSelector') {
        setValue('validationRegex', newValue);
        setValue('validationRegexDescription', getRegexLabelByValue(newValue));
      }
    };

    if (!options || options.length === 0) {
      return (
        <Select
          name={name}
          label={label}
          value=""
          options={[]}
          onChange={() => {}}
          error={error}
          ref={reference}
          required={required}
          readOnly={readOnly}
          {...restProps}
        />
      );
    }

    return (
      <Select
        name={name}
        label={label}
        value={value}
        options={options}
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
