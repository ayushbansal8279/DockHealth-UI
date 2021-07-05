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

const Select = ({ options, label, name, error, variant, ...restProps }) => (
  <FormControl error={error}>
    <InputLabel variant={variant}>{label}</InputLabel>
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
    {error && (
      <FormHelperText variant={variant} error={error}>
        {error}
      </FormHelperText>
    )}
  </FormControl>
);

Select.propTypes = {
  onChange: func,
  label: string.isRequired,
  name: string.isRequired,
  variant: oneOf(['filled']),
  options: arrayOf(
    shape({
      label: string.isRequired,
      value: oneOfType([string, number]),
    }),
  ).isRequired,
};

Select.defaultProps = {
  variant: 'filled',
  onChange: undefined,
};

export default Select;
