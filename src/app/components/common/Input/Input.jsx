/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { TextField } from '@mui/material';
import clsx from 'clsx';
import { inputSx } from '@/app/styles/form';


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
    <TextField
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
      variant="outlined"
      sx={inputSx}
      {...restProps}
    />
  ),
);

export default Input;
