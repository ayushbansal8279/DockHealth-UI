import React, { useRef } from 'react';
import { useToggle } from 'react-use';
import {
  StyledErrorLabel,
  StyledInput,
  StyledInputContainer,
  StyledInputIcon,
  StyledLabel,
  StyledPasswordSwitch,
} from './styled';

const onCrossIconClick =
  ({ onChange, hasError }) =>
  () => {
    if (hasError) {
      onChange('');
    }
  };

const AuthField = ({
  input,
  invisible,
  label,
  type,
  meta: { touched, error, pristine },
  autoFocus = false,
  customError = '',
  setCustomError = () => {},
}) => {
  const inputReference = useRef(null);
  const [passwordShown, togglePasswordShown] = useToggle(false);

  const errorValue = customError || error;

  const hasError = Boolean(!pristine && touched && errorValue);

  let inputClassName = '';

  inputClassName += hasError ? ' error' : '';

  const isPassword = type === 'password';
  const inputType = isPassword && passwordShown ? 'text' : type;

  const { onChange: oldOnChange, ...otherInput } = input;

  const onChange = (event) => {
    oldOnChange(event);
    setCustomError('');
  };

  return (
    <>
      {hasError && <StyledErrorLabel>{errorValue}</StyledErrorLabel>}
      <StyledInputContainer
        invisible={invisible}
        className={inputClassName.trim()}
      >
        <StyledInput
          ref={inputReference}
          type={inputType}
          autoFocus={autoFocus}
          {...otherInput}
          onChange={onChange}
          className={inputClassName.trim()}
          isPassword={isPassword}
        />
        <StyledInputIcon onClick={onCrossIconClick({ onChange, hasError })} />
        {isPassword && (
          <StyledPasswordSwitch onClick={togglePasswordShown}>
            {passwordShown ? 'Hide' : 'Show'}
          </StyledPasswordSwitch>
        )}
        <StyledLabel>{label}</StyledLabel>
      </StyledInputContainer>
    </>
  );
};

export default AuthField;
