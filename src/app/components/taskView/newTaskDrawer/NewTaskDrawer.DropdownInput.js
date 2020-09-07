/* eslint-disable react/jsx-no-duplicate-props */
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
import palette from 'styles/palette';
import { prop } from 'ramda';
import React, { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMount, useUnmount } from 'react-use';
import styled from 'styled-components';

import useBoolean from 'hooks/useBoolean';
import InputPopover from './NewTaskDrawer.InputPopover';
import TextInput from './NewTaskDrawer.TextInput';

const DropdownInputContainer = styled.div`
  width: 100%;
`;

const DropdownItemContainer = styled.div`
  ${({ isHovered }) =>
    isHovered &&
    `
      background-color: ${palette.coolGrey4};
      && > * {
        font-weight: bold;
      }
    `}
`;

const DropdownInput = React.forwardRef(
  (
    {
      children,
      renderItem,
      onItemSelection,
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
    },
    reference,
  ) => {
    const [isPopoverOpen, openPopover, closePopover] =
      popoverStateArray ?? useBoolean(false);

    const [hoveredItem, setHoveredItem] = useState(0);

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
        children.find(({ value }) => value === currentValue)?.displayLabel ??
        '',
      [children, currentValue],
    );

    const setValueForCurrentField = useCallback(
      value => {
        setValue(name, value);
      },
      [name, setValue],
    );

    const handleInputKeyDown = event => {
      switch (event.keyCode) {
        // esc key
        case 27:
          // eslint-disable-next-line no-unused-expressions
          reference.current?.querySelector('input').blur();
          break;

        // enter key
        case 13:
          event.preventDefault();
          event.stopPropagation();
          break;

        // down arrow key
        case 40:
          event.preventDefault();
          event.stopPropagation();
          setHoveredItem(selectedItem =>
            children.length - 1 === selectedItem ? 0 : selectedItem + 1,
          );
          break;

        // up arrow key
        case 38:
          event.preventDefault();
          event.stopPropagation();
          setHoveredItem(selectedItem =>
            selectedItem === 0 ? children.length - 1 : selectedItem - 1,
          );
          break;

        default:
          break;
      }
    };

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
            ...InputProps,
          }}
          inputProps={{
            readOnly: true,
            value: displayLabel,
            onKeyDown: handleInputKeyDown,
            ...inputProps,
          }}
          ref={reference}
          className={className}
          required={required}
          onFocus={event => {
            openPopover();
            onFocus(event);
          }}
          onBlur={event => {
            closePopover();
            onBlur(event);
          }}
          parentType="dropdown"
          autoFocusEnabled={false}
        />
        <InputPopover
          anchorElement={reference}
          isPopoverOpen={isPopoverOpen}
          closePopover={closePopover}
        >
          {children?.map((child, index) => (
            <div
              key={child?.key}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseDown={() => {
                // select item
              }}
            >
              {renderItem({
                setValue: setValueForCurrentField,
                closePopover,
                onItemSelection,
              })({ ...child, isHovered: index === hoveredItem })}
            </div>
          ))}
        </InputPopover>
      </DropdownInputContainer>
    );
  },
);

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
  onItemSelection: func,
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
  onItemSelection: () => {},
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
