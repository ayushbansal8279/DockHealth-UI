import CloseIcon from '@material-ui/icons/Close';
import MoreIcon from '@material-ui/icons/MoreVert';
import React from 'react';
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

const renderMemberItem = member => {
  const invitationPending = member.status === 'PENDING';

  const memberName =
    `${member?.firstName ?? ''} ${member?.lastName ?? ''}`.trim() ||
    'List member';

  const memberRole = getFormattedMemberRole(member?.taskListUserRole);

  const isSignedUp = Boolean(member.userIdentifier);

  return (
    <MemberItem key={member.userIdentifier}>
      <TickIconContainer isSignedUp={isSignedUp}>
        {!invitationPending && <TickIconImage alt="tick" src={TickIcon} />}
      </TickIconContainer>
      <StyledMember isSignedUp={isSignedUp} member={member} />
      <MemberName isSignedUp={isSignedUp}>
        <span>{memberName}</span>
        {!isSignedUp && <NotSignedUpLabel>Has not signed up</NotSignedUpLabel>}
      </MemberName>
      <MemberRole>{!invitationPending && memberRole}</MemberRole>
      <MoreIconButton>
        <MoreIcon />
      </MoreIconButton>
    </MemberItem>
  );
};

const NotInvitingContent = ({
  closeMemberPopover,
  members,
  setInviting,
  isAdmin,
}) => (
  <>
    <PopoverHeader>
      <PopoverHeaderCloseButton onClick={closeMemberPopover}>
        <CloseIcon />
      </PopoverHeaderCloseButton>
      <span>Add to list</span>
    </PopoverHeader>
    <MembersContainer>{members.map(renderMemberItem)}</MembersContainer>
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
