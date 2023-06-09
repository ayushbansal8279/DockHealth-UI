import React, { useEffect, useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import { getUserGroups, deleteUserGroup } from 'actions/user-groups-actions';
import { USERS_PATH } from 'routing/helpers/paths';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';
import toLower from 'ramda/src/toLower';
import compose from 'ramda/src/compose';

import {
  isFetchingUserGroupsSelector,
  defaultUserGroupsSelector,
  userGroupsSelector,
} from 'selectors/user-groups-selectors';
import {
  userProfileSelector,
  userHasUserGroupsFeatureSelector,
} from 'selectors/user-selectors';
import { locationParametersSelector } from 'location/selectors';
import {
  checkIfUserIsOrganizationAdmin,
  isUserGuest,
  isUserViewOnly,
} from 'helpers/user-helper';
import {
  DefaultUserGroupUrl,
  getUserGroupIdentifierByUrlParameter,
} from 'helpers/user-groups-helper';
import {
  DrawerMyListsLabel,
  DrawerListsItem,
  ListNameText,
  DrawerListsList,
  DrawerListsItemLoader,
  MenuLink,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CustomProfilesSubmenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const defaultGroups = useSelector(defaultUserGroupsSelector);
  const groups = useSelector(userGroupsSelector);
  const isFetching = useSelector(isFetchingUserGroupsSelector);
  const userGroupsAvailable = useSelector(userHasUserGroupsFeatureSelector);
  const { groupIdentifier: groupIdentifierUrlParameter } = useSelector(
    locationParametersSelector,
  );
  const isRouteActive = useRouteMatch(USERS_PATH);

  const activeGroupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );
  const currentUser = useSelector(userProfileSelector);
  const isGuest = isUserGuest(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const isInitialListFetching = isFetching && !defaultGroups;

  useEffect(() => {
    dispatch(getUserGroups());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCustomListClick = () => {
    dispatch(openModal('EditUserGroup'));
    dispatch(hideSubMenu());
  };

  const handleDeleteGroup = useCallback(
    (group) => {
      const modalProps = {
        title: 'Delete user group',
        description:
          'Are you sure you want to delete this user group? This action cannot be undone.',
        confirm: () => {
          if (group.identifier === activeGroupIdentifier) {
            history.push(`/`);
          }
          dispatch(deleteUserGroup(group.identifier));
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
      dispatch(hideSubMenu());
    },
    [dispatch, activeGroupIdentifier, history],
  );

  const sortedGroups = useMemo(
    () => (groups ? sortBy(compose(toLower, prop('name')), groups) : null),
    [groups],
  );

  return (
    <>
      <DrawerMyListsLabel>
        <div>Profiles</div>
      </DrawerMyListsLabel>
      <DrawerListsList flexShrink={0}>
        {isInitialListFetching ? (
          <>
            <DrawerListsItemLoader />
            <DrawerListsItemLoader />
            <DrawerListsItemLoader />
          </>
        ) : (
          <>
            <DrawerListsItem>
              <ListNameText>
                <MenuLink to="/custom-profiles">Facilities</MenuLink>
              </ListNameText>
            </DrawerListsItem>
            <DrawerListsItem>
              <ListNameText>
                <MenuLink to="/custom-profiles">Providers</MenuLink>
              </ListNameText>
            </DrawerListsItem>
            <DrawerListsItem>
              <ListNameText>
                <MenuLink to="/custom-profiles">Users</MenuLink>
              </ListNameText>
            </DrawerListsItem>
          </>
        )}
      </DrawerListsList>
    </>
  );
};

export default CustomProfilesSubmenu;
