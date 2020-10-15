import React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  InputBox,
  PatientDetailsInputContainer,
  PatientDetailsInputLabel,
  StyledPatientDetailsInputMask,
  StyledPatientDetailsInput,
  PatientDetailsInputError,
} from './styled';

const InputComponent = ({
  options,
  name,
  register,
  control,
  defaultValue,
  hasError,
  isRequired,
  ...rest
}) => {
  const { disabled } = rest;
  if (options?.length > 0) {
    return (
      <Controller
        name={name}
        onChange={value => (value ? value[1] : null)}
        rules={{ required: isRequired }}
        control={control}
        defaultValue={defaultValue}
        as={props => (
          <Autocomplete
            {...props}
            options={options}
            getOptionLabel={option =>
              option?.charAt(0).toUpperCase() + option?.slice(1)
            }
            disabled={disabled}
            openOnFocus
            renderInput={parameters => (
              <div ref={parameters.InputProps.ref}>
                <StyledPatientDetailsInput {...parameters.inputProps} />
              </div>
            )}
          />
        )}
      />
    );
  }

  return (
    <StyledPatientDetailsInputMask
      inputRef={register({
        required: isRequired,
      })}
      name={name}
      defaultValue={defaultValue}
      hasError={hasError}
      {...rest}
    />
  );
};

const PatientDetailsInput = ({
  label,
  placeholder,
  isActive,
  mask,
  options,
  name,
  register,
  defaultValue,
  control,
  error,
  isRequired,
}) => {
  const hasError = !!error;
  return (
    <PatientDetailsInputContainer>
      <PatientDetailsInputLabel hasError={hasError}>
        {label}
      </PatientDetailsInputLabel>
      <InputBox isActive={isActive} hasError={hasError}>
        <InputComponent
          placeholder={placeholder}
          isActive={isActive}
          disabled={!isActive}
          mask={mask}
          options={options}
          name={name}
          register={register}
          defaultValue={defaultValue}
          control={control}
          hasError={hasError}
          isRequired={isRequired}
        />
      </InputBox>
      <PatientDetailsInputError hasError={hasError}>
        {error}
      </PatientDetailsInputError>
    </PatientDetailsInputContainer>
  );
};

export default PatientDetailsInput;
