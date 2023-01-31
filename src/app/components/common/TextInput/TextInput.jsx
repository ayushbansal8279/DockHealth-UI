/* eslint-disable react/jsx-no-duplicate-props */
import { any, bool, func, objectOf, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import styled from 'styled-components';

const TextInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      name,
      required,
      className,
      onFocus,
      onBlur,
      InputLabelProps,
      inputProps,
      InputProps,
      parentType,
      multiple,
      disabled,
      autoFocusEnabled,
      ...props
    },
    reference,
  ) => {
    const {
      formState: { errors },
      register,
    } = useFormContext();
    const { classes } = props;

    const error = (errors[name] || {}).message;
    const hasError = Boolean(error);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (autoFocusEnabled && reference && reference.current) {
        reference.current.focus();
      }
    }, [autoFocusEnabled, reference]);

    return (
      <>
        <TextField
          ref={reference}
          name={name}
          placeholder={placeholder}
          className={[
            classes.root,
            isFocused ? classes.focused : '',
            className,
            hasError ? classes.error : '',
          ].join(' ')}
          label={
            <>
              <span>{label?.toUpperCase()}</span>
              {required && (
                <>
                  <Spacing horizontal={3} />
                  <span>(required)</span>
                </>
              )}
            </>
          }
          multiline={!!multiple}
          InputProps={{
            margin: 'dense',
            disableUnderline: true,
            classes: {
              input: classes.input,
            },
            ...InputProps,
          }}
          fullWidth
          InputLabelProps={InputLabelProps}
          onFocus={(event) => {
            onFocus(event);
            setIsFocused(true);
          }}
          onBlur={(event) => {
            onBlur(event);
            setIsFocused(false);
          }}
          inputProps={inputProps}
          inputRef={parentType === 'text' ? register : null}
          disabled={disabled}
          autoFocus={autoFocusEnabled}
        />
        <span className={classes.errorMessage}>{error}</span>
      </>
    );
  },
);

TextInput.propTypes = {
  label: string.isRequired,
  name: string.isRequired,
  placeholder: string,
  className: string,
  required: bool,
  multiple: bool,
  parentType: string,
  onFocus: func,
  onBlur: func,
  // eslint-disable-next-line react/forbid-prop-types
  inputProps: objectOf(any),
  // eslint-disable-next-line react/forbid-prop-types
  InputProps: objectOf(any),
  disabled: bool,
};

TextInput.defaultProps = {
  placeholder: '',
  className: '',
  required: false,
  multiple: false,
  parentType: 'text',
  onFocus: () => {},
  onBlur: () => {},
  inputProps: {},
  InputProps: {},
  disabled: false,
};

const FONT_FAMILY = '"Roboto Condensed", sans-serif';
const BORDER = '0.0625rem solid transparent';
const ANIMATION = 'all 0.2s ease-out';

export default styled(TextInput)`
  &&& {
    &.MuiTextInput-root {
      border: ${BORDER};
      border-radius: 0;
      font-family: ${FONT_FAMILY};
      height: 100%;
      transition: ${ANIMATION};
      z-index: 1;
      box-shadow: none;
      border-bottom-color: ${(props) =>
        props.disabled ? palette.coolGrey2 : palette.coolGrey1};

      & label {
        color: ${palette.coolGrey1};
      }
      & label.Mui-disabled {
        color: ${palette.coolGrey2};
      }
      & label.Mui-focused {
        color: ${palette.coolGrey1};
      }
      & .MuiInput-underline:after {
        border-bottom-color: ${palette.coolGrey1};
      }
      & .MuiInput-input {
        box-shadow: none;
      }
      & label + .MuiInput-formControl {
        margin-top: 16px;
      }
      & .MuiInputBase-inputMultiline {
        height: 19px;
        min-height: 0;
      }
      & .MuiInputBase-multiline {
        padding-top: 0;
        padding-bottom: 0;
      }
      & .MuiInputBase-root {
        flex-wrap: ${(props) =>
          props.parentType === 'selectTag' ? 'wrap' : ''};
        padding-right: ${(props) =>
          props.parentType === 'selectTag' ? '30px' : '0px'};
      }
    }

    &.MuiTextInput-label {
      color: ${palette.oPlusRed};
    }

    &.MuiTextInput-error {
      border: ${BORDER};
      border-bottom-color: ${palette.error};
    }

    &.MuiTextInput-errorMessage {
      color: ${palette.error};
      font-family: ${FONT_FAMILY};
      font-size: 14px;
    }

    &.MuiTextInput-focused {
      border: ${BORDER};
      border-bottom-color: ${palette.coolGrey1};
      & .error {
        border: ${BORDER};
        border-bottom-color: ${palette.error};
      }
    }

    &.MuiTextInput-input {
      border-radius: 0;
      box-shadow: none;
      color: ${palette.mediumGrey};
      font-family: ${FONT_FAMILY};
      font-weight: bold;
      padding: 0.75rem 0;
      padding-bottom: 5px;
      &::placeholder {
        opacity: 1;
        color: ${palette.coolGrey1};
        font-weight: normal;
      }
      &:focus {
        background-color: transparent;
        border: 0;
        box-shadow: none;
      }
      &[readonly] {
        background-color: transparent;
        cursor: pointer;
      }
      &[disabled] {
        background-color: transparent;
        cursor: initial;

        &::placeholder {
          color: ${palette.coolGrey2};
        }
      }
    }
  }
`;
