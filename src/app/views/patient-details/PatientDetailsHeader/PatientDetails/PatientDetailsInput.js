import React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PhoneNumberInput from 'material-ui-phone-number';
import clsx from 'clsx';
import {
  InputBox,
  PatientDetailsInputContainer,
  PatientDetailsInputLabel,
  StyledPatientDetailsInputMask,
  StyledPatientDetailsInput,
  PatientDetailsInputError,
  usePhoneNumberStyles,
} from './styled';

const InputComponent = ({
  options,
  name,
  type,
  register,
  setValue,
  control,
  defaultValue,
  hasError,
  isRequired,
  ...rest
}) => {
  const { disabled } = rest;
  const classes = usePhoneNumberStyles();

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
  if (type === 'tel') {
    return (
      <Controller
        name={name}
        rules={{ required: isRequired }}
        control={control}
        defaultValue={defaultValue}
        as={props => (
          <PhoneNumberInput
            {...props}
            disabled={disabled}
            disableDropdown={disabled}
            defaultCountry="us"
            countryCodeEditable={false}
            disableAreaCodes
            onlyCountries={['us', 'ca', 'au', 'pl']}
            className={clsx({
              [classes.root]: true,
            })}
            onChange={phone => {
              setValue(name, phone);
            }}
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
  type,
  register,
  setValue,
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
          type={type}
          register={register}
          setValue={setValue}
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
