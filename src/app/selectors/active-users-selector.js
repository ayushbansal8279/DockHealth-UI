import { createSelector } from 'reselect';

export const activeUsersStateSelector = (state) => state.activeUsers;

export const activeUsersListSelector = createSelector(
  activeUsersStateSelector,
  ({ activeUsersList }) => activeUsersList,
);
