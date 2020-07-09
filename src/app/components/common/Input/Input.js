import React, { useState } from 'react';
import {
  PrimaryInputBox,
  PrimaryInputLabel,
  PrimaryInputField,
  PrimaryInputError,
  SecondaryInputBox,
  SecondaryInputLabel,
  SecondaryInputField,
  SecondaryInputError,
  RequiredLabel,
} from './styled';

const components = {
  primary: {
    boxComponent: PrimaryInputBox,
    labelComponent: PrimaryInputLabel,
    fieldComponent: PrimaryInputField,
    errorComponent: PrimaryInputError,
  },
  secondary: {
    boxComponent: SecondaryInputBox,
    labelComponent: SecondaryInputLabel,
    fieldComponent: SecondaryInputField,
    errorComponent: SecondaryInputError,
  },
};

const Input = React.forwardRef(
  (
    {
      disabled,
      error,
      fullWidth,
      label,
      name,
      onChange,
      placeholder,
      required,
      showError,
      styling = 'primary',
      type,
      value,
      centerizedLabelOnStart,
    },
    reference,
  ) => {
    const [isFocused, setIsFocus] = useState(false);
    const {
      boxComponent: Box,
      labelComponent: Label,
      fieldComponent: Field,
      errorComponent: Error,
    } = components[styling];
    const hasError = showError && error;
    const simpleInput = onChange ? { onChange, value } : {};

    let focusProps = {};

    if (centerizedLabelOnStart) {
      focusProps = {
        onFocus: () => setIsFocus(true),
        onBlur: () => setIsFocus(false),
      };
    }

    const isLabelCenterized =
      !isFocused && centerizedLabelOnStart && (!value || value?.length === 0);

    return (
      <Box fullWidth={fullWidth}>
        <Label isLabelCenterized={isLabelCenterized} htmlFor={name}>
          {label}
          {required && <RequiredLabel>(required)</RequiredLabel>}
        </Label>
        <Field
          id={name}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          isLabelCenterized={isLabelCenterized}
          ref={reference}
          {...focusProps}
          {...simpleInput}
        />
        {hasError && <Error>{error}</Error>}
      </Box>
    );
  },
);

export default Input;
