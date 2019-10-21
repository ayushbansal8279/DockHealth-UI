import React, { useRef } from 'react';
import styled from 'styled-components';

import useBoolean from '../../hooks/useBoolean';

const StyledLabel = styled.div`
  color: #ababb2;
  left: 1rem;
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease-out;
  will-change: top;
  z-index: 1;
`;

const StyledInputIcon = styled.div`
  background-image: none;
  background-position: center;
  background-size: contain;
  bottom: 1rem;
  height: 1rem;
  position: absolute;
  right: 1rem;
  width: 1rem;
  z-index: 1;
`;

const StyledInput = styled.input`
  color: #000;
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  outline: none;
  padding: 1rem 2.5rem 0 1rem;

  ${props => props.isPassword && 'padding-right: 5rem;'}

  &:focus ~ ${StyledLabel}, &:not([value='']) ~ ${StyledLabel} {
    top: 25%;
  }

  &:not([value='']):not(:focus):not(.error) ~ ${StyledInputIcon} {
    background-image: url(assets/img/svg/check.svg);
  }

  &.error ~ ${StyledInputIcon} {
    background-image: url(assets/img/svg/cross.svg);
  }

  && {
    border: 1.5px solid transparent;

    &:focus {
      border: 1.5px solid #dedee2;
    }

    &.error {
      border: 1.5px solid #e40909;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:active,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 40px rgba(243, 245, 246) inset !important;
    }
  }
`;

const StyledInputContainer = styled.div`
  background-color: #f3f5f6;
  border-radius: 0;
  box-sizing: border-box;
  position: relative;
  margin-top: ${props => props.marginTop};
`;

const StyledErrorLabel = styled.div`
  color: #e40909;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  position: absolute;
  top: -1.5em;
`;

const StyledPasswordSwitch = styled.div`
  bottom: 1rem;
  color: rgba(48, 53, 56, 0.8);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 300;
  height: 1rem;
  line-height: 1rem;
  position: absolute;
  right: 2.5rem;
  text-align: right;
  user-select: none;
  z-index: 1;
`;

const AuthField = ({
  input,
  marginTop,
  label,
  type,
  meta: { touched, error },
  autoFocus = false,
  customError = '',
  setCustomError = () => {},
}) => {
  const inputRef = useRef(null);
  const [passwordShown, , , togglePasswordShown] = useBoolean(false);

  const errorValue = customError || error;

  const hasError = Boolean(touched && errorValue);

  let inputClassName = '';

  inputClassName += hasError ? ' error' : '';

  const isPassword = type === 'password';
  const inputType = isPassword && passwordShown ? 'text' : type;

  const { onChange: oldOnChange, ...otherInput } = input;

  const onChange = e => {
    oldOnChange(e);
    setCustomError('');
  };

  return (
    <StyledInputContainer
      marginTop={marginTop}
      className={inputClassName.trim()}
    >
      {hasError && <StyledErrorLabel>{errorValue}</StyledErrorLabel>}
      <StyledInput
        ref={inputRef}
        type={inputType}
        autoFocus={autoFocus}
        {...otherInput}
        onChange={onChange}
        className={inputClassName.trim()}
        isPassword={isPassword}
      />
      <StyledInputIcon />
      {isPassword && (
        <StyledPasswordSwitch onClick={togglePasswordShown}>
          {passwordShown ? 'Hide' : 'Show'}
        </StyledPasswordSwitch>
      )}
      <StyledLabel>{label}</StyledLabel>
    </StyledInputContainer>
  );
};

export default AuthField;
