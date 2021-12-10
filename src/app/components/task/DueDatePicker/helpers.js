export const FormField = {
  RECURRING_OPTION: 'recurringOption',
  RECURRING_ON_DAYS: 'recurringOnDays',
  ENDS: 'endsOption',
  NUMBER_OF_OCCURRENCES: 'numberOfOccurrences',
  END_DATE: 'endDate',
  REPEAT_TIMES_UNIT: 'repeatTimeUnit',
  REPEAT_TIMES: 'repeatTimes',
};

export const RecurringOption = {
  DO_NOT_REPEAT: 'DO_NOT_REPEAT',
  CUSTOM: 'CUSTOM',
  WEEKDAYS_MON_FRI: 'WEEKDAYS_MON_FRI',
  EVERYDAY_SUN_SAT: 'EVERYDAY_SUN_SAT',
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
};

const RecurringOptionLabel = {
  [RecurringOption.DO_NOT_REPEAT]: 'Does not repeat',
  [RecurringOption.CUSTOM]: 'Custom',
  [RecurringOption.WEEKDAYS_MON_FRI]: 'Weekdays M-F',
  [RecurringOption.EVERYDAY_SUN_SAT]: 'Everyday Su-Sa',
  [RecurringOption.WEEKLY]: 'Weekly',
  [RecurringOption.BIWEEKLY]: 'Bi-Weekly',
  [RecurringOption.MONTHLY]: 'Monthly',
  [RecurringOption.YEARLY]: 'Yearly',
};

export const RepeatUnitOption = {
  HOUR: 'HOUR',
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
};

export const RepeatUnitOptionLabel = {
  [RepeatUnitOption.HOUR]: 'Hour',
  [RepeatUnitOption.DAY]: 'Day',
  [RepeatUnitOption.WEEK]: 'Week',
  [RepeatUnitOption.MONTH]: 'Month',
};

export const RECURRING_OPTIONS = Object.values(RecurringOption).map(value => ({
  value,
  label: RecurringOptionLabel[value],
}));

export const REPEAT_UNIT_OPTIONS = Object.values(RepeatUnitOption).map(
  value => ({
    value,
    label: RepeatUnitOptionLabel[value],
  }),
);

export const EndsOption = {
  NEVER: 'NEVER',
  ON_DATE: 'ON_DATE',
  AFTER_OCCURRENCES: 'AFTER_OCCURRENCES',
};

const EndsOptionLabel = {
  [EndsOption.NEVER]: 'Never',
  [EndsOption.ON_DATE]: 'On date',
  [EndsOption.AFTER_OCCURRENCES]: 'After occurrences',
};

export const ENDS_OPTIONS = Object.values(EndsOption).map(value => ({
  value,
  label: EndsOptionLabel[value],
}));

export const FORM_DEFAULT_VALUES = {
  [FormField.RECURRING_OPTION]: RecurringOption.DO_NOT_REPEAT,
  [FormField.RECURRING_ON_DAYS]: [],
  [FormField.ENDS]: EndsOption.NEVER,
  [FormField.NUMBER_OF_OCCURRENCES]: null,
  [FormField.END_DATE]: null,
};

export const OPTIONS_ALLOWED_TO_DAY_SELECTION = [RecurringOption.WEEKLY];
