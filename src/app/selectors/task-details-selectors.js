import { TaskOrigin } from 'helpers/task-helpers';
import {
  taskDetailsSelector,
  multipleTaskDetailsSelector,
} from 'selectors/list-details-selectors';
import {
  dashboardTaskDetailsSelector,
  dashboardMultipleTaskDetailsSelector,
} from 'selectors/dashboard-selectors';
import {
  patientTaskDetailsSelector,
  patientMultipleTaskDetailsSelector,
} from 'selectors/patient-details-selectors';
import {
  templateTaskDetailsSelector,
  templateMultipleTaskDetailsSelector,
} from 'selectors/task-template-selectors';
import {
  userTaskDetailsSelector,
  userMultipleTaskDetailsSelector,
} from 'selectors/person-details-selectors';
import {
  globalTaskDetailsSelector,
  globalMultipleTaskDetailsSelector,
} from 'selectors/global-search-selectors';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const taskLookupSelector = (state, origin, task) => {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  if (origin === TaskOrigin.LIST) {
    return taskDetailsSelector(
      state,
      typeof task === 'string' ? task : task?.identifier,
    );
  }
  if (origin === TaskOrigin.DASHBOARD) {
    return dashboardTaskDetailsSelector(
      state,
      typeof task === 'string' ? task : task?.identifier,
    );
  }
  if (origin === TaskOrigin.PATIENT) {
    return patientTaskDetailsSelector(
      state,
      typeof task === 'string' ? task : task?.identifier,
    );
  }
  if (origin === TaskOrigin.CUSTOM_PROFILE) {
    return patientTaskDetailsSelector(
      state,
      typeof task === 'string' ? task : task?.identifier,
    );
  }
  if (origin === TaskOrigin.TEMPLATE) {
    return templateTaskDetailsSelector(
      state,
      typeof task === 'string' ? task : task?.identifier,
    );
  }
  if (origin === TaskOrigin.GLOBAL) {
    return globalTaskDetailsSelector(
      state,
      typeof task === 'string' ? task : task?.identifier,
    );
  }
  if (origin === TaskOrigin.PERSON) {
    return userTaskDetailsSelector(
      state,
      typeof task === 'string' ? task : task?.identifier,
    );
  }
  return taskDetailsSelector(
    state,
    typeof task === 'string' ? task : task?.identifier,
  );
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const multipleTaskLookupSelector = (state, origin, taskIdentifiers) => {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  if (origin === TaskOrigin.LIST) {
    return multipleTaskDetailsSelector(state, taskIdentifiers);
  }
  if (origin === TaskOrigin.DASHBOARD) {
    return dashboardMultipleTaskDetailsSelector(state, taskIdentifiers);
  }
  if (origin === TaskOrigin.PATIENT) {
    return patientMultipleTaskDetailsSelector(state, taskIdentifiers);
  }
  if (origin === TaskOrigin.TEMPLATE) {
    return templateMultipleTaskDetailsSelector(state, taskIdentifiers);
  }
  if (origin === TaskOrigin.GLOBAL) {
    return globalMultipleTaskDetailsSelector(state, taskIdentifiers);
  }
  if (origin === TaskOrigin.PERSON) {
    return userMultipleTaskDetailsSelector(state, taskIdentifiers);
  }
  return multipleTaskDetailsSelector(state, taskIdentifiers);
};
