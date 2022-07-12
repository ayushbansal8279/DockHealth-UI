import React, { useState } from 'react';
import withSendBird from '@sendbird/uikit-react/withSendBird';
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context';
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI';
import ChatChannelSettings from './ChatChannelSettings';

const ChatChannelConversation = props => {
  const { currentChannelUrl } = props;

  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="sendbird-app__conversation-wrap">
        <ChannelProvider
          channelUrl={currentChannelUrl}
          showSearchIcon
          onChatHeaderActionClick={() => {
            setShowSettings(true);
            console.log(`info button clicked`);
          }}
        >
          <ChannelUI />
        </ChannelProvider>
      </div>
      {showSettings && (
        <div className="sendbird-app__settingspanel-wrap">
          <ChatChannelSettings
            currentChannelUrl={currentChannelUrl}
            setShowSettings={setShowSettings}
          />
        </div>
      )}
    </>
  );
};

export default withSendBird(ChatChannelConversation);
