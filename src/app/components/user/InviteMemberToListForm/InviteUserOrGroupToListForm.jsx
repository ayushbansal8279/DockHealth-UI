import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  IconButton,
  ClickAwayListener,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskListApi from 'api/task-list-api';
import * as OrganizationApi from 'api/organization-api';
import { showAlert } from 'helpers/utility-functions';
import { getMemberStatus, isMemberPending } from 'helpers/list-members-helper';
import * as TaskListActions from 'actions/task-list-actions';
import Spacing from 'components/common/Spacing';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import Loader from 'components/common/Loader/Loader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import {
  onListMemberAdded,
  onListMemberRemoved,
} from 'helpers/ga-event-helper';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { userProfileSelector } from 'selectors/user-selectors';
import messages from './messages';
import ListUsersAndGroupsSelect from './ListUsersAndGroupsSelect/ListUsersAndGroupsSelect';
import ExternalInviteForm from './ExternalInviteForm/ExternalInviteForm';
import {
  LoaderWrapper,
  UserOrGroupListWrapper,
  ListItem,
  ItemFullName,
  ItemFullNameWrapper,
  ItemAvatarWrapper,
  ExternalUserInviteFormWrapper,
  Container,
  ItemStatusLabel,
  OptionContainer,
  IconContainer,
  OptionMenuWrapper,
} from './styled';
import { getMenuOptionsForMember, isEmail } from './helpers';
import ArrowRight from 'img/simple-arrow-right.svg';

