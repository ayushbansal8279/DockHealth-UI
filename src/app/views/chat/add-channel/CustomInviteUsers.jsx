import React, { useState, useCallback } from 'react';
import { useCreateChannelContext } from '@sendbird/uikit-react/CreateChannel/context';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import sendBirdSelectors from '@sendbird/uikit-react/sendBirdSelectors';
import Modal from '@sendbird/uikit-react/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectChannel } from 'actions/sendbird-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import MultiAssignChatInviteMembersList from './MultiAssignChatInviteList';

const InviteUsers = ({ onCancel }) => {
  const { createChannel } = useCreateChannelContext();

  const globalStore = useSendbirdStateContext();
  const sdkInstance = sendBirdSelectors.getSdk(globalStore);

  const { identifier: currentUserId } = useSelector(userProfileSelector);

  const dispatch = useDispatch();

  const [selectedMembers, setSelectedMembers] = useState([]);

  const onSubmit = useCallback(() => {
    const parameters = new sdkInstance.GroupChannelParams();
    parameters.isPublic = false;
    parameters.isEphemeral = false;
    parameters.isDistinct = false;
    parameters.addUserIds(
      selectedMembers.map(member => {
        return member.identifier;
      }),
    );
    // parameters.invitedUserIds = selectedMembers.map(
    //   member => member.identifier,
    // );
    parameters.operatorUserIds = [currentUserId];
    parameters.name = '';

    createChannel(parameters).then(channel => {
      dispatch(selectChannel(channel));
    });

    onCancel();
  }, [
    sdkInstance.GroupChannelParams,
    selectedMembers,
    currentUserId,
    createChannel,
    onCancel,
    dispatch,
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
