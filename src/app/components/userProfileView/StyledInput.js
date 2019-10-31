import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const EMPTY_CLASS_NAME = 'empty';

const StyledLabel = styled.div`
  && {
    left: 1rem;
    font-size: 14px;
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
    background-color: #f3f5f6;
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
    border: 0;
    box-shadow: none;
    color: #000;
    font-size: 14px;
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

    &:focus ~ ${StyledLabel}, &:not(.${EMPTY_CLASS_NAME}) ~ ${StyledLabel} {
      font-size: 12px;
      top: 25%;

      & > .input-label {
        color: #ababb2;
      }
    }
  }
`;

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
      ...props
    },
    ref,
  ) => {
    const { errors, watch, register } = useFormContext();

    const error = (errors[name] || {}).message;
    const hasError = Boolean(error);

    const currentValue = watch(name);

    const maxLength = isPhoneNumber ? 12 : undefined;

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
      >
        {hasError && <StyledErrorLabel>{error}</StyledErrorLabel>}
        <StyledInput
          className={currentValue ? '' : EMPTY_CLASS_NAME}
          name={name}
          ref={register}
          maxLength={maxLength}
          controlled={controlled}
          {...props}
        />
        <StyledLabel>
          <span className="input-label">{label}</span>
          {required && <span className="required">*</span>}
        </StyledLabel>
      </StyledInputContainer>
    );
  },
);
