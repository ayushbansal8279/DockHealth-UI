/* eslint-disable import/prefer-default-export */
import { TaskItemColumn } from 'helpers/task-helpers';

const SHOW_COLUMNS_CONFIG = {
  [TaskItemColumn.WORKFLOW_STATUS]: true,
  [TaskItemColumn.ASSIGNED]: true,
  [TaskItemColumn.ACTIVITY]: true,
  [TaskItemColumn.START_DATE]: true,
  [TaskItemColumn.DUE_DATE]: true,
  [TaskItemColumn.PATIENT]: true,
};

export const limitToConfigurableKeys = dataToLimit =>
  dataToLimit.reduce(
    (accumulator, [key, value]) =>
      SHOW_COLUMNS_CONFIG[key] ? { ...accumulator, [key]: value } : accumulator,
    {},
  );
