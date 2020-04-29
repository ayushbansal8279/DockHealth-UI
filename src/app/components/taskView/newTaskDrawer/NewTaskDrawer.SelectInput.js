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
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import styled from 'styled-components';
import palette from 'styles/palette';
import TextInput from './NewTaskDrawer.TextInput';

const AdornmentContainer = styled.div`
  color: ${palette.orange};
`;

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
    const currentOption =
      children.find(({ value }) => value === currentValue) ?? null;

    return (
      <Autocomplete
        id={`autocomplete-${name}`}
        options={children}
        getOptionLabel={option => renderOptionLabel(option)}
        renderOption={option => renderItem(option)}
        disableClearable
        openOnFocus
        fullWidth
        noOptionsText={noOptionsText}
        getOptionDisabled={getOptionDisabled}
        onInputChange={onInputChange}
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
              ...InputLabelParameters,
              shrink: true,
              ...InputLabelProps,
            }}
            // Both inputProps & InputProps are defined in here to follow the Material UI convention
            // for TextField component → InputProps spread to InputBase component, while
            // inputProps go directly to the native input component
            InputProps={{ ...InputParameters, ...InputProps }}
            inputProps={{
              ...inputParameters,
              ...inputProps,
            }}
            label={label}
            name={name}
            placeholder={placeholder}
            startAdornment={startAdornment}
            ref={reference}
          />
        )}
        value={currentOption}
        variant="outlined"
        onChange={(_event, option) => setValue(name, option?.value)}
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
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
};

export default SelectInput;
