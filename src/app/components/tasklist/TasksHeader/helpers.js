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
  PROFILE: 'PROFILE'
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
    },
    {
      identifier: TaskHeaderColumn.TASK_DETAILS,
      label: 'Details',
      draggable: true,
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
    },
    {
      identifier: TaskHeaderColumn.PROFILE,
      label: 'Profile',
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_GENDER,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Gender`,
      draggable: true,
      sortDisabled: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_DOB,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} DOB`,
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_EMAIL,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Email`,
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_MRN,
      label: `${uniqueIdentifierLabel}`,
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_HOME_PHONE,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Home Phone`,
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.PATIENT_MOBILE_PHONE,
      label: `${customerTypeLabel
        .charAt(0)
        .toUpperCase()}${customerTypeLabel.slice(1)} Mobile Phone`,
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.WORKFLOW_STATUS,
      label: 'Status',
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.PRIORITY,
      label: 'Priority',
      draggable: true,
    },
    {
      identifier: TaskHeaderColumn.COMMENTS,
      label: 'Comments',
      draggable: true,
      sortDisabled: true,
    },
    {
      identifier: TaskHeaderColumn.LABELS,
      label: 'Labels',
      draggable: true,
      sortDisabled: true,
    },
    {
      identifier: TaskHeaderColumn.FILES,
      label: 'Files',
      draggable: true,
      sortDisabled: true,
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
      identifier: TaskHeaderColumn.SHARED,
      label: 'Shared',
      draggable: true,
      printWidth: TaskItemColumnWidth[TaskHeaderColumn.ASSIGNED].PRINT,
    },
    {
      identifier: TaskHeaderColumn.LIST_NAME,
      label: 'List',
      draggable: true,
      hidden: restrictions?.listName !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.ORG_NAME,
      label: 'Org',
      draggable: true,
      hidden: restrictions?.listName !== DISABLED,
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
