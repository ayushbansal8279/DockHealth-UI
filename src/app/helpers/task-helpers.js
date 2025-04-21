import moment from 'moment';
import pipe from 'ramda/src/pipe';
import prop from 'ramda/src/prop';
import path from 'ramda/src/path';
import sortWith from 'ramda/src/sortWith';
import ascend from 'ramda/src/ascend';
import descend from 'ramda/src/descend';
import defaultTo from 'ramda/src/defaultTo';
import toLower from 'ramda/src/toLower';
import trim from 'ramda/src/trim';
import ifElse from 'ramda/src/ifElse';
import isNil from 'ramda/src/isNil';
import unless from 'ramda/src/unless';

import palette from 'styles/palette';
import { transformMetaData } from './date-intent-helpers';

export const TaskStatus = {
  ALL: '',
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
};

export const TaskStatusLabel = {
  [TaskStatus.ALL]: 'All Tasks',
  [TaskStatus.INCOMPLETE]: 'Active Tasks',
  [TaskStatus.COMPLETE]: 'Completed Tasks',
};

export const TaskItemType = {
  BUNDLE: 'BUNDLE',
  TASK: 'TASK',
  TEMPLATE: 'TEMPLATE',
};

export const TaskOrigin = {
  LIST: 'LIST',
  DASHBOARD: 'DASHBOARD',
  PATIENT: 'PATIENT',
  PERSON: 'PERSON',
  CUSTOM_PROFILE: 'CUSTOM_PROFILE',
  TEMPLATE: 'TEMPLATE',
  GLOBAL: 'GLOBAL',
};

export const TaskPriority = {
  NONE: 'NONE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const TaskTemplateType = {
  WORKFLOW: 'WORKFLOW',
  SMARTFLOW: 'SMARTFLOW',
  FOLDER: 'FOLDER',
};

export const CommunicationType = {
  EMAIL: 'EMAIL',
  FAX: 'FAX',
  SMS: 'SMS',
  SECURE_MESSAGE: 'SECURE_MESSAGE',
  ESIGN: 'ESIGN',
  EMR: 'EMR_NOTE',
};

export function getPriorityColor(priority) {
  switch (priority) {
    case TaskPriority.HIGH: {
      return palette.tomatoInYoFace;
    }
    case TaskPriority.MEDIUM:
      return palette.orangeJulius;
    case TaskPriority.LOW:
    default: {
      return 'transparent';
    }
  }
}

export function getPriorityHighlighColor(priority) {
  switch (priority) {
    case TaskPriority.HIGH:
      return palette.tomatoInYoFaceLight;
    case TaskPriority.LOW:
    default:
      return 'white'; // neeeded for sticky column
  }
}

export const TaskGroupType = {
  TASKLIST_DEFAULT: 'TASKLIST_DEFAULT',
  TASKLIST: 'TASKLIST',
  BUNDLE: 'TASK_BUNDLE',
};

export const ReminderType = {
  NONE: 'NONE',
  DAY_OF: 'DAY_OF',
  DAY_BEFORE_1: 'DAY_BEFORE_1',
  DAY_BEFORE_2: 'DAY_BEFORE_2',
  WEEK_BEFORE_1: 'WEEK_BEFORE_1',
  ABSOLUTE: 'ABSOLUTE',
};

export const DueDateIntent = {
  DATE: 'DATE',
  DATETIME_ABSOLUTE: 'DATETIME_ABSOLUTE',
};

export function getLabelsIconTooltipTitle(labels) {
  let toolTipMultiLabelDetails = '';
  if (labels.length === 1) {
    toolTipMultiLabelDetails = `${labels[0].labelName}`;
  } else if (labels.length === 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${labels[1].labelName}`;
  } else if (labels.length > 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${
      labels[1].labelName
    } + ${labels.length - 2}`;
  }
  return toolTipMultiLabelDetails;
}

