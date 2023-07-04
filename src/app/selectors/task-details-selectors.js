import { TaskOrigin } from 'helpers/task-helpers';
import { taskDetailsSelector } from 'selectors/list-details-selectors';
import { dashboardTaskDetailsSelector } from 'selectors/dashboard-selectors';
import { patientTaskDetailsSelector } from 'selectors/patient-details-selectors';
import { templateTaskDetailsSelector } from 'selectors/task-template-selectors';
import { userTaskDetailsSelector } from 'selectors/person-details-selectors';
import { globalTaskDetailsSelector } from 'selectors/global-search-selectors';

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
