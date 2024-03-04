/* eslint-disable react/jsx-no-duplicate-props */
import { any, bool, func, objectOf, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Spacing from 'components/common/Spacing';
import { StyledTextField } from './styled';

const TextInput = React.forwardRef(
  (
    {
      label,
      name,
      placeholder,
      defaultValue,
      required,
      className,
      onFocus,
      onBlur,
      onChange,
      InputLabelProps,
      inputProps,
      InputProps,
      // parentType,
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
        <StyledTextField
          ref={reference}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          variant="filled"
          className={[
            isFocused ? classes?.focused : '',
            className,
            hasError ? classes?.error : '',
          ].join(' ')}
          label={
            <>
              <span>{label?.toUpperCase()}</span>
              {required && (
                <>
                  <Spacing horizontal={3} />
                  <span>*</span>
                </>
              )}
            </>
          }
          multiline={!!multiple}
          InputProps={{
            margin: 'dense',
            disableUnderline: true,
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
          onChange={(event) => {
            onChange(event.target.value);
          }}
          inputProps={inputProps}
          // inputRef={parentType === 'text' ? register : null}
          disabled={disabled}
          autoFocus={autoFocusEnabled}
        />
        <span className={classes?.errorMessage}>{error}</span>
      </>
    );
  },
);

TextInput.propTypes = {
  label: string.isRequired,
  name: string.isRequired,
  placeholder: string,
  defaultValue: string,
  className: string,
  required: bool,
  multiple: bool,
  // parentType: string,
  onFocus: func,
  onBlur: func,
  onChange: func,
  // eslint-disable-next-line react/forbid-prop-types
  inputProps: objectOf(any),
  // eslint-disable-next-line react/forbid-prop-types
  InputProps: objectOf(any),
  disabled: bool,
};

TextInput.defaultProps = {
  placeholder: '',
  className: '',
  defaultValue: '',
  required: false,
  multiple: false,
  // parentType: 'text',
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  inputProps: {},
  InputProps: {},
  disabled: false,
};

export default TextInput;