export function getAttachmentsIconTooltipTitle(attachments) {
  let attachmentLabelDetails = '';
  if (attachments.length === 1) {
    attachmentLabelDetails = `${attachments[0].fileName}`;
  } else if (attachments.length > 1) {
    attachmentLabelDetails = `${attachments[0].fileName} + ${
      attachments.length - 1
    }`;
  }
  return attachmentLabelDetails;
}

export function getCommentsIconTooltipTitle(comments) {
  return `${comments?.length || 0} comment${comments.length === 1 ? '' : 's'}`;
}

export function isStartDateInPast(task) {
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (!task) {
    return false;
  }
  // const { startDate, status } = task;

  // const startDateObjet = moment(startDate);

  return false;
  // return (
  //   status === TaskStatus.INCOMPLETE &&
  //   (startDateObjet.format('HH:mm') !== '00:00' && startDateObjet.hours() > 4
  //     ? startDateObjet.isBefore(moment())
  //     : startDateObjet.isBefore(moment().startOf('day')))
  // );
}

export function isDueDateOverdue(task) {
  // invalid or non-incomplete tasks
  if (!task || task.status !== TaskStatus.INCOMPLETE) {
    return false;
  }
  const { dueDate } = task;

  const dueDateObject =
    task.dueDateIntent === DueDateIntent.DATE
      ? moment.utc(dueDate)
      : moment(dueDate);

  // Compare with today's start of day
  const todayStart = moment(
    `${moment().startOf('day').format('MM/DD/YYYY HH:mm:ss')} +0000`,
  );

  // overdue if due date is before today
  return dueDateObject.isBefore(todayStart);
}

export function checkDateTimeIntent(DateTime) {
  if (DateTime == null) return null;
  const momentDateTime = moment.utc(DateTime);
  return momentDateTime.hour() || momentDateTime.minute()
    ? 'DATETIME_ABSOLUTE'
    : 'DATE';
}

export function checkIfTemplateTask(task) {
  return task?.type === 'TEMPLATE';
}

export function checkIfBundleTask(task) {
  return !!task?.taskGroups?.find(
    ({ groupType }) => groupType === TaskGroupType.BUNDLE,
  );
}

export const TaskItemColumn = {
  DESCRIPTION: 'TASK_DESCRIPTION',
  DUE_DATE: 'DUE_DT',
  START_DATE: 'START_DT',
  ANCHOR_DATE: 'ANCHOR_DT',
  LIST_NAME: 'LIST_NAME',
  ORG_NAME: 'ORG_NAME',
  ASSIGNED: 'ASSIGNED_TO',
  SHARED: 'SHARED',
  PATIENT: 'PATIENT',
  CREATED_DATE: 'CREATED_DT',
  CREATED_BY: 'CREATED_BY',
  COMPLETED_DATE: 'COMPLETED_DT',
  ELAPSED_TIME: 'ELAPSED_TIME',
  COMPLETED_BY: 'COMPLETED_BY',
  // SUBTASKS_COUNT: 'SUBTASKS_COUNT',
  WORKFLOW_STATUS: 'WORKFLOW_STATUS',
  DECISION_SELECT: 'DECISION_SELECT',
  TASK_DETAILS: 'TASK_DETAILS',
  COMMENTS: 'COMMENTS',
  LABELS: 'LABELS',
  FILES: 'FILES',
  PRIORITY: 'PRIORITY',
};

export const PatientTaskItemColumn = {
  GENDER: 'PATIENT_GENDER',
  DOB: 'PATIENT_DOB',
  EMAIL: 'PATIENT_EMAIL',
  MRN: 'PATIENT_MRN',
  MOBILE_PHONE: 'PATIENT_MOBILE_PHONE',
  HOME_PHONE: 'PATIENT_HOME_PHONE',
};

