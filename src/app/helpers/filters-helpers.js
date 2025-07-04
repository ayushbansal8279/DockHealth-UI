import moment from 'moment';
import isEmpty from 'ramda/src/isEmpty';

const TASK_DUE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const checkIfDueDateOptionsMatch = (options, taskDueDate) => {
  const momentDueDate = moment(taskDueDate, TASK_DUE_DATE_FORMAT);

  return options.some(
    (dueDateOption) =>
      (dueDateOption === 'OVERDUE' && moment().isAfter(momentDueDate)) ||
      (dueDateOption === 'DUE_TODAY' &&
        moment().isSame(momentDueDate, 'day')) ||
      (dueDateOption === 'DUE_TOMORROW' &&
        moment().add(1, 'day').isSame(momentDueDate, 'day')) ||
      (dueDateOption === 'DUE_THIS_WEEK' &&
        moment().isSame(momentDueDate, 'week')) ||
      (dueDateOption === 'DUE_THIS_MONTH' &&
        moment().isSame(momentDueDate, 'month')),
  );
};
const checkIfCustomDueDateMatch = (
  customDueDateStart,
  customDueDateEnd,
  taskDueDate,
) =>
  (!customDueDateStart ||
    moment(taskDueDate, TASK_DUE_DATE_FORMAT).isSameOrAfter(
      moment(customDueDateStart, 'YYYY-MM-DD'),
    )) &&
  (!customDueDateEnd ||
    moment(taskDueDate, TASK_DUE_DATE_FORMAT).isSameOrBefore(
      moment(customDueDateEnd, 'YYYY-MM-DD'),
    ));

const checkIfMatchesDueDateCriteria = (
  customDueDateStart,
  customDueDateEnd,
  options,
  taskDueDate,
) => {
  if (
    !customDueDateStart &&
    !customDueDateEnd &&
    (!options || isEmpty(options))
  ) {
    return true;
  }

  if (
    (customDueDateEnd || customDueDateStart) &&
    (!options || isEmpty(options))
  ) {
    return checkIfCustomDueDateMatch(
      customDueDateStart,
      customDueDateEnd,
      taskDueDate,
    );
  }

  if (
    !customDueDateStart &&
    !customDueDateEnd &&
    options &&
    !isEmpty(options)
  ) {
    return checkIfDueDateOptionsMatch(options, taskDueDate);
  }

  return (
    checkIfDueDateOptionsMatch(options, taskDueDate) ||
    checkIfCustomDueDateMatch(customDueDateStart, customDueDateEnd, taskDueDate)
  );
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const checkIfTaskMatchesFilters = (task, filters) => {
  if (!task) {
    return false;
  }

  const {
    priority,
    workflowStatus,
    assignedBy,
    assignedToUsers,
    patient,
    labels,
    dueDate,
    taskList,
  } = task;

  if (!filters || isEmpty(filters)) {
    return true;
  }

  const isDefalutFieldsMatchingFlters =
    (!filters.priorityOptions ||
      !filters.priorityOptions.options ||
      isEmpty(filters.priorityOptions.options) ||
      filters.priorityOptions.options.some(
        (priorityOption) =>
          priorityOption === priority ||
          (priorityOption === 'LOW' && !priority),
      )) &&
    (!filters.workflowStatusOptions ||
      !filters.workflowStatusOptions.options ||
      isEmpty(filters.workflowStatusOptions.options) ||
      filters.workflowStatusOptions.options.some(
        (workflowStatusOption) =>
          workflowStatusOption === workflowStatus ||
          (workflowStatusOption === 'NO_STATUS' && !workflowStatus),
      )) &&
    (!filters.assignedTo ||
      !filters.assignedTo.options ||
      isEmpty(filters.assignedTo.options) ||
      filters.assignedTo.options.some(
        (assignedToOption) =>
          ((!assignedToUsers || isEmpty(assignedToUsers)) &&
            assignedToOption === 'UNASSIGNED') ||
          assignedToUsers.some(
            ({ userIdentifier }) => userIdentifier === assignedToOption,
          ),
      )) &&
    (!filters.assignedBy ||
      !filters.assignedBy.options ||
      isEmpty(filters.assignedBy.options) ||
      filters.assignedBy.options.some(
        (assignedByOption) =>
          assignedByOption === assignedBy?.userIdentifier ||
          (assignedByOption === 'UNASSIGNED' && !assignedBy),
      )) &&
    (!filters.patients ||
      !filters.patients.options ||
      isEmpty(filters.patients.options) ||
      filters.patients.options.some(
        (patientOption) =>
          patientOption === patient?.patientIdentifier ||
          (patientOption === 'UNASSIGNED' && !patient),
      )) &&
    (!filters.taskLists ||
      !filters.taskLists.options ||
      isEmpty(filters.taskLists.options) ||
      filters.taskLists.options.includes(taskList?.taskListIdentifier)) &&
    (!filters.labels ||
      !filters.labels.options ||
      isEmpty(filters.labels.options) ||
      filters.labels.options.some((labelOption) =>
        labels?.some(({ labelIdentifier }) => labelIdentifier === labelOption),
      )) &&
    (!filters.taskDueDateOptions ||
      checkIfMatchesDueDateCriteria(
        filters.taskDueDateOptions?.dateStart,
        filters.taskDueDateOptions?.dateEnd,
        filters.taskDueDateOptions?.options,
        dueDate,
      ));

  if (!filterHasCustomFields(filters)) {
    return isDefalutFieldsMatchingFlters;
  }

  if (task.taskMetaData.length === 0) {
    return false;
  }

  const isCustomFieldsMatchingFlters = checkIfTaskMatchesCustomFilters(
    task.taskMetaData,
    filters,
  );

  return isDefalutFieldsMatchingFlters && isCustomFieldsMatchingFlters;
};

function checkIfTaskMatchesCustomFilters(taskMetaData, filters) {
  const customFilters = extractCustomFiltersFromMegaFilters(filters);
  const taskMetaMap = new Map();

  taskMetaData.forEach((task) => {
    if (task.value || task.values) {
      taskMetaMap.set(task.customFieldIdentifier, task);
    }
  });

  for (const [fieldId, filterConfig] of Object.entries(customFilters)) {
    if (fieldId === '' || !fieldId) {
      continue;
    }

    const taskField = taskMetaMap.get(fieldId);
    if (!taskField) {
      return false;
    }

    if (filterConfig.options && filterConfig.options.length > 0) {
      if (taskField.value) {
        if (!filterConfig.options.includes(taskField.value)) {
          return false;
        }
      } else if (taskField.values && Array.isArray(taskField.values)) {
        const allOptionsMatch = filterConfig.options.every((option) =>
          taskField.values.includes(option),
        );
        if (!allOptionsMatch) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  return true;
}

function filterHasCustomFields(filters) {
  for (const key of Object.keys(filters)) {
    if (UUID_REGEX.test(key)) {
      return true;
    }
  }

  return false;
}

function extractCustomFiltersFromMegaFilters(filters) {
  const uuidFilters = {};

  for (const [key, value] of Object.entries(filters)) {
    if (UUID_REGEX.test(key)) {
      uuidFilters[key] = value;
    }
  }

  return uuidFilters;
}

export default checkIfTaskMatchesFilters;
