import mergeDeepRight from 'ramda/es/mergeDeepRight';
import React from 'react';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';

import { mergeRefs as mergeReferences } from '../../helpers/utility-functions';
import { matchEmptyNumber } from '../../views/UserProfileView.ValidationSchema';
import initializeStyledInputHooks from './StyledInput.Hooks';
import StyledInputAutoCorrectedDate from './StyledInput.AutoCorrectedDate';

const EMPTY_CLASS_NAME = 'empty';
const ERROR_CLASS_NAME = 'error';
const FOCUS_CLASS_NAME = 'focus';

const PHONE_MASK_ARRAY = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
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
  /\d/,
  /\d/,
  '/',
  /\d/,
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
          top: '1rem',

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

  && {
    background-color: transparent;
  }

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
  maskedReference,
  otherProps,
) => {
  const styledInputProps = { ...props, ...inputProps, ...otherProps };

  const onKeyDown = event => {
    if (event.key.length === 1 && !/\d/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }

    return styledInputProps?.onKeyDown?.(event);
  };

  const onBlur = event => {
    const { target } = event;

    if (target.value.replace(/_|-/g, '').length === 0) {
      target.value = '';
    }

    return styledInputProps?.onBlur?.(event);
  };

  return (
    <StyledInput
      ref={mergeReferences([maskedReference, register])}
      autoComplete="none"
      {...styledInputProps}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
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
      autoFocus = false,
      ...props
    },
    reference,
  ) => {
    const {
      onTextareaWrapperClicked,
      register,
      error,
      hasError,
      setInputState,
      wrapperClassName,
      inputProps,
      InputComponent,
      labelComponent,
      inputContainerProps,
      isMaskedInput,
      inputMask,
    } = initializeStyledInputHooks({
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
    });
    return (
      <>
        {hasError && <StyledErrorLabel>{error}</StyledErrorLabel>}
        <StyledInputContainer
          controlled={controlled}
          containerDisabled={containerDisabled}
          isTextarea={isTextarea}
          onClick={event => {
            if (!containerDisabled) {
              onContainerClick(event);
            }
          }}
          ref={reference}
          backgroundColor={backgroundColor}
          {...inputContainerProps}
        >
          {isMaskedInput ? (
            <TextareaWrapper>
              <MaskedInput
                autoComplete="none"
                mask={inputMask}
                render={renderPhoneNumberField({ inputProps, props, register })}
                pipe={isBirthDate ? StyledInputAutoCorrectedDate() : undefined}
                keepCharPositions={false}
                guide
                onFocus={() => setInputState(FOCUS_CLASS_NAME)}
                onBlur={event =>
                  props.onBlur ? props.onBlur(event) : setInputState('')
                }
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
                autoComplete="none"
                {...inputProps}
                {...props}
                onFocus={() => setInputState(FOCUS_CLASS_NAME)}
                onBlur={event =>
                  props.onBlur ? props.onBlur(event) : setInputState('')
                }
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