export const TaskItemColumnWidth = {
  [TaskItemColumn.DUE_DATE]: {
    DEFAULT: 115,
    MINIMUM: 105,
  },
  [TaskItemColumn.START_DATE]: {
    DEFAULT: 115,
    MINIMUM: 105,
  },
  [TaskItemColumn.ANCHOR_DATE]: {
    DEFAULT: 115,
    MINIMUM: 105,
  },
  [TaskItemColumn.COMMENTS]: 100,
  [TaskItemColumn.LABELS]: 100,
  [TaskItemColumn.FILES]: 100,
  [TaskItemColumn.CREATED_DATE]: {
    DEFAULT: 150,
    MINIMUM: 170,
  },
  [TaskItemColumn.COMPLETED_DATE]: {
    DEFAULT: 150,
    MINIMUM: 170,
  },
  [TaskItemColumn.ELAPSED_TIME]: 150,
  [TaskItemColumn.COMPLETED_BY]: 150,
  [TaskItemColumn.ACTIVITY]: 150,
  [TaskItemColumn.LIST_NAME]: 168,
  [TaskItemColumn.ORG_NAME]: 168,
  [TaskItemColumn.ASSIGNED]: {
    DEFAULT: 90,
    WIDE: 90,
    NARROW: 60,
    PRINT: 170,
  },
  [TaskItemColumn.SHARED]: {
    DEFAULT: 90,
    WIDE: 90,
    NARROW: 60,
    PRINT: 170,
  },
  [TaskItemColumn.CREATED_BY]: {
    DEFAULT: 90,
    WIDE: 90,
    NARROW: 60,
    PRINT: 170,
  },
  [TaskItemColumn.PATIENT]: 164,
  [PatientTaskItemColumn.GENDER]: 164,
  [PatientTaskItemColumn.DOB]: 164,
  [PatientTaskItemColumn.EMAIL]: 164,
  [PatientTaskItemColumn.MRN]: 164,
  [PatientTaskItemColumn.HOME_PHONE]: 164,
  [PatientTaskItemColumn.MOBILE_PHONE]: 164,
  [TaskItemColumn.DESCRIPTION]: {
    DEFAULT: 500,
    WIDE: 475,
    PRINT: 300,
  },
  [TaskItemColumn.TASK_DETAILS]: {
    DEFAULT: 500,
    WIDE: 475,
    PRINT: 300,
  },
  [TaskItemColumn.SUBTASKS_COUNT]: 60,
  [TaskItemColumn.WORKFLOW_STATUS]: 120,
  [TaskItemColumn.PRIORITY]: 120,
};

export const TASK_ITEM_BASE_COLUMN_CONFIG = {
  [TaskItemColumn.DESCRIPTION]: true,
  [TaskItemColumn.TASK_DETAILS]: true,
  // [TaskItemColumn.SUBTASKS_COUNT]: true,
  [TaskItemColumn.PATIENT]: true,
  [PatientTaskItemColumn.GENDER]: true,
  [PatientTaskItemColumn.DOB]: true,
  [PatientTaskItemColumn.EMAIL]: true,
  [PatientTaskItemColumn.MRN]: true,
  [PatientTaskItemColumn.HOME_PHONE]: true,
  [PatientTaskItemColumn.MOBILE_PHONE]: true,
  [TaskItemColumn.WORKFLOW_STATUS]: true,
  [TaskItemColumn.COMMENTS]: true,
  [TaskItemColumn.LABELS]: true,
  [TaskItemColumn.FILES]: true,
  [TaskItemColumn.START_DATE]: true,
  [TaskItemColumn.DUE_DATE]: true,
  [TaskItemColumn.COMPLETED_DATE]: true,
  [TaskItemColumn.ELAPSED_TIME]: true,
  [TaskItemColumn.COMPLETED_BY]: true,
  [TaskItemColumn.CREATED_DATE]: true,
  [TaskItemColumn.CREATED_BY]: true,
  [TaskItemColumn.ANCHOR_DATE]: true,
  [TaskItemColumn.ASSIGNED]: true,
  [TaskItemColumn.SHARED]: true,
  [TaskItemColumn.LIST_NAME]: false,
  [TaskItemColumn.ORG_NAME]: false,
  [TaskItemColumn.PRIORITY]: true,
};

