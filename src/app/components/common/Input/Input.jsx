/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

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
      variant = 'filled',
      ...restProps
    },
    reference,
  ) => (
    <TextField
      sx={{ input: { color: 'red' } }}
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
      variant={variant}
      {...restProps}
    />
  ),
);

export default Input;
