/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from 'react';
import { splitAt } from 'ramda';
import Spacing from 'components/common/Spacing';
import UniversalTooltip from 'components/common/UniversalTooltip';
import Member from 'components/members/Member';
import { InviteMemberPopoverWithButton } from 'components/members/InviteMemberPopover';
import useBoolean from 'hooks/useBoolean';

import { MoreMembersButtonContainer } from './styled';

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

const TaskListMembers = ({ members, limit = 4 }) => {
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
      {shownMembers?.map(member => (
        <>
          <Spacing horizontal={2} />
          <Member member={member} size={40} />
        </>
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
    </>
  );
};

export default TaskListMembers;
