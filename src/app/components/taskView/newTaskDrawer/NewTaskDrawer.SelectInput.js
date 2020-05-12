/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-duplicate-props */
import { Chip } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
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
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import palette from 'styles/palette';
import { DrawerChip } from './NewTaskDrawer.SelectInput.Styled';
import { CondensedH4, AdornmentContainer } from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';

const StyledAutocomplete = withStyles({
  option: {},
  listbox: {},
})(Autocomplete);

const onChange = ({ multiple, name, setValue, onItemSelected }) => (
  _event,
  option,
) => {
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
    onItemSelected(option);
  } else {
    setValue(name, option?.value);
    onItemSelected(option);
  }
};

const renderItemWithHighlighting = (option, inputValue) => {
  const matches = match(option.displayLabel, inputValue);
  const parts = parse(option.displayLabel, matches);
  return (
    <div>
      {parts.map(part => (
        <span
          key={`${option.displayLabel}_${part}`}
          style={{ fontWeight: part.highlight ? 700 : 400 }}
        >
          {part.text}
        </span>
      ))}
    </div>
  );
};

// const startAdornmentProp = {
//   startAdornment: <AdornmentContainer>+</AdornmentContainer>
// }

const renderTags = ({ currentValueIdentifiers }) => (value, getTagProps) => (
  <>
    {value.map((option, index) => (
      <>
        <DrawerChip
          label={
            <CondensedH4>
              {typeof option === 'string' ? option : option?.displayLabel}
            </CondensedH4>
          }
          {...getTagProps({ index })}
        />
        {index === currentValueIdentifiers.length - 1 && (
          <Chip
            label={
              <CondensedH4 style={{ color: palette.orange }}>+</CondensedH4>
            }
            style={{
              marginBottom: '8px',
              height: '24px',
              fontWeight: 'bold',
              backgroundColor: palette.coolGrey3,
              marginRight: '10px',
            }}
            onClick={() => {
              // console.log('chip clicked');
            }}
          />
        )}
      </>
    ))}
  </>
);

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
      onItemSelected,
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

    const placeholderValue =
      currentValue && currentValue !== '' ? '' : placeholder;

    const currentOption = multiple
      ? currentValue
      : children.find(({ value }) => value === currentValue) ?? null;

    // const availableOptions = multiple
    //   ? children.filter(
    //       ({ value }) =>
    //         !currentValueIdentifiers.includes(value) || value === null,
    //     )
    //   : children;

    const availableOptions = children;

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
      <StyledAutocomplete
        debug
        id={`autocomplete-${name}`}
        options={availableOptions}
        getOptionLabel={option => renderOptionLabel(option)}
        renderOption={(option, { inputValue }) =>
          renderItem(option, inputValue)
        }
        disableClearable={disableClearable}
        openOnFocus
        fullWidth
        filterSelectedOptions={!!multiple}
        multiple={multiple}
        freeSolo={freeSolo}
        noOptionsText={noOptionsText}
        getOptionDisabled={getOptionDisabled}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        renderTags={renderTags({ currentValueIdentifiers })}
        // renderInput={(params) => <TextField {...params} label="debug" margin="normal" />}
        renderInput={({
          InputProps: InputParameters = {},
          inputProps: inputParameters = {},
          InputLabelProps: InputLabelParameters = {},
          ...otherParameters
        }) => (
          <TextInput
            {...otherParameters}
            parentType="select"
            InputLabelProps={{
              ...InputLabelProps,
              ...InputLabelParameters,
              shrink: true,
            }}
            // Both inputProps & InputProps are defined in here to follow the Material UI convention
            // for TextField component → InputProps spread to InputBase component, while
            // inputProps go directly to the native input component
            InputProps={
              startAdornment && (!currentOption || currentOption === '')
                ? {
                    ...InputProps,
                    ...InputParameters,
                    ...{ startAdornment: InputProps.startAdornment },
                    ...{ endAdornment: InputProps.endAdornment },
                  }
                : {
                    ...InputProps,
                    ...InputParameters,
                    ...{ endAdornment: InputProps.endAdornment },
                  }
            }
            // InputProps={{
            //   startAdornment: <AdornmentContainer>+</AdornmentContainer>,
            // }}
            inputProps={{
              ...inputProps,
              ...inputParameters,
            }}
            label={label}
            name={name}
            placeholder={placeholderValue}
            multiple={multiple}
            ref={reference}
            // onClick={event => {
            //   console.log('on click');
            //   document.getElementById(`autocomplete-${name}`).focus();
            // }}
          />
        )}
        value={currentOption}
        variant="outlined"
        onChange={onChange({ multiple, setValue, name, onItemSelected })}
        forcePopupIcon={Boolean(endAdornment)}
        popupIcon={
          <AdornmentContainer>
            {endAdornment && (
              <KeyboardArrowDown fontSize="small" color="inherit" />
            )}
          </AdornmentContainer>
        }
        getOptionSelected={(option, selected) =>
          selected.value === option.value
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
  startAdornment: bool,
  endAdornment: bool,
  forcePopupIcon: bool,
  noOptionsText: node,
  getOptionDisabled: func,
  onInputChange: func,
  onItemSelected: func,
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
  renderItem: renderItemWithHighlighting,
  // renderItem: prop('label'),
  renderOptionLabel: propOr('', 'displayLabel'),
  startAdornment: false,
  endAdornment: false,
  forcePopupIcon: undefined,
  noOptionsText: undefined,
  getOptionDisabled: prop('disabled'),
  onInputChange: undefined,
  onItemSelected: undefined,
  multiple: false,
  freeSolo: false,
  disableClearable: true,
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
};

export default SelectInput;
