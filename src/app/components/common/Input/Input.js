import React, { useState } from 'react';
import {
  InputWrapper,
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
      autoFocus,
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
      <InputWrapper isHidden={type === 'hidden'} fullWidth={fullWidth}>
        {hasError && styling === 'primary' && <Error>{error}</Error>}
        <Box>
          <Label
            isLabelCenterized={isLabelCenterized}
            htmlFor={name}
            hasError={hasError}
          >
            {label}
            {label && required && <RequiredLabel>(required)</RequiredLabel>}
          </Label>
          <Field
            autoFocus={autoFocus}
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
        </Box>
        {hasError && styling === 'secondary' && <Error>{error}</Error>}
      </InputWrapper>
    );
  },
);

export default Input;
