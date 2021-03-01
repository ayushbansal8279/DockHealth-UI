import React from 'react';
import { useDispatch } from 'react-redux';
import { splitAt } from 'ramda';
import { openModal } from 'modal/actions';
import { isMemberPending } from 'helpers/list-members-helper';
import Spacing from 'components/common/Spacing';
import Member from 'components/members/Member/Member';
import InviteMemberButton from 'components/members/InviteMemberButton/InviteMemberButton';
import AdditionalMembersCounter from 'components/members/AdditionalMembersCounter/AdditionalMembersCounter';
import { MemberWrapper } from './styled';

const TaskListMembers = ({ members, list, refreshMembers, limit = 4 }) => {
  const dispatch = useDispatch();
  const [shownMembers, hiddenMembers] = splitAt(limit, members ?? []);

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
      {hiddenMembers?.length > 0 && (
        <>
          <Spacing horizontal={1} />
          <AdditionalMembersCounter hiddenMembers={hiddenMembers} size={40} />
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
