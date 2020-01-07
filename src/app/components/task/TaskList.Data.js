import moment from 'moment';

import { getPatientName } from '../../helpers/utility-functions';

export const SORTING_KEYS = {
  ASSIGNED_TO: 'ASSIGNED_TO',
  TASK: 'TASK',
  PATIENT: 'PATIENT',
  DUE_DATE: 'DUE_DATE',
  STATUS: 'STATUS',
};

export const sortingColumns = [
  {
    key: SORTING_KEYS.ASSIGNED_TO,
    valueGetter: task => task.assignedTo?.userName ?? '',
  },
  {
    key: SORTING_KEYS.TASK,
    valueGetter: task => task.description,
  },
  {
    key: SORTING_KEYS.PATIENT,
    valueGetter: task => getPatientName(task.patient),
  },
  {
    key: SORTING_KEYS.DUE_DATE,
    valueGetter: task => moment(task.dueDate ?? '').format('YYYY-MM-DD'),
  },
  {
    key: SORTING_KEYS.STATUS,
    valueGetter: task => task.workflowStatus ?? '',
  },
];

export const TASK_LIST_SHOW_MORE_STEP = 100;

export const DEFAULT_SORTING = [
  ...sortingColumns.map(sortingColumn => ({
    ...sortingColumn,
    order: 'asc',
  })),
];

export const NO_SORTING = [];
