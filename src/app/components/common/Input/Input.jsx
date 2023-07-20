/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { TextField } from '@mui/material';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)`
  & .MuiInputBase-formControl:before {
    border: none !important;
  }
`;

const Input = React.forwardRef(
  (
    {
      id,
      name,
      label,
      placeholder,
      multiline,
      error,
      defaultValue,
      size,
      disabled,
      customInputComponent: CustomInputComponent,
      startAdornment,
      endAdornment,
      shrink,
      hiddenLabel,
      readOnly,
      inputRef,
      required = false,
      variant = 'filled',
      ...restProps
    },
    reference,
  ) => (
    <StyledTextField
      ref={reference}
      inputRef={inputRef}
      id={id}
      name={name}
      label={required ? `${label} *` : label}
      placeholder={placeholder}
      multiline={multiline}
      error={!!error}
      defaultValue={defaultValue}
      size={size}
      helperText={error || null}
      disabled={disabled}
      inputProps={{ readOnly }}
      InputProps={{
        inputComponent: CustomInputComponent,
        startAdornment,
        endAdornment,
        className: clsx({ 'Mui-readonly': readOnly }),
      }}
      InputLabelProps={{
        shrink: readOnly || shrink,
      }}
      hiddenLabel={hiddenLabel}
      variant={variant}
      {...restProps}
    />
  ),
);

export default Input;
