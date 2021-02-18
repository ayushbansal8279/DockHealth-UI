/* eslint-disable react/jsx-no-duplicate-props */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import * as AlertActions from 'alert/actions';
import { useFormContext } from 'react-hook-form';
import useBoolean from 'hooks/useBoolean';
import { isDueDateOverdue } from 'helpers/task-helpers';
import { isOutsideScrollView } from 'helpers/scroll-helper';
import initializeDueDateSectionHooks from './hooks';
import { AdornmentClear } from '../NewTaskDrawer.Styled';
import InputPopover from '../InputPopover/InputPopover';
import {
  DueTimeLabelContainer,
  DueTimeInputMaskContainer,
  DueTimeInputMask,
  DueTimeErrorMessage,
  TimeOptionsContainer,
  TimeOptionButton,
} from './styled';
import { TIME_12H_FORMAT } from '../NewTaskDrawer.Utilities';

const TIME_12H_FORMAT_REGULAR_EXPRESSION = /^(1[0-2]|0{0,1}[1-9]):([0-5]\d) [APap][Mm]$/;

function isDueTimeInputEmpty(value) {
  return !value || value === '' || value === '__:__ __';
}

function isDueTimeValid(value) {
  return TIME_12H_FORMAT_REGULAR_EXPRESSION.test(value);
}

function generateTimeOptions() {
  const TIME_FORMAT = 'hh:mm a';
  return new Array(24).fill().reduce((accumulator, currentValue, index) => {
    accumulator.push(moment({ hour: index }).format(TIME_FORMAT));
    accumulator.push(moment({ hour: index, minutes: 30 }).format(TIME_FORMAT));
    return accumulator;
  }, []);
}

