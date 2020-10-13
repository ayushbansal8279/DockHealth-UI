/* eslint-disable react/jsx-no-duplicate-props */
import { Divider } from '@material-ui/core';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import useBoolean from 'hooks/useBoolean';
import { RobotoTypography } from 'styles/theme';

import Datepicker from 'components/common/Datepicker/Datepicker';
import palette from 'styles/palette';
import DropdownInput from './NewTaskDrawer.DropdownInput';
import { AdornmentClear } from './NewTaskDrawer.Styled';
import { DueDateLabelContainer } from './NewTaskDrawer.DueDateSection.Styled';
import initializeDueDateSectionHooks from './NewTaskDrawer.DueDateSection.Hooks';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const DATE_US_FORMAT = 'MM/DD/YY';
const SET_DATE_VALUE = 'set-date';

const DueDateSection = ({
  selectedTask,
  isOverDue,
  setAutoSaveVisible,
  onTaskUpdate,
  dueTimeReference,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dateFieldName = 'dueDate';

  const reference = useRef(null);

  const inputReference = reference.current?.querySelector('input');

  const [isCalendarOpen, openCalendar, closeCalendar] = useBoolean(false);
  const popoverStateArray = useBoolean(false);
  const [initialMonthMomentValue, setInitialMonthMomentValue] = useState(null);

  const { setValue, watch } = useFormContext();

  const currentDueDate = watch(dateFieldName);
  const currentDueTime = dueTimeReference?.current?.value;

  const selectedTaskIdentifier = selectedTask?.taskIdentifier ?? null;

  const { saveDueDate, clearDueDate } = initializeDueDateSectionHooks({
    setAutoSaveVisible,
    setValue,
    onTaskUpdate,
  });

  useEffect(() => {
    closeCalendar();
  }, [closeCalendar, selectedTaskIdentifier]);

  const setDueDateValue = useCallback(
    async value => {
      setValue(dateFieldName, value);
      await saveDueDate({
        updatedDueDate: value,
        updatedDueTime: currentDueTime || '',
      });
      setAutoSaveVisible();

      setTimeout(() => {
        inputReference.focus();
      }, 150);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      closeCalendar,
      currentDueTime,
      saveDueDate,
      setAutoSaveVisible,
      setValue,
      inputReference,
    ],
  );

  const selectOption = useCallback(
    value => {
      if (value === 'calendar') return;

      if (value === SET_DATE_VALUE) {
        if (isCalendarOpen) {
          closeCalendar();
        } else {
          openCalendar();
        }
        inputReference.blur();
        setTimeout(() => {
          // a simple hack to reopen the Popover since it doesn't support scroll and needs to have everything displayed so as to re-position
          inputReference.focus();
        }, 100);
      } else {
        setValue(dateFieldName, value);
        saveDueDate({
          updatedDueDate: value,
          updatedDueTime: currentDueTime || '',
        });
        closeCalendar();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputReference, currentDueTime, saveDueDate],
  );

  const dueDateOptions = [
    {
      key: 'today',
      value: moment()
        .startOf('day')
        .format(DATE_ISO_FORMAT),
      label: isHovered => (
        <DueDateLabelContainer isHovered={isHovered}>
          <RobotoTypography condensed variant="h4">
            Today
          </RobotoTypography>
        </DueDateLabelContainer>
      ),
      displayLabel: moment()
        .startOf('day')
        .format(DATE_US_FORMAT),
    },
    {
      key: 'tomorrow',
      value: moment()
        .startOf('day')
        .add(1, 'day')
        .format(DATE_ISO_FORMAT),
      label: isHovered => (
        <DueDateLabelContainer isHovered={isHovered}>
          <RobotoTypography condensed variant="h4">
            Tomorrow
          </RobotoTypography>
        </DueDateLabelContainer>
      ),
      displayLabel: moment()
        .startOf('day')
        .add(1, 'day')
        .format(DATE_US_FORMAT),
    },
    {
      key: 'set-date',
      value: SET_DATE_VALUE,
      label: isHovered => (
        <DueDateLabelContainer isHovered={isHovered}>
          <RobotoTypography condensed variant="h4">
            Set date
          </RobotoTypography>
        </DueDateLabelContainer>
      ),
      displayLabel: 'Set date',
    },
  ];

  const options = [
    ...dueDateOptions,
    isCalendarOpen && {
      key: 'calendar',
      value: 'calendar',
      label: (
        <div>
          <Divider />
          <Datepicker
            onDateChange={setDueDateValue}
            selectedDate={currentDueDate ? moment(currentDueDate) : null}
            initialMonthMomentValue={initialMonthMomentValue}
            onMonthChange={nextMonthMomentValue => {
              setInitialMonthMomentValue(nextMonthMomentValue);
              setTimeout(() => {
                inputReference.focus();
              }, 100);
            }}
          />
        </div>
      ),
      displayLabel: '',
      disabled: true,
    },
  ].filter(Boolean);

  return (
    <DropdownInput
      ref={reference}
      name={dateFieldName}
      label="Due date"
      placeholder="Set a due date?"
      InputProps={{
        endAdornment:
          selectedTask && currentDueDate ? (
            <AdornmentClear onClick={clearDueDate} />
          ) : (
            ''
          ),
      }}
      inputProps={{
        value: currentDueDate
          ? moment(currentDueDate).format(DATE_US_FORMAT)
          : '',
        style: {
          color: isOverDue && palette.red,
        },
      }}
      selectOption={selectOption}
      popoverStateArray={popoverStateArray}
    >
      {options}
    </DropdownInput>
  );
};

export default DueDateSection;
