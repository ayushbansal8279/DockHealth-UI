import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';
import mergeDeepRight from 'ramda/es/mergeDeepRight';

import { mergeRefs } from '../../helpers/utilityFunctions';
import {
  matchEmptyNumber,
  PHONE_MASK_ARRAY,
} from '../../views/UserProfileView.ValidationSchema';

const EMPTY_CLASS_NAME = 'empty';
const ERROR_CLASS_NAME = 'error';
const FOCUS_CLASS_NAME = 'focus';

const StyledLabel = styled.div`
  && {
    left: 1rem;
    font-size: ${props => props.fontSize ?? 14}px;
    font-family: 'Open Sans', sans-serif;
    font-weight: normal;
    pointer-events: none;
    position: absolute;
    top: 2.34375rem;
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
    height: ${props => (props.isTextarea ? 9.375 : 4.6875)}rem;
    margin-top: 0.5rem;
    position: relative;

    ${props => props.gutterBottom && 'margin-bottom: 1rem;'}

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
    position: absolute;
    top: -1.5em;
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
          '-webkit-box-shadow':
            '0 0 0 40px rgba(243, 245, 246) inset !important',
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
      isPhoneNumber,
      containerDisabled = false,
      controlled = false,
      onContainerClick = () => {},
      fontSize,
      labelFontSize,
      isTextarea = false,
      backgroundColor,
      gutterBottom = false,
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
    };

    const InputComponent = isTextarea ? StyledTextarea : StyledInput;

    const labelComponent = (
      <StyledLabel fontSize={fontSize}>
        <span className="input-label">{label}</span>
        {required && <span className="required">*</span>}
      </StyledLabel>
    );

    const inputContainerProps = {
      gutterBottom,
    };

    return (
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
        {hasError && <StyledErrorLabel>{error}</StyledErrorLabel>}
        {isPhoneNumber ? (
          <TextareaWrapper>
            <MaskedInput
              mask={PHONE_MASK_ARRAY}
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
      </StyledInputContainer>
    );
  },
);
