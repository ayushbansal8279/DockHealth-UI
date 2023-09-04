import React, { useState, useCallback } from 'react';
import Modal from '@sendbird/uikit-react/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectChannel } from 'actions/sendbird-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import { useSendbirdStateContext } from '@sendbird/uikit-react';
import MultiAssignChatInviteMembersList from './MultiAssignChatInviteList';

const InviteUsersToChannelModal = ({ onClose }) => {
  const sendBirdContext = useSendbirdStateContext();

  const { identifier: currentUserId } = useSelector(userProfileSelector);
  const { organizationIdentifier } = useSelector(organizationSelector);

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
      customType: organizationIdentifier,
    };

    sendBirdContext.stores.sdkStore.sdk.groupChannel
      .createChannel(parameters)
      .then((channel) => {
        dispatch(selectChannel(channel));
      });

    onClose();
  }, [
    selectedMembers,
    currentUserId,
    organizationIdentifier,
    sendBirdContext.stores.sdkStore.sdk.groupChannel,
    onClose,
    dispatch,
  ]);

  return (
    <Modal
      titleText="Create New Conversation"
      submitText="Submit"
      type="PRIMARY"
      onCancel={() => {
        onClose();
      }}
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

export default InviteUsersToChannelModal;
