import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.div`
  color: #ababb2;
  left: 1rem;
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
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
  border: 0;
  outline: none;
`;

const StyledInput = styled.input`
  color: #000;
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  outline: none;
  padding: 1rem 2rem 0 1rem;

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
  }
`;

const StyledInputContainer = styled.div`
  background-color: #f3f5f6;
  border-radius: 0;
  box-sizing: border-box;
  margin-top: 2.5em;
  max-width: 85%;
  position: relative;
`;

const StyledErrorLabel = styled.div`
  color: #f40707;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  position: absolute;
  top: -1.5em;
`;

const AuthField = ({
  input, label, type, meta: { touched, error },
}) => {
  const hasError = Boolean(touched && error);

  let inputClassName = '';

  inputClassName += hasError ? ' error' : '';

  return (
    <StyledInputContainer className={inputClassName.trim()}>
      {hasError && <StyledErrorLabel>{error}</StyledErrorLabel>}
      <StyledInput type={type} {...input} className={inputClassName.trim()} />
      <StyledInputIcon />
      <StyledLabel>{label}</StyledLabel>
    </StyledInputContainer>
  );
};

export default AuthField;
