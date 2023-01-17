import moment from 'moment';
import isEmpty from 'ramda/src/isEmpty';

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
    ((!filters.priorityOptions ||
      !filters.priorityOptions.options ||
      isEmpty(filters.priorityOptions.options) ||
      filters.priorityOptions.options.some(
        priorityOption =>
          priorityOption === priority ||
          (priorityOption === 'LOW' && !priority),
      )) &&
      (!filters.workflowStatusOptions ||
        !filters.workflowStatusOptions.options ||
        isEmpty(filters.workflowStatusOptions.options) ||
        filters.workflowStatusOptions.options.some(
          workflowStatusOption =>
            workflowStatusOption === workflowStatus ||
            (workflowStatusOption === 'NO_STATUS' && !workflowStatus),
        )) &&
      (!filters.assignedTo ||
        !filters.assignedTo.options ||
        isEmpty(filters.assignedTo.options) ||
        filters.assignedTo.options.some(
          assignedToOption =>
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
          assignedByOption =>
            assignedByOption === assignedBy?.userIdentifier ||
            (assignedByOption === 'UNASSIGNED' && !assignedBy),
        )) &&
      (!filters.patients ||
        !filters.patients.options ||
        isEmpty(filters.patients.options) ||
        filters.patients.options.some(
          patientOption =>
            patientOption === patient?.patientIdentifier ||
            (patientOption === 'UNASSIGNED' && !patient),
        )) &&
      (!filters.taskLists ||
        !filters.taskLists.options ||
        isEmpty(filters.taskLists.options) ||
        filters.taskLists.options.some(
          taskListOption => taskListOption === taskList?.taskListIdentifier,
        )) &&
      (!filters.labels ||
        !filters.labels.options ||
        isEmpty(filters.labels.options) ||
        filters.labels.options.some(labelOption =>
          labels?.some(
            ({ labelIdentifier }) => labelIdentifier === labelOption,
          ),
        )) &&
      !filters.taskDueDateOptions) ||
    checkIfMatchesDueDateCriteria(
      filters.taskDueDateOptions.dateStart,
      filters.taskDueDateOptions.dateEnd,
      filters.taskDueDateOptions.options,
      dueDate,
    )
  );
};

export default checkIfTaskMatchesFilters;
