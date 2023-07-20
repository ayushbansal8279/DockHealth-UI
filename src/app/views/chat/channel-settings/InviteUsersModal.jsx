import React, { useState, useCallback, useEffect } from 'react';
import Modal from '@sendbird/uikit-react/ui/Modal';
import { useSelector } from 'react-redux';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import MultiAssignChatInviteMembersList from '../add-channel/MultiAssignChatInviteList';

const InviteUsersModal = ({ onCancel, onSubmit }) => {
  const channel = useSelector(selectedChatChannelSelector);

  const [, setMembers] = useState([]);
  const [, setHasNext] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    setSelectedMembers(channel.members);

    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then((returnedMembers) => {
      setMembers(returnedMembers);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);

  const handleSubmit = useCallback(async () => {
    const currentChannelMembers = channel.members;
    const selectedIdentifiers = selectedMembers.map(
      (member) => member.identifier,
    );

    const bannedMembersQuery = channel.createBannedUserListQuery();
    const bannedMembers = await bannedMembersQuery.next();

    const membersToUnban = selectedMembers.filter(({ identifier }) => {
      return bannedMembers.find(({ userId: id }) => id === identifier);
    });

    const deselectedMembers = currentChannelMembers.filter(
      ({ userId: identifier }) => {
        return !selectedMembers.find(({ identifier: id }) => id === identifier);
      },
    );

    await Promise.all(
      deselectedMembers.map(({ userId: identifier }) => {
        return channel.banUserWithUserId(identifier, -1, '');
      }),
      membersToUnban.map(({ identifier }) => {
        return channel.unbanUserWithUserId(identifier);
      }),
    );

    await channel.inviteWithUserIds(selectedIdentifiers);
    onSubmit();
  }, [channel, selectedMembers, onSubmit]);

  return (
    <Modal
      titleText="Invite To Conversation"
      submitText="Submit"
      type="PRIMARY"
      onCancel={onCancel}
      onSubmit={handleSubmit}
    >
      <MultiAssignChatInviteMembersList
        selectedMembers={selectedMembers}
        onSelect={(selected) => {
          setSelectedMembers(selected);
        }}
      />
    </Modal>
  );
};

export default InviteUsersModal;
