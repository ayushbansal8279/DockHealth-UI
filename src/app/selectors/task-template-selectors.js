import { createSelector } from 'reselect';

export const taskTemplateStateSelector = state => state.taskTemplate;

export const taskTemplatesSelector = createSelector(
  taskTemplateStateSelector,
  ({ taskTemplates }) => taskTemplates,
);

export const isFetchingTaskTemplatesSelector = createSelector(
  taskTemplateStateSelector,
  ({ isFetching }) => isFetching,
);

export const taskTemplateDetailsSelector = taskTemplateIdentifier =>
  createSelector(
    taskTemplateStateSelector,
    ({ taskTemplateDetails }) => taskTemplateDetails[taskTemplateIdentifier],
  );

export const taskTemplateSelector = taskTemplateIdentifier =>
  createSelector(taskTemplateStateSelector, ({ taskTemplates }) =>
    taskTemplates.find(
      template => template.taskTemplateIdentifier === taskTemplateIdentifier,
    ),
  );

export const allTaskTemplateDetailsSelector = createSelector(
  taskTemplateStateSelector,
  ({ taskTemplateDetails }) => taskTemplateDetails,
);
