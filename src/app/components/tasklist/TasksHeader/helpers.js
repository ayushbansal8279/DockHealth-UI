import { TaskItemColumnWidth } from 'helpers/task-helpers';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';

export const TaskHeaderColumn = {
  DESCRIPTION: 'TASK_DESCRIPTION',
  TASK_DETAILS: 'TASK_DETAILS',
  SUBTASKS_COUNT: 'SUBTASKS_COUNT',
  PATIENT: 'PATIENT',
  WORKFLOW_STATUS: 'WORKFLOW_STATUS',
  COMMENTS: 'COMMENTS',
  LABELS: 'LABELS',
  FILES: 'FILES',
  START_DATE: 'START_DT',
  DUE_DATE: 'DUE_DT',
  CREATED_DATE: 'CREATED_DT',
  CREATED_BY: 'CREATED_BY',
  COMPLETED_DATE: 'COMPLETED_DT',
  ELAPSED_TIME: 'ELAPSED_TIME',
  COMPLETED_BY: 'COMPLETED_BY',
  ANCHOR_DATE: 'ANCHOR_DT',
  ASSIGNED: 'ASSIGNED_TO',
  SHARED: 'SHARED',
  LIST_NAME: 'LIST_NAME',
  ORG_NAME: 'ORG_NAME',
  PRIORITY: 'PRIORITY',
  PATIENT_GENDER: 'PATIENT_GENDER',
  PATIENT_DOB: 'PATIENT_DOB',
  PATIENT_EMAIL: 'PATIENT_EMAIL',
  PATIENT_MRN: 'PATIENT_MRN',
  PATIENT_HOME_PHONE: 'PATIENT_HOME_PHONE',
  PATIENT_MOBILE_PHONE: 'PATIENT_MOBILE_PHONE',
};

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

export const getTaskHeaderOptions = (
  customerTypeLabel,
  uniqueIdentifierLabel,
  column,
  restrictions,
) => {
  const predefinedHeaderColumns = [
    {
      identifier: TaskHeaderColumn.DESCRIPTION,
      label: 'Tasks',
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.TASK_DETAILS,
      label: 'Details',
      draggable: true,
      sortEnabled: true,
    },
    // {
    //   identifier: TaskHeaderColumn.SUBTASKS_COUNT,
    //   label: 'Sub',
    //   draggable: true,
    // },
    {
      identifier: TaskHeaderColumn.PATIENT,
      label:
        customerTypeLabel.charAt(0).toUpperCase() + customerTypeLabel.slice(1),
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_GENDER,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Gender`,
      draggable: true,
      sortEnabled: false,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_DOB,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} DOB`,
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_EMAIL,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Email`,
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_MRN,
      label: `${uniqueIdentifierLabel}`,
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_HOME_PHONE,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Home Phone`,
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_MOBILE_PHONE,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Mobile Phone`,
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.WORKFLOW_STATUS,
      label: 'Status',
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.PRIORITY,
      label: 'Priority',
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.COMMENTS,
      label: 'Comments',
      draggable: true,
      sortEnabled: false,
    },
    {
      identifier: TaskHeaderColumn.LABELS,
      label: 'Labels',
      draggable: true,
      sortEnabled: false,
    },
    {
      identifier: TaskHeaderColumn.FILES,
      label: 'Files',
      draggable: true,
      sortEnabled: false,
    },
    {
      identifier: TaskHeaderColumn.START_DATE,
      label: 'Start',
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.DUE_DATE,
      label: 'Due',
      draggable: true,
      hidden: restrictions?.dueDate !== DISABLED,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.CREATED_DATE,
      label: 'Created date',
      draggable: true,
      hidden: restrictions?.createdDate !== DISABLED,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.COMPLETED_DATE,
      label: 'Completed date',
      draggable: true,
      hidden: restrictions?.completedDate !== DISABLED,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.ELAPSED_TIME,
      label: 'Elapsed time',
      draggable: true,
      hidden: restrictions?.elapsedTime !== DISABLED,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.COMPLETED_BY,
      label: 'Completed by',
      draggable: true,
      hidden: restrictions?.completedBy !== DISABLED,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.CREATED_BY,
      label: 'Created by',
      draggable: true,
      hidden: restrictions?.createdBy !== DISABLED,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.ANCHOR_DATE,
      label: 'Anchor',
      draggable: true,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.ASSIGNED,
      label: 'Assign',
      draggable: true,
      printWidth: TaskItemColumnWidth[TaskHeaderColumn.ASSIGNED].PRINT,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.SHARED,
      label: 'Shared',
      draggable: true,
      printWidth: TaskItemColumnWidth[TaskHeaderColumn.ASSIGNED].PRINT,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.LIST_NAME,
      label: 'List',
      draggable: true,
      hidden: restrictions?.listName !== DISABLED,
      sortEnabled: true,
    },
    {
      identifier: TaskHeaderColumn.ORG_NAME,
      label: 'Org',
      draggable: true,
      hidden: restrictions?.listName !== DISABLED,
      sortEnabled: true,
    },
  ];

  const foundHeaderColumn = predefinedHeaderColumns.find(
    (c) => c.identifier === column?.identifier,
  );

  return { ...foundHeaderColumn, ...column };
};

export const reorderColumns = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
