import moment from 'moment';
/* eslint-disable sonarjs/prefer-immediate-return */
import { isEmpty } from 'ramda';

const TASK_DUE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

const checkIfDueDateOptionsMatch = (options, taskDueDate) => {
  const momentDueDate = moment(taskDueDate, TASK_DUE_DATE_FORMAT);

  return options.some(dueDateOption => {
    return (
      (dueDateOption === 'OVERDUE' && moment().isAfter(momentDueDate)) ||
      (dueDateOption === 'DUE_TODAY' &&
        moment().isSame(momentDueDate, 'day')) ||
      (dueDateOption === 'DUE_TOMORROW' &&
        moment()
          .add(1, 'day')
          .isSame(momentDueDate, 'day')) ||
      (dueDateOption === 'DUE_THIS_WEEK' &&
        moment().isSame(momentDueDate, 'week')) ||
      (dueDateOption === 'DUE_THIS_MONTH' &&
        moment().isSame(momentDueDate, 'month'))
    );
  });
};
const checkIfCustomDueDateMatch = (
  customDueDateStart,
  customDueDateEnd,
  taskDueDate,
) => {
  return (
    (!customDueDateStart ||
      moment(taskDueDate, TASK_DUE_DATE_FORMAT).isSameOrAfter(
        moment(customDueDateStart, 'YYYY-MM-DD'),
      )) &&
    (!customDueDateEnd ||
      moment(taskDueDate, TASK_DUE_DATE_FORMAT).isSameOrBefore(
        moment(customDueDateEnd, 'YYYY-MM-DD'),
      ))
  );
};

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

  return (
    (!filters.priorityOptions ||
      isEmpty(filters.priorityOptions) ||
      filters.priorityOptions.some(
        priorityOption =>
          priorityOption === priority ||
          (priorityOption === 'LOW' && !priority),
      )) &&
    (!filters.workflowStatusOptions ||
      isEmpty(filters.workflowStatusOptions) ||
      filters.workflowStatusOptions.some(
        workflowStatusOption =>
          workflowStatusOption === workflowStatus ||
          (workflowStatusOption === 'NO_STATUS' && !workflowStatus),
      )) &&
    (!filters.assignedTo ||
      isEmpty(filters.assignedTo) ||
      filters.assignedTo.some(
        assignedToOption =>
          ((!assignedToUsers || isEmpty(assignedToUsers)) &&
            assignedToOption === 'UNASSIGNED') ||
          assignedToUsers.some(
            ({ userIdentifier }) => userIdentifier === assignedToOption,
          ),
      )) &&
    (!filters.assignedBy ||
      isEmpty(filters.assignedBy) ||
      filters.assignedBy.some(
        assignedByOption =>
          assignedByOption === assignedBy?.userIdentifier ||
          (assignedByOption === 'UNASSIGNED' && !assignedBy),
      )) &&
    (!filters.patients ||
      isEmpty(filters.patients) ||
      filters.patients.some(
        patientOption =>
          patientOption === patient?.patientIdentifier ||
          (patientOption === 'UNASSIGNED' && !patient),
      )) &&
    (!filters.taskLists ||
      isEmpty(filters.taskLists) ||
      filters.taskLists.some(
        taskListOption => taskListOption === taskList?.taskListIdentifier,
      )) &&
    (!filters.labels ||
      isEmpty(filters.labels) ||
      filters.labels.some(labelOption =>
        labels?.some(({ labelIdentifier }) => labelIdentifier === labelOption),
      )) &&
    checkIfMatchesDueDateCriteria(
      filters.customDueDateStart,
      filters.customDueDateEnd,
      filters.dueDateOptions,
      dueDate,
    )
  );
};

export default checkIfTaskMatchesFilters;
