import React from 'react';
import { useFormContext } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import styled from 'styled-components';

import { mergeRefs } from '../../helpers/utilityFunctions';
import {
  matchEmptyNumber,
  PHONE_MASK_ARRAY,
} from '../../views/UserProfileView.ValidationSchema';

const EMPTY_CLASS_NAME = 'empty';
const ERROR_CLASS_NAME = 'error';

const StyledLabel = styled.div`
  && {
    left: 1rem;
    font-size: ${props => props.fontSize ?? 14}px;
    font-family: 'Open Sans', sans-serif;
    font-weight: normal;
    pointer-events: none;
    position: absolute;
    top: 50%;
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
    position: relative;

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

const StyledInput = styled.input`
  && {
    background-color: transparent;
    border: 1.5px solid transparent;
    box-shadow: none;
    color: #000;
    font-size: ${props => props.fontSize ?? 14}px;
    font-family: 'Open Sans', sans-serif;
    font-weight: normal;
    height: 75px;
    margin-top: 8px;
    outline: none;
    padding: 1rem 2.5rem 0 1rem;
    ${props =>
      props.controlled &&
      `
      cursor: pointer;
      pointer-events: none;
    `}
    ${props => props.fullWidth && 'width: 100%;'}
    ${props => props.gutterBottom && 'margin-bottom: 1rem;'}

    &:focus ~ ${StyledLabel}, &:not(.${EMPTY_CLASS_NAME}) ~ ${StyledLabel} {
      font-size: 12px;
      top: 25%;

      & > .input-label {
        color: #ababb2;
      }
    }

    &:focus {
      border: 1.5px solid #dedee2;
    }

    &.${ERROR_CLASS_NAME} {
      border: 1.5px solid #e40909;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:active,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      transition: all 0.25s ease-out, -webkit-box-shadow 0s;
      -webkit-box-shadow: 0 0 0 40px rgba(243, 245, 246) inset !important;
    }

  }
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
      backgroundColor,
      ...props
    },
    ref,
  ) => {
    const { errors, watch, register } = useFormContext();

    const error = (errors[name] || {}).message;
    const currentValue = watch(name);
    const hasError = Boolean(error);

    let inputClassName = '';

    if (hasError) {
      inputClassName += ` ${ERROR_CLASS_NAME}`;
    }

    if (!currentValue || (isPhoneNumber && !matchEmptyNumber(currentValue))) {
      inputClassName += ` ${EMPTY_CLASS_NAME}`;
    }

    inputClassName = inputClassName.trim();

    const inputProps = {
      className: inputClassName,
      name,
      controlled,
      fontSize,
      fullWidth: true,
      gutterBottom: true,
    };

    return (
      <StyledInputContainer
        controlled={controlled}
        containerDisabled={containerDisabled}
        onClick={e => {
          if (!containerDisabled) {
            onContainerClick(e);
          }
        }}
        ref={ref}
        backgroundColor={backgroundColor}
      >
        {hasError && <StyledErrorLabel>{error}</StyledErrorLabel>}
        {isPhoneNumber ? (
          <MaskedInput
            mask={PHONE_MASK_ARRAY}
            render={renderPhoneNumberField({ inputProps, props, register })}
          />
        ) : (
          <StyledInput ref={register} {...inputProps} {...props} />
        )}
        <StyledLabel fontSize={fontSize}>
          <span className="input-label">{label}</span>
          {required && <span className="required">*</span>}
        </StyledLabel>
      </StyledInputContainer>
    );
  },
);
