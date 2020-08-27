import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Grid, IconButton, ClickAwayListener } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskListApi from 'api/tasklist-api';
import * as PeopleApi from 'api/people-api';
import { showAlert } from 'helpers/utility-functions';
import { getMemberStatus, isMemberPending } from 'helpers/list-members-helper';
import * as TaskListActions from 'actions/tasklist-actions';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import Member from 'components/members/Member/Member';
import Loader from 'components/common/Loader/Loader';
import ListMembersSelect from './ListMembersSelect/ListMembersSelect';
import ExternalInviteForm from './ExternalInviteForm/ExternalInviteForm';

import {
  LoaderWrapper,
  MembersListWrapper,
  MemberListItem,
  MemberFullName,
  MemberFullNameWrapper,
  MemberAvatarWrapper,
  MemberMenuWrapper,
  MemberMenuButton,
  MemberMenuButtonTitle,
  MemberMenuButtonDescription,
  MenuPopover,
  ExternalUserInviteFormWrapper,
  Container,
  MemberStatusLabel,
} from './styled';
import { getMenuOptionsForMember } from './helpers';

// eslint-disable-next-line sonarjs/cognitive-complexity
const InviteMemberToListForm = ({ list, onMembersRefresh }) => {
  const dispatch = useDispatch();

  const menuAnchor = useRef(null);

  const [isSavingList, setIsSavingList] = useState(false);
  const [isUpdatingMembersList, setIsUpdatingMembersList] = useState(false);
  const [listMembersFetched, setListMembersFetched] = useState(false);
  const [
    allOrganizationMembersFetched,
    setAllOrganizationMembersFetched,
  ] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMenuOptions, setCurrentMenuOptions] = useState(null);
  const [externalInviteFormState, setExternalInviteFormState] = useState({
    opened: false,
  });
  const [listMembers, setListMembers] = useState([]);
  const [allOrganizationMembers, setAllOrganizationMembers] = useState([]);

  useEffect(() => {
    setAllOrganizationMembersFetched(false);
    PeopleApi.findAllUsersByOrganizationId().then(organizationMembers => {
      setAllOrganizationMembers(organizationMembers);
      setAllOrganizationMembersFetched(true);
    });
  }, []);

  const refreshListMembers = (isInitial = false) => {
    if (listMembers.length === 0) {
      setListMembersFetched(false);
    } else {
      setIsUpdatingMembersList(true);
    }

    if (!isInitial && typeof onMembersRefresh === 'function')
      onMembersRefresh();

    TaskListApi.getMembersByTaskListId(list.taskListIdentifier, 'ALL')
      .then(members => {
        setListMembers(members);
        setListMembersFetched(true);
        setIsUpdatingMembersList(false);
      })
      .catch(() => {
        setIsUpdatingMembersList(false);
      });
  };

  useEffect(() => {
    if (list?.taskListIdentifier) {
      refreshListMembers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const userProfile = useSelector(state => state.userState.userProfile);

  const organizationMembersNotInTheList = useMemo(
    () =>
      allOrganizationMembers.filter(
        organizationMember =>
          !listMembers.some(
            ({ userIdentifier }) =>
              organizationMember.userIdentifier === userIdentifier,
          ),
      ),
    [allOrganizationMembers, listMembers],
  );

  const currentUserListRole = useMemo(() => {
    const currentUserInList = listMembers.find(
      ({ userIdentifier }) => userIdentifier === userProfile?.userIdentifier,
    );

    return currentUserInList?.taskListUserRole;
  }, [userProfile, listMembers]);

  const handleInviteMembers = members => {
    setIsSavingList(true);
    const newMembersIdentifiers = members.map(
      ({ userIdentifier }) => userIdentifier,
    );
    const requestTaskList = {
      taskListIdentifier: list.taskListIdentifier,
      memberIdentifiers: [...newMembersIdentifiers],
    };

    TaskListActions.saveTaskList(requestTaskList)(dispatch)
      .then(() => {
        refreshListMembers();
        setIsSavingList(false);
      })
      .catch(error => {
        setIsSavingList(false);
        showAlert({
          status: 'error',
          title: 'Error',
          text: error?.message ?? messages.submit.error,
        });
      });
  };

  const changeUserRole = (userIdentifier, role) => {
    setIsUpdatingMembersList(true);

    TaskListApi.changeUserRoleForList(
      list.taskListIdentifier,
      userIdentifier,
      role,
    )
      .then(() => {
        refreshListMembers();
      })
      .catch(() => {
        refreshListMembers();
      });
  };

  const removeUserFromList = userIdentifier => {
    setIsUpdatingMembersList(true);

    TaskListApi.removeUserFromTaskList(list.taskListIdentifier, userIdentifier)
      .then(() => {
        refreshListMembers();
      })
      .catch(() => {
        refreshListMembers();
      });
  };

  const cancelInviteToList = userIdentifier => {
    setIsUpdatingMembersList(true);

    TaskListApi.cancelInviteToTaskList(list.taskListIdentifier, userIdentifier)
      .then(() => {
        refreshListMembers();
      })
      .catch(() => {
        refreshListMembers();
      });
  };

  const resendInvitationToList = userIdentifier => {
    setIsUpdatingMembersList(true);

    TaskListApi.inviteUserToTaskList(list.taskListIdentifier, userIdentifier)
      .then(() => {
        refreshListMembers();
      })
      .catch(() => {
        refreshListMembers();
      });
  };

  const resendApprovalRequestToList = userIdentifier => {
    setIsUpdatingMembersList(true);

    PeopleApi.resendApprovalRequestUserForOrganization(userIdentifier)
      .then(() => {
        refreshListMembers();
      })
      .catch(() => {
        refreshListMembers();
      });
  };

  const handleOpenMenu = (event, member) => {
    menuAnchor.current = event.target;
    setCurrentMenuOptions(
      getMenuOptionsForMember(member, {
        changeUserRole,
        removeUserFromList,
        cancelInviteToList,
        resendInvitationToList,
        resendApprovalRequestToList,
      }),
    );
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    menuAnchor.current = null;
    setCurrentMenuOptions(null);
    setIsMenuOpen(false);
  };

  const handleOpenExternalInviteForm = searchedValue => {
    const [firstName, lastName] = searchedValue?.split(' ');
    setExternalInviteFormState({
      opened: true,
      initialValues: {
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
      {allOrganizationMembersFetched && listMembersFetched ? (
        <>
          <ListMembersSelect
            disabled={isSavingList}
            availablePeople={organizationMembersNotInTheList}
            isLoadingAvailablePeople={!allOrganizationMembersFetched}
            onAcitonButtonClick={handleInviteMembers}
            emptyListAction={handleOpenExternalInviteForm}
          />
          <Spacing vertical={4} />
          <MembersListWrapper>
            {listMembers.map(member => {
              const status = getMemberStatus(member);

              return (
                <MemberListItem key={member.userIdentifier}>
                  <MemberAvatarWrapper isPending={isMemberPending(member)}>
                    <Member size={38} member={member} />
                  </MemberAvatarWrapper>
                  <MemberFullNameWrapper isPending={isMemberPending(member)}>
                    <MemberFullName>
                      {member.userName}{' '}
                      {member.userIdentifier ===
                        userProfile?.userIdentifier && <span>&nbsp;(me)</span>}
                    </MemberFullName>
                  </MemberFullNameWrapper>
                  {status && <MemberStatusLabel>{status}</MemberStatusLabel>}
                  {currentUserListRole === 'ADMIN' && (
                    <IconButton
                      onClick={event => handleOpenMenu(event, member)}
                      disabled={isUpdatingMembersList}
                      size="small"
                      color="secondary"
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </MemberListItem>
              );
            })}
          </MembersListWrapper>
          {isUpdatingMembersList && (
            <>
              <Grid container direction="column" alignItems="center">
                <Spacing vertical={2} />
                <Loader />
                <Spacing vertical={2} />
              </Grid>
            </>
          )}
        </>
      ) : (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      )}
      {currentMenuOptions && (
        <MenuPopover
          anchorEl={menuAnchor?.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          transitionDuration={0}
        >
          <MemberMenuWrapper>
            {currentMenuOptions.map(({ title, description, action }) => (
              <MemberMenuButton
                key={title}
                type="button"
                onClick={() => {
                  handleCloseMenu();
                  action();
                }}
              >
                <MemberMenuButtonTitle>{title}</MemberMenuButtonTitle>
                {description && (
                  <MemberMenuButtonDescription>
                    {description}
                  </MemberMenuButtonDescription>
                )}
              </MemberMenuButton>
            ))}
          </MemberMenuWrapper>
        </MenuPopover>
      )}
      {externalInviteFormState.opened && (
        <ClickAwayListener
          onClickAway={() => setExternalInviteFormState({ opened: false })}
        >
          <ExternalUserInviteFormWrapper>
            <ExternalInviteForm
              taskListIdentifier={list?.taskListIdentifier}
              initialValues={externalInviteFormState?.initialValues}
              closeInviteForm={() =>
                setExternalInviteFormState({ opended: false })
              }
              onInviteSuccess={refreshListMembers}
            />
          </ExternalUserInviteFormWrapper>
        </ClickAwayListener>
      )}
    </Container>
  );
};

export default InviteMemberToListForm;
