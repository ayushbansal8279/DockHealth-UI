import { createSelector } from 'reselect';

export const invitationStateSelector = state => state.invitationState;

export const pendingListsSelector = createSelector(
  invitationStateSelector,
  ({ pendingTasklists }) => pendingTasklists,
);
