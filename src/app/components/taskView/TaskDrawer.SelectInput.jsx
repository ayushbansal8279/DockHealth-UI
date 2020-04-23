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
import TextInput from './TaskDrawer.TextInput';

const AdornmentContainer = styled.div`
  color: ${palette.orange};
`;

const SelectInput = ({
  children,
  label,
  name,
  placeholder,
  renderItem,
  startAdornment,
  endAdornment,
  InputProps,
  inputProps,
  InputLabelProps,
}) => {
  const { register, unregister, setValue } = useFormContext();

  useMount(() => {
    register({
      name,
    });
  });

  useUnmount(() => {
    unregister(name);
  });

  return (
    <Autocomplete
      id={`autocomplete-${name}`}
      options={children}
      getOptionLabel={propOr('', 'displayLabel')}
      renderOption={option => renderItem(option)}
      disableClearable
      fullWidth
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
          inputProps={{ ...inputParameters, ...inputProps }}
          label={label}
          name={name}
          placeholder={placeholder}
          startAdornment={startAdornment}
        />
      )}
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
};

SelectInput.propTypes = {
  children: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
      displayLabel: string.isRequired,
      value: string.isRequired,
    }),
  ).isRequired,
  label: string.isRequired,
  name: string.isRequired,
  placeholder: string,
  renderItem: func,
  startAdornment: node,
  endAdornment: node,
  forcePopupIcon: bool,
  inputProps: objectOf(any),
  InputProps: objectOf(any),
  InputLabelProps: objectOf(any),
};

SelectInput.defaultProps = {
  placeholder: '',
  renderItem: prop('displayLabel'),
  startAdornment: undefined,
  endAdornment: false,
  forcePopupIcon: undefined,
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
};

export default SelectInput;
