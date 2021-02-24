/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable sonarjs/cognitive-complexity */
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
import { RobotoTypography } from 'styles/theme';
import { prop, propOr } from 'ramda';
import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import useBoolean from 'hooks/useBoolean';
import { AdornmentContainer } from '../styled';
import TextInput from '../TextInput/TextInput';
import {
  DrawerChip,
  DrawerAddChip,
  StyledAutoComplete,
  Listbox,
  EndAdornmentActionButton,
  EndAdornmentContainer,
} from './styled';

// const filter = createFilterOptions();

const onChange = ({
  multiple,
  name,
  setValue,
  onItemSelected,
  onItemRemoved,
  formatTagItem,
  closeAutocomplete,
}) => (_event, option, reason, details) => {
  if (multiple && Array.isArray(option)) {
    // reason = select-option, remove-option
    const newOptions = option?.map(value => {
      if (typeof value === 'string') {
        return formatTagItem(null, value);
      }
      return value;
    });

    setValue(name, newOptions);
    closeAutocomplete();
    if (reason === 'select-option' && onItemSelected) {
      onItemSelected(newOptions, details.option, _event);
    } else if (reason === 'remove-option' && onItemRemoved) {
      onItemRemoved(newOptions, details.option, _event);
    }
  } else {
    setValue(name, option?.value);
    closeAutocomplete();
    if (reason === 'select-option' && onItemSelected) {
      onItemSelected(option, details.option, _event);
    } else if (reason === 'remove-option' && onItemRemoved) {
      onItemRemoved(option, details.option, _event);
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
              <RobotoTypography condensed variant="h4">
                {typeof option === 'string' ? option : option?.displayLabel}
              </RobotoTypography>
            }
            {...getTagProps({ index })}
          />
        )}
        {!focusState && (
          <DrawerChip
            key={`label_${option?.key}`}
            label={
              <RobotoTypography condensed variant="h4">
                {typeof option === 'string' ? option : option?.displayLabel}
              </RobotoTypography>
            }
            {...getTagProps({ index })}
            onDelete={undefined}
          />
        )}
        {index === currentValueIdentifiers.length - 1 &&
          !popupOpen &&
          !focusState && (
            <DrawerAddChip
              label={
                <RobotoTypography condensed variant="h4">
                  +
                </RobotoTypography>
              }
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
      onItemRemoved,
      formatTagItem,
      multiple,
      freeSolo,
      disableClearable,
      InputProps,
      inputProps,
      InputLabelProps,
      forceOpen,
      endAdornmentActionLabel,
      onFocusCallback,
      disabled,
      autoFocusEnabled,
      endAdornmentEnabled,
      onEndAdornmentAcionClick,
      itemEditing,
      showAllOptions,
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
      ? currentValue ?? []
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
        onItemRemoved,
        formatTagItem,
        closeAutocomplete,
      }),
      getOptionSelected: (option, selected) => selected.value === option.value,
      autoHighlight: true,
    });

    let filteredGroupedOptions = groupedOptions;
    if (!showAllOptions) {
      filteredGroupedOptions = useMemo(
        () =>
          groupedOptions.filter(option =>
            option?.displayLabel
              ?.toLowerCase()
              .startsWith(inputValue.toLowerCase()),
          ),
        [inputValue, groupedOptions],
      );
    }

    const inputReference = setAnchorEl;

    const onKeyDown = useCallback(
      event => {
        if (multiple && event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();

          const { value: targetValue } = event.target;

          const selectedOption = formatTagItem(null, targetValue);

          const newOptions = [...currentValue, selectedOption];

          setValue(name, newOptions);
          onItemSelected(newOptions, selectedOption, event);
          event.target.value = '';
        }

        if (
          !multiple &&
          filteredGroupedOptions.length === 0 &&
          event.key === 'Enter' &&
          onEndAdornmentAcionClick
        ) {
          onEndAdornmentAcionClick(event.target.value);
        }
      },
      [
        multiple,
        formatTagItem,
        currentValue,
        setValue,
        name,
        onItemSelected,
        onEndAdornmentAcionClick,
        filteredGroupedOptions,
      ],
    );

    const onTagCreate = useCallback(
      event => {
        // TODO find a better way
        const targetValue =
          event.target.parentElement.parentElement.children[
            event.target.parentElement.parentElement.childElementCount - 2
          ].value;

        const selectedOption = formatTagItem(null, targetValue);

        const newOptions = [...currentValue, selectedOption];

        setValue(name, newOptions);
        onItemSelected(newOptions, selectedOption, event);
        event.target.value = '';
      },
      [formatTagItem, currentValue, setValue, name, onItemSelected],
    );

    let startAdornment = !focusState ? (
      <AdornmentContainer>+</AdornmentContainer>
    ) : (
      ''
    );
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

    const endAdornment = (
      <EndAdornmentContainer>
        {endAdornmentEnabled &&
          filteredGroupedOptions.length === 0 &&
          !!inputValue &&
          popupOpen &&
          (multiple ? (
            <EndAdornmentActionButton onClick={onTagCreate}>
              Create label
            </EndAdornmentActionButton>
          ) : (
            <EndAdornmentActionButton
              onClick={() => onEndAdornmentAcionClick(inputValue)}
            >
              {endAdornmentActionLabel}
            </EndAdornmentActionButton>
          ))}

        {InputProps.endAdornment}
      </EndAdornmentContainer>
    );

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
              autoFocusEnabled={autoFocusEnabled}
            />
          </StyledAutoComplete>
          {filteredGroupedOptions.length === 0 &&
          inputValue !== '' &&
          inputValue !== currentOption?.displayLabel ? (
            <Listbox
              {...getListboxProps()}
              itemEditing={itemEditing}
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
          {filteredGroupedOptions.length > 0 ? (
            <Listbox
              {...getListboxProps()}
              itemEditing={itemEditing}
              style={{
                width:
                  reference && reference.current
                    ? reference.current.clientWidth
                    : '300px',
              }}
            >
              {filteredGroupedOptions.map((option, index) => (
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
      key: string,
      label: node,
      displayLabel: string,
      value: string,
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
  onItemRemoved: func,
  formatTagItem: func,
  multiple: bool,
  freeSolo: bool,
  disableClearable: bool,
  inputProps: objectOf(any),
  InputProps: objectOf(any),
  InputLabelProps: objectOf(any),
  forceOpen: bool,
  endAdornmentActionLabel: string,
  onEndAdornmentAcionClick: func,
  onFocusCallback: func,
  disabled: bool,
  autoFocusEnabled: bool,
  showAllOptions: bool,
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
  onEndAdornmentAcionClick: undefined,
  onItemRemoved: undefined,
  formatTagItem: undefined,
  multiple: false,
  freeSolo: false,
  disableClearable: true,
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
  forceOpen: false,
  endAdornmentActionLabel: undefined,
  onFocusCallback: undefined,
  disabled: false,
  autoFocusEnabled: false,
  showAllOptions: false,
};

export default SelectInput;
