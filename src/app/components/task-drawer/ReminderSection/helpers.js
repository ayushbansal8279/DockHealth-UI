import React from 'react';
import moment from 'moment';
import { ReminderTypeSelectOption } from './styled';
import { TIME_12H_FORMAT } from '../helpers';

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

export function getDefaultReminderTime(dueDate) {
  const momentDueDate = moment(dueDate);

  if (!momentDueDate.isValid()) return '06:00 AM';

  if (momentDueDate.isValid() && momentDueDate.hour() === 0) {
    if (momentDueDate.minute() === 0) {
      return '06:00 AM';
    }
    return '12:00 AM';
  }

  return momentDueDate.add(-1, 'hours').format(TIME_12H_FORMAT);
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
