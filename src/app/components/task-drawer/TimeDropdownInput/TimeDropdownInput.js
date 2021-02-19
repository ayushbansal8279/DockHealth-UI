/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { bool, func, node, oneOf, string } from 'prop-types';
import { useFormContext } from 'react-hook-form';
import useBoolean from 'hooks/useBoolean';
import { isOutsideScrollView } from 'helpers/scroll-helper';
import { AdornmentClear } from '../NewTaskDrawer.Styled';
import InputPopover from '../InputPopover/InputPopover';
import {
  TimeLabelContainer,
  TimeInputMaskContainer,
  TimeInputMask,
  TimeErrorMessage,
  TimeOptionsContainer,
  TimeOptionButton,
} from './styled';
import { generateTimeOptions, isTimeInputEmpty, isTimeValid } from './helpers';

const TimeDropdownInput = ({
  type,
  name,
  label,
  disabled,
  error,
  savedValue,
  onSave,
  endAdornment,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [isPopoverOpen, setIsPopoverOpen, unsetIsPopoverOpen] = useBoolean(
    false,
  );
  const inputWrapperReference = useRef(null);
  const optionsContainerReference = useRef(null);
  const [options, setOptions] = useState([]);
  const [activeElementIndex, setActiveElementIndex] = useState(null);

  const {
    register,
    unregister,
    watch,
    setValue,
    errors,
    setError,
    clearError,
  } = useFormContext();

  const timeValue = watch(name);

  useEffect(() => {
    register(name);
    setOptions(generateTimeOptions);

    return () => {
      unregister(name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveCursorToEnd = useCallback(() => {
    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      inputWrapperReference.current
        ?.querySelector('input')
        .setSelectionRange(timeValue?.length, timeValue?.length);
    }, 0);
  }, [timeValue]);

  const resetDueTimeInput = useCallback(() => {
    if (savedValue) {
      if (savedValue === '00:00 AM' || savedValue === '12:00 AM') {
        setValue(name, '');
        clearError(name);
      } else {
        setValue(name, savedValue);
      }
    } else {
      setValue(name, '');
    }
  }, [clearError, name, savedValue, setValue]);

  useEffect(() => {
    resetDueTimeInput();
  }, [resetDueTimeInput]);

  const saveTime = useCallback(
    value => {
      if (value !== savedValue) {
        if (!isTimeValid(value) && !isTimeInputEmpty(value)) {
          setError(
            name,
            'manual',
            'Time must be between 12:00 am and 11:59 pm and include am/pm',
          );
          unsetIsPopoverOpen();
          return;
        }
        clearError(name);
        setValue(name, value);
        setActiveElementIndex(null);
        onSave(value);
      }
    },
    [
      clearError,
      name,
      onSave,
      savedValue,
      setError,
      setValue,
      unsetIsPopoverOpen,
    ],
  );

  const handleInputBlur = useCallback(() => {
    if (isTimeInputEmpty(timeValue) || !isTimeValid(timeValue)) {
      resetDueTimeInput();
    } else {
      saveTime(timeValue);
    }
    unsetIsPopoverOpen();
  }, [timeValue, saveTime, resetDueTimeInput, unsetIsPopoverOpen]);

  const handleInputKeyDown = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    event => {
      switch (event.key) {
        case 'Escape':
          resetDueTimeInput();
          unsetIsPopoverOpen();
          setActiveElementIndex(null);
          moveCursorToEnd();
          break;

        case 'Enter':
          event.preventDefault();
          event.stopPropagation();
          if (
            (!isTimeValid(timeValue) || isTimeInputEmpty(timeValue)) &&
            activeElementIndex === null
          ) {
            setError(
              name,
              'manual',
              'Time must be between 12:00 am and 11:59 pm and include am/pm',
            );
          } else if (activeElementIndex !== null && isPopoverOpen) {
            setValue(name, options[activeElementIndex]);
            setActiveElementIndex(null);
            moveCursorToEnd();
          } else {
            // eslint-disable-next-line no-unused-expressions
            event.target?.blur();
          }
          unsetIsPopoverOpen();
          break;

        case 'ArrowDown':
          event.preventDefault();
          event.stopPropagation();
          if (!isPopoverOpen) setIsPopoverOpen();
          setActiveElementIndex(selectedIndex => {
            const newIndex =
              selectedIndex === options.length - 1 || selectedIndex == null
                ? 0
                : selectedIndex + 1;

            if (
              optionsContainerReference.current?.children?.[newIndex] &&
              isOutsideScrollView(
                optionsContainerReference.current,
                optionsContainerReference.current?.children?.[newIndex],
              )
            ) {
              // eslint-disable-next-line no-unused-expressions
              optionsContainerReference.current.children[
                newIndex
              ]?.scrollIntoView(false);
            }
            setValue(name, options[newIndex]);
            return newIndex;
          });
          break;

        case 'ArrowUp':
          event.preventDefault();
          event.stopPropagation();
          if (!isPopoverOpen) setIsPopoverOpen();
          setActiveElementIndex(selectedIndex => {
            const newIndex =
              selectedIndex === 0 || selectedIndex === null
                ? options.length - 1
                : selectedIndex - 1;
            if (
              optionsContainerReference.current?.children?.[newIndex] &&
              isOutsideScrollView(
                optionsContainerReference.current,
                optionsContainerReference.current?.children?.[newIndex],
              )
            ) {
              optionsContainerReference.current.scrollTop =
                optionsContainerReference.current?.children?.[newIndex]
                  ?.offsetTop || 0;
            }
            setValue(name, options[newIndex]);
            return newIndex;
          });
          break;

        default:
          break;
      }
    },
    [
      activeElementIndex,
      timeValue,
      isPopoverOpen,
      moveCursorToEnd,
      name,
      options,
      resetDueTimeInput,
      setError,
      setIsPopoverOpen,
      setValue,
      unsetIsPopoverOpen,
    ],
  );

  const handleInputChange = useCallback(
    event => {
      const newValue = event.target?.value;
      if (errors[name]) clearError(name);
      if (!isPopoverOpen) setIsPopoverOpen();
      setValue(name, newValue);
      const foundOptionIndex = !isTimeInputEmpty(newValue)
        ? options.findIndex(option => option.startsWith(newValue.split('_')[0]))
        : -1;
      setActiveElementIndex(foundOptionIndex === -1 ? null : foundOptionIndex);
      if (
        foundOptionIndex !== -1 &&
        isOutsideScrollView(
          optionsContainerReference.current,
          optionsContainerReference.current?.children?.[foundOptionIndex],
        )
      ) {
        optionsContainerReference.current.scrollTop =
          optionsContainerReference.current?.children?.[
            foundOptionIndex
          ].offsetTop;
      }
    },
    [
      clearError,
      errors,
      isPopoverOpen,
      name,
      options,
      setIsPopoverOpen,
      setValue,
    ],
  );

  return (
    <div>
      {label && <TimeLabelContainer>{label}</TimeLabelContainer>}
      <TimeInputMaskContainer
        type={type}
        ref={inputWrapperReference}
        hasError={!!errors[name]}
      >
        <TimeInputMask
          type={type}
          name={name}
          mask="19:59 am"
          maskChar="_"
          formatChars={{
            '1': '[0-1]',
            '5': '[0-5]',
            '9': '[0-9]',
            a: '[APap]',
            m: '[Mm]',
          }}
          value={(timeValue || '').toLowerCase()}
          alwaysShowMask
          onBlur={handleInputBlur}
          onFocus={setIsPopoverOpen}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          error={error}
          autocomplete="off"
          disabled={disabled}
        />
        {endAdornment || (
          <AdornmentClear
            onClick={() => {
              if (!disabled) saveTime('');
            }}
            disabled={disabled}
            style={{
              marginLeft: '20px',
              marginBottom: '2px',
            }}
          />
        )}
      </TimeInputMaskContainer>
      <InputPopover
        anchorElement={inputWrapperReference}
        isPopoverOpen={isPopoverOpen}
        closePopover={unsetIsPopoverOpen}
      >
        <TimeOptionsContainer ref={optionsContainerReference}>
          {options.map((option, index) => (
            <TimeOptionButton
              key={option}
              type="button"
              onMouseDown={event => {
                event.preventDefault();
                setValue(name, option);
                unsetIsPopoverOpen();
                moveCursorToEnd();
              }}
              onMouseEnter={() => setActiveElementIndex(index)}
              isActive={index === activeElementIndex}
            >
              {option?.toLowerCase()}
            </TimeOptionButton>
          ))}
        </TimeOptionsContainer>
      </InputPopover>
      {errors?.[name]?.message && (
        <TimeErrorMessage>{errors[name].message}</TimeErrorMessage>
      )}
    </div>
  );
};

TimeDropdownInput.propTypes = {
  type: oneOf(['primary', 'secondary']),
  name: string.isRequired,
  label: string,
  disabled: bool,
  error: bool,
  savedValue: string.isRequired,
  onSave: func.isRequired,
  endAdornment: node,
};

TimeDropdownInput.defaultProps = {
  type: 'primary',
  label: null,
  disabled: false,
  error: false,
  endAdornment: null,
};

export default TimeDropdownInput;
