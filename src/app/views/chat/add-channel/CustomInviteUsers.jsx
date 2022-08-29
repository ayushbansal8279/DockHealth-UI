import React, { useState, useContext, useCallback } from 'react';
import { useCreateChannelContext } from '@sendbird/uikit-react/CreateChannel/context';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import Modal from '@sendbird/uikit-react/ui/Modal';
import MultiAssignChatInviteMembersList from './MultiAssignChatInviteList';
import SelectedChannelContext from '../SelectedChannelContext';

const InviteUsers = ({ onCancel }) => {
  const { createChannel } = useCreateChannelContext();

  const globalStore = useSendbirdStateContext();
  const sdkInstance = sendBirdSelectors.getSdk(globalStore);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const { setSelectedChannel } = useContext(SelectedChannelContext);

  const onSubmit = useCallback(() => {
    const parameters = new sdkInstance.GroupChannelParams();
    parameters.isPublic = false;
    parameters.isEphemeral = false;
    parameters.isDistinct = true;
    parameters.addUserIds(
      selectedMembers.map(member => {
        return member.identifier;
      }),
    );
    parameters.name = '';

    createChannel(parameters).then(channel => {
      setSelectedChannel(channel);
    });

    onCancel();
  }, [
    createChannel,
    onCancel,
    sdkInstance.GroupChannelParams,
    selectedMembers,
    setSelectedChannel,
  ]);

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
        onSelect={selected => {
          setSelectedMembers(selected);
        }}
      />
    </Modal>
  );
};

export default InviteUsers;
