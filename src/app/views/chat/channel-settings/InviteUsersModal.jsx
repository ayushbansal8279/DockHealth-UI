import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useCreateChannelContext } from '@sendbird/uikit-react/CreateChannel/context';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import Modal from '@sendbird/uikit-react/ui/Modal';
import MultiAssignChatInviteMembersList from '../add-channel/MultiAssignChatInviteList';
import ChannelSettingsContext from './ChannelSettingsContext';
import SelectedChannelContext from '../SelectedChannelContext';

const InviteUsersModal = ({ onCancel }) => {

  const globalStore = useSendbirdStateContext();
  const { channel } = useContext(ChannelSettingsContext);
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

//   const onSubmit = useCallback(() => {
//     const parameters = new sdkInstance.GroupChannelParams();
//     parameters.isPublic = false;
//     parameters.isEphemeral = false;
//     parameters.isDistinct = false;
//     parameters.addUserIds(
//       selectedMembers.map(member => {
//         return member.identifier;
//       }),
//     );
//     parameters.name = '';

//     createChannel(parameters).then(channel => {
//       setSelectedChannel(channel);
//     });

//     onCancel();
//   }, [
//     createChannel,
//     onCancel,
//     sdkInstance.GroupChannelParams,
//     selectedMembers,
//     setSelectedChannel,
//   ]);

  const onSubmit = useCallback(() => {
    const userIds = selectedMembers.map(member => {
      return member.identifier;
    });
    channel.inviteWithUserIds(userIds);
  }, [channel, selectedMembers]);

  return (
    <Modal
      titleText="Invite To Conversation"
      submitText="Submit"
      type="PRIMARY"
      onCancel={onCancel}
      onSubmit={onSubmit}
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
