import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import CloseIcon from '@material-ui/icons/Close';
import MoreIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import { isEmpty } from 'ramda';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  cancelInviteToTaskList,
  changeUserRoleForList,
  invitePersonToTaskList,
  inviteUserToTaskList,
  removeUserFromList,
} from '../../actions/tasklist-actions';
import useBoolean from '../../hooks/useBoolean';
import TickIcon from '../../img/tick-icon.svg';
import {
  HeaderSearch,
  HeaderSearchButton,
  HeaderSearchContainer,
  InviteLink,
  MemberItem,
  MemberName,
  MemberRole,
  MembersContainer,
  MoreIconButton,
  NoMembersElement,
  NotSignedUpLabel,
  PopoverBottomSection,
  PopoverDivider,
  PopoverHeader,
  PopoverHeaderCloseButton,
  StyledMember,
  TickIconContainer,
  TickIconImage,
} from './InviteMemberPopover.Styled';

const getFormattedMemberRole = memberRole => {
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
  isSignedUp,
  member,
  taskListIdentifier,
}) => () => {
  if (isSignedUp) {
    inviteUserToTaskList(taskListIdentifier, member?.userIdentifier)(dispatch);
  } else {
    invitePersonToTaskList(member, taskListIdentifier)(dispatch);
  }
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
      removeUserFromList(taskListIdentifier, member)(dispatch);
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

  const memberRole = getFormattedMemberRole(member?.taskListUserRole);

  const isSignedUp = Boolean(member?.userIdentifier);

  const taskListIdentifier = taskList?.taskListIdentifier;

  const isUserListMember = member?.taskListUserRole === 'MEMBER';

  const memberSubLabel = (() => {
    if (!isSignedUp) {
      return 'Has not signed up';
    }

    if (invitationPending) {
      return 'Invitation pending';
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

  const hasUserAcceptedInvitation = isSignedUp && !invitationPending;

  return (
    <MemberItem>
      <TickIconContainer transparent={!hasUserAcceptedInvitation}>
        {!notInTaskList && <TickIconImage alt="tick" src={TickIcon} />}
      </TickIconContainer>
      <StyledMember transparent={!hasUserAcceptedInvitation} member={member} />
      <MemberName transparent={!hasUserAcceptedInvitation}>
        <span>{memberName}</span>
        {memberSubLabel && (
          <NotSignedUpLabel>{memberSubLabel}</NotSignedUpLabel>
        )}
      </MemberName>
      <MemberRole>{!invitationPending && memberRole}</MemberRole>
      {currentUser?.userIdentifier !== member?.userIdentifier && (
        <div ref={moreIconButtonReference}>
          <MoreIconButton onClick={openItemPopover}>
            <MoreIcon />
          </MoreIconButton>
        </div>
      )}
      <Popover
        anchorEl={moreIconButtonReference.current}
        open={isItemPopoverOpen}
        onClose={closeItemPopover}
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
              {topButtonLabel}
            </ListItem>
          )}
          {bottomButtonLabel && bottomButtonOnClick && (
            <ListItem button onClick={bottomButtonOnClick}>
              {bottomButtonLabel}
            </ListItem>
          )}
        </List>
      </Popover>
    </MemberItem>
  );
};

const renderMemberItemElement = ({
  currentUser,
  taskList,
  notInTaskList = false,
}) => member => (
  <MemberItemElement
    key={member?.userIdentifier ?? member?.email}
    member={member}
    currentUser={currentUser}
    taskList={taskList}
    notInTaskList={notInTaskList}
  />
);

const memberFilterIteratee = ({ searchTerm }) => ({ firstName, lastName }) =>
  searchTerm
    ? firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase())
    : true;

const NotInvitingContent = ({
  closeMemberPopover,
  members,
  membersNotInTaskList,
  setInviting,
  isAdmin,
  currentUser,
  taskList,
}) => {
  const [isSearching, setSearching, resetSearching] = useBoolean(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm('');
  }, [isSearching]);

  const filteredMembers = members.filter(memberFilterIteratee({ searchTerm }));
  const filteredMembersNotInTaskList = membersNotInTaskList.filter(
    memberFilterIteratee({ searchTerm }),
  );

  return (
    <>
      <PopoverHeader>
        {isSearching ? (
          <HeaderSearchContainer>
            <HeaderSearch
              autoFocus
              onChange={event => setSearchTerm(event.target.value)}
              value={searchTerm}
              endAdornment={
                <HeaderSearchButton onClick={resetSearching}>
                  <CloseIcon />
                </HeaderSearchButton>
              }
            />
          </HeaderSearchContainer>
        ) : (
          <>
            <PopoverHeaderCloseButton onClick={closeMemberPopover}>
              <CloseIcon />
            </PopoverHeaderCloseButton>
            <span>Add to list</span>
            <PopoverHeaderCloseButton onClick={setSearching}>
              <SearchIcon />
            </PopoverHeaderCloseButton>
          </>
        )}
      </PopoverHeader>
      <MembersContainer>
        {filteredMembers.map(
          renderMemberItemElement({ currentUser, taskList }),
        )}
        {filteredMembersNotInTaskList.map(
          renderMemberItemElement({
            currentUser,
            taskList,
            notInTaskList: true,
          }),
        )}
        {isEmpty(filteredMembers) && isEmpty(filteredMembersNotInTaskList) && (
          <NoMembersElement />
        )}
      </MembersContainer>
      <PopoverDivider />
      <PopoverBottomSection>
        <div>
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
        </div>
      </PopoverBottomSection>
    </>
  );
};

export default NotInvitingContent;
