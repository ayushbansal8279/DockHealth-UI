import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { List, ListItem } from '@material-ui/core';
import * as TaskListApi from 'api/tasklist-api';
import { Close as CloseIcon } from '@material-ui/icons';
import { isEmpty, prop, sortBy, uniqBy } from 'ramda';
import useBoolean from 'hooks/useBoolean';
import TickIcon from 'img/tick-icon';
import { MontserratTypography } from 'styles/theme-montserrat';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import {
  HeaderSearch,
  HeaderSearchContainer,
  InviteLink,
  MemberActionsPopover,
  MemberInnerItem,
  MemberItem,
  MemberName,
  MemberRole,
  MembersContainer,
  NoMembersElement,
  NotSignedUpLabel,
  PopoverBottomSection,
  PopoverDivider,
  PopoverHeader,
  PopoverHeaderCloseButton,
  StyledMember,
  TickIconContainer,
  LoaderContainer,
} from './InviteMemberPopover.Styled';

const getFormattedMemberRole = ({ memberRole, invitationPending }) => {
  if (invitationPending) {
    return 'INVITED';
  }

  switch (memberRole) {
    case 'ADMIN':
      return 'Admin';
    case 'MEMBER':
      return 'Member';
    default:
      return '';
  }
};

const getMemberItemPopoverData = ({
  invitationPending,
  isUserListMember,
  member,
  taskListIdentifier,
  closeItemPopover,
  notInTaskList,
  inviteUserToTaskList,
  cancelInviteToTaskList,
  changeUserRoleForList,
  removeUserFromTaskList,
}) => {
  if (notInTaskList) {
    return {
      topButtonOnClick: () => {
        inviteUserToTaskList(taskListIdentifier, member);
        closeItemPopover();
      },
      topButtonLabel: 'Invite to list',
    };
  }

  if (invitationPending) {
    return {
      topButtonOnClick: () => {
        inviteUserToTaskList(taskListIdentifier, member);
        closeItemPopover();
      },
      topButtonLabel: 'Resend invitation',
      bottomButtonOnClick: () => {
        cancelInviteToTaskList(taskListIdentifier, member?.email);
        closeItemPopover();
      },
      bottomButtonLabel: 'Cancel invitation',
    };
  }

  return {
    topButtonOnClick: () => {
      changeUserRoleForList(
        taskListIdentifier,
        member,
        isUserListMember ? 'ADMIN' : 'MEMBER',
      );

      closeItemPopover();
    },
    topButtonLabel: isUserListMember ? 'Make an admin' : 'Remove as admin',
    bottomButtonOnClick: () => {
      removeUserFromTaskList(taskListIdentifier, member.userIdentifier);
      closeItemPopover();
    },
    bottomButtonLabel: 'Remove from list',
  };
};

