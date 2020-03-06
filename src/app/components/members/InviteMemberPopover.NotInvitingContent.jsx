import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import CloseIcon from '@material-ui/icons/Close';
import MoreIcon from '@material-ui/icons/MoreVert';
import React, { useRef } from 'react';
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
  InviteLink,
  MemberItem,
  MemberName,
  MemberRole,
  MembersContainer,
  MoreIconButton,
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

const getMemberItemPopoverData = ({
  dispatch,
  invitationPending,
  isSignedUp,
  isUserListMember,
  member,
  taskListIdentifier,
  closeItemPopover,
}) =>
  invitationPending
    ? {
        topButtonOnClick: () => {
          if (isSignedUp) {
            inviteUserToTaskList(taskListIdentifier, member?.userIdentifier)(
              dispatch,
            );
          } else {
            invitePersonToTaskList(member, taskListIdentifier)(dispatch);
          }
          closeItemPopover();
        },
        topButtonLabel: 'Resend invitation',
        bottomButtonOnClick: () => {
          cancelInviteToTaskList(taskListIdentifier, member?.email)(dispatch);
          closeItemPopover();
        },
        bottomButtonLabel: 'Cancel invitation',
      }
    : {
        topButtonOnClick: () => {
          changeUserRoleForList(
            taskListIdentifier,
            member,
            isUserListMember ? 'ADMIN' : 'MEMBER',
          )(dispatch);

          closeItemPopover();
        },
        topButtonLabel: `Make ${isUserListMember ? 'an admin' : 'a member'}`,
        bottomButtonOnClick: () => {
          removeUserFromList(taskListIdentifier, member)(dispatch);
          closeItemPopover();
        },
        bottomButtonLabel: 'Remove from list',
      };

const MemberItemElement = ({ member, currentUser, taskList }) => {
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

  const isUserListMember = member?.role === 'MEMBER';

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
  });

  return (
    <MemberItem>
      <TickIconContainer isSignedUp={isSignedUp}>
        {!invitationPending && <TickIconImage alt="tick" src={TickIcon} />}
      </TickIconContainer>
      <StyledMember isSignedUp={isSignedUp} member={member} />
      <MemberName isSignedUp={isSignedUp}>
        <span>{memberName}</span>
        {!isSignedUp && <NotSignedUpLabel>Has not signed up</NotSignedUpLabel>}
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
          <ListItem button onClick={topButtonOnClick}>
            {topButtonLabel}
          </ListItem>
          <ListItem button onClick={bottomButtonOnClick}>
            {bottomButtonLabel}
          </ListItem>
        </List>
      </Popover>
    </MemberItem>
  );
};

const NotInvitingContent = ({
  closeMemberPopover,
  members,
  setInviting,
  isAdmin,
  currentUser,
  taskList,
}) => (
  <>
    <PopoverHeader>
      <PopoverHeaderCloseButton onClick={closeMemberPopover}>
        <CloseIcon />
      </PopoverHeaderCloseButton>
      <span>Add to list</span>
    </PopoverHeader>
    <MembersContainer>
      {members.map(member => (
        <MemberItemElement
          key={member?.userIdentifier ?? member?.email}
          member={member}
          currentUser={currentUser}
          taskList={taskList}
        />
      ))}
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

export default NotInvitingContent;
