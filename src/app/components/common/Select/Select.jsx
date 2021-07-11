import React from 'react';
import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import {
  func,
  number,
  shape,
  string,
  arrayOf,
  oneOfType,
  oneOf,
} from 'prop-types';
import { boolean } from 'yup';
import Input from '../Input/Input';

const Select = ({
  options,
  label,
  name,
  error,
  variant,
  readOnly,
  value,
  ...restProps
}) => {
  const selectedOption = options.find(element => element.value === value);
  return (
    <FormControl error={error}>
      <InputLabel shrink={!!value} variant={variant}>
        {label}
      </InputLabel>
      {readOnly ? (
        <Input
          name={name}
          readOnly={readOnly}
          value={selectedOption?.label}
          {...restProps}
        />
      ) : (
        <MuiSelect
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
          inputProps={{ name }}
          variant={variant}
          {...restProps}
        >
          {options.map(option => (
            <MenuItem value={option.value}>{option.label}</MenuItem>
          ))}
        </MuiSelect>
      )}
      {error && (
        <FormHelperText variant={variant} error={error}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

Select.propTypes = {
  onChange: func,
  label: string.isRequired,
  name: string.isRequired,
  variant: oneOf(['filled']),
  readonly: boolean,
  options: arrayOf(
    shape({
      label: string.isRequired,
      value: oneOfType([string, number]),
    }),
  ).isRequired,
};

Select.defaultProps = {
  variant: 'filled',
  readonly: false,
  onChange: undefined,
};

export default Select;
