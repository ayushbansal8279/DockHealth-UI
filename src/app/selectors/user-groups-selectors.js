import { UserGroupType } from 'helpers/user-groups-helper';
import { createSelector } from 'reselect';

export const userGroupsStateSelector = (state) => state.userGroups;

export const userGroupsSelector = createSelector(
  userGroupsStateSelector,
  ({ groups }) =>
    groups?.filter(
      ({ listType }) =>
        listType === UserGroupType.CUSTOM || listType === undefined,
    ) || null,
);

export const defaultUserGroupsSelector = createSelector(
  userGroupsStateSelector,
  ({ groups }) =>
    groups?.filter(({ listType }) => listType === UserGroupType.DEFAULT) ||
    null,
);

export const isFetchingUserGroupsSelector = createSelector(
  userGroupsStateSelector,
  ({ isFetchingGroups }) => isFetchingGroups,
);

export const getUserGroupDetailsSelector = (userGroupIdentifier) =>
  createSelector(
    userGroupsStateSelector,
    ({ groupsDetails }) => groupsDetails[userGroupIdentifier] ?? null,
  );

export const getCurrentUserGroupDetailsSelector = createSelector(
  userGroupsStateSelector,
  ({ groupsDetails, currentGroup }) => groupsDetails[currentGroup] ?? null,
);

export const isCreatingUserGroupsSelector = createSelector(
  userGroupsStateSelector,
  ({ isCreatingGroup }) => isCreatingGroup,
);

export const creatingUserGroupsErrorSelector = createSelector(
  userGroupsStateSelector,
  ({ creatingError }) => creatingError,
);

export const isSavingUserGroupSelector = (userGroupIdentifier) =>
  createSelector(
    userGroupsStateSelector,
    ({ groupsDetails }) =>
      groupsDetails[userGroupIdentifier]?.isSaving ?? false,
  );

export const userGroupErrorSelector = (userGroupIdentifier) =>
  createSelector(
    userGroupsStateSelector,
    ({ groupsDetails }) => groupsDetails[userGroupIdentifier]?.error ?? false,
  );