export const SHOW_COLUMNS_CONFIG = {
  [TaskItemColumn.WORKFLOW_STATUS]: true,
  [TaskItemColumn.ASSIGNED]: true,
  [TaskItemColumn.SHARED]: true,
  [TaskItemColumn.COMMENTS]: true,
  [TaskItemColumn.LABELS]: true,
  [TaskItemColumn.FILES]: true,
  [TaskItemColumn.START_DATE]: true,
  [TaskItemColumn.DUE_DATE]: true,
  [TaskItemColumn.CREATED_DATE]: true,
  [TaskItemColumn.CREATED_BY]: true,
  [TaskItemColumn.COMPLETED_DATE]: true,
  [TaskItemColumn.ELAPSED_TIME]: true,
  [TaskItemColumn.COMPLETED_BY]: true,
  [TaskItemColumn.ANCHOR_DATE]: true,
  [TaskItemColumn.PATIENT]: true,
  [TaskItemColumn.LIST_NAME]: true,
  [TaskItemColumn.ORG_NAME]: true,
  [TaskItemColumn.TASK_DETAILS]: true,
  [TaskItemColumn.PRIORITY]: true,
  [PatientTaskItemColumn.GENDER]: true,
  [PatientTaskItemColumn.DOB]: true,
  [PatientTaskItemColumn.EMAIL]: true,
  [PatientTaskItemColumn.MRN]: true,
  [PatientTaskItemColumn.HOME_PHONE]: true,
  [PatientTaskItemColumn.MOBILE_PHONE]: true,
};

