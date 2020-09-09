import { Collapse, TextField } from '@material-ui/core';
import styled from 'styled-components';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { useMount, useUnmount } from 'react-use';
import useBoolean from 'hooks/useBoolean';
import { RequiredLabel } from 'components/common/Input/styled';
import {
  UniversalInputBase,
  UniversalInputLabel,
  UniversalFormControl,
  ErrorLabel,
} from './styled';

export const UniversalTimePicker = ({ inputRef, name, setValue }) => (
  <TextField
    id={inputRef}
    label={name}
    type="time"
    defaultValue={setValue}
    className={TextField}
    InputLabelProps={{
      shrink: true,
    }}
    inputProps={{
      step: 300, // 5 min
    }}
  />
);

export const UniversalMobileInputComponent = ({
  inputRef,
  name,
  setValue,
  ...otherProps
}) => (
  <InputMask
    {...otherProps}
    name={name}
    ref={inputRef}
    mask="(999) 999-9999"
    onChange={event => {
      setValue(name, event.target.value);
    }}
  />
);

export const UniversalBirthdayInputComponent = ({
  inputRef,
  name,
  setValue,
  ...otherProps
}) => (
  <InputMask
    {...otherProps}
    name={name}
    ref={inputRef}
    mask="99/99/9999"
    onChange={event => {
      setValue(name, event.target.value);
    }}
  />
);

export const UniversalInput = ({
  label,
  name,
  placeholder,
  inputContainerReference = undefined,
  CustomComponent = undefined,
  required = false,
  className = '',
  whiteBackground = false,
  customShrinkCondition = undefined,
  ...InputBaseProps
}) => {
  const {
    register,
    errors,
    clearError,
    watch,
    setValue,
    unregister,
  } = useFormContext();
  const error = errors?.[name]?.message;

  const hasError = Boolean(error);

  const [focused, setFocused, unsetFocused] = useBoolean(false);

  const value = watch(name);

  useMount(() => {
    if (CustomComponent) {
      register({
        name,
      });
    }
  });

  useUnmount(() => {
    if (CustomComponent) {
      unregister(name);
    }
  });

  const shrink =
    typeof customShrinkCondition === 'undefined'
      ? Boolean(focused || value || placeholder)
      : Boolean(customShrinkCondition);

  return (
    <div ref={inputContainerReference} className={className}>
      <Collapse in={hasError} timeout={150}>
        <ErrorLabel>{error}</ErrorLabel>
      </Collapse>
      <UniversalFormControl
        error={hasError}
        whiteBackground={whiteBackground}
        fullWidth
      >
        <UniversalInputLabel shrink={shrink} error={hasError}>
          {label}
          {required && <RequiredLabel>(required)</RequiredLabel>}
        </UniversalInputLabel>
        <UniversalInputBase
          name={name}
          placeholder={placeholder}
          inputRef={register}
          inputProps={{
            setValue,
            name,
          }}
          error={hasError}
          inputComponent={CustomComponent}
          onKeyUp={() => clearError(name)}
          onFocus={setFocused}
          onBlur={unsetFocused}
          {...InputBaseProps}
        />
      </UniversalFormControl>
    </div>
  );
};

export const UniversalMontserratInput = styled(UniversalInput)`
  &&& * {
    font-family: 'Montserrat', sans-serif;
  }
`;
