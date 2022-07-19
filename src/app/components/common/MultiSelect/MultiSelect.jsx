import React from 'react';
import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  ListItemText,
  Checkbox,
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

const MultiSelect = ({
  options,
  label,
  name,
  error,
  variant,
  readOnly,
  value,
  placeholder,
  inputRef,
  ...restProps
}) => {
  const renderedValues = value?.map(selected => {
    return options.find(option => option.value === selected)?.label;
  });
  return readOnly ? (
    <Input
      name={name}
      label={label}
      readOnly={readOnly}
      value={renderedValues?.join(', ')}
      error={error}
      placeholder={placeholder}
      {...restProps}
    />
  ) : (
    <FormControl error={error}>
      <InputLabel shrink={!!value} variant={variant}>
        {label}
      </InputLabel>
      <MuiSelect
        multiple
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
          style: {
            marginTop: name.includes('taskMetaData') ? '40px' : '0',
            zIndex: zIndex.optionsMenu,
          },
        }}
        inputProps={{ name, shrink: 'true', placeholder, inputRef }}
        variant={variant}
        value={value ?? []}
        renderValue={selectedValue =>
          selectedValue
            .map(selected => {
              return options.find(option => option.value === selected)?.label;
            })
            .join(', ')
        }
        {...restProps}
      >
        {options?.map(option => {
          return (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={value?.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
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

MultiSelect.propTypes = {
  onChange: func,
  label: string,
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

MultiSelect.defaultProps = {
  label: undefined,
  variant: 'filled',
  readOnly: false,
  onChange: undefined,
};

export default MultiSelect;
