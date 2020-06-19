import React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
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
  ...rest
}) => {
  const { isActive, disabled } = rest;
  if (options?.length > 0) {
    return (
      <Controller
        name="gender"
        onChange={value => (value ? value[1] : null)}
        rules={{ required: true }}
        control={control}
        defaultValue={defaultValue}
        as={props => (
          <Autocomplete
            {...props}
            options={options}
            getOptionLabel={option => option}
            disabled={disabled}
            openOnFocus
            renderInput={parameters => {
              return (
                <div ref={parameters.InputProps.ref}>
                  <StyledPatientDetailsInput
                    {...parameters.inputProps}
                    isActive={isActive}
                    hasError={hasError}
                  />
                </div>
              );
            }}
          />
        )}
      />
    );
  }

  return (
    <StyledPatientDetailsInputMask
      inputRef={register({
        required: true,
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
}) => {
  const hasError = !!error;
  return (
    <PatientDetailsInputContainer>
      <PatientDetailsInputLabel hasError={hasError}>
        {label}
      </PatientDetailsInputLabel>
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
      />
      <PatientDetailsInputError hasError={hasError}>
        {error}
      </PatientDetailsInputError>
    </PatientDetailsInputContainer>
  );
};

export default PatientDetailsInput;
