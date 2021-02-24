import React, { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';
import { isDueDateOverdue } from 'helpers/task-helpers';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import ArrowIcon from 'img/arrow';
import {
  ReminderContainer,
  Description,
  SelectArrowImg,
  useReminderTypeInputStyles,
  useReminderTypeTextFieldStyles,
} from './styled';
import {
  ReminderType,
  REMINDER_TYPE_FIELD_NAME,
  REMINDER_TIME_FIELD_NAME,
  getDefaultReminderTime,
  generateReminderTypeSelectOptions,
} from './helpers';
import DropdownInput from '../NewTaskDrawer.DropdownInput';
import TimeDropdownInput from '../TimeDropdownInput/TimeDropdownInput';
import { TIME_12H_FORMAT } from '../helpers';

const ReminderSection = ({ selectedTask, isDisabled, onSave }) => {
  const { reminderType, reminderTime, dueDate } = selectedTask || {};

  const reminderTypeDropdownReference = useRef(null);
  const { register, unregister, setValue } = useFormContext();
  const [reminderTypeOptions, setReminderTypeOptions] = useState([]);
  const [reminderTypeValue, setReminderTypeValue] = useState(reminderType);

  const reminderTypeInputClasses = useReminderTypeInputStyles();
  const reminderTypeTextFieldClasses = useReminderTypeTextFieldStyles();

  useEffect(() => {
    setReminderTypeOptions(generateReminderTypeSelectOptions);
    register(REMINDER_TYPE_FIELD_NAME);
    register(REMINDER_TIME_FIELD_NAME);

    return () => {
      unregister(REMINDER_TYPE_FIELD_NAME);
      unregister(REMINDER_TIME_FIELD_NAME);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(REMINDER_TYPE_FIELD_NAME, reminderType);
    setValue(REMINDER_TIME_FIELD_NAME, reminderTime);
    setReminderTypeValue(reminderType);
  }, [reminderTime, reminderType, setValue, setReminderTypeValue]);

  const isTaskDueDateOverdue = isDueDateOverdue(dueDate);

  const reminderIsOn =
    reminderTypeValue && reminderTypeValue !== ReminderType.NONE;

  const sectionDisabled = isDisabled || !reminderIsOn || isTaskDueDateOverdue;

  const reminderChecked = reminderIsOn && !isTaskDueDateOverdue;

  const isCheckboxDisabled = isDisabled || isTaskDueDateOverdue;

  const handleToggleReminder = useCallback(() => {
    if (isDisabled) return;

    if (!reminderTypeValue || reminderTypeValue === ReminderType.NONE) {
      const defaultType = ReminderType.DAY_OF;
      const defaultTime = getDefaultReminderTime(dueDate);

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
  }, [
    dueDate,
    onSave,
    reminderTypeValue,
    setValue,
    setReminderTypeValue,
    isDisabled,
  ]);

  const handleSelectReminderType = useCallback(
    value => {
      setValue(REMINDER_TYPE_FIELD_NAME, value);
      if (value === ReminderType.DAY_OF) {
        const defaultTime = getDefaultReminderTime(dueDate);
        setReminderTypeValue(value);
        setValue(REMINDER_TIME_FIELD_NAME, defaultTime);
        onSave({ reminderType: value, reminderTime: defaultTime });
      } else {
        onSave({ reminderType: value });
      }
    },
    [dueDate, onSave, setValue, setReminderTypeValue],
  );

  const handleSelectReminderTime = useCallback(
    value => {
      setValue(REMINDER_TIME_FIELD_NAME, value);
      onSave({ reminderTime: value });
    },
    [onSave, setValue],
  );

  const validateReminderTime = useCallback(
    newValue => {
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
    <ReminderContainer>
      <Checkbox
        isDisabled={isCheckboxDisabled}
        isChecked={reminderChecked}
        onClick={handleToggleReminder}
      />
      <Spacing horizontal={4} />
      <Description isDisabled={sectionDisabled}>Reminder</Description>
      <Spacing horizontal={4} />
      {!sectionDisabled && (
        <DropdownInput
          ref={reminderTypeDropdownReference}
          name={REMINDER_TYPE_FIELD_NAME}
          placeholder="--"
          InputProps={{
            endAdornment: <SelectArrowImg src={ArrowIcon} alt="arrow" />,
            classes: reminderTypeInputClasses,
          }}
          textFieldClasses={reminderTypeTextFieldClasses}
          onSelect={handleSelectReminderType}
          disabled={sectionDisabled}
        >
          {reminderTypeOptions}
        </DropdownInput>
      )}
      <Spacing horizontal={3} />
      {!sectionDisabled && <Description>at</Description>}
      <Spacing horizontal={3} />
      {!sectionDisabled && (
        <TimeDropdownInput
          type="secondary"
          name="reminderTime"
          savedValue={reminderTime}
          onSave={handleSelectReminderTime}
          disabled={sectionDisabled}
          // isHidden={sectionDisabled}
          endAdornment={<SelectArrowImg src={ArrowIcon} alt="arrow" />}
          validate={validateReminderTime}
        />
      )}
    </ReminderContainer>
  );
};

export default ReminderSection;
