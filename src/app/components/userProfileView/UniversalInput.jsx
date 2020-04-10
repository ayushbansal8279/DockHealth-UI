import {
  Collapse,
  FormControl,
  InputBase,
  InputLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { useMount, useUnmount } from 'react-use';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import palette, { opacify } from '../../palette';

export const ErrorLabel = styled.h4`
  color: ${palette.error};
  font-size: 0.75rem;
  margin: 0;
  margin-bottom: 0.125rem;
  user-select: none;
`;

export const UniversalFormControl = withStyles({
  root: {
    backgroundColor: palette.coolGrey4,
    height: '4rem',
    transition: 'all 0.2s ease-out',
  },
  whiteBackground: {
    backgroundColor: palette.white,
  },
  error: {
    backgroundColor: palette.lightGrey,
  },
})(({ classes, whiteBackground, error, ...props }) => {
  const className = clsx(
    classes.root,
    error && classes.error,
    whiteBackground && classes.whiteBackground,
  );
  return <FormControl className={className} {...props} />;
});

export const UniversalInputLabel = withStyles({
  root: {
    color: palette.greyBlue,
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(1rem, -50%) scale(1)',
    transition: 'all 200ms ease',
    zIndex: 2,
  },
  required: {
    '& > span': {
      color: palette.error,
    },
  },
  shrink: {
    color: palette.unknownGrey5,
    top: '5%',
    transform: 'translate(1rem, 0.375rem) scale(1)',
    transformOrigin: 'center left',
    transition: 'all 200ms ease',
  },
  focused: {
    color: `${palette.unknownGrey5} !important`,
  },
})(InputLabel);

export const UniversalInputBase = withStyles({
  root: {
    border: `0.0625rem solid ${opacify(palette.unknownGrey6, 0)}`,
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
  },
  error: {
    border: `0.0625rem solid ${palette.error}`,
  },
  focused: {
    border: `0.0625rem solid ${palette.unknownGrey6}`,
    '&$error': {
      border: `0.0625rem solid ${palette.error}`,
    },
  },
  input: {
    borderRadius: 0,
    boxShadow: 'none',
    paddingBottom: 0,
    padding: '1.25rem 1rem',
    '&:focus': {
      backgroundColor: opacify(palette.lightGrey, 0),
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: opacify(palette.lightGrey, 0),
      cursor: 'pointer',
    },
  },
})(InputBase);

export const UniversalMobileInputComponent = ({
  inputRef,
  name,
  setValue,
  ...otherProps
}) => (
  <InputMask
    {...otherProps}
    name={name}
    ref={inputRef}
    mask="(999) 999-9999"
    maskPlaceholder={null}
    onChange={event => {
      setValue(name, event.target.value);
    }}
  />
);

export const UniversalBirthdayInputComponent = ({
  inputRef,
  name,
  setValue,
  ...otherProps
}) => (
  <InputMask
    {...otherProps}
    name={name}
    ref={inputRef}
    mask="99/99/9999"
    maskPlaceholder={null}
    onChange={event => {
      setValue(name, event.target.value);
    }}
  />
);

export const UniversalInput = ({
  label,
  name,
  placeholder,
  inputContainerReference = undefined,
  CustomComponent = undefined,
  required = false,
  className = '',
  whiteBackground = false,
  customShrinkCondition = undefined,
  ...InputBaseProps
}) => {
  const {
    register,
    errors,
    clearError,
    watch,
    setValue,
    unregister,
  } = useFormContext();
  const error = errors?.[name]?.message;

  const hasError = Boolean(error);

  const [focused, setFocused, unsetFocused] = useBoolean(false);

  const value = watch(name);

  useMount(() => {
    if (CustomComponent) {
      register({
        name,
      });
    }
  });

  useUnmount(() => {
    if (CustomComponent) {
      unregister(name);
    }
  });

  const shrink =
    typeof customShrinkCondition === 'undefined'
      ? Boolean(focused || value || placeholder)
      : Boolean(customShrinkCondition);

  return (
    <div ref={inputContainerReference} className={className}>
      <Collapse in={hasError} timeout={150}>
        <ErrorLabel>{error}</ErrorLabel>
      </Collapse>
      <UniversalFormControl
        error={hasError}
        whiteBackground={whiteBackground}
        fullWidth
      >
        <UniversalInputLabel required={required} shrink={shrink}>
          {label}
        </UniversalInputLabel>
        <UniversalInputBase
          name={name}
          placeholder={placeholder}
          inputRef={register}
          inputProps={{
            value,
            setValue,
            name,
            register,
          }}
          error={hasError}
          inputComponent={CustomComponent}
          onKeyUp={() => clearError(name)}
          onFocus={setFocused}
          onBlur={unsetFocused}
          {...InputBaseProps}
        />
      </UniversalFormControl>
    </div>
  );
};

export const UniversalMontserratInput = styled(UniversalInput)`
  &&& * {
    font-family: 'Montserrat', sans-serif;
  }
`;
