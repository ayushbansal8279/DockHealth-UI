import { PatientAttachmentType } from 'helpers/patient-details-helpers';
import { createSelector } from 'reselect';

export const patientDetailsStateSelector = (state) => state.patientDetails;

export const patientTaskListsSelector = createSelector(
  patientDetailsStateSelector,
  ({ lists }) => lists,
);

export const isFetchingPatientTaskListsSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetching }) => isFetching,
);

export const completeTasksVisibilitySelector = createSelector(
  patientDetailsStateSelector,
  ({ completeTasksVisible }) => completeTasksVisible,
);

export const currentListTasksStatusSelector = createSelector(
  patientDetailsStateSelector,
  ({ currentTasksStatus }) => currentTasksStatus,
);

export const patientTaskDetailsSelector = createSelector(
  patientDetailsStateSelector,
  (_, taskId) => taskId,
  (patientDetails, taskId) => patientDetails.tasksMap[taskId],
);

export const patientMultipleTaskDetailsSelector = createSelector(
  patientDetailsStateSelector,
  (_, taskIds) => taskIds,
  (patientDetails, taskIds) =>
    taskIds.map((taskId) => patientDetails.tasksMap[taskId]),
);

export const patientListHasTasksSelector = createSelector(
  patientDetailsStateSelector,
  ({ lists }) => lists?.length > 0,
);

export const currentPatientIdentifierSelector = createSelector(
  patientDetailsStateSelector,
  ({ patientIdentifier }) => patientIdentifier,
);

export const currentFolderIdentifierSelector = createSelector(
  patientDetailsStateSelector,
  ({ currentFolderIdentifier }) => currentFolderIdentifier,
);

export const patientTaskSearchSelector = createSelector(
  patientDetailsStateSelector,
  ({ taskSearch }) => taskSearch,
);

export const completeTasksCountSelector = createSelector(
  patientDetailsStateSelector,
  ({ completeTasksCount }) => completeTasksCount,
);

export const patientTasksSortSelector = createSelector(
  patientDetailsStateSelector,
  ({ sort }) => sort,
);

export const patientSelector = createSelector(
  patientDetailsStateSelector,
  ({ patient }) => patient,
);

export const patientNotesSelector = createSelector(
  patientDetailsStateSelector,
  ({ patient }) => patient?.allNotes || null,
);

export const isFetchingNotesSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetchingPatient }) => isFetchingPatient,
);

export const isFetchingPatientSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetchingPatient }) => isFetchingPatient,
);

export const isFetchingPatientLabelsSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetchingLabels }) => isFetchingLabels,
);

export const patientLabelsSelector = createSelector(
  patientDetailsStateSelector,
  ({ labels }) => labels,
);

export const isFetchingPatientAttachmentsSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetchingAttachments }) => isFetchingAttachments,
);

export const patientAttachmentsSelector = createSelector(
  patientDetailsStateSelector,
  ({ attachments }) =>
    attachments?.filter(({ type }) => type !== PatientAttachmentType.FOLDER) ??
    null,
);

export const patientFoldersSelector = createSelector(
  patientDetailsStateSelector,
  ({ attachments }) =>
    attachments?.filter(({ type }) => type === PatientAttachmentType.FOLDER) ??
    null,
);

export const selectedTasksSelector = (state) =>
  state?.taskItems?.selectedTaskIdentifiers.map(
    (taskId) => state?.patientDetails?.tasksMap[taskId],
  );
