import React from 'react';
import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  ListItemText,
} from '@material-ui/core';
import {
  func,
  number,
  shape,
  string,
  arrayOf,
  oneOfType,
  oneOf,
  bool,
} from 'prop-types';
import zIndex from 'styles/z-index';
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
  const selectedOption = options?.find(element => element.value === value);
  return readOnly ? (
    <Input
      name={name}
      label={label}
      readOnly={readOnly}
      value={selectedOption?.label}
      error={error}
      {...restProps}
    />
  ) : (
    <FormControl error={error}>
      <InputLabel shrink={!!value} variant={variant}>
        {label}
      </InputLabel>
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
          style: { zIndex: zIndex.optionsMenu },
        }}
        inputProps={{ name }}
        variant={variant}
        value={value}
        renderValue={selectedValue =>
          options.find(option => option.value === selectedValue)?.label
        }
        {...restProps}
      >
        {options?.map(option => {
          const { OptionIcon } = option;
          return (
            <MenuItem value={option.value}>
              {OptionIcon || null}
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          );
        })}
      </MuiSelect>
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
  readOnly: bool,
  options: arrayOf(
    shape({
      label: string.isRequired,
      value: oneOfType([string, number]),
    }),
  ).isRequired,
};

Select.defaultProps = {
  variant: 'filled',
  readOnly: false,
  onChange: undefined,
};

export default Select;
