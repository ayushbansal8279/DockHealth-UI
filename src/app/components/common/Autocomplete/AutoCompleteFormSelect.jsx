import React from 'react';
import { useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { ColorIndicator } from '../Select/styled';
import { Checkbox, ListItemText, MenuItem } from '@mui/material';
import { none } from 'ramda';


const AutoCompleteFormSelect = React.forwardRef(
    ({ name, label, options, required, readOnly, onChange, multiple = false, ...restProps }, reference) => {
      const { register, setValue, watch, formState: { errors }, clearErrors, unregister } = useFormContext();
      const value = watch(name) || (multiple ? [] : '');
      const error = errors?.[name]?.message;
  
      React.useEffect(() => {
        register(name);
        return () => unregister(name);
      }, [register, unregister, name]);
  
      const handleChange = (_, newValue) => {
        if (error) clearErrors(name);
        if (multiple) {
          setValue(name, newValue.length ? newValue.map(option => option.value) : []);
        } else {
          setValue(name, newValue?.value || none);
        }
        if (typeof onChange === 'function') onChange(newValue);
      };
      const selectedOptions = multiple
        ? options.filter(option => value.includes(option.value))
        : options.find(option => option.value === value) || null;
  
      return (
        <Autocomplete
          multiple={multiple}
          ref={reference}
          options={options}
          getOptionLabel={(option) => option.label}
          value={selectedOptions}
          onChange={handleChange}
          disableCloseOnSelect={multiple}
          renderOption={(props, option, { selected }) => (
            <MenuItem {...props} key={option.value} value={option.value}>
              {multiple && <Checkbox style={{ marginRight: 8 }} checked={selected} />}
              {option.color && <ColorIndicator color={option.color} />}
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>   
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='standard'
              sx={{
                backgroundColor: '#f5f8fa',  
                borderRadius:'4px',
                '& .MuiInputLabel-root': {
                  color: '#7d91a2',
                  paddingLeft: '10px',
                  textTransform: 'none',
                },
                '& .MuiInputBase-root': {
                  borderRadius: '4px',
                  padding: '8px 10px',               
                },
                '& .MuiSvgIcon-root': {
                  color: '#ffac33', // Set the dropdown arrow color
                },
                
              }}
              label={label}
              error={!!error}
              helperText={error}
              required={required}
              inputRef={reference}
              InputProps={{
                ...params.InputProps,
                readOnly,
              }}
              {...restProps}
            />
          )}
        />
      );
    }
  );

export default AutoCompleteFormSelect;
