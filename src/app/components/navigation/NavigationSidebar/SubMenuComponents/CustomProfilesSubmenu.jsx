import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import { getUserGroups, deleteUserGroup } from 'actions/user-groups-actions';
import palette from 'styles/palette';
import { Box } from '@mui/material';
import { createUserGroupPath, USERS_PATH } from 'routing/helpers/paths';
import AddButton from 'components/common/AddButton/AddButton';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { MoreVert } from '@mui/icons-material';
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
  userHasCustomProfilesFeatureSelector,
} from 'selectors/user-selectors';
import { locationParametersSelector } from 'location/selectors';
import {
  checkIfUserIsOrganizationAdmin,
  isUserGuestOrDockLite,
  isUserViewOnly,
} from 'helpers/user-helper';
import {
  DefaultUserGroupUrl,
  getUserGroupIdentifierByUrlParameter,
} from 'helpers/user-groups-helper';
import { getAllProfileTypes } from 'api/profile-type-api';
import UpgradePlan from 'components/common/UpgradePlan/UpgradePlan';
import UserGroupsIcon from 'img/premium/user-groups.svg';
import {
  DrawerMyListsLabel,
  DrawerListsItem,
  ListNameText,
  DrawerListsList,
  DrawerItemOptions,
  DrawerListsItemLoader,
  UpgradePlanContainer,
  MenuLink,
} from './styled';

const renderListItems = (list) =>
  list?.map(({ name, identifier }) => (
    <DrawerListsItem>
      <ListNameText>
        <MenuLink to={`/custom-profiles/${identifier}`}>{name}</MenuLink>
      </ListNameText>
    </DrawerListsItem>
  ));

// eslint-disable-next-line sonarjs/cognitive-complexity
const CustomProfilesSubmenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const defaultGroups = useSelector(defaultUserGroupsSelector);
  const groups = useSelector(userGroupsSelector);
  const isFetching = useSelector(isFetchingUserGroupsSelector);
  const userGroupsAvailable = useSelector(userHasUserGroupsFeatureSelector);
  const userHasCustomProfilesAvailable = useSelector(
    userHasCustomProfilesFeatureSelector,
  );
  const { groupIdentifier: groupIdentifierUrlParameter } = useSelector(
    locationParametersSelector,
  );
  const isRouteActive = useRouteMatch(USERS_PATH);

  const activeGroupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );
  const currentUser = useSelector(userProfileSelector);
  const isGuestOrDockLite = isUserGuestOrDockLite(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const isInitialListFetching = isFetching && !defaultGroups;

  const [profileTypes, setProfileTypes] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllProfileTypes();
        setProfileTypes(
          response?.map((type) => ({ ...type, id: type.identifier })),
        );
      } catch {
        setProfileTypes([]);
      }
    }
    fetchData();
    dispatch(getUserGroups());
  }, [dispatch]);

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
            {userHasCustomProfilesAvailable && (
              <>{profileTypes && renderListItems(profileTypes)}</>
            )}
            {defaultGroups?.map(({ identifier, name, usersCount }) => (
              <DrawerListsItem key={identifier}>
                <ListNameText
                  isActive={
                    isRouteActive && identifier === activeGroupIdentifier
                  }
                  onClick={() => {
                    history.push(
                      createUserGroupPath(DefaultUserGroupUrl[identifier]),
                    );
                  }}
                >
                  {name}
                </ListNameText>
                <DrawerItemOptions>
                  <div>{usersCount ?? 0}</div>
                  <Box m={1.5} />
                </DrawerItemOptions>
              </DrawerListsItem>
            ))}
            {!isGuestOrDockLite && (
              <DrawerListsItem>
                <ListNameText>
                  <MenuLink to="/settings/contacts">Contacts</MenuLink>
                </ListNameText>
              </DrawerListsItem>
            )}
          </>
        )}
      </DrawerListsList>
      {!isGuestOrDockLite && userGroupsAvailable && (
        <>
          <Box m={6} flexShrink={0} />
          <DrawerMyListsLabel>
            <div>User Groups</div>
            {isOrganizationAdmin && !isViewOnly && (
              <AddButton onClick={handleAddCustomListClick}>Add</AddButton>
            )}
          </DrawerMyListsLabel>
          <DrawerListsList>
            {isInitialListFetching ? (
              <>
                <DrawerListsItemLoader />
                <DrawerListsItemLoader />
              </>
            ) : (
              <>
                {sortedGroups?.map((group) => (
                  <DrawerListsItem key={group.identifier}>
                    <ListNameText
                      isActive={
                        isRouteActive &&
                        group.identifier === activeGroupIdentifier
                      }
                      onClick={() => {
                        history.push(createUserGroupPath(group.identifier));
                      }}
                    >
                      {group.name}
                    </ListNameText>
                    <DrawerItemOptions>
                      <div>{group.usersCount ?? 0}</div>
                      {isOrganizationAdmin ? (
                        <OptionsMenu
                          disablePortal
                          options={[
                            {
                              name: 'Edit',
                              onClick: () => {
                                dispatch(
                                  openModal('AddUserToGroup', {
                                    userGroupIdentifier: group.identifier,
                                  }),
                                );
                                dispatch(hideSubMenu());
                              },
                            },
                            {
                              name: 'Delete',
                              onClick: () => handleDeleteGroup(group),
                              color: palette.oPlusRed,
                            },
                          ]}
                        >
                          <MoreVert color="primary" />
                        </OptionsMenu>
                      ) : (
                        <Box m={1.5} />
                      )}
                    </DrawerItemOptions>
                  </DrawerListsItem>
                ))}
              </>
            )}
          </DrawerListsList>
        </>
      )}
      {!userGroupsAvailable && (
        <UpgradePlanContainer>
          <UpgradePlan
            title="Custom user groups"
            description="Build custom teams for group assignments, communication, and collaboration across workflows and care settings."
            iconImage={<img src={UserGroupsIcon} alt="Custom User Groups" />}
          />
        </UpgradePlanContainer>
      )}
    </>
  );
};

export default CustomProfilesSubmenu;
