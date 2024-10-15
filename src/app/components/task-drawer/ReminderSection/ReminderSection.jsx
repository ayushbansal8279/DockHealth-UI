import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { isDueDateOverdue, ReminderType } from 'helpers/task-helpers';
import { useBoolean } from 'hooks/useBoolean';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import TimeDropdownInput from 'components/common/TimeDropdownInput/TimeDropdownInput';
import SecondaryDropdownInput from 'components/common/DropdownInput/SecondaryDropdownInput';
import ArrowIcon from 'img/arrow.svg';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import { ReminderContainer, Description, SelectArrowImg, StyledPopover, DateViewText, DateViewContainer } from './styled';
import {
  REMINDER_TYPE_FIELD_NAME,
  REMINDER_TIME_FIELD_NAME,
  REMINDER_TYPE_OPTIONS,
} from './helpers';
import PopoverCard from 'components/common/PopoverCard/PopoverCard';
import DatePicker from 'components/task/DatePicker/DatePicker';
import ReminderDatePicker from './ReminderDatePicker';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ReminderSection = ({ onSave, disabled, selectedTask }) => {
  const { reminderType, reminderTime = null, dueDate, reminderDt } = selectedTask || {};
  const reminderDate = moment(reminderDt);
  const isDisabled = !dueDate;
  const reminderTypeDropdownReference = useRef(null);
  const formMethods = useForm();
  const { register, setValue, watch } = formMethods;
  const [reminderTypeValue, setReminderTypeValue] = useState(reminderType);
  const [reminderTypeCustomDate, setReminderTypeCustomDate] = useState(false);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const buttonReference = useRef(null);
  const reminderDateRef = useRef(null);

  useEffect(() => {
    setValue(REMINDER_TYPE_FIELD_NAME, reminderType);
    setValue(REMINDER_TIME_FIELD_NAME, reminderTime);
    setReminderTypeValue(reminderType);
    if (reminderType === ReminderType.ABSOLUTE) {
      setReminderTypeCustomDate(true);
    }
  }, [reminderTime, reminderType, setValue, setReminderTypeValue]);

  const isTaskDueDateOverdue = isDueDateOverdue(selectedTask);

  const reminderIsOn = reminderTypeValue
    ? reminderTypeValue !== ReminderType.NONE
    : reminderType && reminderTypeValue !== ReminderType.NONE;

  const sectionDisabled = isDisabled || !reminderIsOn || isTaskDueDateOverdue;

  const reminderChecked = reminderIsOn && !isTaskDueDateOverdue;

  const isCheckboxDisabled = isDisabled || isTaskDueDateOverdue;

  const handleToggleReminder = useCallback(() => {
    if (isDisabled) return;

    if (!reminderTypeValue || reminderTypeValue === ReminderType.NONE) {
      const defaultType = ReminderType.DAY_OF;
      const defaultTime = null;

      setReminderTypeValue(defaultType);
      setValue(REMINDER_TYPE_FIELD_NAME, defaultType);
      setValue(REMINDER_TIME_FIELD_NAME, defaultTime);
      onSave({ reminderType: defaultType, reminderTime: defaultTime });
    } else {
      setReminderTypeValue(ReminderType.NONE);
      setValue(REMINDER_TYPE_FIELD_NAME, ReminderType.NONE);
      setValue(REMINDER_TIME_FIELD_NAME, null);
      onSave({ reminderType: ReminderType.NONE, reminderTime: null });
    }
  }, [onSave, reminderTypeValue, setValue, setReminderTypeValue, isDisabled]);

  const handleSelectReminderDate = useCallback((value) => {
    onSave({ reminderType: ReminderType.ABSOLUTE, reminderDt: value });
    setReminderTypeCustomDate(true);
  },
    [onSave, setReminderTypeCustomDate],
  );

  const selectReminderTime = useCallback((value) => {
    onSave({ reminderType: ReminderType.ABSOLUTE, reminderTime: value });
    setReminderTypeCustomDate(true);
  },
    [onSave, setReminderTypeCustomDate],
  );

  const close = () => {
    closePopover();
  }

  const handleSelectReminderType = useCallback(
    (value) => {
      setValue(REMINDER_TYPE_FIELD_NAME, value);
      if (value === ReminderType.DAY_OF) {
        setReminderTypeCustomDate(false);
        const defaultTime = undefined;
        setReminderTypeValue(value);
        setValue(REMINDER_TIME_FIELD_NAME, defaultTime);
        onSave({ reminderType: value, reminderTime: defaultTime });
      } else if (value === ReminderType.ABSOLUTE) {
        openPopover(true);
        setReminderTypeValue(value);
        onSave({ reminderType: value });
      }
      else {
        onSave({ reminderType: value });
        setReminderTypeCustomDate(false);
      }
    },
    [onSave, setValue, setReminderTypeValue],
  );

  const handleSelectReminderTime = useCallback(
    (value) => {
      setValue(REMINDER_TIME_FIELD_NAME, value);
      onSave({ reminderTime: value });
    },
    [onSave, setValue],
  );

  const validateReminderTime = useCallback(
    (newValue) => {
      const momentDueDate = moment(dueDate);

      if (
        reminderType === ReminderType.DAY_OF &&
        !(momentDueDate.hour() === 0 && momentDueDate.minute() === 0)
      ) {
        const momentReminderTime = moment(newValue, TIME_12H_FORMAT);
        const reminderMoment = momentDueDate
          .clone()
          .set('hour', momentReminderTime.hour())
          .set('minute', momentReminderTime.minute());

        if (reminderMoment.isAfter(momentDueDate)) {
          throw new Error('Past task due time');
        }
      }
      return true;
    },
    [dueDate, reminderType],
  );

  return (
    <FormProvider {...formMethods}>
      <ReminderContainer ref={reminderDateRef}>
        <Checkbox
          isDisabled={isCheckboxDisabled || disabled}
          isChecked={reminderChecked ?? false}
          onClick={handleToggleReminder}
          size={14}
          ref={buttonReference}
        />
        <Spacing horizontal={3} />
        <Description isDisabled={sectionDisabled}>Reminder</Description>
        <Spacing horizontal={3} />
        {!sectionDisabled && (
          <>
            <SecondaryDropdownInput
              name={REMINDER_TYPE_FIELD_NAME}
              value={watch(REMINDER_TYPE_FIELD_NAME)}
              placeholder="--"
              onSelect={handleSelectReminderType}
              disabled={sectionDisabled}
              width={145}
              // height={145}
              options={REMINDER_TYPE_OPTIONS}
              {...register(REMINDER_TYPE_FIELD_NAME)}
              ref={reminderTypeDropdownReference}
            />
            <StyledPopover
              anchorEl={reminderDateRef?.current}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{ marginLeft: '103px' }}
              open={isPopoverOpen}
              onClose={(event) => {
                event.stopPropagation();
                closePopover();
              }}
              width="auto"
            >
              {isPopoverOpen && (
                <PopoverCard>
                  <Box width="auto" minWidth={buttonReference.current?.offsetWidth}>
                    {/* <DatePicker selectedDate={reminderDt} onDateChange={handleSelectReminderDate} onCloseClick={closePopover} /> */}
                    <ReminderDatePicker selectedDate={reminderDt} onDateChange={handleSelectReminderDate} onCloseClick={closePopover} onTimeChange={selectReminderTime} />
                  </Box>
                </PopoverCard>
              )}
            </StyledPopover>
            {reminderTypeCustomDate && (
              <>
                <Spacing horizontal={3} />
                <DateViewContainer >
                  <DateViewText ref={buttonReference}
                    onClick={(event) => {
                      event.stopPropagation();
                      openPopover(true);
                    }}>
                    {reminderDate.format('MMM DD, YYYY')}
                  </DateViewText>
                </DateViewContainer>
                <Spacing horizontal={3} />
                <Description>at</Description>
                <DateViewContainer >
                  <DateViewText ref={buttonReference}
                    onClick={(event) => {
                      event.stopPropagation();
                      openPopover(true);
                    }}>
                    {reminderTime}
                  </DateViewText>
                </DateViewContainer>
              </>)}
            {!reminderTypeCustomDate &&
              <>
                <Spacing horizontal={2} />
                <Description>at</Description>
                <Spacing horizontal={2} />
                <TimeDropdownInput
                  type="secondary"
                  savedValue={reminderTime}
                  value={watch(REMINDER_TIME_FIELD_NAME)}
                  onValueChange={(newValue) =>
                    setValue(REMINDER_TIME_FIELD_NAME, newValue)
                  }
                  onSave={handleSelectReminderTime}
                  disabled={sectionDisabled}
                  endAdornment={<SelectArrowImg src={ArrowIcon} alt="arrow" />}
                  validate={validateReminderTime}
                />
              </>
            }
          </>
        )}
      </ReminderContainer>
    </FormProvider>
  );
};

export default ReminderSection;
