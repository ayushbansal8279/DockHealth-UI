/* eslint-disable react/jsx-no-duplicate-props */
import { Divider } from '@material-ui/core';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import useBoolean from 'hooks/useBoolean';
import { RobotoTypography } from 'styles/theme';

import Calendar from './NewTaskDrawer.Calendar';
import DropdownInput from './NewTaskDrawer.DropdownInput';
import { DueDateLabelContainer } from './NewTaskDrawer.DueDateSection.Styled';
import { AdornmentContainer } from './NewTaskDrawer.Styled';

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
        closePopover();
        closeCalendar();
      }
    }}
  >
    {label}
  </div>
);

const DueDateSection = ({ selectedTask }) => {
  const dateFieldName = 'dueDate';

  const [isCalendarOpen, openCalendar, closeCalendar] = useBoolean(false);
  const popoverStateArray = useBoolean(false);
  const openPopover = popoverStateArray[1];
  const closePopover = popoverStateArray[2];

  const { setValue, watch } = useFormContext();

  const currentDueDate = watch(dateFieldName);

  const selectedTaskIdentifier = useSelector(
    store => store.taskState.selectedTask?.taskIdentifier ?? null,
  );

  useEffect(() => {
    closeCalendar();
  }, [closeCalendar, selectedTaskIdentifier]);

  const setDueDateValue = useCallback(
    value => {
      setValue(dateFieldName, value);
      closeCalendar();
      closePopover();
    },
    [closeCalendar, closePopover, setValue],
  );

  const options = [
    ...dueDateOptions,
    isCalendarOpen && {
      key: 'calendar',
      value: 'calendar',
      label: (
        <div>
          <Divider />
          <Calendar dateFieldName={dateFieldName} setDate={setDueDateValue} />
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
        startAdornment:
          selectedTask && selectedTask.dueDate != null ? (
            ''
          ) : (
            <AdornmentContainer>+</AdornmentContainer>
          ),
      }}
      inputProps={{
        value: currentDueDate
          ? moment(currentDueDate).format(DATE_US_FORMAT)
          : '',
      }}
      renderItem={renderDropdownItem({
        openCalendar,
        closeCalendar,
        openPopover,
        closePopover,
      })}
      popoverStateArray={popoverStateArray}
    >
      {options}
    </DropdownInput>
  );
};

export default DueDateSection;
