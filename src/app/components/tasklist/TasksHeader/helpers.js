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
  ASSIGNED: 'ASSIGNED_TO',
  LIST_NAME: 'LIST_NAME',
};

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

export const getTaskHeaderOptions = (
  customerTypeLabel,
  groupHasMultipleAssignees,
  config,
  restrictions,
) => [
  {
    id: TaskHeaderColumn.DESCRIPTION,
    label: 'Tasks',
    draggable: false,
    shouldBeDisplayed: config[TaskHeaderColumn.DESCRIPTION],
  },
  {
    id: TaskHeaderColumn.SUBTASKS_COUNT,
    label: 'Sub',
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.SUBTASKS_COUNT],
    shouldBeDisplayed: config[TaskHeaderColumn.DESCRIPTION],
  },
  {
    id: TaskHeaderColumn.PATIENT,
    label: customerTypeLabel,
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.PATIENT],
    shouldBeDisplayed: config[TaskHeaderColumn.PATIENT],
  },
  {
    id: TaskHeaderColumn.WORKFLOW_STATUS,
    label: 'Status',
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.WORKFLOW_STATUS],
    shouldBeDisplayed: config[TaskHeaderColumn.WORKFLOW_STATUS],
  },
  {
    id: TaskHeaderColumn.ACTIVITY,
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.ACTIVITY],
    shouldBeDisplayed: config[TaskHeaderColumn.ACTIVITY],
  },
  {
    id: TaskHeaderColumn.START_DATE,
    label: 'Start',
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.START_DATE],
    shouldBeDisplayed: config[TaskHeaderColumn.START_DATE],
  },
  {
    id: TaskHeaderColumn.DUE_DATE,
    label: 'Due',
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.DUE_DATE],
    shouldBeDisplayed:
      config[TaskHeaderColumn.DUE_DATE] && restrictions?.dueDate !== DISABLED,
  },
  {
    id: TaskHeaderColumn.ASSIGNED,
    label: groupHasMultipleAssignees ? 'Assign' : 'Asgn',
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.ASSIGNED].WIDE,
    shouldBeDisplayed: config[TaskHeaderColumn.ASSIGNED],
  },
  {
    id: TaskHeaderColumn.LIST_NAME,
    label: 'List',
    draggable: true,
    width: TaskItemColumnWidth[TaskHeaderColumn.LIST_NAME],
    shouldBeDisplayed:
      config[TaskHeaderColumn.LIST_NAME] && restrictions?.listName !== DISABLED,
  },
];

export const reorderColumns = (
  currentColumnsOrder,
  { column, currentVisibleOrder },
) => {
  const { destination, source, draggableId } = column;
  const destinationElement = currentVisibleOrder[destination.index + +1];
  const fullListDestinationIndex = currentColumnsOrder.indexOf(
    destinationElement,
  );
  const newOrder = currentColumnsOrder.filter(c => c !== draggableId);
  newOrder.splice(fullListDestinationIndex, 0, draggableId);
  return newOrder;
};
