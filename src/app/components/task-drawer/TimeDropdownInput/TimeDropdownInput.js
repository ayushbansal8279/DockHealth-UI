/* eslint-disable react/jsx-no-duplicate-props */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { bool, func, node, oneOf, string } from 'prop-types';
import useBoolean from 'hooks/useBoolean';
import { isOutsideScrollView } from 'helpers/scroll-helper';
import { AdornmentClear } from '../styled';
import InputPopover from '../InputPopover/InputPopover';
import {
  TimeDropdownContainer,
  TimeLabelContainer,
  TimeInputMaskContainer,
  TimeInputMask,
  TimeErrorMessage,
  TimeOptionsContainer,
  TimeOptionButton,
  EndAdornmentContainer,
} from './styled';
import { generateTimeOptions, isTimeInputEmpty, isTimeValid } from './helpers';

const TimeDropdownInput = ({
  type,
  label,
  disabled,
  error,
  savedValue,
  value,
  onValueChange,
  onSave,
  endAdornment,
  validate,
  hideError,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [isPopoverOpen, setIsPopoverOpen, unsetIsPopoverOpen] = useBoolean(
    false,
  );
  const inputWrapperReference = useRef(null);
  const optionsContainerReference = useRef(null);
  const [options, setOptions] = useState([]);
  const [activeElementIndex, setActiveElementIndex] = useState(null);

  const [timeInternalValue, setTimeInternalValue] = useState(savedValue);
  const [timeError, setTimeError] = useState(null);

  const timeValue = value !== undefined ? value : timeInternalValue;
  const setTimeValue = useMemo(
    () => (onValueChange !== undefined ? onValueChange : setTimeInternalValue),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    setOptions(generateTimeOptions);
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
        setTimeValue('');
      } else {
        setTimeValue(savedValue);
      }
    } else {
      setTimeValue('');
    }
    setTimeError(null);
  }, [savedValue, setTimeValue]);

  useEffect(() => {
    resetDueTimeInput();
  }, [resetDueTimeInput]);

  const validateInput = useCallback(
    inputValue => {
      if (!isTimeValid(inputValue) && !isTimeInputEmpty(inputValue)) {
        setTimeError(
          'Time must be between 12:00 am and 11:59 pm and include am/pm',
        );
        unsetIsPopoverOpen();
        return false;
      }

      if (typeof validate === 'function') {
        try {
          validate(inputValue);
        } catch (error_) {
          setTimeError(error_.message || '');
          return false;
        }
      }

      return true;
    },
    [unsetIsPopoverOpen, validate],
  );

  const saveTime = useCallback(
    inputValue => {
      if (inputValue !== savedValue && validateInput(inputValue)) {
        setTimeError(null);
        setTimeValue(inputValue);
        setActiveElementIndex(null);
        onSave(inputValue);
      }
    },
    [onSave, savedValue, setTimeValue, validateInput],
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
          if (activeElementIndex !== null && isPopoverOpen) {
            setTimeValue(options[activeElementIndex]);
            setActiveElementIndex(null);
            moveCursorToEnd();
          } else if (validateInput(timeValue)) {
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
            setTimeValue(options[newIndex]);
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
            setTimeValue(options[newIndex]);
            return newIndex;
          });
          break;

        default:
          break;
      }
    },
    [
      resetDueTimeInput,
      unsetIsPopoverOpen,
      moveCursorToEnd,
      activeElementIndex,
      isPopoverOpen,
      validateInput,
      timeValue,
      setIsPopoverOpen,
      setTimeValue,
      options,
    ],
  );

  const handleInputChange = useCallback(
    event => {
      const newValue = event.target?.value?.toUpperCase();
      if (timeError) setTimeError(null);
      if (!isPopoverOpen) setIsPopoverOpen();
      setTimeValue(newValue);
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
    [isPopoverOpen, options, setIsPopoverOpen, setTimeValue, timeError],
  );

  return (
    <TimeDropdownContainer>
      {label && <TimeLabelContainer>{label}</TimeLabelContainer>}
      <TimeInputMaskContainer
        type={type}
        ref={inputWrapperReference}
        hasError={!!timeError}
      >
        <TimeInputMask
          type={type}
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
          error={error || timeError}
          autoComplete="off"
          disabled={disabled}
        />
        {endAdornment ? (
          <EndAdornmentContainer>{endAdornment}</EndAdornmentContainer>
        ) : (
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
                setTimeValue(option);
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
      {!hideError && timeError && (
        <TimeErrorMessage type={type}>{timeError}</TimeErrorMessage>
      )}
    </TimeDropdownContainer>
  );
};

TimeDropdownInput.propTypes = {
  type: oneOf(['primary', 'secondary']),
  label: string,
  disabled: bool,
  error: bool,
  savedValue: string.isRequired,
  onSave: func.isRequired,
  endAdornment: node,
  validate: func,
};

TimeDropdownInput.defaultProps = {
  type: 'primary',
  label: null,
  disabled: false,
  error: false,
  endAdornment: null,
  validate: null,
};

export default TimeDropdownInput;
