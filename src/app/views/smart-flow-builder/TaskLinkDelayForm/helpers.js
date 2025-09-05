import { capitalize } from 'helpers/capitalize';

export const DelayPeriodUnit = {
  MINUTE: 'MINUTE',
  HOUR: 'HOUR',
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
};

export const TIME_TYPE = {
  BEFORE: 'BEFORE',
  AFTER: 'AFTER',
};

export const TIME_REFERENCE = {
  PREV_TASK_DUE_DATE_TIME: 'Previous task due date',
  NEXT_TASK_DUE_DATE_TIME: 'Next task due date',
  PREV_TASK_COMPLETION_DATE_TIME: 'Previous task complete',
  WORKFLOW_ANCHOR_DATE: 'Workflow anchor date',
  WORKFLOW_DEPLOY_DATE: 'Workflow deploy date',
};

export const TIME_REFERENCE_OPTIONS = Object.keys(TIME_REFERENCE).map(
  (value) => ({
    value,
    label: TIME_REFERENCE[value],
  }),
);

export const TIME_TYPE_OPTIONS = Object.values(TIME_TYPE).map((value) => ({
  value,
  label: capitalize(value.toLowerCase()),
}));

export const DELAY_PERIOD_UNIT_OPTIONS = Object.values(DelayPeriodUnit).map(
  (value) => ({ value, label: capitalize(value.toLowerCase()) }),
);
