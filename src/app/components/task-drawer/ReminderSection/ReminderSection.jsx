import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
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

const ReminderSection = ({
  reminderType,
  reminderTime,
  dueDate,
  isDisabled,
}) => {
  const reminderTypeDropdownReference = useRef(null);
  const { register, unregister, setValue, watch } = useFormContext();
  const [reminderTypeOptions, setReminderTypeOptions] = useState([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminderTime, reminderType]);

  const reminderTypeValue = watch(REMINDER_TYPE_FIELD_NAME);

  const reminderIsOn =
    reminderTypeValue && reminderTypeValue !== ReminderType.NONE;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveReminders = useCallback((type, time) => {}, []);

  const handleToggleReminder = useCallback(() => {
    if (!reminderTypeValue || reminderTypeValue === ReminderType.NONE) {
      const defaultType = ReminderType.DAY_BEFORE_1;
      const defaultTime = getDefaultReminderTime(dueDate);

      setValue(REMINDER_TYPE_FIELD_NAME, defaultType);
      setValue(REMINDER_TIME_FIELD_NAME, defaultTime);
      saveReminders(defaultType, defaultTime);
    } else {
      setValue(REMINDER_TYPE_FIELD_NAME, ReminderType.NONE);
      setValue(REMINDER_TIME_FIELD_NAME, null);
      saveReminders(ReminderType.NONE, null);
    }
  }, [dueDate, reminderTypeValue, saveReminders, setValue]);

  const handleSelectReminderType = useCallback(
    value => {
      setValue(REMINDER_TYPE_FIELD_NAME, value);
    },
    [setValue],
  );

  // const handleSelectRemindeTime = useCallback(
  //   value => {
  //     setValue(REMINDER_TIME_FIELD_NAME, value);
  //   },
  //   [setValue],
  // );

  const sectionDisabled =
    !reminderTypeValue || reminderTypeValue === ReminderType.NONE;

  return (
    <ReminderContainer isDisabled={isDisabled || !reminderIsOn}>
      <Checkbox isChecked={reminderIsOn} onClick={handleToggleReminder} />
      <Spacing horizontal={4} />
      <Description>Reminder</Description>
      <Spacing horizontal={4} />
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
      <Spacing horizontal={3} />
      <Description>at</Description>
      <Spacing horizontal={3} />
      <TimeDropdownInput
        name="reminderTime"
        savedValue={reminderTime}
        onSave={value => console.log('value', value)}
        disabled={sectionDisabled}
      />
    </ReminderContainer>
  );
};

export default ReminderSection;
