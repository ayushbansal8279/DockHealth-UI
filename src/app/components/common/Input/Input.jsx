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
      variant = 'filled',
      ...restProps
    },
    reference,
  ) => (
    <TextField
      ref={reference}
      id={id}
      name={name}
      label={label}
      placeholder={placeholder}
      multiline={multiline}
      error={error}
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
        shrink,
      }}
      variant={variant}
      {...restProps}
    />
  ),
);

export default Input;
