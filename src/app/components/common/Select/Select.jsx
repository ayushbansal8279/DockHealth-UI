import React from 'react';
import {
  Select as MuiSelect,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  ListItemText,
} from '@mui/material';
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
import { ColorIndicator } from './styled';

const Select = React.forwardRef(
  (
    {
      options,
      label,
      name,
      error,
      variant,
      readOnly,
      value,
      placeholder,
      inputRef,
      required,
      disabled = false,
      ...restProps
    },
    reference,
  ) => {
    const selectedOption = options?.find((element) => element.value === value);
    return readOnly ? (
      <Input
        name={name}
        label={label}
        readOnly={readOnly}
        required={required}
        value={selectedOption?.label || ''}
        error={error}
        placeholder={placeholder}
        disabled={disabled}
        {...restProps}
      />
    ) : (
      <FormControl error={error}>
        <InputLabel shrink={!!value} variant={variant} required={required}>
          {label}
        </InputLabel>
        <MuiSelect
          disabled={disabled}
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
          ref={reference}
          placeholder={placeholder}
          inputProps={{ name, shrink: 1, placeholder, inputRef }}
          variant={variant}
          value={value || ''}
          renderValue={(selectedValue) =>
            options.find((option) => option.value === selectedValue)?.label
          }
          {...restProps}
        >
          {options?.map((option) => {
            const { OptionIcon } = option;
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.color && <ColorIndicator color={option.color} />}
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
  },
);

Select.propTypes = {
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

Select.defaultProps = {
  label: undefined,
  variant: 'filled',
  readOnly: false,
  onChange: undefined,
};

export default Select;
