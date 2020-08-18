import { useFormContext } from 'react-hook-form';
import React, { useState } from 'react';

const onTextareaWrapperClicked = ({ isTextarea }) => event => {
  if (isTextarea) {
    const [textarea] = event.target.querySelectorAll('textarea');

    return textarea?.focus();
  }

  return null;
};

export default ({
  name,
  ERROR_CLASS_NAME,
  EMPTY_CLASS_NAME,
  isPhoneNumber,
  matchEmptyNumber,
  isTextarea,
  controlled,
  fontSize,
  labelFontSize,
  backgroundColor,
  autoFocus,
  StyledTextarea,
  StyledInput,
  StyledLabel,
  labelInactiveTop,
  required,
  label,
  containerHeight,
  containerMarginTop,
  visible,
  gutterBottom,
  isBirthDate,
  PHONE_MASK_ARRAY,
  BIRTH_DATE_MASK_ARRAY,
}) => {
  const { errors, watch, register } = useFormContext();

  const error = (errors[name] || {}).message;
  const currentValue = watch(name);
  const hasError = Boolean(error);

  const [inputState, setInputState] = useState('');

  let inputClassName = '';

  if (hasError) {
    inputClassName += ` ${ERROR_CLASS_NAME}`;
  }

  if (!currentValue || (isPhoneNumber && !matchEmptyNumber(currentValue))) {
    inputClassName += ` ${EMPTY_CLASS_NAME}`;
  }

  inputClassName = inputClassName.trim();

  const wrapperClassName = `${inputClassName} ${inputState}`.trim();

  const inputProps = {
    className: inputClassName,
    name,
    controlled,
    fontSize,
    labelFontSize,
    isTextarea,
    fullWidth: true,
    backgroundColor,
    autoFocus,
  };

  const InputComponent = isTextarea ? StyledTextarea : StyledInput;

  const labelComponent = (
    <StyledLabel fontSize={fontSize} labelInactiveTop={labelInactiveTop}>
      <span className="input-label">{label}</span>
      {required && <span className="required">*</span>}
    </StyledLabel>
  );

  const inputContainerProps = {
    containerHeight,
    containerMarginTop,
    hasError,
    gutterBottom,
    visible,
  };

  const isMaskedInput = isPhoneNumber || isBirthDate;
  const inputMask = (() => {
    if (isPhoneNumber) return PHONE_MASK_ARRAY;
    if (isBirthDate) return BIRTH_DATE_MASK_ARRAY;
    return null;
  })();

  return {
    onTextareaWrapperClicked: onTextareaWrapperClicked({ isTextarea }),
    errors,
    watch,
    register,
    error,
    currentValue,
    hasError,
    inputState,
    setInputState,
    inputClassName,
    wrapperClassName,
    inputProps,
    InputComponent,
    labelComponent,
    inputContainerProps,
    isMaskedInput,
    inputMask,
  };
};
