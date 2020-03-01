import ReactGA from 'react-ga';

const parseBooleanToLabel = value => (value ? 'On' : 'Off');

export const onFilterChanged = filter => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task list filter changed',
    label: filter || 'NONE',
  });
};

export const onSlimViewChanged = slimView => {
  ReactGA.event({
    category: 'Task list',
    action: 'Slim view option changed',
    label: parseBooleanToLabel(slimView),
  });
};

export const onHeadsUpDisplayToggled = displayHUD => {
  ReactGA.event({
    category: 'Task list',
    action: 'Heads up display toggled',
    label: parseBooleanToLabel(displayHUD),
  });
};

export const onNotificationsToggled = notifications => {
  ReactGA.event({
    category: 'Task list',
    action: 'Notifications toggled',
    label: parseBooleanToLabel(notifications),
  });
};

export const onButtonClicked = button => {
  ReactGA.event({
    category: 'Button',
    action: 'Button clicked',
    label: button,
  });
};

export const onTaskStatusChanged = status => {
  const label = typeof status === 'string' ? status : status.label;

  ReactGA.event({
    category: 'Task list',
    action: 'Task status changed',
    label,
  });
};

export const onTaskPriorityChanged = priority => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task priority changed',
    label: priority,
  });
};

export const onSubtaskOrderChanged = () => {
  ReactGA.event({
    category: 'Task list',
    action: 'Subtask order changed',
  });
};

export const onTaskSortingChanged = (column, order) => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task priority changed',
    label: `Column: ${column}, Order: ${order}`,
  });
};

export const onTaskListAdded = () => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task list added',
  });
};

export const onTaskListDeleted = () => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task list deleted',
  });
};

export const onTaskListEdited = () => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task list edited',
  });
};

export const onTaskListLeft = () => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task list left',
  });
};

export const onTaskListInvitationAccepted = () => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task list invitation accepted',
  });
};

export const onTaskListInvitationRejected = () => {
  ReactGA.event({
    category: 'Task list',
    action: 'Task list invitation rejected',
  });
};

export const onPatientAdded = () => {
  ReactGA.event({
    category: 'Patients',
    action: 'Patient added',
  });
};

export const onPatientEdited = () => {
  ReactGA.event({
    category: 'Patients',
    action: 'Patient edited',
  });
};

export const onPatientNoteAdded = () => {
  ReactGA.event({
    category: 'Patients',
    action: 'Patient note added',
  });
};

export const onPatientNoteEdited = () => {
  ReactGA.event({
    category: 'Patients',
    action: 'Patient note edited',
  });
};

export const onLogin = () => {
  ReactGA.set({
    userIdentifier: sessionStorage.userIdentifier,
  });
};

export const onLogout = () => {
  ReactGA.set({
    userIdentifier: null,
  });
};
