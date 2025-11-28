import React from 'react';
import { useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Checkbox,
  FormHelperText,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { ColorIndicator } from '../Select/styled';
import { inputSx } from '@/app/styles/form';

const AutoCompleteFormSelect = React.forwardRef(
  (
    {
      name,
      label,
      options,
      required,
      readOnly,
      onChange,
      multiple = false,
      formMethods,
      ...restProps
    },
    reference,
  ) => {
    const formContext = useFormContext();
    const {
      register,
      setValue,
      watch,
      formState: { errors },
      clearErrors,
      unregister,
    } = formMethods || formContext;

    const isNested = name?.includes('.');
    const nestedParts = name?.split('.');

    const error = isNested
      ? errors?.[nestedParts[0]]?.[nestedParts[1]]?.message
      : errors?.[name]?.message;
    const value = watch(name) || (multiple ? [] : '');

    React.useEffect(() => {
      if (required) {
        register(name, {
          required: 'This field is required',
          validate: (value) => {
            if (multiple) {
              return value && Array.isArray(value) && value.length > 0
                ? true
                : 'This field is required';
            } else {
              return value && value !== '' ? true : 'This field is required';
            }
          },
        });
      } else {
        register(name);
      }
      return () => unregister(name);
    }, [register, unregister, name, required, multiple]);

    const handleChange = (_, newValue) => {
      if (error) clearErrors(name);

      if (multiple) {
        const newArrayValue = newValue?.length
          ? newValue.map((option) => option.value)
          : [];
        setValue(name, newArrayValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        setValue(name, newValue?.value || null, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (typeof onChange === 'function') onChange(newValue);
    };

    const selectedOptions = multiple
      ? options.filter((option) => value.includes(option.value))
      : options.find((option) => option.value === value) || null;

    return (
      <>
        <Autocomplete
          disabled={readOnly}
          name={name}
          multiple={multiple}
          ref={reference}
          options={options}
          getOptionLabel={(option) => option.label}
          value={selectedOptions}
          onChange={handleChange}
          disableCloseOnSelect={multiple}
          renderOption={(props, option, { selected }) => (
            <MenuItem {...props} key={option.value} value={option.value}>
              {multiple && (
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
              )}
              {option.color && <ColorIndicator color={option.color} />}
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              name={name}
              {...params}
              variant="outlined"
              sx={inputSx}
              label={label}
              inputRef={reference}
              InputProps={{
                ...params.InputProps,
                readOnly,
              }}
              {...restProps}
            />
          )}
        />
        {error && (
          <FormHelperText error sx={{ pl: 1.5 }}>
            {error}
          </FormHelperText>
        )}
      </>
    );
  },
);

export default AutoCompleteFormSelect;
