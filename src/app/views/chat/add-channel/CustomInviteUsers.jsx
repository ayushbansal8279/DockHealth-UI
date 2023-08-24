import React, { useState, useCallback } from 'react';
import { useCreateChannelContext } from '@sendbird/uikit-react/CreateChannel/context';
import Modal from '@sendbird/uikit-react/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectChannel } from 'actions/sendbird-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import MultiAssignChatInviteMembersList from './MultiAssignChatInviteList';

const InviteUsers = ({ onCancel }) => {
  const { createChannel } = useCreateChannelContext();

  const { identifier: currentUserId } = useSelector(userProfileSelector);

  const dispatch = useDispatch();

  const [selectedMembers, setSelectedMembers] = useState([]);

  const onSubmit = useCallback(() => {
    const parameters = {
      isPublic: false,
      isEphemeral: false,
      isDistinct: true,
      invitedUserIds: selectedMembers.map((member) => {
        return member.identifier;
      }),
      operatorUserIds: [currentUserId],
      name: '',
    };

    createChannel(parameters).then((channel) => {
      dispatch(selectChannel(channel));
    });

    onCancel();
  }, [selectedMembers, currentUserId, createChannel, onCancel, dispatch]);

  return (
    <Modal
      titleText="Create New Conversation"
      submitText="Submit"
      type="PRIMARY"
      onCancel={onCancel}
      onSubmit={onSubmit}
    >
      <MultiAssignChatInviteMembersList
        selectedMembers={[]}
        onSelect={(selected) => {
          setSelectedMembers(selected);
        }}
      />
    </Modal>
  );
};

export default InviteUsers;
