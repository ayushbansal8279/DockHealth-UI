// @ts-nocheck

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClickAwayListener, IconButton } from '@mui/material'

import Spacing from '@/app/components/common/Spacing'
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu'
import { isEmail } from '@/app/components/user/InviteMemberToListForm/helpers'
import { Container, ExternalUserInviteFormWrapper, ItemAvatarWrapper, ItemFullName, ItemFullNameWrapper, ItemStatusLabel, ListItem, OptionContainer, OptionMenuWrapper } from '@/app/components/user/InviteMemberToListForm/styled'
import UserAvatar from '@/app/components/user/UserAvatar/UserAvatar'
import { isMemberPending } from '@/app/helpers/list-members-helper'
import { userProfileSelector } from '@/app/selectors/user-selectors'
import ListUsersAndGroupsSelect from '@/app/components/user/InviteMemberToListForm/ListUsersAndGroupsSelect/ListUsersAndGroupsSelect'
import ExternalInviteForm from '@/app/components/user/InviteMemberToListForm/ExternalInviteForm/ExternalInviteForm'
import { IconContainer, UserListWrapper } from './styled'
import ArrowRight from 'img/simple-arrow-right.svg';
import * as OrganizationApi from '@/app/api/organization-api';
import { changeWorkspaceUserRole, invitePersonToWorkspace, inviteUserToWorkspace, removeUserFromWorkspace } from '@/app/actions/workspace-actions'
import { getMenuOptionsForWorkspaceUser } from './helpers'
import { getWorkspaceMemberStatus } from '@/app/helpers/workspace-helpers'
import { workspaceUsersSelector } from '@/app/selectors/workspace-selectors'

const InviteUserToWorkspaceForm = ({
  identifier: workspaceIdentifier,
}) => {
  const dispatch = useDispatch();
  const [externalInviteFormState, setExternalInviteFormState] = useState({
    opened: false,
  });
  const [allOrganizationUsersAndGroupsFetched, setAllOrganizationUsersAndGroupsFetched] = useState(false);
  const [allOrganizationUsersAndGroups, setAllOrganizationUsersAndGroups] = useState([]);
  const [isSavingList, setIsSavingList] = useState(false);

  const listUsersAndGroups = useSelector(workspaceUsersSelector);
  // const isLoading = useSelector(isFetchingWorkspaceUsersSelector);
  
  useEffect(() => {
    setAllOrganizationUsersAndGroupsFetched(false);
    OrganizationApi.getOrganizationUsersAndUserGroups().then(
      (organizationMembers) => {
        setAllOrganizationUsersAndGroups(organizationMembers);
        setAllOrganizationUsersAndGroupsFetched(true);
      },
    );
  }, []);

  // TODO: reuse
  const organizationUsersAndGroupsNotInTheList = useMemo(
    () =>
      allOrganizationUsersAndGroups.filter(
        (organizationMember) =>
          !listUsersAndGroups.some(
            ({ identifier }) => organizationMember.identifier === identifier,
          ),
      ),
    [allOrganizationUsersAndGroups, listUsersAndGroups],
  );

  // TODO: get it from list
  const currentUserListRole = 'ADMIN';

  const userProfile = useSelector(userProfileSelector);

  const handleInviteMembers = (members) => {
    setIsSavingList(true);
    const newMemberIdentifier = members[0].identifier;

    dispatch(inviteUserToWorkspace({
      userIdentifier: newMemberIdentifier,
      workspaceIdentifier,
      onDone: () => setIsSavingList(false),
    }));
  }

  const handleOpenExternalInviteForm = (searchedValue) => {
    const [firstName, lastName] = searchedValue?.split(' ');
    const emailEntered = isEmail(searchedValue);
    setExternalInviteFormState({
      opened: true,
      initialValues: emailEntered
        ? { email: searchedValue }
        : {
            firstName: firstName
              ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
              : '',
            lastName: lastName
              ? lastName.charAt(0).toUpperCase() + lastName.slice(1)
              : '',
          },
    });
  };

  const handleCustomInvite = (data) => (
    new Promise((resolve, reject) => {
      dispatch(
        invitePersonToWorkspace({
          workspaceIdentifier,
          data,
          onSuccess: resolve,
          onFailure: reject,
        })
      );
    })
  )

  const handleRemoveUser = (userIdentifier) => {
    dispatch(
      removeUserFromWorkspace({
        userIdentifier,
        workspaceIdentifier
      })
    );
  }

  const changeUserRole = (userIdentifier, role) => {
    dispatch(changeWorkspaceUserRole({ 
      workspaceIdentifier, 
      userIdentifier, 
      role, 
    }));
  }

  return (
    <Container>
      <ListUsersAndGroupsSelect
        disabled={isSavingList}
        usersAndGroups={organizationUsersAndGroupsNotInTheList}
        isLoadingAvailablePeople={false}
        onActionButtonClick={handleInviteMembers}
        emptyListAction={handleOpenExternalInviteForm}
      />
      <Spacing vertical={4} />
      <UserListWrapper>
        {listUsersAndGroups
          .filter(user => user.userStatus === 'ACTIVE')
          .map((user) => {
          const status = getWorkspaceMemberStatus(user);
          return (
            <ListItem key={user.identifier}>
              <ItemAvatarWrapper isPending={isMemberPending(user)}>                
                <UserAvatar size={35} user={user} />
              </ItemAvatarWrapper>
              <ItemFullNameWrapper isPending={isMemberPending(user)}>
                <ItemFullName>
                  {user.name}{' '}
                  {user.identifier &&
                    user.identifier === userProfile?.identifier && (
                      <span>&nbsp;(me)</span>
                    )}
                </ItemFullName>
              </ItemFullNameWrapper>
              <OptionContainer>
                <ItemStatusLabel>
                  {status ? status : 'Member'}
                </ItemStatusLabel>
                <OptionMenuWrapper>
                {(currentUserListRole === 'ADMIN' ||
                  currentUserListRole === 'OWNER') && (
                  <OptionsMenu
                    placement="bottom-end"
                    options={getMenuOptionsForWorkspaceUser(user, {
                      changeUserRole,
                      removeUserFromWorkspace: handleRemoveUser,
                      // cancelInviteToWorkspace,
                      // resendInvitationToWorkspace,
                      // resendApprovalRequestToList,
                    })}
                    customButtonComponent={IconButton}
                    isDisabled={false}
                  >
                    <IconContainer src={ArrowRight} alt="arrow" />
                  </OptionsMenu>
                )}
                </OptionMenuWrapper>
              </OptionContainer>
            </ListItem>
          );
        })}
      </UserListWrapper>
      {externalInviteFormState.opened && (
        <ClickAwayListener
          onClickAway={() => setExternalInviteFormState({ opened: false })}
        >
          <ExternalUserInviteFormWrapper>
            <ExternalInviteForm
              initialValues={externalInviteFormState?.initialValues}
              customInviteMethod={handleCustomInvite}
              onInviteSuccess={refreshWorkspaceUsers}
              closeInviteForm={() => setExternalInviteFormState({ opened: false })}
            />
          </ExternalUserInviteFormWrapper>
        </ClickAwayListener>
      )}
    </Container>
  )
}

export default InviteUserToWorkspaceForm