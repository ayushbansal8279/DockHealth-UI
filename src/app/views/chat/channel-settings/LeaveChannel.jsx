import React from 'react';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import Modal from '@sendbird/uikit-react/ui/Modal';
import { useChannelListContext } from '@sendbird/uikit-react/ChannelList/context';

const LeaveChannel = props => {
  const { onSubmit, onCancel } = props;

  const channel = useChannelListContext()?.currentChannel;
  const state = useSendbirdStateContext();
  const logger = state?.config?.logger;
  const isOnline = state?.config?.isOnline;
  if (channel) {
    return (
      <Modal
        disabled={!isOnline}
        onCancel={onCancel}
        onSubmit={() => {
          logger.info('ChannelSettings: Leaving channel', channel);
          channel.leave().then(() => {
            onSubmit();
          });
        }}
        submitText="Leave"
        titleText="Leave this Conversation?"
      />
    );
  }
  return <></>;
};

export default LeaveChannel;
