import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import Input from './Input';
import moment from 'moment';

const FormInput = React.forwardRef(
  (
    {
      name,
      onChange,
      inputComponent: InputComponent = Input,
      validate,
      disableClearErrorOnKeyUp,
      required,
      readOnly,
      isDate,
      isTask,
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

    let value = watch(name);

    useMount(() => {
      register(name, {
        required: required ? 'This field is required' : false,
        validate: validate || undefined,
      });
    })

    useUnmount(() => {
      unregister(name);
    });

    const handleChange = (event) => {
      setValue(name, event.target.value, { shouldDirty: true });
      if (typeof onChange === 'function') onChange(event);
    };

    if(isDate && !isTask) {
      const localDate = moment(value);
      const recalculatedUtcMidnight = moment(localDate).startOf('day').utc();  
      const isDateIntent = value === recalculatedUtcMidnight.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      
      const newValue = isDateIntent ? moment(value).format("YYYY-MM-DDT00:00:00.000[Z]") : value;

      if (newValue !== value) {
        setValue(name, newValue);  
      }
    }

    return (
      <InputComponent
        ref={reference}
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        error={error}
        errors={errors}
        required={required}
        onKeyUp={() => (disableClearErrorOnKeyUp ? null : clearErrors(name))}
        readOnly={readOnly}
        {...restProps}
      />
    );
  },
);

export default FormInput;