const DueTimeInput = ({ dueDate, setAutoSaveVisible, onTaskUpdate }) => {
  const [isPopoverOpen, setIsPopoverOpen, unsetIsPopoverOpen] = useBoolean(
    false,
  );
  const inputWrapperReference = useRef(null);
  const optionsContainerReference = useRef(null);
  const [options, setOptions] = useState([]);
  const [activeElementIndex, setActiveElementIndex] = useState(null);

  const DUE_TIME_FIELD_NAME = 'dueTime';

  const dispatch = useDispatch();

  const {
    register,
    unregister,
    watch,
    setValue,
    errors,
    setError,
    clearError,
  } = useFormContext();

  const dueDateValue = watch('dueDate');
  const dueTimeValue = watch(DUE_TIME_FIELD_NAME);
  const selectedTaskDueDateMoment = useMemo(() => moment(dueDate || null), [
    dueDate,
  ]);

  const { saveDueDate } = initializeDueDateSectionHooks({
    setAutoSaveVisible,
    onTaskUpdate,
  });

  useEffect(() => {
    register(DUE_TIME_FIELD_NAME);
    setOptions(generateTimeOptions);

    return () => {
      unregister(DUE_TIME_FIELD_NAME);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetDueTimeInput = useCallback(() => {
    if (selectedTaskDueDateMoment.isValid()) {
      const taskDueTime = selectedTaskDueDateMoment.format(TIME_12H_FORMAT);
      if (taskDueTime === '00:00 am' || taskDueTime === '12:00 am') {
        setValue(DUE_TIME_FIELD_NAME, '');
        clearError(DUE_TIME_FIELD_NAME);
      } else {
        setValue(DUE_TIME_FIELD_NAME, taskDueTime);
      }
    } else {
      setValue(DUE_TIME_FIELD_NAME, '');
    }
  }, [clearError, selectedTaskDueDateMoment, setValue]);

  useEffect(() => {
    resetDueTimeInput();
  }, [resetDueTimeInput, dueDate]);

  const saveDueTime = useCallback(
    value => {
      if (
        !selectedTaskDueDateMoment.isValid() ||
        value !== selectedTaskDueDateMoment.format(TIME_12H_FORMAT)
      ) {
        if (!isDueTimeValid(value) && !isDueTimeInputEmpty(value)) {
          setError(
            DUE_TIME_FIELD_NAME,
            'manual',
            'Time must be between 12:00 am and 11:59 pm and include am/pm',
          );
          unsetIsPopoverOpen();
          return;
        }
        clearError(DUE_TIME_FIELD_NAME);
        setValue(DUE_TIME_FIELD_NAME, value);
        setActiveElementIndex(null);
        saveDueDate({
          updatedDueDate: dueDateValue,
          updatedDueTime: value,
        })
          .then(() => {})
          .catch(() => {
            dispatch(
              AlertActions.showGlobalErrorAlert(
                'Error updating due date and time, please try again later',
              ),
            );
          });
      }
    },
    [
      clearError,
      dispatch,
      dueDateValue,
      saveDueDate,
      selectedTaskDueDateMoment,
      setError,
      setValue,
      unsetIsPopoverOpen,
    ],
  );

  const handleInputBlur = useCallback(() => {
    if (isDueTimeInputEmpty(dueTimeValue) || !isDueTimeValid(dueTimeValue)) {
      resetDueTimeInput();
    } else {
      saveDueTime(dueTimeValue);
    }
    unsetIsPopoverOpen();
  }, [dueTimeValue, saveDueTime, resetDueTimeInput, unsetIsPopoverOpen]);

  const handleInputKeyDown = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    event => {
      switch (event.key) {
        case 'Escape':
          resetDueTimeInput();
          unsetIsPopoverOpen();
          setActiveElementIndex(null);
          break;

        case 'Enter':
          event.preventDefault();
          event.stopPropagation();
          if (
            (!isDueTimeValid(dueTimeValue) ||
              isDueTimeInputEmpty(dueTimeValue)) &&
            activeElementIndex === null
          ) {
            setError(
              DUE_TIME_FIELD_NAME,
              'manual',
              'Time must be between 12:00 am and 11:59 pm and include am/pm',
            );
          } else if (activeElementIndex !== null) {
            setValue(DUE_TIME_FIELD_NAME, options[activeElementIndex]);
            setActiveElementIndex(null);
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
            setValue(DUE_TIME_FIELD_NAME, options[newIndex]);
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
            setValue(DUE_TIME_FIELD_NAME, options[newIndex]);
            return newIndex;
          });
          break;

        default:
          break;
      }
    },
    [
      activeElementIndex,
      dueTimeValue,
      isPopoverOpen,
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
      const newValue = event.target?.value?.toLowerCase();
      if (errors.dueTime) clearError(DUE_TIME_FIELD_NAME);
      if (!isPopoverOpen) setIsPopoverOpen();
      setValue(DUE_TIME_FIELD_NAME, newValue);
      const foundOptionIndex = !isDueTimeInputEmpty(newValue)
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
      errors.dueTime,
      isPopoverOpen,
      options,
      setIsPopoverOpen,
      setValue,
    ],
  );

  return (
    <div>
      <DueTimeLabelContainer>DUE TIME (00:00 am/pm)</DueTimeLabelContainer>
      <DueTimeInputMaskContainer
        ref={inputWrapperReference}
        hasError={!!errors.dueTime}
      >
        <DueTimeInputMask
          name="dueTime"
          mask="19:59 am"
          maskChar="_"
          formatChars={{
            '1': '[0-1]',
            '5': '[0-5]',
            '9': '[0-9]',
            a: '[APap]',
            m: '[Mm]',
          }}
          value={dueTimeValue}
          placeholder="00:00 am"
          alwaysShowMask
          onBlur={handleInputBlur}
          onFocus={setIsPopoverOpen}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          isOverDue={isDueDateOverdue(dueDate)}
          autocomplete="off"
        />
        <AdornmentClear
          onClick={() => {
            saveDueTime('');
          }}
          style={{
            marginLeft: '20px',
            marginBottom: '2px',
          }}
        />
      </DueTimeInputMaskContainer>
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
                setValue(DUE_TIME_FIELD_NAME, option);
                unsetIsPopoverOpen();
              }}
              onMouseEnter={() => setActiveElementIndex(index)}
              isActive={index === activeElementIndex}
            >
              {option}
            </TimeOptionButton>
          ))}
        </TimeOptionsContainer>
      </InputPopover>
      {errors?.dueTime?.message && (
        <DueTimeErrorMessage>{errors.dueTime.message}</DueTimeErrorMessage>
      )}
    </div>
  );
};

export default DueTimeInput;
