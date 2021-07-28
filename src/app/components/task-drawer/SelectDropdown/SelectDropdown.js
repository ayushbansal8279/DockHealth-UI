/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useRef, useState } from 'react';
import { Grid } from '@material-ui/core';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import useBoolean from 'hooks/useBoolean';
import { isOutsideScrollView } from 'helpers/scroll-helper';
import Input from 'components/common/Input/Input';
import {
  arrayOf,
  bool,
  func,
  node,
  oneOfType,
  shape,
  string,
} from 'prop-types';
import AddRecordOption from 'components/common/AddRecordOption/AddRecordOption';
import { ListContainer, ListItem, ListItemButton } from './styled';
import { AdornmentClear } from '../styled';

const SelectDropdown = React.forwardRef(
  (
    {
      name,
      label,
      placeholder,
      disabled,
      options,
      selectedOption,
      isLoadingOptions,
      onInputChange,
      onOptionSelect,
      onClear,
      onAddItemClick,
      clearOnSuccess,
      addItemEnabled,
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const inputContainerReference = useRef(null);
    const listReference = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [currentSelectedOption, setCurrentSelectedOption] = useState(
      selectedOption,
    );
    const [isFocused, setIsFocused, unsetIsFocused] = useBoolean(false);
    const [hoveredItemIndex, setHoveredItemIndex] = useState(0);

    const handleInputChange = event => {
      const newValue = event.target.value;
      setInputValue(newValue);
      onInputChange(newValue);
    };

    const { value } = selectedOption || {};

    useEffect(() => {
      if (!isFocused) {
        setInputValue(currentSelectedOption?.displayLabel || '');
      }
    }, [isFocused, currentSelectedOption]);

    useEffect(() => {
      setCurrentSelectedOption(selectedOption || null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
      if (isFocused) onInputChange(inputValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    useEffect(() => {
      setHoveredItemIndex(0);
    }, [options]);

    const handleOptionSelect = option => {
      setCurrentSelectedOption(option);
      onOptionSelect(option);
    };

    const handleInputKeyDown = event => {
      switch (event.keyCode) {
        // esc key
        case 27:
          event.preventDefault();
          event.stopPropagation();
          inputContainerReference.current.querySelector('input').blur();
          break;

        // enter key
        case 13:
          event.preventDefault();
          event.stopPropagation();
          if (inputValue && options?.length > 0 && options[hoveredItemIndex]) {
            handleOptionSelect(options[hoveredItemIndex]);
          } else if (
            inputValue &&
            (!options || (options.length === 0 && !isLoadingOptions))
          ) {
            onAddItemClick(inputValue);
          }
          break;

        // down arrow key
        case 40:
          event.preventDefault();
          event.stopPropagation();

          if (options?.length > 0) {
            setHoveredItemIndex(previousIndex => {
              let newIndex;
              if (previousIndex === options.length - 1) {
                newIndex = 0;
              } else {
                newIndex = previousIndex + 1;
              }

              if (listReference.current?.children?.[newIndex])
                listReference.current.children[newIndex].scrollIntoView(false);

              return newIndex;
            });
          }
          break;

        // up arrow key
        case 38:
          event.preventDefault();
          event.stopPropagation();

          if (options?.length > 0) {
            setHoveredItemIndex(previousIndex => {
              let newIndex;

              if (previousIndex === 0) {
                newIndex = options.length - 1;
              } else {
                newIndex = previousIndex - 1;
              }

              if (
                listReference.current?.children?.[newIndex] &&
                isOutsideScrollView(
                  listReference.current,
                  listReference.current?.children?.[newIndex],
                )
              ) {
                listReference.current.scrollTop =
                  listReference.current?.children?.[newIndex].offsetTop;
              }

              return newIndex;
            });
          }
          break;

        default:
          // do nothing
          break;
      }
    };

    const showAddRecordOption =
      typeof onAddItemClick === 'function' &&
      inputValue &&
      addItemEnabled &&
      !isLoadingOptions &&
      (!options || options.length === 0) &&
      currentSelectedOption?.displayLabel !== inputValue;

    return (
      <>
        <div ref={inputContainerReference}>
          <Input
            ref={reference}
            label={label}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            InputLabelProps={{
              shrink: true,
            }}
            parentType="select"
            inputProps={{
              autoComplete: 'off',
              value: inputValue,
              onChange: handleInputChange,
              onKeyDown: handleInputKeyDown,
            }}
            InputProps={{
              endAdornment: !disabled ? (
                <>
                  {currentSelectedOption?.displayLabel === inputValue && (
                    <AdornmentClear
                      onClick={() => {
                        if (clearOnSuccess) {
                          onClear(() => setCurrentSelectedOption(null));
                        } else {
                          onClear();
                          setCurrentSelectedOption(null);
                        }
                      }}
                    />
                  )}
                </>
              ) : null,
            }}
            onFocus={setIsFocused}
            onBlur={unsetIsFocused}
          />
        </div>
        {isFocused && inputValue && (
          <ListContainer
            ref={listReference}
            width={inputContainerReference?.current?.clientWidth || 300}
          >
            {!isLoadingOptions ? (
              <>
                {' '}
                {options?.length > 0
                  ? options.map((option, index) => (
                      <ListItem key={option.key}>
                        <ListItemButton
                          type="button"
                          isHovered={hoveredItemIndex === index}
                          onMouseDown={() => handleOptionSelect(option)}
                          onMouseEnter={() => setHoveredItemIndex(index)}
                        >
                          {typeof option.label === 'function'
                            ? option.label({ searchValue: inputValue })
                            : option.label}
                        </ListItemButton>
                      </ListItem>
                    ))
                  : null}
                {showAddRecordOption && (
                  <ListItem key="addRecordButton">
                    <AddRecordOption
                      handleAddRecord={() => onAddItemClick(inputValue)}
                      searchValue={inputValue}
                    />
                  </ListItem>
                )}
              </>
            ) : (
              <Grid container justify="center" alignItems="center">
                <Spacing vertical={3} />
                <Loader size={LoaderSizes.small} />
                <Spacing vertical={3} />
              </Grid>
            )}
          </ListContainer>
        )}
      </>
    );
  },
);

SelectDropdown.propTypes = {
  name: string.isRequired,
  label: string.isRequired,
  placeholder: string,
  disabled: bool,
  options: arrayOf(
    shape({
      key: string,
      label: oneOfType([node, func]),
      displayLabel: string,
      value: string,
    }),
  ),
  selectedOption: shape({
    key: string,
    label: func,
    displayLabel: string,
    value: string,
  }),
  isLoadingOptions: bool,
  onInputChange: func.isRequired,
  onOptionSelect: func.isRequired,
  onClear: func.isRequired,
  onAddItemClick: func,
  addItemEnabled: bool,
};

SelectDropdown.defaultProps = {
  placeholder: null,
  disabled: false,
  options: [],
  selectedOption: null,
  isLoadingOptions: false,
  onAddItemClick: null,
  addItemEnabled: true,
};
export default SelectDropdown;
