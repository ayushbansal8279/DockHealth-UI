/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-duplicate-props */
import { KeyboardArrowDown } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import {
  any,
  arrayOf,
  bool,
  func,
  node,
  objectOf,
  shape,
  string,
} from 'prop-types';
import { prop, propOr } from 'ramda';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';

import {
  AdornmentContainer,
  DrawerChip,
} from './NewTaskDrawer.SelectInput.Styled';
import { CondensedH4 } from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';

const onChange = ({ multiple, name, setValue }) => (_event, option) => {
  if (multiple) {
    const newOptions = option?.map(value => {
      if (typeof value === 'string') {
        return {
          key: value,
          value: null,
          label: <CondensedH4>{value}</CondensedH4>,
          displayLabel: value,
        };
      }

      return value;
    });

    setValue(name, newOptions);
  } else {
    setValue(name, option?.value);
  }
};

const SelectInput = React.forwardRef(
  (
    {
      children,
      label,
      name,
      placeholder,
      renderItem,
      renderOptionLabel,
      startAdornment,
      endAdornment,
      noOptionsText,
      getOptionDisabled,
      onInputChange,
      multiple,
      freeSolo,
      disableClearable,
      InputProps,
      inputProps,
      InputLabelProps,
    },
    reference,
  ) => {
    const { register, unregister, setValue, watch } = useFormContext();

    useMount(() => {
      register({
        name,
      });
    });

    useUnmount(() => {
      unregister(name);
    });

    const currentValue = watch(name);

    const currentValueIdentifiers = multiple
      ? currentValue?.map(prop('value')) ?? []
      : [];

    const currentOption = multiple
      ? currentValue
      : children.find(({ value }) => value === currentValue) ?? null;

    const availableOptions = multiple
      ? children.filter(
          ({ value }) =>
            !currentValueIdentifiers.includes(value) || value === null,
        )
      : children;

    const onKeyDown = useCallback(
      event => {
        if (multiple && event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();

          const { value } = event.target;

          const newOptions = [
            ...currentValue,
            {
              key: value,
              value: null,
              label: <CondensedH4>{value}</CondensedH4>,
              displayLabel: value,
            },
          ];

          setValue(name, newOptions);

          event.target.value = '';
        }
      },
      [currentValue, multiple, name, setValue],
    );

    return (
      <Autocomplete
        id={`autocomplete-${name}`}
        options={availableOptions}
        getOptionLabel={option => renderOptionLabel(option)}
        renderOption={option => renderItem(option)}
        disableClearable={disableClearable}
        openOnFocus
        fullWidth
        multiple={multiple}
        freeSolo={freeSolo}
        noOptionsText={noOptionsText}
        getOptionDisabled={getOptionDisabled}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <DrawerChip
              label={
                <CondensedH4>
                  {typeof option === 'string' ? option : option?.displayLabel}
                </CondensedH4>
              }
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={({
          InputProps: InputParameters = {},
          inputProps: inputParameters = {},
          InputLabelProps: InputLabelParameters = {},
          ...otherParameters
        }) => (
          <TextInput
            {...otherParameters}
            select
            InputLabelProps={{
              ...InputLabelProps,
              ...InputLabelParameters,
              shrink: true,
            }}
            // Both inputProps & InputProps are defined in here to follow the Material UI convention
            // for TextField component → InputProps spread to InputBase component, while
            // inputProps go directly to the native input component
            InputProps={{ ...InputProps, ...InputParameters }}
            inputProps={{
              ...inputProps,
              ...inputParameters,
            }}
            label={label}
            name={name}
            placeholder={placeholder}
            startAdornment={startAdornment}
            multiple={multiple}
            ref={reference}
          />
        )}
        value={currentOption}
        variant="outlined"
        onChange={onChange({ multiple, setValue, name })}
        forcePopupIcon={Boolean(endAdornment)}
        popupIcon={
          <AdornmentContainer>
            {endAdornment ?? (
              <KeyboardArrowDown fontSize="small" color="inherit" />
            )}
          </AdornmentContainer>
        }
      />
    );
  },
);

SelectInput.propTypes = {
  children: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
      displayLabel: string.isRequired,
      value: string.isRequired,
    }),
  ),
  label: string.isRequired,
  name: string.isRequired,
  placeholder: string,
  renderItem: func,
  renderOptionLabel: func,
  startAdornment: node,
  endAdornment: node,
  forcePopupIcon: bool,
  noOptionsText: node,
  getOptionDisabled: func,
  onInputChange: func,
  multiple: bool,
  freeSolo: bool,
  disableClearable: bool,
  inputProps: objectOf(any),
  InputProps: objectOf(any),
  InputLabelProps: objectOf(any),
};

SelectInput.defaultProps = {
  children: [],
  placeholder: '',
  renderItem: prop('label'),
  renderOptionLabel: propOr('', 'displayLabel'),
  startAdornment: undefined,
  endAdornment: false,
  forcePopupIcon: undefined,
  noOptionsText: undefined,
  getOptionDisabled: prop('disabled'),
  onInputChange: undefined,
  multiple: false,
  freeSolo: false,
  disableClearable: true,
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
};

export default SelectInput;
