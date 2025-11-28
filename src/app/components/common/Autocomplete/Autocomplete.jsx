/* eslint-disable react/require-default-props */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import { Autocomplete as AutocompleteMUI, TextField } from '@mui/material';
import styled from 'styled-components';
import { inputSx } from '@/app/styles/form';

const StandardAutocompleteMUI = styled(AutocompleteMUI)`
  &&& {
    &.MuiAutocomplete-option {
      padding: 0;
    }

    &.MuiAutocomplete-listbox {
      padding: 0;
    }

    &.MuiAutocomplete-noOptions {
      padding: 0;
    }
  }
`;

const StandardInput = ({
  label,
  onBlurInput,
  onFocusInput,
  params,
  placeholder,
  textFieldReference,
  isInputDisabled,
  CustomInputProps,
}) => {
  const { InputProps: InputPropsParams, ...restParams } = params;

  return (
    <TextField
      variant="outlined"
      sx={inputSx}
      label={label}
      fullWidth
      onBlur={onBlurInput}
      onFocus={onFocusInput}
      placeholder={placeholder}
      ref={textFieldReference}
      disabled={isInputDisabled}
      InputProps={{
        ...InputPropsParams,
        ...CustomInputProps,
      }}
      {...restParams}
    />
  );
};

const Autocomplete = ({
  classes,
  autoFocus,
  CustomInput,
  disableCloseOnSelect,
  disablePortal,
  filterSelectedOptions,
  getInputReference,
  getOptionLabel,
  inputValue,
  isDisabled,
  isInputDisabled,
  isLoading,
  isOpen,
  label,
  multiple,
  noOptionsText,
  onBlurInput,
  onChange,
  onClose,
  onFocusInput,
  onInputChange,
  onOpen,
  options,
  placeholder,
  renderOption,
  renderTags,
  value,
  InputProps,
  disableClearable,
  isOptionEqualToValue,
  limitTags,
  required,
  name,
}) => {
  const textFieldReference = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      const inputElement = textFieldReference.current?.querySelector('input');
      setTimeout(() => {
        inputElement?.focus();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  useEffect(() => {
    if (getInputReference && textFieldReference) {
      getInputReference(textFieldReference.current?.querySelector('input'));
    }
  }, [getInputReference, textFieldReference]);

  const renderInput = useCallback(
    (parameters) =>
      CustomInput ? (
        <CustomInput
          isInputDisabled={isInputDisabled}
          label={label}
          onBlurInput={onBlurInput}
          onFocusInput={onFocusInput}
          params={parameters}
          placeholder={placeholder}
          textFieldReference={textFieldReference}
          CustomInputProps={InputProps}
          required={required}
          name={name}
        />
      ) : (
        <StandardInput
          isInputDisabled={isInputDisabled}
          label={label}
          onBlurInput={onBlurInput}
          onFocusInput={onFocusInput}
          params={parameters}
          placeholder={placeholder}
          textFieldReference={textFieldReference}
          CustomInputProps={InputProps}
          required={required}
          name={name}
        />
      ),
    [
      CustomInput,
      InputProps,
      isInputDisabled,
      label,
      onBlurInput,
      onFocusInput,
      placeholder,
      name,
    ],
  );

  return (
    <StandardAutocompleteMUI
      classes={classes}
      disableCloseOnSelect={disableCloseOnSelect}
      disablePortal={disablePortal}
      disabled={isDisabled}
      filterSelectedOptions={filterSelectedOptions}
      getOptionLabel={getOptionLabel}
      inputValue={inputValue}
      loading={isLoading}
      multiple={multiple}
      noOptionsText={noOptionsText}
      onChange={(_, value_, reason) => onChange(value_, reason)}
      onClose={onClose}
      onInputChange={(event, value_, reason) => {
        if (onInputChange.length === 1) {
          onInputChange(value_);
        } else {
          onInputChange(event, value_, reason);
        }
      }}
      onOpen={onOpen}
      open={isOpen}
      openOnFocus={autoFocus}
      options={options}
      renderInput={renderInput}
      renderOption={renderOption}
      renderTags={renderTags}
      value={value}
      isOptionEqualToValue={isOptionEqualToValue}
      disableClearable={disableClearable}
      limitTags={limitTags}
      required={required}
      name={name}
    />
  );
};

Autocomplete.defaultProps = {
  disablePortal: true,
};

Autocomplete.propTypes = {
  autoFocus: propTypes.bool,
  CustomInput: propTypes.func,
  disableCloseOnSelect: propTypes.bool,
  disablePortal: propTypes.bool,
  filterSelectedOptions: propTypes.func,
  getInputReference: propTypes.func,
  getOptionLabel: propTypes.func,
  inputValue: propTypes.string,
  isDisabled: propTypes.bool,
  isLoading: propTypes.bool,
  isOpen: propTypes.bool,
  label: propTypes.string,
  multiple: propTypes.bool,
  noOptionsText: propTypes.node,
  onBlurInput: propTypes.func,
  onChange: propTypes.func,
  onClose: propTypes.func,
  onInputChange: propTypes.func,
  onOpen: propTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  options: propTypes.array,
  placeholder: propTypes.string,
  renderOption: propTypes.func,
  renderTags: propTypes.func,
  value: propTypes.oneOfType([
    propTypes.string,
    propTypes.arrayOf(propTypes.string),
    propTypes.arrayOf(propTypes.object),
  ]),
  name: propTypes.string,
};

export default Autocomplete;
