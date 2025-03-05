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
export const HOME_SHARED_PATH = '/core/home/shared-with-me-tasks';
export const HOME_ALL_TASKS_PATH = '/core/home/all-tasks';
export const HOME_UPCOMING_TASKS_PATH = '/core/home/upcoming-tasks';
export const HOME_OVERDUE_TASKS_PATH = '/core/home/overdue-tasks';
export const HOME_COMPLETED_TASKS_PATH = '/core/home/completed-tasks';
export const UNENROLLED_USER = '/auth/unEnrolledUser';
export const DEFAULT_REDIRECT_PATH = '/auth/login';
export const SUBS_SETTINGS_PATH = '/settings/subscriptions';
export const SUBS_EXPIRED_PATH = '/settings/subscription-expired';
export const SUBS_PAYMENT_PATH = '/settings/subscription-payment';
export const SUBS_PAYMENT_FINISHED_PATH =
  '/settings/subscription-payment-finished';
export const USERS_SETTINGS_PATH = '/settings/users';
export const POFILES_SETTINGS_PATH = '/settings/profiles';
export const TASK_CUSTOMIZATIONS_PATH = '/settings/task-customizations';
export const CUSTOM_FIELDS_SETTINGS_PATH = '/settings/custom-fields';
export const DEVELOPERS_PATH = '/settings/developers';
export const WORKFLOW_LIBRARY_PATH = '/core/workflows/library';
export const WORKFLOW_BUILDER_PATH = '/core/workflows/builder';
export const CUSTOM_PROFILES_PATH = '/core/custom-profiles';
export const USERS_PATH = '/core/people';
export const SINGLE_TASK_PATH = '/core/task';

export const TASK_LIST_PATH = '/core/tasks';
export const PATIENTS_LIST_ALL = '/core/patients/list/all';
export const PATIENTS_LIST_WITH_TASKS = '/core/patients/list/active';
export const PATIENTS_LIST_ARCHIVED = '/core/patients/list/archived';
export const PATIENTS_LIST = '/core/patients/list';
export const PATIENTS_LIST_CUSTOM = '/core/patients/list/custom';

export const CHAT_PATH = '/core/chat';

export const createSingleTaskPath = (taskIdentifier) =>
  `${SINGLE_TASK_PATH}/${taskIdentifier}`;

export const createTaskListPath = (taskListIdentifier) =>
  `${TASK_LIST_PATH}/${taskListIdentifier}`;

export const createPatientListPath = (patientListIdentifier) =>
  `${PATIENTS_LIST}/${patientListIdentifier}`;

export const createPatientDetailsPath = (patientIdentifier) =>
  `/core/patient/${patientIdentifier}`;

export const createPatientAttachmentsPath = (
  patientIdentifier,
  folderIdentifier = null,
) =>
  `/core/patient/${patientIdentifier}/files${
    folderIdentifier ? `/${folderIdentifier}` : ``
  }`;

export const createPatientDetailsListPath = (
  patientIdentifier,
  taskListIdentifier,
) => `/core/patient/${patientIdentifier}/tasks/${taskListIdentifier}`;

export const createWorkflowBuilderPath = (workflowIdentifier) =>
  `${WORKFLOW_BUILDER_PATH}/${workflowIdentifier}`;

export const createWorkflowFolderPath = (folderIdentifier) =>
  `${WORKFLOW_LIBRARY_PATH}/${folderIdentifier}`;

export const createUserGroupPath = (groupIdentifier) =>
  USERS_PATH + (groupIdentifier ? `/${groupIdentifier}` : '');

export const createProfileListPath = (profileTypeIdentifier, profileIdentifier) =>
  `${CUSTOM_PROFILES_PATH}/${profileTypeIdentifier}/${profileIdentifier}`;