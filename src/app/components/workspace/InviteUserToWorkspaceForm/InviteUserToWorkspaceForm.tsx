// @ts-nocheck

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ClickAwayListener } from '@mui/material'

import Spacing from '@/app/components/common/Spacing'
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu'
import { getMenuOptionsForMember, isEmail } from '@/app/components/user/InviteMemberToListForm/helpers'
import { Container, ExternalUserInviteFormWrapper, ItemAvatarWrapper, ItemFullName, ItemFullNameWrapper, ItemStatusLabel, ListItem, OptionContainer, OptionMenuWrapper } from '@/app/components/user/InviteMemberToListForm/styled'
import UserAvatar from '@/app/components/user/UserAvatar/UserAvatar'
import { getMemberStatus, isMemberPending } from '@/app/helpers/list-members-helper'
import { userProfileSelector } from '@/app/selectors/user-selectors'
import { workspaceUsersDummyData } from '@/app/views/workspace/workspace-users/helper'
import ListUsersAndGroupsSelect from '@/app/components/user/InviteMemberToListForm/ListUsersAndGroupsSelect/ListUsersAndGroupsSelect'
import ExternalInviteForm from '@/app/components/user/InviteMemberToListForm/ExternalInviteForm/ExternalInviteForm'
import { UserListWrapper } from './styled'

const InviteUserToWorkspaceForm = () => {
  const [workspaceUsers, setWorkspaceUsers] = useState([
    {
      identifier: 5,
      name: 'AVeryLong UserNameMore',
      email: 'averylong.username@example.com',
      role: 'member',
      status: 'resend invite',
      isSelected: false,
    }
  ]);
  const [externalInviteFormState, setExternalInviteFormState] = useState({
    opened: false,
  });

  const userProfile = useSelector(userProfileSelector);

  const handleInviteMembers = () => {
    console.log("handle invite members func")
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

  const refreshWorkspaceUsers = () => {}

  const handleCustomInvite = (data) => {
    console.log("handle invite", data);
    // return CustomApi.inviteToSomething(data);
  };

  return (
    <Container>
      <ListUsersAndGroupsSelect
        // disabled={isSavingList}
        // usersAndGroups={organizationUsersAndGroupsNotInTheList}
        usersAndGroups={workspaceUsersDummyData}
        // isLoadingAvailablePeople={!allOrganizationUsersAndGroupsFetched}
        isLoadingAvailablePeople={false}
        onActionButtonClick={handleInviteMembers}
        emptyListAction={handleOpenExternalInviteForm}
      />
      <Spacing vertical={4} />
      <UserListWrapper>
        {workspaceUsers.map((user) => {
          const status = getMemberStatus(user);
          return (
            <ListItem key={user.identifier}>
              <ItemAvatarWrapper isPending={isMemberPending(user)}>
                {/* {isUserGroup(user) ? (
                  <GroupAvatar size={35} group={user} />
                ) : ( */}
                  <UserAvatar size={35} user={user} />
                {/* )} */}
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
                {/* {user.itemType === 'GROUP' && (
                  <ItemStatusLabel>Group</ItemStatusLabel>
                )} */}
                <OptionMenuWrapper>
                {/* {(currentUserListRole === 'ADMIN' ||
                  currentUserListRole === 'OWNER') && (
                  <OptionsMenu
                    placement="bottom-end"
                    options={getMenuOptionsForMember(user, {
                      changeUserRole,
                      removeUserFromList,
                      cancelInviteToList,
                      resendInvitationToList,
                      resendApprovalRequestToList,
                    })}
                    customButtonComponent={IconButton}
                    isDisabled={isUpdatingUsersAndGroupsList}
                  >
                    <IconContainer src={ArrowRight} alt="arrow" />
                  </OptionsMenu>
                )} */}
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
          <ExternalUserInviteFormWrapper
            // externalInvitePosition={externalInvitePosition}
          >
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