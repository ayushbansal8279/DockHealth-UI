import { List, ListItem } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { isEmpty, prop, sortBy, uniqBy } from 'ramda';
import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  cancelInviteToTaskList,
  changeUserRoleForList,
  // invitePersonToTaskList,
  inviteUserToTaskList,
  removeUserFromTaskList,
} from '../../actions/tasklist-actions';
import useBoolean from '../../hooks/useBoolean';
import TickIcon from '../../img/tick-icon';
import { MontserratTypography } from '../../theme-montserrat';
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

const inviteUserMethod = ({
  closeItemPopover,
  dispatch,
  member,
  taskListIdentifier,
}) => () => {
  inviteUserToTaskList(taskListIdentifier, member?.userIdentifier)(dispatch);
  closeItemPopover();
};

const getMemberItemPopoverData = ({
  dispatch,
  invitationPending,
  isSignedUp,
  isUserListMember,
  member,
  taskListIdentifier,
  closeItemPopover,
  notInTaskList,
}) => {
  if (notInTaskList) {
    return {
      topButtonOnClick: inviteUserMethod({
        closeItemPopover,
        dispatch,
        isSignedUp,
        member,
        taskListIdentifier,
      }),
      topButtonLabel: 'Invite to list',
    };
  }

  if (invitationPending) {
    return {
      topButtonOnClick: inviteUserMethod({
        closeItemPopover,
        dispatch,
        isSignedUp,
        member,
        taskListIdentifier,
      }),
      topButtonLabel: 'Resend invitation',
      bottomButtonOnClick: () => {
        cancelInviteToTaskList(taskListIdentifier, member?.email)(dispatch);
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
      )(dispatch);

      closeItemPopover();
    },
    topButtonLabel: isUserListMember ? 'Make an admin' : 'Remove as admin',
    bottomButtonOnClick: () => {
      removeUserFromTaskList(taskListIdentifier, member)(dispatch);
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
}) => {
  const moreIconButtonReference = useRef(null);
  const dispatch = useDispatch();
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
    dispatch,
    invitationPending,
    isSignedUp,
    isUserListMember,
    member,
    taskListIdentifier,
    closeItemPopover,
    notInTaskList,
  });

  const isCurrentUser = currentUser?.userIdentifier === member?.userIdentifier;

  const toggleInvitation = useCallback(() => {
    if (isCurrentUser) {
      return;
    }

    if (notInTaskList) {
      inviteUserMethod({
        closeItemPopover,
        dispatch,
        isSignedUp,
        member,
        taskListIdentifier,
      })();
    } else {
      if (invitationPending) {
        cancelInviteToTaskList(taskListIdentifier, member?.email)(dispatch);
      } else {
        removeUserFromTaskList(taskListIdentifier, member)(dispatch);
      }
      closeItemPopover();
    }
  }, [
    closeItemPopover,
    dispatch,
    invitationPending,
    isCurrentUser,
    isSignedUp,
    member,
    notInTaskList,
    taskListIdentifier,
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

const renderMemberItemElement = ({
  currentUser,
  taskList,
  membersNotInTaskListIdentifiers,
}) => member => {
  const memberIdentifier = member?.userIdentifier ?? member?.email;

  return (
    <MemberItemElement
      key={memberIdentifier}
      member={member}
      currentUser={currentUser}
      taskList={taskList}
      notInTaskList={membersNotInTaskListIdentifiers.includes(memberIdentifier)}
    />
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
  membersNotInTaskList,
  setInviting,
  isAdmin,
  currentUser,
  taskList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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
        <MontserratTypography variant="h4">
          Invite to {taskList?.listName ?? 'list'}
        </MontserratTypography>
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
      <MembersContainer>
        {allMembersSorted.map(
          renderMemberItemElement({
            currentUser,
            taskList,
            membersNotInTaskListIdentifiers,
          }),
        )}
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
  );
};

export default NotInvitingContent;
