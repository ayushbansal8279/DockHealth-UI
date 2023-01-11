import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import splitAt from 'ramda/src/splitAt';
import { openModal } from 'modal/actions';
import { isMemberPending } from 'helpers/list-members-helper';
import Spacing from 'components/common/Spacing';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import InviteMemberButton from 'components/user/InviteMemberButton/InviteMemberButton';
import AdditionalMembersCounter from 'components/user/AdditionalMembersCounter/AdditionalMembersCounter';
import { userProfileSelector } from 'selectors/user-selectors';
import { isUserGuest, isUserViewOnly } from 'helpers/user-helper';
import { MemberWrapper } from './styled';

const TaskListMembers = ({ members, list, refreshMembers, limit = 4 }) => {
  const dispatch = useDispatch();
  const [shownMembers, hiddenMembers] = splitAt(limit, members ?? []);

  const currentUser = useSelector(userProfileSelector);
  const isGuest = isUserGuest(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  return (
    <>
      {shownMembers?.map((member, index) => (
        <MemberWrapper
          key={member.userIdentifier}
          isPending={isMemberPending(member)}
        >
          {index !== 0 && <Spacing horizontal={2} />}
          <UserAvatar user={member} size={40} />
        </MemberWrapper>
      ))}
      {hiddenMembers?.length > 0 && (
        <>
          <Spacing horizontal={1} />
          <AdditionalMembersCounter hiddenMembers={hiddenMembers} size={40} />
        </>
      )}
      <Spacing horizontal={2} />
      {!isGuest &&
        !isViewOnly &&
        list?.listType !== 'INBOX' &&
        list?.listType !== 'PUBLIC' && (
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
        )}
    </>
  );
};

export default TaskListMembers;
