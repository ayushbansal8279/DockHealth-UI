/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { splitAt } from 'ramda';
import { openModal } from 'modal/actions';
import { isMemberPending } from 'helpers/list-members-helper';
import Spacing from 'components/common/Spacing';
import UniversalTooltip from 'components/common/UniversalTooltip/UniversalTooltip';
import Member from 'components/members/Member/Member';
import InviteMemberButton from 'components/members/InviteMemberButton/InviteMemberButton';
import useBoolean from 'hooks/useBoolean';

import { MoreMembersButtonContainer, MemberWrapper } from './styled';

const getMembersNames = ({ members }) =>
  members?.map(member => {
    if (!member) {
      return null;
    }

    const { firstName, lastName, userIdentifier } = member;

    return (
      <div key={userIdentifier}>
        {`${firstName ?? ''} ${lastName ?? ''}`.trim()}
      </div>
    );
  });

const TaskListMembers = ({ members, list, refreshMembers, limit = 4 }) => {
  const dispatch = useDispatch();
  const moreMembersButtonReference = useRef(null);
  const [shownMembers, hiddenMembers] = splitAt(limit, members ?? []);
  const hiddenMembersCount = hiddenMembers?.length;
  const [
    isShowMoreMembersTooltipOpen,
    showMoreMembersTooltip,
    hideMoreMembersTooltip,
  ] = useBoolean(false);

  return (
    <>
      {shownMembers?.map((member, index) => (
        <MemberWrapper
          isPending={isMemberPending(member)}
          key={member.userIdentifier}
        >
          {index !== 0 && <Spacing horizontal={2} />}
          <Member member={member} size={40} />
        </MemberWrapper>
      ))}
      {hiddenMembersCount > 0 && (
        <>
          <Spacing horizontal={1} />
          <UniversalTooltip
            placement="bottom"
            open={isShowMoreMembersTooltipOpen}
            anchorEl={moreMembersButtonReference.current}
          >
            {getMembersNames({ members: hiddenMembers })}
          </UniversalTooltip>
          <MoreMembersButtonContainer
            onMouseEnter={showMoreMembersTooltip}
            onMouseLeave={hideMoreMembersTooltip}
            ref={moreMembersButtonReference}
          >
            +{hiddenMembersCount}
          </MoreMembersButtonContainer>
        </>
      )}
      <Spacing horizontal={2} />
      <InviteMemberButton
        size={40}
        onClick={() =>
          dispatch(
            openModal('InviteToList', {
              list,
              onMembersRefresh: refreshMembers,
            }),
          )
        }
      />
    </>
  );
};

export default TaskListMembers;