const MemberItemElement = ({
  member,
  currentUser,
  taskList,
  notInTaskList,
  cancelInviteToTaskList,
  removeUserFromTaskList,
  inviteUserToTaskList,
  changeUserRoleForList,
}) => {
  const moreIconButtonReference = useRef(null);
  const invitationPending = member.status === 'PENDING';

  const [isItemPopoverOpen, openItemPopover, closeItemPopover] = useBoolean(
    false,
  );

  const memberName =
    `${member?.firstName ?? ''} ${member?.lastName ?? ''}`.trim() ||
    'List member';

  const memberRole = getFormattedMemberRole({
    memberRole: member?.taskListUserRole,
    invitationPending,
  });

  const isSignedUp =
    member.userStatus !== 'INVITED' && Boolean(member?.userIdentifier);

  const taskListIdentifier = taskList?.taskListIdentifier;

  const isUserListMember = member?.taskListUserRole === 'MEMBER';

  const memberSubLabel = (() => {
    if (!isSignedUp) {
      return 'Has not signed up';
    }

    if (invitationPending) {
      return 'Invited';
    }

    return '';
  })();

  const {
    topButtonOnClick,
    topButtonLabel,
    bottomButtonOnClick,
    bottomButtonLabel,
  } = getMemberItemPopoverData({
    invitationPending,
    isSignedUp,
    isUserListMember,
    member,
    taskListIdentifier,
    closeItemPopover,
    notInTaskList,
    inviteUserToTaskList,
    cancelInviteToTaskList,
    changeUserRoleForList,
    removeUserFromTaskList,
  });

  const isCurrentUser = currentUser?.userIdentifier === member?.userIdentifier;

  const toggleInvitation = useCallback(() => {
    if (isCurrentUser) {
      return;
    }

    if (notInTaskList) {
      inviteUserToTaskList(taskListIdentifier, member);
    } else {
      if (invitationPending) {
        cancelInviteToTaskList(taskListIdentifier, member?.email);
        removeUserFromTaskList(taskListIdentifier, member.userIdentifier);
      }
      closeItemPopover();
    }
  }, [
    inviteUserToTaskList,
    cancelInviteToTaskList,
    removeUserFromTaskList,
    closeItemPopover,
    invitationPending,
    taskListIdentifier,
    member,
    isCurrentUser,
    notInTaskList,
  ]);

  const hasUserAcceptedInvitation = isSignedUp && !invitationPending;

  return (
    <MemberItem key={member?.userIdentifier ?? member?.email}>
      <MemberInnerItem isCurrentUser={isCurrentUser} onClick={toggleInvitation}>
        <TickIconContainer>
          {!notInTaskList && <TickIcon active={hasUserAcceptedInvitation} />}
        </TickIconContainer>
        <StyledMember
          transparent={!hasUserAcceptedInvitation}
          member={member}
          size={40}
        />
        <MemberName transparent={!hasUserAcceptedInvitation}>
          <MontserratTypography variant="h4">
            <span>{memberName}</span>
            {memberSubLabel && (
              <NotSignedUpLabel>{memberSubLabel}</NotSignedUpLabel>
            )}
          </MontserratTypography>
        </MemberName>
      </MemberInnerItem>
      {memberRole && (
        <MemberRole
          isCurrentUser={isCurrentUser}
          invitationPending={invitationPending}
          onClick={openItemPopover}
          ref={moreIconButtonReference}
        >
          <MontserratTypography variant="h4">{memberRole}</MontserratTypography>
        </MemberRole>
      )}
      <MemberActionsPopover
        anchorEl={moreIconButtonReference.current}
        open={isItemPopoverOpen && !isCurrentUser}
        onClose={closeItemPopover}
        PaperProps={{
          elevation: 1,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List>
          {topButtonOnClick && topButtonLabel && (
            <ListItem button onClick={topButtonOnClick}>
              <MontserratTypography variant="h4">
                {topButtonLabel}
              </MontserratTypography>
            </ListItem>
          )}
          {bottomButtonLabel && bottomButtonOnClick && (
            <ListItem button onClick={bottomButtonOnClick}>
              <MontserratTypography variant="h4">
                {bottomButtonLabel}
              </MontserratTypography>
            </ListItem>
          )}
        </List>
      </MemberActionsPopover>
    </MemberItem>
  );
};

const memberFilterIteratee = ({ searchTerm }) => ({ firstName, lastName }) =>
  searchTerm
    ? firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase())
    : true;

const memberIdentifierIteratee = member =>
  member?.userIdentifier ?? member?.email;

const getMembersData = ({ members, membersNotInTaskList, searchTerm }) => {
  const filteredMembersIdentifiers = members.map(prop('userIdentifier'));

  const membersNotInTaskListIdentifiers = membersNotInTaskList
    .filter(
      ({ userIdentifier }) =>
        !filteredMembersIdentifiers.includes(userIdentifier),
    )
    .map(memberIdentifierIteratee);

  const allMembers = uniqBy(
    memberIdentifierIteratee,
    [...(members ?? []), ...(membersNotInTaskList ?? [])].filter(
      memberFilterIteratee({ searchTerm }),
    ),
  );

  const allMembersSorted = sortBy(
    ({ firstName, lastName }) =>
      `${firstName ?? ''} ${lastName ?? ''}`.trim().toLowerCase(),
    allMembers,
  );

  return {
    allMembersSorted,
    membersNotInTaskListIdentifiers,
  };
};

const NotInvitingContent = ({
  closeMemberPopover,
  members,
  setInviting,
  isAdmin,
  currentUser,
  taskList,
  cancelInviteToTaskList,
  removeUserFromTaskList,
  inviteUserToTaskList,
  changeUserRoleForList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [membersNotInTaskList, setMembersNotInTaskList] = useState([]);
  const [membersInitialized, setMembersInitialized] = useState(false);

  const { taskListIdentifier } = taskList;

  const fetchMembersNotInTaskList = useCallback(
    listId => {
      TaskListApi.getOrganizationUsersNotInTaskList(listId)
        .then(users => {
          setMembersNotInTaskList(users);
          setMembersInitialized(true);
        })
        .catch(() => {
          setMembersInitialized(true);
          setMembersNotInTaskList([]);
        });
    },
    [setMembersNotInTaskList],
  );

  useEffect(() => {
    fetchMembersNotInTaskList(taskListIdentifier);
  }, [fetchMembersNotInTaskList, taskListIdentifier, members]);

  const { allMembersSorted, membersNotInTaskListIdentifiers } = useMemo(
    () =>
      getMembersData({
        members,
        membersNotInTaskList,
        searchTerm,
      }),
    [members, membersNotInTaskList, searchTerm],
  );

  return (
    <>
      <PopoverHeader hasCloseButton>
        <MontserratTypography variant="h4">Invite to list</MontserratTypography>
        <PopoverHeaderCloseButton onClick={closeMemberPopover} edge="end">
          <CloseIcon />
        </PopoverHeaderCloseButton>
      </PopoverHeader>
      <HeaderSearchContainer>
        <HeaderSearch
          autoFocus
          fullWidth
          onChange={event => setSearchTerm(event.target.value)}
          value={searchTerm}
        />
      </HeaderSearchContainer>
      {membersInitialized ? (
        <>
          <MembersContainer>
            {allMembersSorted.map(member => {
              const memberIdentifier = member?.userIdentifier ?? member?.email;

              return (
                <MemberItemElement
                  key={memberIdentifier}
                  member={member}
                  currentUser={currentUser}
                  taskList={taskList}
                  notInTaskList={membersNotInTaskListIdentifiers.includes(
                    memberIdentifier,
                  )}
                  cancelInviteToTaskList={cancelInviteToTaskList}
                  removeUserFromTaskList={removeUserFromTaskList}
                  inviteUserToTaskList={inviteUserToTaskList}
                  changeUserRoleForList={changeUserRoleForList}
                />
              );
            })}
            {isEmpty(allMembersSorted) && (
              <NoMembersElement>
                <MontserratTypography variant="h4">
                  No members found.
                </MontserratTypography>
              </NoMembersElement>
            )}
          </MembersContainer>
          <PopoverDivider />
          <PopoverBottomSection>
            <MontserratTypography variant="h4">
              <span>Don&apos;t see who you&apos;re looking for?&nbsp;</span>
              {isAdmin ? (
                <InviteLink onClick={setInviting}>
                  Invite them to this list.
                </InviteLink>
              ) : (
                <span>
                  Ask an organizational admin to invite people to this list.
                </span>
              )}
            </MontserratTypography>
          </PopoverBottomSection>
        </>
      ) : (
        <LoaderContainer>
          <Loader size={LoaderSizes.medium} />
        </LoaderContainer>
      )}
    </>
  );
};

export default NotInvitingContent;
