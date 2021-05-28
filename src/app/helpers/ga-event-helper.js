import sendEvent from 'api/usage-api';

const USAGE_ACTION_EVENT_TYPE = 'USAGE_ACTION';

const TASK_DRAWER_CATEGORY = 'Task drawer';
const TASK_LIST_CATEGORY = 'Task list';
const TASK_GROUP_CATEGORY = 'Task group';
const ACTIVITY_ALERTS_CATEGORY = 'Activity alerts';
const PATIENTS_CATEGORY = 'Patients';
const USER_AUTH_CATEGORY = 'User Auth';
const USER_EDUCATION_CATEGORY = 'User education';

const parseBooleanToLabel = value => (value ? 'On' : 'Off');

// Task drawer

export function onTaskDrawerSubtaskAdd(source) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Add Sub Task',
    eventLabel: source,
  });
}

export function onTaskDrawerTaskAssigned() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Task assigned',
  });
}

export function onTaskDrawerTaskStatusChanged(label) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Task status changed',
    eventLabel: label || 'No status',
  });
}

export function onTaskDrawerPatientAdded() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Patient added',
  });
}

export function onTaskDrawerTaskPatientChanged() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Task patient changed',
  });
}

export function onTaskDrawerTaskPriorityChanged(value) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Task priority changed',
    eventLabel: value,
  });
}

export function onTaskDrawerSubtaskCompleted() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Subtask completed',
  });
}

export function onTaskDrawerSubtaskReActivated() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Subtask re-activated',
  });
}

export function onTaskDrawerSubtaskAssigned() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Subtask assigned',
  });
}

export function onTaskDrawerTaskDuplicated() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Task duplicated',
  });
}

export function onTaskDrawerTaskDeleted() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_DRAWER_CATEGORY,
    eventAction: 'Task deleted',
  });
}

// Task list

export function onFilterChanged(filterType) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Mega filter changed',
    eventLabel: filterType,
  });
}

export function onSearchChanged() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Search changed',
  });
}

export function onSortChanged(column, order) {
  if (column && order) {
    sendEvent({
      usageEventType: USAGE_ACTION_EVENT_TYPE,
      eventCategory: TASK_LIST_CATEGORY,
      eventAction: 'Sort changed',
      eventLabel: `Column: ${column}, Order: ${order}`,
    });
  }
}

export function onSlimViewChanged(slimView) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Slim view option changed',
    eventLabel: parseBooleanToLabel(slimView),
  });
}

export function onNotificationsToggled(notifications) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Notifications toggled',
    eventLabel: parseBooleanToLabel(notifications),
  });
}

export function onTaskStatusChanged(status) {
  const label = typeof status === 'string' ? status : status?.label;

  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task status changed',
    eventLabel: label || 'No status',
  });
}

export function onTaskDueDateChanged() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task due date changed',
  });
}

export function onTaskAssigned() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task assigned',
  });
}

export function onTaskCompleted() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task completed',
  });
}

export function onTaskReActivated() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task re-activated',
  });
}

export function onSubtaskCompleted() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Subtask completed',
  });
}

export function onSubtaskReActivated() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Subtask re-activated',
  });
}

export function onRightClickAction(actionName) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Right Click',
    eventLabel: actionName,
  });
}

export function onSubtaskAdded(source) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Add Sub Task',
    eventLabel: source,
  });
}

export function onMultiSelectAction(actionName) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Multi Select',
    eventLabel: actionName,
  });
}

export function onSubtaskOrderChanged() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Subtask order changed',
  });
}

export function onTaskOrderChanged() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task order changed',
  });
}

export function onPrint() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Print',
  });
}

export function onTaskListAdded() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task list added',
  });
}

export function onTaskListDeleted() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task list deleted',
  });
}

export function onTaskListEdited() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task list edited',
  });
}

export function onTaskListLeave() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task list leave',
  });
}

export function onTaskListInvitationRejected() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task list invitation rejected',
  });
}

export function onTaskListInvitationAccepted() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'Task list invitation accepted',
  });
}

export function onListMemberAdded() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'List Member',
    eventLabel: 'Added',
  });
}

export function onListMemberRemoved() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_LIST_CATEGORY,
    eventAction: 'List Member',
    eventLabel: 'Removed',
  });
}

// Task group

export function onTaskGroupExpanded() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_GROUP_CATEGORY,
    eventAction: 'Expanded',
  });
}

export function onTaskGroupCollapsed() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: TASK_GROUP_CATEGORY,
    eventAction: 'Collapsed',
  });
}

// Activity Alerts

export function onActivityAlertOpened() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: ACTIVITY_ALERTS_CATEGORY,
    eventAction: 'Opened',
  });
}

// Patients

export function onPatientAdded() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: PATIENTS_CATEGORY,
    eventAction: 'Patient added',
  });
}

export function onPatientEdited() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: PATIENTS_CATEGORY,
    eventAction: 'Patient edited',
  });
}

export function onPatientNoteAdded() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: PATIENTS_CATEGORY,
    eventAction: 'Patient note added',
  });
}

export function onPatientNoteEdited() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: PATIENTS_CATEGORY,
    eventAction: 'Patient note edited',
  });
}

export function onLogin() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_AUTH_CATEGORY,
    eventAction: 'User Login',
  });
}

export function onLogout() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_AUTH_CATEGORY,
    eventAction: 'User Logout',
  });
}

// User education

export function onAutoTourModalStepEnter(modalName, stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: `Auto | ${modalName}`,
    eventLabel: stepKey,
  });
}

export function onTourModalStepEnter(modalName, stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: modalName,
    eventLabel: stepKey,
  });
}

export function onTaskDrawerTourStepEnter(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Task drawer tour',
    eventLabel: stepKey,
  });
}

export function onNewUserTourEnter(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'First user tour',
    eventLabel: stepKey,
  });
}

export function onInboxTourEnter(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Inbox tour',
    eventLabel: stepKey,
  });
}

export function onListsTipsEvent(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Lists tips',
    eventLabel: stepKey,
  });
}

export function onListsTutorialModalEvent(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Lists tutorial modal',
    eventLabel: stepKey,
  });
}

export function onMentionsTourModalEvent(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Mentions modal',
    eventLabel: stepKey,
  });
}

export function onNotificationSettingsTourModalEvent(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Notification settings tour modal',
    eventLabel: stepKey,
  });
}

export function onMenuTourStepEnter(stepKey) {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Menu tour',
    eventLabel: stepKey,
  });
}

export function onHomeTipsOpened() {
  sendEvent({
    usageEventType: USAGE_ACTION_EVENT_TYPE,
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Home tips',
  });
}