export const TASK_ITEM_SORT_METHODS = {
  [TaskItemColumn.DESCRIPTION]: sortWith([
    ascend(pipe(prop('description'), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.TASK_DETAILS]: sortWith([
    ascend(pipe(prop('details'), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.DUE_DATE]: sortWith([
    ascend(pipe(prop('dueDate'), defaultTo('~'))),
  ]),
  [TaskItemColumn.CREATED_DATE]: sortWith([
    ascend(pipe(prop('dateCreated'), defaultTo('~'))),
  ]),
  [TaskItemColumn.COMPLETED_DATE]: sortWith([
    ascend(pipe(prop('completedDt'), defaultTo('~'))),
  ]),
  [TaskItemColumn.WORKFLOW_STATUS]: sortWith([
    ascend(
      pipe(
        prop('workflowStatus'),
        unless(isNil, prop('name')),
        defaultTo('~'),
        toLower,
      ),
    ),
  ]),
  [TaskItemColumn.PRIORITY]: sortWith([
    ascend(
      pipe(
        prop('priority'),
        unless(isNil, prop('name')),
        defaultTo('~'),
        toLower,
      ),
    ),
  ]),
  [TaskItemColumn.PATIENT]: sortWith([
    ascend(
      ifElse(
        path(['patient', 'patientName']),
        pipe(path(['patient', 'patientName']), defaultTo('~'), toLower),
        pipe(
          path(['parentTask', 'patient', 'patientName']),
          defaultTo('~'),
          toLower,
        ),
      ),
    ),
  ]),
  [TaskItemColumn.ASSIGNED]: sortWith([
    ascend(
      pipe(path(['assignedToUsers', 0, 'userName']), defaultTo('~'), toLower),
    ),
  ]),
  [TaskItemColumn.CREATED_BY]: sortWith([
    ascend(pipe(path(['creator', 'userName']), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.COMPLETED_BY]: sortWith([
    ascend(pipe(path(['completedBy', 'userName']), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.LIST_NAME]: sortWith([
    ascend(pipe(path(['taskList', 'listName']), defaultTo('~'), toLower, trim)),
  ]),
  [TaskItemColumn.ORG_NAME]: sortWith([
    ascend(
      pipe(
        path(['organization', 'organizationName']),
        defaultTo('~'),
        toLower,
        trim,
      ),
    ),
  ]),
  [TaskItemColumn.SUBTASKS_COUNT]: sortWith([
    ascend(pipe(prop('subTasksCount'), defaultTo(-1))),
  ]),
  [PatientTaskItemColumn.GENDER]: sortWith([
    ascend(pipe(prop('gender'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.DOB]: sortWith([
    ascend(pipe(prop('dob'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.EMAIL]: sortWith([
    ascend(pipe(prop('email'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.MRN]: sortWith([
    ascend(pipe(prop('mrn'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.HOME_PHONE]: sortWith([
    ascend(pipe(prop('phoneHome'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.MOBILE_PHONE]: sortWith([
    ascend(pipe(prop('phoneMobile'), defaultTo('~'), toLower)),
  ]),
};

export const TASK_ITEM_SORT_DESC_METHODS = {
  [TaskItemColumn.DESCRIPTION]: sortWith([
    descend(pipe(prop('description'), defaultTo(' '), toLower)),
  ]),
  [TaskItemColumn.TASK_DETAILS]: sortWith([
    descend(pipe(prop('details'), defaultTo(' '), toLower)),
  ]),
  [TaskItemColumn.DUE_DATE]: sortWith([
    descend(pipe(prop('dueDate'), defaultTo(' '))),
  ]),
  [TaskItemColumn.CREATED_DATE]: sortWith([
    descend(pipe(prop('createdDate'), defaultTo(' '))),
  ]),
  [TaskItemColumn.COMPLETED_DATE]: sortWith([
    descend(pipe(prop('completedDt'), defaultTo(' '))),
  ]),
  [TaskItemColumn.WORKFLOW_STATUS]: sortWith([
    descend(
      pipe(
        prop('workflowStatus'),
        unless(isNil, prop('name')),
        defaultTo(' '),
        toLower,
      ),
    ),
  ]),
  [TaskItemColumn.PRIORITY]: sortWith([
    descend(
      pipe(
        prop('priority'),
        unless(isNil, prop('name')),
        defaultTo('~'),
        toLower,
      ),
    ),
  ]),
  [TaskItemColumn.PATIENT]: sortWith([
    descend(
      ifElse(
        path(['patient', 'patientName']),
        pipe(path(['patient', 'patientName']), defaultTo(' '), toLower),
        pipe(
          path(['parentTask', 'patient', 'patientName']),
          defaultTo(' '),
          toLower,
        ),
      ),
    ),
  ]),
  [TaskItemColumn.ASSIGNED]: sortWith([
    descend(
      pipe(path(['assignedToUsers', 0, 'userName']), defaultTo(' '), toLower),
    ),
  ]),
  [TaskItemColumn.COMPLETED_BY]: sortWith([
    descend(pipe(path(['completedBy', 'userName']), defaultTo(' '), toLower)),
  ]),
  [TaskItemColumn.CREATED_BY]: sortWith([
    descend(pipe(path(['creator', 'userName']), defaultTo(' '), toLower)),
  ]),
  [TaskItemColumn.LIST_NAME]: sortWith([
    descend(
      pipe(path(['taskList', 'listName']), defaultTo(' '), toLower, trim),
    ),
  ]),
  [TaskItemColumn.ORG_NAME]: sortWith([
    descend(
      pipe(
        path(['organization', 'organizationName']),
        defaultTo(' '),
        toLower,
        trim,
      ),
    ),
  ]),
  [TaskItemColumn.SUBTASKS_COUNT]: sortWith([
    descend(pipe(prop('subTasksCount'), defaultTo(-1))),
  ]),
  [PatientTaskItemColumn.GENDER]: sortWith([
    ascend(pipe(prop('gender'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.DOB]: sortWith([
    ascend(pipe(prop('dob'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.EMAIL]: sortWith([
    ascend(pipe(prop('email'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.MRN]: sortWith([
    ascend(pipe(prop('mrn'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.HOME_PHONE]: sortWith([
    ascend(pipe(prop('phoneHome'), defaultTo('~'), toLower)),
  ]),
  [PatientTaskItemColumn.MOBILE_PHONE]: sortWith([
    ascend(pipe(prop('phoneMobile'), defaultTo('~'), toLower)),
  ]),
};

export function updateNestedTask(dataToUpdate, taskIdentifier, task) {
  if (
    task.subtasks?.some((s) => s.taskIdentifier === taskIdentifier) ||
    task.taskDependencies?.some((s) => s.taskIdentifier === taskIdentifier)
  ) {
    return {
      ...task,
      subtasks: task?.subtasks?.map((subtask) =>
        taskIdentifier === subtask.taskIdentifier
          ? { ...subtask, ...dataToUpdate }
          : subtask,
      ),
      taskDependencies: task?.taskDependencies?.map((t) =>
        taskIdentifier === t.taskIdentifier ? { ...t, ...dataToUpdate } : t,
      ),
    };
  }

  return task;
}

export function updateSubtasksInTaskWithCallback(
  updateCallback,
  taskIdentifier,
  task,
) {
  if (
    task.subtasks?.some((s) => s.taskIdentifier === taskIdentifier) ||
    task.taskDependencies?.some((s) => s.taskIdentifier === taskIdentifier)
  ) {
    return {
      ...task,
      subtasks: task?.subtasks?.map((subtask) =>
        taskIdentifier === subtask.taskIdentifier
          ? updateCallback(subtask)
          : subtask,
      ),
      taskDependencies: task?.taskDependencies?.map((t) =>
        taskIdentifier === t.taskIdentifier ? updateCallback(t) : t,
      ),
    };
  }

  return task;
}
export const isColumnChecked = (columns, columnName) =>
  !!columns?.find((c) => c.identifier === columnName)?.isChecked;

export const EmrNoteTypeOptions = {
  COMMUNICATION_NOTE: 'Communication note',
  REFERRAL_NOTE: 'Referral note',
  CONSULT_NOTE: 'Consult note',
  PROCEDURE_NOTE: 'Procedure note',
  PROGRESS_NOTE: 'Progress note',
};

export function findIncompleteRequiredFields(customFields, task, taskBundle) {
  const requiredFieldLabels = task?.labels
    ?.filter((lbl) => lbl.labelName.indexOf('Required_') === 0)
    .map((lbl) => lbl.labelName.replace('Required_', ''));

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  let incompleteCustomFields = customFields?.filter((field) => {
    const taskMetaData = task?.taskMetaData;
    const taskFieldIdentifier = field?.identifier;
    const matchingMetaData = taskMetaData?.find(
      (tmd) => tmd?.customFieldIdentifier === taskFieldIdentifier,
    );

    return (
      (field?.displayOptions.includes('TASK_REQUIRED') ||
        requiredFieldLabels?.includes(field?.name)) &&
      (matchingMetaData === undefined ||
        matchingMetaData?.length === 0 ||
        !(
          (matchingMetaData?.value && matchingMetaData?.value !== '') ||
          (matchingMetaData?.values && matchingMetaData?.values.length > 0)
        ))
    );
  });

  // check for attachment
  const attachmentRequired = task?.labels?.find(
    (lbl) => lbl.labelName.indexOf('Required_Attachment') === 0,
  );
  if (attachmentRequired && task?.attachments?.length === 0) {
    incompleteCustomFields = incompleteCustomFields?.concat([
      {
        name: 'Task Attachment',
      },
    ]);
  }

  // check for patient
  const patientRequired = task?.labels?.find(
    (lbl) => lbl.labelName.indexOf('Required_Patient') === 0,
  );
  if (patientRequired && !task?.patient) {
    incompleteCustomFields = incompleteCustomFields?.concat([
      {
        name: 'Patient',
      },
    ]);
  }

  return incompleteCustomFields;
}

export const transformTaskMetadata = (data) => {
  if (!data?.taskMetaData || !Array.isArray(data.taskMetaData)) return data;

  return {
    ...data,
    taskMetaData: transformMetaData(data.taskMetaData),
  };
};