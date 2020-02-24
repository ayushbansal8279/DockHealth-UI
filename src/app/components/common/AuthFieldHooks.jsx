import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useToggle } from 'react-use';
import {
  StyledErrorLabel,
  StyledInput,
  StyledInputContainer,
  StyledInputIcon,
  StyledLabel,
  StyledPasswordSwitch,
} from './AuthField.styled';

const onCrossIconClick = ({ clearError, hasError, name, setValue }) => () => {
  if (hasError) {
    clearError(name);
    setValue(name, '');
  }
};

const AuthFieldHooks = ({
  name,
  invisible,
  label,
  type,
  onChange,
  ...props
}) => {
  const { errors, register, clearError, setValue } = useFormContext();
  const error = errors?.[name]?.message;

  const [passwordShown, togglePasswordShown] = useToggle(false);

  const hasError = Boolean(error);

  let inputClassName = '';

  inputClassName += hasError ? ' error' : '';

  const isPassword = type === 'password';
  const inputType = isPassword && passwordShown ? 'text' : type;

  return (
    <>
      {hasError && <StyledErrorLabel>{error}</StyledErrorLabel>}
      <StyledInputContainer
        invisible={invisible}
        className={inputClassName.trim()}
      >
        <StyledInput
          ref={register}
          name={name}
          type={inputType}
          className={inputClassName.trim()}
          isPassword={isPassword}
          onChange={onChange}
          placeholder=" "
          {...props}
        />
        <StyledInputIcon
          onClick={onCrossIconClick({ clearError, hasError, name, setValue })}
        />
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

export default AuthFieldHooks;