const InviteUserOrGroupToListForm = ({
  list,
  onMembersRefresh,
  externalInvitePosition,
  workspaceIdentifier,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const [isSavingList, setIsSavingList] = useState(false);
  const [isUpdatingUsersAndGroupsList, setIsUpdatingUsersAndGroupsList] =
    useState(false);
  const [listUsersAndGroupsFetched, setListUsersAndGroupsFetched] =
    useState(false);
  const [
    allOrganizationUsersAndGroupsFetched,
    setAllOrganizationUsersAndGroupsFetched,
  ] = useState(false);
  const [externalInviteFormState, setExternalInviteFormState] = useState({
    opened: false,
  });
  const [listUsersAndGroups, setListUsersAndGroups] = useState([]);
  const [allOrganizationUsersAndGroups, setAllOrganizationUsersAndGroups] =
    useState([]);

  useEffect(() => {
    setAllOrganizationUsersAndGroupsFetched(false);
    OrganizationApi.getOrganizationUsersAndUserGroups(workspaceIdentifier).then(
      (organizationMembers) => {
        setAllOrganizationUsersAndGroups(organizationMembers);
        setAllOrganizationUsersAndGroupsFetched(true);
      },
    );
  }, []);

  const refreshListUsersAndGroups = (isInitial = false) => {
    if (listUsersAndGroups.length === 0) {
      setListUsersAndGroupsFetched(false);
    } else {
      setIsUpdatingUsersAndGroupsList(true);
    }

    if (!isInitial && typeof onMembersRefresh === 'function')
      onMembersRefresh();

    TaskListApi.getMembersByTaskListId(list.taskListIdentifier, 'ALL')
      .then((usersAndGroups) => {
        setListUsersAndGroups(usersAndGroups);
        setListUsersAndGroupsFetched(true);
        setIsUpdatingUsersAndGroupsList(false);
      })
      .catch(() => {
        setIsUpdatingUsersAndGroupsList(false);
      });
  };

  useEffect(() => {
    if (list?.taskListIdentifier) {
      refreshListUsersAndGroups(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const userProfile = useSelector(userProfileSelector);

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

  const currentUserListRole = useMemo(() => {
    const currentUserInList = listUsersAndGroups.find(
      ({ identifier }) => identifier === userProfile?.identifier,
    );

    return currentUserInList?.taskListUserRole;
  }, [userProfile, listUsersAndGroups]);

  const handleInviteMembers = (members) => {
    setIsSavingList(true);
    const newMembersIdentifiers = members.map(({ identifier }) => identifier);
    const requestTaskList = {
      taskListIdentifier: list.taskListIdentifier,
      memberIdentifiers: [...newMembersIdentifiers],
    };

    TaskListActions.inviteMultipleUsersToTaskList(
      requestTaskList.taskListIdentifier,
      requestTaskList.memberIdentifiers,
    )(dispatch)
      .then(() => {
        onListMemberAdded();
        refreshListUsersAndGroups();
        setIsSavingList(false);
      })
      .catch((error) => {
        setIsSavingList(false);
        showAlert({
          status: 'error',
          title: 'Error',
          text: error?.message ?? messages.submit.error,
        });
      });
  };

  const changeUserRole = (identifier, role) => {
    setIsUpdatingUsersAndGroupsList(true);

    TaskListApi.changeUserRoleForList(list.taskListIdentifier, identifier, role)
      .then(() => {
        refreshListUsersAndGroups();
      })
      .catch(() => {
        refreshListUsersAndGroups();
      });
  };

  const removeUserFromList = (identifier) => {
    setIsUpdatingUsersAndGroupsList(true);

    TaskListApi.removeUserFromTaskList(list.taskListIdentifier, identifier)
      .then(() => {
        onListMemberRemoved();
        refreshListUsersAndGroups();
      })
      .catch(() => {
        refreshListUsersAndGroups();
      });
  };

  const cancelInviteToList = (identifier) => {
    setIsUpdatingUsersAndGroupsList(true);

    TaskListApi.cancelInviteToTaskList(list.taskListIdentifier, identifier)
      .then(() => {
        refreshListUsersAndGroups();
      })
      .catch(() => {
        refreshListUsersAndGroups();
      });
  };

  const resendInvitationToList = (identifier) => {
    setIsUpdatingUsersAndGroupsList(true);

    TaskListApi.inviteUserToTaskList(list.taskListIdentifier, identifier)
      .then(() => {
        refreshListUsersAndGroups();
      })
      .catch(() => {
        refreshListUsersAndGroups();
      });
  };

  const resendApprovalRequestToList = (identifier) => {
    setIsUpdatingUsersAndGroupsList(true);

    OrganizationApi.resendApprovalRequestUserForOrganization(identifier)
      .then(() => {
        refreshListUsersAndGroups();
      })
      .catch(() => {
        refreshListUsersAndGroups();
      });
  };

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

  return (
    <Container>
      {allOrganizationUsersAndGroupsFetched && listUsersAndGroupsFetched ? (
        <>
          <ListUsersAndGroupsSelect
            disabled={isSavingList}
            usersAndGroups={organizationUsersAndGroupsNotInTheList}
            isLoadingAvailablePeople={!allOrganizationUsersAndGroupsFetched}
            onActionButtonClick={handleInviteMembers}
            emptyListAction={handleOpenExternalInviteForm}
          />
          <Spacing vertical={4} />
          <UserOrGroupListWrapper>
            {listUsersAndGroups.map((userOrGroup) => {
              const status = getMemberStatus(userOrGroup);
              return (
                <ListItem key={userOrGroup.identifier}>
                  <ItemAvatarWrapper isPending={isMemberPending(userOrGroup)}>
                    {isUserGroup(userOrGroup) ? (
                      <GroupAvatar size={35} group={userOrGroup} />
                    ) : (
                      <UserAvatar size={35} user={userOrGroup} />
                    )}
                  </ItemAvatarWrapper>
                  <ItemFullNameWrapper isPending={isMemberPending(userOrGroup)}>
                    <ItemFullName>
                      {userOrGroup.name}{' '}
                      {userOrGroup.identifier &&
                        userOrGroup.identifier === userProfile?.identifier && (
                          <span>&nbsp;(me)</span>
                        )}
                    </ItemFullName>
                  </ItemFullNameWrapper>
                  <OptionContainer>
                    <ItemStatusLabel>
                      {status ? status : 'Member'}
                    </ItemStatusLabel>
                    {userOrGroup.itemType === 'GROUP' && (
                      <ItemStatusLabel>Group</ItemStatusLabel>
                    )}
                    <OptionMenuWrapper>
                    {(currentUserListRole === 'ADMIN' ||
                      currentUserListRole === 'OWNER') && (
                      <OptionsMenu
                        placement="bottom-end"
                        options={getMenuOptionsForMember(userOrGroup, {
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
                    )}
                    </OptionMenuWrapper>
                  </OptionContainer>
                </ListItem>
              );
            })}
          </UserOrGroupListWrapper>
          {isUpdatingUsersAndGroupsList && (
            <Grid container direction="column" alignItems="center">
              <Spacing vertical={3} />
              <Loader />
            </Grid>
          )}
        </>
      ) : (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      )}
      {externalInviteFormState.opened && (
        <ClickAwayListener
          onClickAway={() => setExternalInviteFormState({ opened: false })}
        >
          <ExternalUserInviteFormWrapper
            externalInvitePosition={externalInvitePosition}
          >
            <ExternalInviteForm
              taskListIdentifier={list?.taskListIdentifier}
              initialValues={externalInviteFormState?.initialValues}
              closeInviteForm={() =>
                setExternalInviteFormState({ opended: false })
              }
              onInviteSuccess={refreshListUsersAndGroups}
            />
          </ExternalUserInviteFormWrapper>
        </ClickAwayListener>
      )}
    </Container>
  );
};

export default InviteUserOrGroupToListForm;
