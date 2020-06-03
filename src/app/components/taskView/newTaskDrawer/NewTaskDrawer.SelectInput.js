/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-duplicate-props */
import { Chip, NoSsr } from '@material-ui/core';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
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
import useBoolean from 'hooks/useBoolean';
import {
  DrawerChip,
  DrawerAddChip,
  StyledAutoComplete,
  Listbox,
  TagCreateActionButton,
} from './NewTaskDrawer.SelectInput.Styled';
import { CondensedH4, AdornmentContainer } from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';

// const filter = createFilterOptions();

const onChange = ({
  multiple,
  name,
  setValue,
  onItemSelected,
  closeAutocomplete,
}) => (_event, option) => {
  if (multiple && Array.isArray(option)) {
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
    closeAutocomplete();
    if (onItemSelected) {
      onItemSelected(option, _event);
    }
  } else {
    setValue(name, option?.value);
    closeAutocomplete();
    if (onItemSelected) {
      onItemSelected(option, _event);
    }
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

const renderTags = ({
  currentValueIdentifiers,
  focusState,
  popupOpen,
  openAutocomplete,
}) => (value, getTagProps) => (
  <>
    {value.map((option, index) => (
      <>
        {focusState && (
          <DrawerChip
            key={`label_${option?.key}`}
            label={
              <CondensedH4>
                {typeof option === 'string' ? option : option?.displayLabel}
              </CondensedH4>
            }
            {...getTagProps({ index })}
          />
        )}
        {!focusState && (
          <DrawerChip
            key={`label_${option?.key}`}
            label={
              <CondensedH4>
                {typeof option === 'string' ? option : option?.displayLabel}
              </CondensedH4>
            }
            {...getTagProps({ index })}
            onDelete={undefined}
          />
        )}
        {index === currentValueIdentifiers.length - 1 && !popupOpen && (
          <DrawerAddChip
            label={<CondensedH4>+</CondensedH4>}
            onClick={() => {
              openAutocomplete();
            }}
          />
        )}
      </>
    ))}
  </>
);

/* eslint-disable sonarjs/cognitive-complexity */
const SelectInput = React.forwardRef(
  (
    {
      children,
      label,
      name,
      placeholder,
      renderItem,
      renderOptionLabel,
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
      forceOpen,
      createTagActionLabel,
      onFocusCallback,
      disabled,
    },
    reference,
  ) => {
    const { register, unregister, setValue, watch } = useFormContext();

    const [openState, openAutocomplete, closeAutocomplete] = useBoolean(false);
    const [focusState, enableFocus, disableFocus] = useBoolean(false);

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

    const hasCurrentValue =
      (!Array.isArray(currentValue) &&
        currentValue !== null &&
        currentValue !== '') ||
      (Array.isArray(currentValue) && currentValue.length > 0);

    // console.log('hasCurrentValue: '+hasCurrentValue);

    const placeholderValue = !hasCurrentValue ? placeholder : '';

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

    const {
      getRootProps,
      getInputLabelProps,
      getInputProps,
      getTagProps,
      getListboxProps,
      getOptionProps,
      groupedOptions,
      inputValue,
      value,
      setAnchorEl,
      popupOpen,
    } = useAutocomplete({
      id: `autocomplete-${name}`,
      open: openState,
      options: availableOptions,
      getOptionLabel: option => renderOptionLabel(option),
      debug: false, // prevents clearOnBlur
      disablePortal: true,
      disableClearable,
      openOnFocus: true,
      multiple,
      freeSolo,
      getOptionDisabled,
      onInputChange: (event, newValue) => {
        // console.log('onInputChange: '+newValue);
        if (focusState && !popupOpen) {
          openAutocomplete();
        }
        if (!multiple && newValue !== currentOption?.displayLabel) {
          setValue(name, null);
        }
        if (onInputChange) {
          onInputChange(event, newValue, 'input');
        }
      },
      value: currentOption,
      onChange: onChange({
        multiple,
        setValue,
        name,
        onItemSelected,
        closeAutocomplete,
      }),
      getOptionSelected: (option, selected) => selected.value === option.value,
    });

    const inputReference = setAnchorEl;

    // console.log('dirty: '+dirty);
    // console.log('inputValue: '+inputValue);
    // console.log('selectedValue: '+currentOption?.displayLabel);
    // console.log(currentOption);
    // console.log('groupedOptions length: '+groupedOptions.length);

    const onKeyDown = useCallback(
      event => {
        // console.log('onKeyDown');
        if (multiple && event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();

          const { value: targetValue } = event.target;

          const newOptions = [
            ...currentValue,
            {
              key: targetValue,
              value: null,
              label: <CondensedH4>{targetValue}</CondensedH4>,
              displayLabel: targetValue,
            },
          ];

          setValue(name, newOptions);
          onItemSelected(newOptions, event);
          event.target.value = '';
        }
      },
      [currentValue, multiple, name, setValue, onItemSelected],
    );

    const onTagCreate = useCallback(
      event => {
        // TODO find a better way
        const targetValue =
          event.target.parentElement.children[
            event.target.parentElement.childElementCount - 2
          ].value;

        const newOptions = [
          ...currentValue,
          {
            key: targetValue,
            value: null,
            label: <CondensedH4>{targetValue}</CondensedH4>,
            displayLabel: targetValue,
          },
        ];

        setValue(name, newOptions);
        onItemSelected(newOptions);
        event.target.value = '';
      },
      [currentValue, name, setValue, onItemSelected],
    );

    let startAdornment = <AdornmentContainer>+</AdornmentContainer>;
    if (multiple && currentOption && currentOption.length > 0) {
      const getCustomizedTagProps = parameters => ({
        ...getTagProps(parameters),
      });

      if (renderTags) {
        startAdornment = renderTags({
          currentValueIdentifiers,
          focusState,
          popupOpen,
          openAutocomplete,
        })(value, getCustomizedTagProps);
      } else {
        startAdornment = value.map((option, index) => (
          <Chip
            key={`label_${option?.key}`}
            label={renderOptionLabel(option)}
            {...getCustomizedTagProps({ index })}
          />
        ));
      }
    } else if (currentValue && currentValue.length > 0) {
      startAdornment = '';
    }

    let endAdornment = '';
    if (!multiple) {
      endAdornment = InputProps.endAdornment;
    } else if (multiple && groupedOptions.length === 0 && inputValue !== '') {
      endAdornment = (
        <TagCreateActionButton onClick={onTagCreate}>
          {createTagActionLabel}
        </TagCreateActionButton>
      );
    }

    return (
      <NoSsr>
        <div>
          <StyledAutoComplete ref={reference} {...getRootProps()}>
            <TextInput
              ref={inputReference}
              {...getInputProps()}
              disabled={disabled}
              parentType={
                multiple && currentOption && currentOption.length > 3
                  ? 'selectTag'
                  : 'select'
              }
              newColor="#ff0000"
              InputLabelProps={{
                ...getInputLabelProps(),
                ...InputLabelProps,
                shrink: true,
              }}
              // Both inputProps & InputProps are defined in here to follow the Material UI convention
              // for TextField component → InputProps spread to InputBase component, while
              // inputProps go directly to the native input component
              InputProps={{
                ...InputProps,
                ...{ startAdornment },
                ...{ endAdornment },
                ...{ onKeyDown },
              }}
              inputProps={{
                ...getInputProps(),
                ...inputProps,
              }}
              label={label}
              name={name}
              placeholder={placeholderValue}
              multiple={false}
              onFocus={() => {
                openAutocomplete();
                enableFocus();
                if (onFocusCallback) {
                  onFocusCallback();
                }
              }}
              onBlur={() => {
                if (!forceOpen) {
                  closeAutocomplete();
                }
                disableFocus();
              }}
              onKeyDown={onKeyDown}
            />
          </StyledAutoComplete>
          {groupedOptions.length === 0 &&
          inputValue !== '' &&
          inputValue !== currentOption?.displayLabel ? (
            <Listbox
              {...getListboxProps()}
              style={{
                width:
                  reference && reference.current
                    ? reference.current.clientWidth
                    : '300px',
              }}
            >
              <div>{noOptionsText}</div>
            </Listbox>
          ) : null}
          {groupedOptions.length > 0 ? (
            <Listbox
              {...getListboxProps()}
              style={{
                width:
                  reference && reference.current
                    ? reference.current.clientWidth
                    : '300px',
              }}
            >
              {groupedOptions.map((option, index) => (
                <li
                  {...getOptionProps({ option, index })}
                  data-multiple={multiple ? 'true' : 'false'}
                  key={`label_options_${option?.key}`}
                >
                  {renderItem && renderItem(option, inputValue)}
                  {/* renderItem(option, null)} */}
                  {!renderItem && <span>{option.displayLabel}</span>}
                </li>
              ))}
            </Listbox>
          ) : null}
        </div>
      </NoSsr>
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
  forceOpen: bool,
  createTagActionLabel: string,
  onFocusCallback: func,
  disabled: bool,
};

SelectInput.defaultProps = {
  children: [],
  placeholder: '',
  renderItem: renderItemWithHighlighting,
  // renderItem: prop('label'),
  renderOptionLabel: propOr('', 'displayLabel'),
  forcePopupIcon: undefined,
  noOptionsText: undefined,
  getOptionDisabled: undefined,
  onInputChange: undefined,
  onItemSelected: undefined,
  multiple: false,
  freeSolo: false,
  disableClearable: true,
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
  forceOpen: false,
  createTagActionLabel: undefined,
  onFocusCallback: undefined,
  disabled: false,
};

export default SelectInput;
