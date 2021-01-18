import sendEvent from 'api/usage-api';

const USER_EDUCATION_CATEGORY = 'User education';

const parseBooleanToLabel = value => (value ? 'On' : 'Off');

export const onFilterChanged = filter => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task list filter changed',
    eventLabel: filter || 'NONE',
  });
};

export const onSlimViewChanged = slimView => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Slim view option changed',
    eventLabel: parseBooleanToLabel(slimView),
  });
};

export const onHeadsUpDisplayToggled = displayHUD => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Heads up display toggled',
    eventLabel: parseBooleanToLabel(displayHUD),
  });
};

export const onNotificationsToggled = notifications => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Notifications toggled',
    eventLabel: parseBooleanToLabel(notifications),
  });
};

export const onButtonClicked = button => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Button',
    eventAction: 'Button clicked',
    eventLabel: button,
  });
};

export const onTaskStatusChanged = status => {
  const label = typeof status === 'string' ? status : status.label;

  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task status changed',
    label,
  });
};

export const onTaskPriorityChanged = priority => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task priority changed',
    eventLabel: priority,
  });
};

export const onSubtaskOrderChanged = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Subtask order changed',
  });
};

export const onTaskSortingChanged = (column, order) => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task priority changed',
    eventLabel: `Column: ${column}, Order: ${order}`,
  });
};

export const onTaskListAdded = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task list added',
  });
};

export const onTaskListDeleted = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task list deleted',
  });
};

export const onTaskListEdited = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task list edited',
  });
};

export const onTaskListLeft = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task list left',
  });
};

export const onTaskListInvitationAccepted = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task list invitation accepted',
  });
};

export const onTaskListInvitationRejected = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Task list',
    eventAction: 'Task list invitation rejected',
  });
};

export const onPatientAdded = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Patients',
    eventAction: 'Patient added',
  });
};

export const onPatientEdited = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Patients',
    eventAction: 'Patient edited',
  });
};

export const onPatientNoteAdded = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Patients',
    eventAction: 'Patient note added',
  });
};

export const onPatientNoteEdited = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'Patients',
    eventAction: 'Patient note edited',
  });
};

export const onAutoTourModalStepEnter = (modalName, stepKey) => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: `Auto | ${modalName}`,
    eventLabel: stepKey,
  });
};

export const onTourModalStepEnter = (modalName, stepKey) => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: modalName,
    eventLabel: stepKey,
  });
};

export const onTaskDrawerTourStepEnter = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Task drawer tour',
    eventLabel: stepKey,
  });
};

export const onNewUserTourEnter = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'First user tour',
    eventLabel: stepKey,
  });
};

export const onInboxTourEnter = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Inbox tour',
    eventLabel: stepKey,
  });
};

export const onListsTipsEvent = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Lists tips',
    eventLabel: stepKey,
  });
};

export const onListsTutorialModalEvent = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Lists tutorial modal',
    eventLabel: stepKey,
  });
};

export const onMentionsTourModalEvent = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Mentions modal',
    eventLabel: stepKey,
  });
};

export const onNotificationSettingsTourModalEvent = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Notification settings tour modal',
    eventLabel: stepKey,
  });
};

export const onLogin = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'User Auth',
    eventAction: 'User Login',
  });
};

export const onLogout = () => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: 'User Auth',
    eventAction: 'User Logout',
  });
};

export const onMenuTourStepEnter = stepKey => {
  sendEvent({
    usageEventType: 'USAGE_ACTION',
    eventCategory: USER_EDUCATION_CATEGORY,
    eventAction: 'Menu tour',
    eventLabel: stepKey,
  });
};
