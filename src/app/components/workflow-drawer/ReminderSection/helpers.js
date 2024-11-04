import { ReminderType } from 'helpers/task-helpers';

export const REMINDER_TYPE_FIELD_NAME = 'reminderType';
export const REMINDER_TIME_FIELD_NAME = 'reminderTime';

export const ReminderLabel = {
  [ReminderType.NONE]: '--',
  [ReminderType.DAY_OF]: 'On due date',
  [ReminderType.DAY_BEFORE_1]: '1 day before',
  [ReminderType.DAY_BEFORE_2]: '2 days before',
  [ReminderType.WEEK_BEFORE_1]: '1 week before',
  [ReminderType.ABSOLUTE]: 'Custom Date'
};

export const REMINDER_TYPE_OPTIONS = Object.values(ReminderType)
  .filter((value) => value !== ReminderType.NONE)
  .map((value) => ({
    value,
    label: ReminderLabel[value],
  }));
