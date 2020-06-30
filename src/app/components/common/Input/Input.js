import React from 'react';
import {
  PrimaryInputBox,
  PrimaryInputLabel,
  PrimaryInputField,
  PrimaryInputError,
  SecondaryInputBox,
  SecondaryInputLabel,
  SecondaryInputField,
  SecondaryInputError,
  RedDot,
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
    },
    reference,
  ) => {
    const {
      boxComponent: Box,
      labelComponent: Label,
      fieldComponent: Field,
      errorComponent: Error,
    } = components[styling];
    const hasError = showError && error;
    const simpleInput = onChange ? { onChange, value } : {};
    return (
      <Box fullWidth={fullWidth}>
        <Label htmlFor={name}>
          {label}
          {required && <RedDot>*</RedDot>}
        </Label>
        <Field
          id={name}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          ref={reference}
          {...simpleInput}
        />
        {hasError && <Error>{error}</Error>}
      </Box>
    );
  },
);

export default Input;
