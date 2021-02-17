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
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const inputWrapperReference = useRef(null);
  const [options, setOptions] = useState([]);
  const [activeElementIndex, setActiveElementIndex] = useState(0);

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

  const { saveDueDate } = initializeDueDateSectionHooks({
    setAutoSaveVisible,
    onTaskUpdate,
  });

  const clearDueTime = async () => {
    setValue(DUE_TIME_FIELD_NAME, '');
    try {
      clearError(DUE_TIME_FIELD_NAME);
      await saveDueDate({
        updatedDueDate: dueDateValue,
        updatedDueTime: '',
      });
      setAutoSaveVisible();
    } catch {
      dispatch(
        AlertActions.showGlobalAlert(
          'Error updating due date and time, please try again later',
          'error',
        ),
      );
    }
  };

  const handleSaveDueTime = useCallback(
    (value, event) => {
      // eslint-disable-next-line no-unused-expressions
      event?.stopPropagation();
      // eslint-disable-next-line no-unused-expressions
      event?.preventDefault();

      if (
        !selectedTaskDueDateMoment.isValid() ||
        value !== selectedTaskDueDateMoment.format(TIME_12H_FORMAT)
      ) {
        if (!isDueTimeValid(value)) {
          setError(
            DUE_TIME_FIELD_NAME,
            'manual',
            'Time must be between 12:00 am and 11:59 pm and include am/pm',
          );
          return;
        }
        clearError(DUE_TIME_FIELD_NAME);
        setValue(DUE_TIME_FIELD_NAME, value);
        saveDueDate({
          updatedDueDate: dueDateValue,
          updatedDueTime: value,
        });
      }
      unsetFocused();
      // eslint-disable-next-line no-unused-expressions
      inputWrapperReference.current?.querySelector('input')?.blur();
    },
    [
      clearError,
      dueDateValue,
      saveDueDate,
      selectedTaskDueDateMoment,
      setError,
      setValue,
      unsetFocused,
    ],
  );

  const handleBlurEvent = useCallback(() => {
    if (isDueTimeInputEmpty(dueTimeValue) || !isDueTimeValid(dueTimeValue)) {
      resetDueTimeInput();
    } else {
      handleSaveDueTime(dueTimeValue);
    }
    unsetFocused();
  }, [dueTimeValue, handleSaveDueTime, resetDueTimeInput, unsetFocused]);

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
          onBlur={handleBlurEvent}
          onFocus={setFocused}
          onChange={event => {
            if (errors.dueTime) clearError(DUE_TIME_FIELD_NAME);
            setValue(DUE_TIME_FIELD_NAME, event.target?.value?.toLowerCase());
          }}
          onKeyDown={event =>
            event.key === 'Enter' && handleSaveDueTime(dueTimeValue, event)
          }
          isOverDue={isDueDateOverdue(dueDate)}
          isFocus={isFocused}
          autocomplete="off"
        />
        <AdornmentClear
          onClick={clearDueTime}
          style={{
            marginLeft: '20px',
            marginBottom: '2px',
          }}
        />
      </DueTimeInputMaskContainer>
      <InputPopover
        anchorElement={inputWrapperReference}
        isPopoverOpen={isFocused}
        closePopover={unsetFocused}
      >
        <TimeOptionsContainer>
          {options.map((option, index) => (
            <TimeOptionButton
              key={option}
              type="button"
              onMouseDown={() => handleSaveDueTime(option)}
              onMouseEnter={() => setActiveElementIndex(index)}
              isSelected={option === dueTimeValue}
              isActive={index === activeElementIndex}
              disabled={option === dueTimeValue}
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
