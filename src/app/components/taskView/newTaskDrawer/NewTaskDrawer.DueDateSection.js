/* eslint-disable react/jsx-no-duplicate-props */
import { Divider } from '@material-ui/core';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
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

const dueDateOptions = [
  {
    key: 'today',
    value: moment()
      .startOf('day')
      .format(DATE_ISO_FORMAT),
    label: (
      <DueDateLabelContainer>
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
    label: (
      <DueDateLabelContainer>
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
    label: (
      <DueDateLabelContainer>
        <RobotoTypography condensed variant="h4">
          Set date
        </RobotoTypography>
      </DueDateLabelContainer>
    ),
    displayLabel: 'Set date',
  },
];

const renderDropdownItem = ({
  openCalendar,
  closeCalendar,
  openPopover,
  closePopover,
  onItemSelection,
}) => ({ setValue }) => ({ label, value, disabled }) => (
  <div
    onClick={() => {
      if (disabled) return;

      if (value === SET_DATE_VALUE) {
        openCalendar();
        closePopover();
        setTimeout(() => {
          // a simple hack to reopen the Popover since it doesn't support scroll and needs to have everything displayed so as to re-position
          openPopover();
        }, 50);
      } else {
        setValue(value);
        onItemSelection(value);
        closePopover();
        closeCalendar();
      }
    }}
  >
    {label}
  </div>
);

const onItemSelection = ({ saveDueDate, currentDueTime }) => value => {
  saveDueDate({
    updatedDueDate: value,
    updatedDueTime: currentDueTime || '',
  });
};

const DueDateSection = ({
  selectedTask,
  isOverDue,
  setAutoSaveVisible,
  refreshList,
  shouldRefreshContext,
}) => {
  const dateFieldName = 'dueDate';
  const timeFieldName = 'dueTime';

  const [isCalendarOpen, openCalendar, closeCalendar] = useBoolean(false);
  const popoverStateArray = useBoolean(false);
  const openPopover = popoverStateArray[1];
  const closePopover = popoverStateArray[2];

  const { setValue, watch } = useFormContext();

  const currentDueDate = watch(dateFieldName);
  const currentDueTime = watch(timeFieldName);

  const selectedTaskIdentifier = selectedTask?.taskIdentifier ?? null;

  const { saveDueDate, clearDueDate } = initializeDueDateSectionHooks({
    setAutoSaveVisible,
    setValue,
    refreshList,
    shouldRefresh: shouldRefreshContext,
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
      closeCalendar();
      closePopover();
      setAutoSaveVisible();
    },
    [
      closeCalendar,
      closePopover,
      currentDueTime,
      saveDueDate,
      setAutoSaveVisible,
      setValue,
    ],
  );

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
          />
        </div>
      ),
      displayLabel: '',
      disabled: true,
    },
  ].filter(Boolean);

  return (
    <DropdownInput
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
          color: isOverDue ? palette.red : palette.black,
        },
      }}
      renderItem={renderDropdownItem({
        openCalendar,
        closeCalendar,
        openPopover,
        closePopover,
        onItemSelection: onItemSelection({ saveDueDate, currentDueTime }),
      })}
      popoverStateArray={popoverStateArray}
    >
      {options}
    </DropdownInput>
  );
};

export default DueDateSection;
