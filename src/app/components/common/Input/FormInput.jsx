import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import Input from './Input';
import { validateAndSetError } from '../../patients/PatientForm/helpers';

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
      formMethods,
      ...restProps
    },
    reference,
  ) => {
    const formContext = useFormContext();
    const {
      register,
      formState: { errors },
      watch,
      setValue,
      unregister,
      setError,
      clearErrors,
    } = formMethods || formContext;

    const isPatientCustomField = name?.includes('patientMetaData.');
    const isNested = name?.includes('.');
    const nestedParts = name?.split('.');

    const error = isNested
      ? errors?.[nestedParts[0]]?.[nestedParts[1]]?.message
      : errors?.[name]?.message;

    const value = watch(name);

    useMount(() => {
      register(name, {
        required: required ? 'This field is required' : false,
        validate: isPatientCustomField
          ? undefined
          : validate
          ? validate
          : undefined,
      });
    });

    useUnmount(() => {
      unregister(name);
    });

    const handleChange = (event) => {
      const newValue = event.target.value;
      if (isPatientCustomField) {
        validateAndSetError(name, newValue, validate, setError, clearErrors);
      }

      setValue(name, newValue, {
        shouldDirty: true,
        shouldValidate: validate ? true : false,
      });
      if (typeof onChange === 'function') onChange(event);
    };

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
