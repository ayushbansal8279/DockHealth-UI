/* eslint-disable react/jsx-no-duplicate-props */
import { Popover } from '@material-ui/core';
import {
  any,
  arrayOf,
  bool,
  func,
  node,
  objectOf,
  oneOfType,
  shape,
  string,
} from 'prop-types';
import { prop } from 'ramda';
import React, { useCallback, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useCss, useMount, useUnmount } from 'react-use';
import styled from 'styled-components';

import useBoolean from 'hooks/useBoolean';

import TextInput from './NewTaskDrawer.TextInput';

const DropdownInputContainer = styled.div`
  width: 100%;
`;

const DropdownInput = ({
  children,
  renderItem,
  name,
  label,
  placeholder,
  className,
  required,
  onFocus,
  onBlur,
  popoverStateArray,
  InputLabelProps,
  InputProps,
  inputProps,
}) => {
  const reference = useRef(null);

  const [isPopoverOpen, openPopover, closePopover] =
    popoverStateArray ?? useBoolean(false);

  const { width } = reference.current?.getBoundingClientRect() || {};

  const popoverClassName = useCss({
    '&&': {
      border: 0,
      marginTop: '0.5rem',
      width,
    },
  });

  const { register, unregister, setValue, watch } = useFormContext();

  useMount(() => {
    register({
      name,
    });
  });

  useUnmount(() => {
    unregister(name);
  });

  const currentValue = watch(name);

  const displayLabel = useMemo(
    () =>
      children.find(({ value }) => value === currentValue)?.displayLabel ?? '',
    [children, currentValue],
  );

  const setValueForCurrentField = useCallback(
    value => {
      setValue(name, value);
    },
    [name, setValue],
  );

  return (
    <DropdownInputContainer>
      <TextInput
        name={name}
        label={label}
        placeholder={placeholder}
        InputLabelProps={{
          shrink: true,
          ...InputLabelProps,
        }}
        InputProps={{
          onClick: openPopover,
          ...InputProps,
        }}
        inputProps={{
          readOnly: true,
          value: displayLabel,
          ...inputProps,
        }}
        ref={reference}
        className={className}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        select
      />
      <Popover
        anchorEl={reference.current}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        open={isPopoverOpen}
        onClose={closePopover}
        transitionDuration={0}
        PaperProps={{
          className: popoverClassName,
          elevation: 1,
        }}
      >
        {children?.map(
          renderItem({ setValue: setValueForCurrentField, closePopover }),
        )}
      </Popover>
    </DropdownInputContainer>
  );
};

DropdownInput.propTypes = {
  children: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
      displayLabel: string.isRequired,
      value: string.isRequired,
    }),
  ).isRequired,
  popoverStateArray: arrayOf(oneOfType([bool, func])),
  renderItem: func,
  label: string.isRequired,
  placeholder: string,
  name: string.isRequired,
  className: string,
  required: bool,
  onFocus: func,
  onBlur: func,
  inputProps: objectOf(any),
  InputProps: objectOf(any),
  InputLabelProps: objectOf(any),
};

DropdownInput.defaultProps = {
  popoverStateArray: null,
  renderItem: () => prop('label'),
  placeholder: '',
  className: '',
  required: false,
  onFocus: () => {},
  onBlur: () => {},
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
};

export default DropdownInput;
