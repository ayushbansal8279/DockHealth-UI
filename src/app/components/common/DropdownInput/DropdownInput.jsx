/* eslint-disable react/forbid-prop-types */
/* eslint-disable sonarjs/cognitive-complexity */
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
import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { useBoolean } from 'hooks/useBoolean';
import InputPopover from 'components/common/InputPopover/InputPopover';
import TextInput from 'components/common/TextInput/TextInput';

const StyledButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
`;

const DropdownInput = React.forwardRef(
  (
    {
      children,
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
      textFieldClasses,
      onSelect,
      disabled,
      value,
    },
    reference,
  ) => {
    const innerInputReference = useRef(null);
    const inputReference = reference || innerInputReference;

    const [isPopoverOpen, openPopover, closePopover] =
      popoverStateArray ?? useBoolean(false);

    const [hoveredItem, setHoveredItem] = useState(0);

    const displayLabel = useMemo(
      () => children.find(({ value: v }) => v === value)?.displayLabel ?? '',
      [children, value],
    );

    const handleSelectOption = ({ value: v }) => {
      if (value !== v) {
        onSelect(v);
      }
    };

    const handleInputKeyDown = event => {
      switch (event.key) {
        case 'Escape':
          // eslint-disable-next-line no-unused-expressions
          reference.current?.querySelector('input').blur();
          break;

        case 'Enter':
          event.preventDefault();
          event.stopPropagation();
          handleSelectOption(children[hoveredItem]);
          break;

        case 'ArrowDown':
          event.preventDefault();
          event.stopPropagation();
          setHoveredItem(selectedItem =>
            children.length - 1 === selectedItem ? 0 : selectedItem + 1,
          );
          break;

        case 'ArrowUp':
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
      <>
        <TextInput
          name={name}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          InputLabelProps={{
            shrink: true,
            ...InputLabelProps,
          }}
          InputProps={{
            ...InputProps,
            startAdornment: !displayLabel ? InputProps?.startAdornment : null,
          }}
          inputProps={{
            readOnly: true,
            value: displayLabel,
            onKeyDown: handleInputKeyDown,
            disabled,
            ...inputProps,
          }}
          ref={inputReference}
          className={className}
          required={required}
          classes={textFieldClasses}
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
          anchorElement={inputReference}
          isPopoverOpen={isPopoverOpen}
          closePopover={closePopover}
        >
          {children?.map((child, index) => (
            <StyledButton
              type="button"
              key={child?.key}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseDown={() => {
                handleSelectOption(child);
              }}
            >
              {typeof child.label === 'function'
                ? child.label(hoveredItem === index)
                : child.label}
            </StyledButton>
          ))}
        </InputPopover>
      </>
    );
  },
);

DropdownInput.propTypes = {
  children: arrayOf(
    shape({
      key: string,
      label: oneOfType([func, node]),
      displayLabel: string,
      value: string,
    }),
  ),
  popoverStateArray: arrayOf(oneOfType([bool, func])),
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
  onSelect: func.isRequired,
  disabled: bool,
};

DropdownInput.defaultProps = {
  children: [],
  popoverStateArray: null,
  placeholder: '',
  className: '',
  required: false,
  onFocus: () => {},
  onBlur: () => {},
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
  disabled: false,
};

export default DropdownInput;
