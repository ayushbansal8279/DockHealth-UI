export const CREATE_ACCOUNT_PATH = '/onboarding/create-account';
export const EULA_PATH = '/onboarding/eula';
export const BAA_OVERVIEW_PATH = '/onboarding/baa-overview';
export const BAA_CHECK_PATH = '/onboarding/baa-check';
export const BAA_INVITATION_SENT_PATH = '/onboarding/baa-invitation-sent';
export const ORG_SETUP_PATH = '/onboarding/organization-setup';
export const TEAM_SETUP_PATH = '/onboarding/team-setup';
export const QUESTIONS_PATH = '/onboarding/eula';
export const TRIAL_EXPIRATION_PATH = '/settings/trial-check';
export const HOME_PATH = '/core/home/my-tasks';
export const UNENROLLED_USER = '/auth/unEnrolledUser';
export const DEFAULT_REDIRECT_PATH = '/auth/login';
export const SUBS_SETTINGS_PATH = '/settings/subscriptions';
export const CUSTOM_FIELDS_SETTINGS_PATH = '/settings/custom-fields';
export const TASK_TEMPLATES_PATH = '/core/workflows';

export const TASK_LIST_PATH = '/core/tasks';
export const PATIENTS_LIST_ALL = '/core/patients/list/all';
export const PATIENTS_LIST = '/core/patients/list';

export const createTaskListPath = taskListIdentifier =>
  `${TASK_LIST_PATH}/${taskListIdentifier}`;

export const createPatientListPath = patientListIdentifier =>
  `${PATIENTS_LIST}/${patientListIdentifier}`;

export const createPatientDetailsPath = patientIdentifier =>
  `/core/patient/${patientIdentifier}`;

export const createPatientDetailsListPath = (
  patientIdentifier,
  taskListIdentifier,
) => `/core/patient/${patientIdentifier}/tasks/${taskListIdentifier}`;

export const createTaskTemplateDetailsPath = taskTemplateIdentifier =>
  `${TASK_TEMPLATES_PATH}/${taskTemplateIdentifier}`;
