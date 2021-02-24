import React from 'react';
import { ReminderTypeSelectOption } from './styled';

export const REMINDER_TYPE_FIELD_NAME = 'reminderType';
export const REMINDER_TIME_FIELD_NAME = 'reminderTime';

export const ReminderType = {
  NONE: 'NONE',
  DAY_OF: 'DAY_OF',
  DAY_BEFORE_1: 'DAY_BEFORE_1',
  DAY_BEFORE_2: 'DAY_BEFORE_2',
  WEEK_BEFORE_1: 'WEEK_BEFORE_1',
};

export function getReminderTypeLabel(reminderType) {
  switch (reminderType) {
    case ReminderType.NONE:
      return '--';
    case ReminderType.DAY_OF:
      return 'On due date';
    case ReminderType.DAY_BEFORE_1:
      return '1 day before';
    case ReminderType.DAY_BEFORE_2:
      return '2 days before';
    case ReminderType.WEEK_BEFORE_1:
      return '1 week before';
    default:
      return null;
  }
}

export function getDefaultReminderTime() {
  return undefined;
}

export function generateReminderTypeSelectOptions() {
  return Object.values(ReminderType)
    .filter(value => value !== ReminderType.NONE)
    .map(value => {
      const label = getReminderTypeLabel(value);
      return {
        key: value,
        label: isHovered => (
          <ReminderTypeSelectOption isActive={isHovered}>
            {label}
          </ReminderTypeSelectOption>
        ),
        value,
        displayLabel: label,
      };
    });
}
