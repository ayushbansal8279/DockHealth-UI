import { TaskItemColumnWidth } from 'helpers/task-helpers';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';

export const TaskHeaderColumn = {
  DESCRIPTION: 'TASK_DESCRIPTION',
  SUBTASKS_COUNT: 'SUBTASKS_COUNT',
  PATIENT: 'PATIENT',
  WORKFLOW_STATUS: 'WORKFLOW_STATUS',
  ACTIVITY: 'ACTIVITY',
  START_DATE: 'START_DT',
  DUE_DATE: 'DUE_DT',
  CREATED_DATE: 'CREATED_DT',
  CREATED_BY: 'CREATED_BY',
  COMPLETED_DATE: 'COMPLETED_DT',
  ELAPSED_TIME: 'ELAPSED_TIME',
  COMPLETED_BY: 'COMPLETED_BY',
  ANCHOR_DATE: 'ANCHOR_DT',
  ASSIGNED: 'ASSIGNED_TO',
  LIST_NAME: 'LIST_NAME',
};

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

export const getTaskHeaderOptions = (
  customerTypeLabel,
  column,
  restrictions,
) => {
  const predefinedHeaderColumns = [
    {
      identifier: TaskHeaderColumn.DESCRIPTION,
      label: 'Tasks',
      draggable: true,
    },
    // {
    //   identifier: TaskHeaderColumn.SUBTASKS_COUNT,
    //   label: 'Sub',
    //   draggable: true,
    // },
    {
      identifier: TaskHeaderColumn.PATIENT,
      label: customerTypeLabel,
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.WORKFLOW_STATUS,
      label: 'Status',
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.ACTIVITY,
      label: 'Details',
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.START_DATE,
      label: 'Start',
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.DUE_DATE,
      label: 'Due',
      draggable: true,
      hidden: restrictions?.dueDate !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.CREATED_DATE,
      label: 'Created date',
      draggable: true,
      hidden: restrictions?.createdDate !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.COMPLETED_DATE,
      label: 'Completed date',
      draggable: true,
      hidden: restrictions?.completedDate !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.ELAPSED_TIME,
      label: 'Elapsed time',
      draggable: true,
      hidden: restrictions?.elapsedTime !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.COMPLETED_BY,
      label: 'Completed by',
      draggable: true,
      hidden: restrictions?.completedBy !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.CREATED_BY,
      label: 'Created by',
      draggable: true,
      hidden: restrictions?.createdBy !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.ANCHOR_DATE,
      label: 'Anchor',
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.ASSIGNED,
      label: 'Assign',
      draggable: true,
      printWidth: TaskItemColumnWidth[TaskHeaderColumn.ASSIGNED].PRINT,
    },
    {
      identifier: TaskHeaderColumn.LIST_NAME,
      label: 'List',
      draggable: true,
      hidden: restrictions?.listName !== DISABLED,
    },
  ];

  const foundHeaderColumn = predefinedHeaderColumns.find(
    c => c.identifier === column.identifier,
  );

  return { ...foundHeaderColumn, ...column };
};

export const reorderColumns = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
