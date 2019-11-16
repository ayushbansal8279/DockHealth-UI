import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';
import mergeDeepRight from 'ramda/es/mergeDeepRight';

import { mergeRefs } from '../../helpers/utilityFunctions';
import { matchEmptyNumber } from '../../views/UserProfileView.ValidationSchema';

const EMPTY_CLASS_NAME = 'empty';
const ERROR_CLASS_NAME = 'error';
const FOCUS_CLASS_NAME = 'focus';

const PHONE_MASK_ARRAY = [
  /[1-9]/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const BIRTH_DATE_MASK_ARRAY = [
  /[0-1]/,
  /\d/,
  '/',
  /[0-2]/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const StyledLabel = styled.div`
  && {
    left: 1rem;
    font-size: ${props => props.fontSize ?? 14}px;
    font-family: 'Open Sans', sans-serif;
    font-weight: normal;
    pointer-events: none;
    position: absolute;
    top: ${props => props.labelInactiveTop ?? 2.34375}rem;
    transform: translateY(-50%);
    transition: font-size 0.2s ease-out, top 0.2s ease-out;
    z-index: 1;

    & > .input-label {
      color: #000000;
      transition: color 0.2s ease-out;
    }

    & > .required {
      color: #e40909;
      padding-left: 4px;
      transition: color 0.2s ease-out;
    }
  }
`;

const StyledInputContainer = styled.div`
  && {
    background-color: ${props => props.backgroundColor ?? '#f3f5f6'};
    border-radius: 0;
    box-sizing: border-box;
    height: ${props =>
      props.containerHeight || (props.isTextarea ? 7.03125 : 4.6875)}rem;
    position: relative;

    ${props => props.gutterBottom && 'margin-bottom: 1rem;'}
    ${props => !props.visible && 'display: none;'}
    margin-top: ${props =>
      props.hasError
        ? props.containerMarginTopOnError ?? 0
        : props.containerMarginTop ?? 0.5}rem;

    ${props => {
      if (props.controlled) {
        if (props.containerDisabled) {
          return 'cursor: not-allowed';
        }

        return 'cursor: pointer';
      }

      return '';
    }}
  }
`;

const StyledErrorLabel = styled.div`
  && {
    color: #e40909;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    margin-bottom: 0.125rem;
  }
`;

const inputStyle = styleExtension => props =>
  mergeDeepRight(
    {
      '&&': {
        backgroundColor: 'transparent',
        border: '1.5px solid transparent',
        boxShadow: 'none',
        color: '#000',
        fontSize: `${props.fontSize ?? 14}px`,
        fontWeight: 'normal',
        height: '100%',
        outline: 'none',
        padding: '1rem 2.5rem 0 1rem',

        cursor: props.controlled && 'pointer',
        pointerEvents: props.controlled && 'none',

        lineHeight: props.isTextarea && '2rem',

        width: props.fullWidth && '100%',

        [`&:focus ~ ${StyledLabel}, &:not(.${EMPTY_CLASS_NAME}) ~ ${StyledLabel}`]: {
          fontSize: `${props.labelFontSize ?? 12}px`,
          top: `${props.isTextarea ? 1.25 : 1}rem`,

          '& > .input-label': {
            color: '#ababb2',
          },
        },

        '&:focus': {
          border: '1.5px solid #dedee2',
        },

        [`&.${ERROR_CLASS_NAME}`]: {
          border: '1.5px solid #e40909',
        },

        [`&:-webkit-autofill, &:-webkit-autofill:active, &:-webkit-autofill:hover, &:-webkit-autofill:focus`]: {
          transition: 'all 0.25s ease-out, -webkit-box-shadow 0s',
          '-webkit-box-shadow': `0 0 0 40px ${props.backgroundColor ??
            'rgba(243, 245, 246, 0)'} inset !important`,
        },
      },
    },
    styleExtension,
  );

const StyledInput = styled.input(inputStyle({}));
const StyledTextarea = styled.textarea(
  inputStyle({
    '&&': {
      resize: 'none',
      padding: 0,
    },
    '&&&': {
      border: 'none',
    },
  }),
);

const TextareaWrapper = styled.div`
  height: 100%;
  transition: all 0.25s ease-out;

  ${props =>
    props.isTextarea &&
    `
    border: 1.5px solid transparent;
    box-sizing: border-box;
    cursor: text;
    overflow: hidden;
    padding: 2rem 1rem 1rem 1rem;

    &.${FOCUS_CLASS_NAME} {
      border: 1.5px solid #dedee2;
    }

    &.${ERROR_CLASS_NAME} {
      border: 1.5px solid #e40909;
    }
  `}
`;

const renderPhoneNumberField = ({ inputProps, props, register }) => (
  maskedRef,
  otherProps,
) => {
  return (
    <StyledInput
      ref={mergeRefs([maskedRef, register])}
      {...props}
      {...inputProps}
      {...otherProps}
    />
  );
};

export default React.forwardRef(
  (
    {
      name,
      label,
      required,
      isBirthDate,
      isPhoneNumber,
      containerDisabled = false,
      controlled = false,
      onContainerClick = () => {},
      fontSize,
      labelFontSize,
      isTextarea = false,
      backgroundColor,
      gutterBottom = false,
      visible = true,
      containerHeight,
      containerMarginTop,
      containerMarginTopOnError,
      labelInactiveTop,
      rightAdornment,
      ...props
    },
    ref,
  ) => {
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

    const onTextareaWrapperClicked = event => {
      if (isTextarea) {
        const [textarea] = event.target.querySelectorAll('textarea');

        return textarea?.focus();
      }

      return null;
    };

    const inputProps = {
      className: inputClassName,
      name,
      controlled,
      fontSize,
      labelFontSize,
      isTextarea,
      fullWidth: true,
      backgroundColor,
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

    return (
      <>
        {hasError && <StyledErrorLabel>{error}</StyledErrorLabel>}
        <StyledInputContainer
          controlled={controlled}
          containerDisabled={containerDisabled}
          isTextarea={isTextarea}
          onClick={e => {
            if (!containerDisabled) {
              onContainerClick(e);
            }
          }}
          ref={ref}
          backgroundColor={backgroundColor}
          {...inputContainerProps}
        >
          {isMaskedInput ? (
            <TextareaWrapper>
              <MaskedInput
                mask={inputMask}
                render={renderPhoneNumberField({ inputProps, props, register })}
              />
              {labelComponent}
            </TextareaWrapper>
          ) : (
            <TextareaWrapper
              className={isTextarea ? wrapperClassName : ''}
              isTextarea={isTextarea}
              onClick={onTextareaWrapperClicked}
            >
              <InputComponent
                ref={register}
                {...inputProps}
                {...props}
                onFocus={() => setInputState(FOCUS_CLASS_NAME)}
                onBlur={() => setInputState('')}
              />
              {labelComponent}
            </TextareaWrapper>
          )}
          {rightAdornment}
        </StyledInputContainer>
      </>
    );
  },
);
