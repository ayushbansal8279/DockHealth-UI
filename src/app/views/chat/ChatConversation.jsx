import React from 'react';
import withSendBird from '@sendbird/uikit-react/withSendBird';
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context';
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI';

const ChatChannelConversation = props => {
  const { currentChannelUrl } = props;

  return (
    <div className="customized-app">
      <div className="sendbird-app__wrap">
        <div className="sendbird-app__conversation-wrap">
          <ChannelProvider channelUrl={currentChannelUrl}>
            <ChannelUI />
          </ChannelProvider>
        </div>
      </div>
    </div>
  );
};

export default withSendBird(ChatChannelConversation);
