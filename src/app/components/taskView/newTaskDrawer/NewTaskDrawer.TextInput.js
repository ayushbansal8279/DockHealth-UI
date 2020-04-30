import { any, bool, func, objectOf, string } from 'prop-types';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import Spacing from 'components/common/Spacing';

import {
  DrawerFormControl,
  DrawerInputLabel,
  DrawerInputBase,
  DrawerInputContainer,
  DrawerInputBaseMultiple,
} from './NewTaskDrawer.TextInput.Styled';

const TextInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      name,
      required,
      className,
      onFocus,
      onBlur,
      InputLabelProps,
      inputProps,
      InputProps,
      select,
      multiple,
      ...props
    },
    reference,
  ) => {
    const { register } = useFormContext();

    const InputBaseComponent = multiple
      ? DrawerInputBaseMultiple
      : DrawerInputBase;

    return (
      <DrawerInputContainer
        ref={reference}
        className={className}
        multiple={multiple}
        {...props}
      >
        <DrawerFormControl fullWidth multiple={multiple}>
          <DrawerInputLabel {...InputLabelProps}>
            <span>{label?.toUpperCase()}</span>
            {required && (
              <>
                <Spacing horizontal={3} />
                <span>(required)</span>
              </>
            )}
          </DrawerInputLabel>
          <InputBaseComponent
            {...InputProps}
            name={name}
            placeholder={placeholder}
            inputRef={select ? null : register}
            onFocus={onFocus}
            onBlur={onBlur}
            inputProps={inputProps}
            multiple={multiple}
          />
        </DrawerFormControl>
      </DrawerInputContainer>
    );
  },
);

TextInput.propTypes = {
  label: string.isRequired,
  placeholder: string,
  name: string.isRequired,
  className: string,
  required: bool,
  onFocus: func,
  onBlur: func,
  select: bool,
  multiple: bool,
  inputProps: objectOf(any),
  InputProps: objectOf(any),
  InputLabelProps: objectOf(any),
};

TextInput.defaultProps = {
  placeholder: '',
  className: '',
  required: false,
  multiple: false,
  select: false,
  onFocus: () => {},
  onBlur: () => {},
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
};

export default TextInput;
