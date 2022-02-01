import { createSelector } from 'reselect';
import { compose, path, prop } from 'ramda';
import { checkIfTemplateWorkflow } from 'helpers/workflow-helpers';

export const workflowDrawerStateSelector = state => state.workflowDrawer;

export const isWorkflowDrawerOpenSelector = createSelector(
  workflowDrawerStateSelector,
  prop('open'),
);

export const workflowIdentifierSelector = createSelector(
  workflowDrawerStateSelector,
  prop('workflowIdentifier'),
);

export const workflowSelector = createSelector(
  workflowDrawerStateSelector,
  prop('workflow'),
);

export const workflowCommentsSelector = createSelector(
  workflowDrawerStateSelector,
  path(['workflow', 'comments']),
);

export const workflowAttachmentsSelector = createSelector(
  workflowDrawerStateSelector,
  path(['workflow', 'attachments']),
);

export const workflowListIdentifierSelector = createSelector(
  workflowDrawerStateSelector,
  path(['workflow', 'taskListIdentifier']),
);

export const workflowAutofocusFieldSelector = createSelector(
  workflowDrawerStateSelector,
  prop('autoFocusFieldName'),
);

export const isFetchingHistorySelector = createSelector(
  workflowDrawerStateSelector,
  prop('isFetchingHistory'),
);

export const historySelector = createSelector(
  workflowDrawerStateSelector,
  prop('history'),
);

export const isWorkflowTemplateSelector = createSelector(
  workflowDrawerStateSelector,
  compose(checkIfTemplateWorkflow, prop('workflow')),
);
