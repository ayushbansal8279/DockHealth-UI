import prop from 'ramda/src/prop';
import { createSelector } from 'reselect';

export const taskTemplateStateSelector = (state) => state.taskTemplate;

export const taskTemplatesSelector = createSelector(
  taskTemplateStateSelector,
  ({ taskTemplates }) => taskTemplates,
);

export const taskTemplateBreadcrumbsSelector = createSelector(
  taskTemplateStateSelector,
  ({ breadcrumbs }) => breadcrumbs,
);

export const isFetchingTaskTemplatesSelector = createSelector(
  taskTemplateStateSelector,
  ({ isFetching }) => isFetching,
);

export const taskTemplateDetailsSelector = (taskTemplateIdentifier) =>
  createSelector(
    taskTemplateStateSelector,
    ({ taskTemplateDetails }) => taskTemplateDetails[taskTemplateIdentifier],
  );

export const templateTaskDetailsSelector = createSelector(
  taskTemplateStateSelector,
  (_, taskId) => taskId,
  (details, taskId) => details.tasksMap[taskId],
);

export const templateMultipleTaskDetailsSelector = createSelector(
  taskTemplateStateSelector,
  (_, taskIds) => taskIds,
  (details, taskIds) => taskIds.map((taskId) => details.tasksMap[taskId]),
);

export const taskTemplateSelector = (taskTemplateIdentifier) =>
  createSelector(taskTemplateStateSelector, ({ taskTemplates }) =>
    taskTemplates.find(
      (template) => template.identifier === taskTemplateIdentifier,
    ),
  );

export const allTemplateDetailsSelector = createSelector(
  taskTemplateStateSelector,
  ({ taskTemplateDetails }) => taskTemplateDetails,
);

export const allTasksSelector = createSelector(
  taskTemplateStateSelector,
  ({ taskTemplateDetails }) =>
    taskTemplateDetails
      ? Object.values(taskTemplateDetails)?.flatMap(({ tasks }) => tasks || [])
      : [],
);

export const currentTaskTemplateIdentifierSelector = createSelector(
  taskTemplateStateSelector,
  prop('currentTaskTemplateIdentifier'),
);

export const historyTaskTemplateSelector = createSelector(
  taskTemplateStateSelector,
  prop('taskTemplateHistoryDetails'),
);

export const currentTaskTemplateSelector = createSelector(
  taskTemplateStateSelector,
  prop('currentTaskTemplate'),
);

export const currentFolderIdentifierSelector = createSelector(
  taskTemplateStateSelector,
  prop('folderIdentifier'),
);

export const selectedTasksSelector = (state) =>
  state?.taskItems?.selectedTaskIdentifiers
    .filter((taskId) => state?.taskTemplate?.tasksMap[taskId] !== undefined)
    .map((taskId) => state?.taskTemplate?.tasksMap[taskId]);
