import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useCreateChannelContext } from '@sendbird/uikit-react/CreateChannel/context';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import Modal from '@sendbird/uikit-react/ui/Modal';
import MultiAssignChatInviteMembersList from '../add-channel/MultiAssignChatInviteList';
import ChannelSettingsContext from './ChannelSettingsContext';
import SelectedChannelContext from '../SelectedChannelContext';

const InviteUsersModal = ({ onCancel, onSubmit }) => {
  const globalStore = useSendbirdStateContext();
  const { channel } = useContext(ChannelSettingsContext);
  const { createChannel } = useCreateChannelContext();
  const sdkInstance = sendBirdSelectors.getSdk(globalStore);

  const [members, setMembers] = useState([]);
  const [hasNext, setHasNext] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const { setSelectedChannel } = useContext(SelectedChannelContext);

  useEffect(() => {
    if (!channel) {
      setMembers([]);
      return;
    }

    setSelectedMembers(channel.members);

    const memberUserListQuery = channel?.createMemberListQuery({ limit: 10 });
    memberUserListQuery.next().then(returnedMembers => {
      setMembers(returnedMembers);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);

  const handleSubmit = useCallback(() => {
    const filteredMembers = Object.keys(selectedMembers).filter(
      m => selectedMembers[m],
    );

    console.log(
      `users selected: ${JSON.stringify(
        selectedMembers,
      )} for channel: ${JSON.stringify(channel)}`,
    );

    channel
      .inviteWithUserIds(['4936ef1a-4bbe-11ea-a4e8-124feabd863a'])
      .then(() => {
        onSubmit(filteredMembers);
        onCancel();
      })
      .catch(error => {
        console.log(`error inviting: ${error}`);
      });
  }, [channel, onCancel, onSubmit, selectedMembers]);

  // const handleSubmit = useCallback(() => {
  //   const parameters = new sdkInstance.GroupChannelParams();
  //   parameters.isPublic = false;
  //   parameters.isEphemeral = false;
  //   parameters.isDistinct = false;
  //   const selectedMembersMap = selectedMembers.map(member => {
  //     return member.identifier;
  //   });
  //   console.log(`selected members map: ${selectedMembersMap}`);
  //   parameters.addUserIds(selectedMembersMap);
  //   parameters.name = null;

  //   console.log(`paratmers: ${JSON.stringify(parameters)}`);

  //   createChannel(parameters).then(returnedChannel => {
  //     console.log(`returned channel: ${JSON.stringify(returnedChannel)}`);
  //     setSelectedChannel(returnedChannel);
  //   });

  //   onCancel();
  // }, [
  //   sdkInstance.GroupChannelParams,
  //   selectedMembers,
  //   createChannel,
  //   onCancel,
  //   setSelectedChannel,
  // ]);

//   const handleSubmit = useCallback(async () => {
//     const userIds = selectedMembers.map(member => {
//       return member.identifier;
//     });
//     await channel.inviteWithUserIds(userIds);
//     onCancel();
//   }, [channel, selectedMembers, onCancel]);

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
        onSelect={selected => {
          setSelectedMembers(selected);
        }}
      />
    </Modal>
  );
};

export default InviteUsersModal;
