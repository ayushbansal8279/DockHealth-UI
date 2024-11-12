/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { TextField } from '@mui/material';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { getHelperText } from './helpers';

const StyledTextField = styled(TextField)`
  && {
    text-transform: !important;
  }
  & .MuiInputBase-formControl:before {
    border: none !important;
  }
  & .MuiInputBase-root {
    border-radius: 10px;
  }
  & .MuiInputBase-input {
    text-transform: !important;
  }
  & .MuiInputLabel-formControl {
    text-transform: none !important;
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
      readOnly,
      inputRef,
      required = false,
      variant = 'outlined',
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
      helperText={getHelperText(error)}
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
      variant={variant}
      {...restProps}
    />
  ),
);

export default Input;
