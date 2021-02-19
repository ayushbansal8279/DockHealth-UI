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

const ReminderSection = ({ selectedTask, isDisabled, onSave }) => {
  const { reminderType, reminderTime, dueDate } = selectedTask || {};

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
  }, [reminderTime, reminderType, setValue]);

  const reminderTypeValue = watch(REMINDER_TYPE_FIELD_NAME);

  const reminderIsOn =
    reminderTypeValue && reminderTypeValue !== ReminderType.NONE;

  const sectionDisabled = isDisabled || !reminderIsOn;

  const handleToggleReminder = useCallback(() => {
    if (!reminderTypeValue || reminderTypeValue === ReminderType.NONE) {
      const defaultType = ReminderType.DAY_BEFORE_1;
      const defaultTime = getDefaultReminderTime(dueDate);

      setValue(REMINDER_TYPE_FIELD_NAME, defaultType);
      setValue(REMINDER_TIME_FIELD_NAME, defaultTime);
      onSave({ reminderType: defaultType, reminderTime: defaultTime });
    } else {
      setValue(REMINDER_TYPE_FIELD_NAME, ReminderType.NONE);
      setValue(REMINDER_TIME_FIELD_NAME, null);
      onSave({ reminderType: ReminderType.NONE, reminderTime: null });
    }
  }, [dueDate, onSave, reminderTypeValue, setValue]);

  const handleSelectReminderType = useCallback(
    value => {
      setValue(REMINDER_TYPE_FIELD_NAME, value);
      onSave({ reminderType: value });
    },
    [onSave, setValue],
  );

  const handleSelectReminderTime = useCallback(
    value => {
      setValue(REMINDER_TIME_FIELD_NAME, value);
      onSave({ reminderTime: value });
    },
    [onSave, setValue],
  );

  return (
    <ReminderContainer isDisabled={sectionDisabled}>
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
        type="secondary"
        name="reminderTime"
        savedValue={reminderTime}
        onSave={handleSelectReminderTime}
        disabled={sectionDisabled}
        endAdornment={<SelectArrowImg src={ArrowIcon} alt="arrow" />}
      />
    </ReminderContainer>
  );
};

export default ReminderSection;
