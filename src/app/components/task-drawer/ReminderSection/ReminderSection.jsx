import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import ReminderSelect from '../ReminderSelect/ReminderSelect';
import { ReminderContainer, Description } from './styled';
import {
  ReminderType,
  REMINDER_TYPE_FIELD_NAME,
  REMINDER_TIME_FIELD_NAME,
  getDefaultReminderTime,
  getReminderTypeLabel,
} from './helpers';

const ReminderSection = ({
  reminderType,
  reminderTime,
  dueDate,
  isDisabled,
}) => {
  const { register, unregister, setValue, watch } = useFormContext();
  const [reminderTypeOptions, setReminderTypeOptions] = useState([]);

  console.log('reminderType', reminderType);
  console.log('reminderTime', reminderTime);

  useEffect(() => {
    setReminderTypeOptions(() =>
      Object.values(ReminderType)
        .filter(value => value !== ReminderType.NONE)
        .map(value => ({
          label: getReminderTypeLabel(value),
          value,
        })),
    );
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
  const reminderTimeValue = watch(REMINDER_TIME_FIELD_NAME);

  const reminderIsOn =
    reminderTypeValue && reminderTypeValue !== ReminderType.NONE;

  const handleToggleReminder = useCallback(() => {
    if (!reminderTypeValue || reminderTypeValue === ReminderType.NONE) {
      setValue(REMINDER_TYPE_FIELD_NAME, ReminderType.DAY_BEFORE_1);
      setValue(REMINDER_TIME_FIELD_NAME, getDefaultReminderTime(dueDate));
    } else {
      setValue(REMINDER_TYPE_FIELD_NAME, ReminderType.NONE);
      setValue(REMINDER_TIME_FIELD_NAME, reminderTimeValue || null);
    }
  }, [dueDate, reminderTimeValue, reminderTypeValue, setValue]);

  const handleSelectReminderType = useCallback(
    value => {
      setValue(REMINDER_TYPE_FIELD_NAME, value);
    },
    [setValue],
  );

  const handleSelectRemindeTime = useCallback(
    value => {
      setValue(REMINDER_TIME_FIELD_NAME, value);
    },
    [setValue],
  );

  return (
    <ReminderContainer isDisabled={isDisabled || !reminderIsOn}>
      <Checkbox isChecked={reminderIsOn} onClick={handleToggleReminder} />
      <Spacing horizontal={4} />
      <Description>Reminder</Description>
      <Spacing horizontal={4} />
      <ReminderSelect
        width={140}
        readOnly
        onSelect={handleSelectReminderType}
        value={reminderTypeValue}
        options={reminderTypeOptions}
      />
      <Spacing horizontal={3} />
      <Description>at</Description>
      <Spacing horizontal={3} />
      <ReminderSelect
        width={100}
        value={reminderTimeValue}
        onSelect={handleSelectRemindeTime}
        options={[{ label: '09:00 am', value: '09:00 AM' }]}
      />
    </ReminderContainer>
  );
};

export default ReminderSection;
