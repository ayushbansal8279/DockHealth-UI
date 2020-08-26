import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Grid, IconButton, ClickAwayListener } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from 'img/modals/person';
import PeopleIcon from 'img/modals/people';
import * as TaskListApi from 'api/tasklist-api';
import * as PeopleApi from 'api/people-api';
import { showAlert } from 'helpers/utility-functions';
import * as TaskListActions from 'actions/tasklist-actions';
import Spacing from 'components/common/Spacing';
import messages from 'components/ListForm/messages';
import Member from 'components/members/Member';
import Loader from 'components/common/Loader/Loader';
import { Title, FormWrapper, Header, Description } from '../styled';
import ListMembersSelect from '../ListMembersSelect/ListMembersSelect';
import ExternalInviteForm from '../ExternalInviteForm/ExternalInviteForm';
import {
  InviteInitialViewWrapper,
  InviteInitialViewContent,
  NavigationActionButton,
  NavigationIcon,
  NavigationText,
  SkipButton,
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
} from './styled';
import {
  getMenuOptionsForMember,
  getMemberStatusLabel,
  isMemberPending,
} from './helpers';

const InviteMembersForm = ({
  closeModal,
  isListEditMode,
  list,
  setList,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();

  const menuAnchor = useRef(null);

  const [newListView, setNewListView] = useState(!isListEditMode);
  const [isSavingList, setIsSavingList] = useState(false);
  const [isUpdatingMembersList, setIsUpdatingMembersList] = useState(false);
  const [listMembers, setListMembers] = useState([]);
  const [listMembersFetched, setListMembersFetched] = useState(false);
  const [allOrganizationMembers, setAllOrganizationMembers] = useState([]);
  const [
    allOrganizationMembersFetched,
    setAllOrganizationMembersFetched,
  ] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMenuOptions, setCurrentMenuOptions] = useState(null);
  const [externalInviteFormState, setExternalInviteFormState] = useState({
    opened: false,
  });

  useEffect(() => {
    if (!newListView) {
      setAllOrganizationMembersFetched(false);
      PeopleApi.findAllUsersByOrganizationId().then(organizationMembers => {
        setAllOrganizationMembers(organizationMembers);
        setAllOrganizationMembersFetched(true);
      });
    }
  }, [newListView]);

  const refreshListMembers = () => {
    if (listMembers.length === 0) {
      setListMembersFetched(false);
    } else {
      setIsUpdatingMembersList(true);
    }

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
    if (!newListView && list?.taskListIdentifier) {
      refreshListMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newListView, list]);

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
      memberIdentifiers: [...list.memberIdentifiers, ...newMembersIdentifiers],
      adminIdentifiers: list.adminIdentifiers,
    };

    TaskListActions.saveTaskList(requestTaskList)(dispatch)
      .then(updatedList => {
        setList(updatedList);
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

    // TODO: update to correct endpoint
    TaskListApi.inviteUserToTaskList(list.taskListIdentifier, userIdentifier)
      .then(() => {
        refreshListMembers();
      })
      .catch(() => {
        refreshListMembers();
      });
  };

  // eslint-disable-next-line sonarjs/no-identical-functions
  const resendApprovalRequestToList = userIdentifier => {
    setIsUpdatingMembersList(true);

    // TODO: update to correct endpoint
    TaskListApi.inviteUserToTaskList(list.taskListIdentifier, userIdentifier)
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

  if (newListView) {
    return (
      <InviteInitialViewWrapper>
        <Header>
          <Title>Would you like to Invite people to this list</Title>
        </Header>
        <InviteInitialViewContent>
          <NavigationActionButton onClick={closeModal}>
            <Spacing vertical={5} />
            <NavigationIcon src={PersonIcon} alt="Just for me" />
            <Spacing vertical={5} />
            <NavigationText>This list is just for me</NavigationText>
          </NavigationActionButton>
          <NavigationActionButton onClick={() => setNewListView(false)}>
            <Spacing vertical={5} />
            <NavigationIcon src={PeopleIcon} alt="Invite others" />
            <Spacing vertical={5} />
            <NavigationText>Invite others to this list</NavigationText>
          </NavigationActionButton>
        </InviteInitialViewContent>
      </InviteInitialViewWrapper>
    );
  }

  return (
    <FormWrapper>
      <Grid container direction="column" justify="space-between">
        <Grid container item>
          <Header>
            <Title>Invite Others to this list</Title>
            <Description>
              Invite as many people as you’d like to share it with. The people
              you invite to this list will have access to the tasks, people and
              patients who are part of this list.
            </Description>
          </Header>
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
                {listMembers.map(member => (
                  <MemberListItem key={member.userIdentifier}>
                    <MemberAvatarWrapper isPending={isMemberPending(member)}>
                      <Member size={38} member={member} />
                    </MemberAvatarWrapper>
                    <MemberFullNameWrapper isPending={isMemberPending(member)}>
                      <MemberFullName>
                        {member.userName}{' '}
                        {member.userIdentifier ===
                          userProfile?.userIdentifier && (
                          <span>&nbsp;(me)</span>
                        )}
                      </MemberFullName>
                    </MemberFullNameWrapper>
                    {getMemberStatusLabel(member)}
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
                ))}
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
        </Grid>
        <Spacing vertical={4} />
        <SkipButton type="button" onClick={closeModal}>
          Skip
        </SkipButton>
      </Grid>
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
    </FormWrapper>
  );
};

export default InviteMembersForm;
