import React from 'react';
import ChannelSettings from '@sendbird/uikit-react/ChannelSettings';

const ChatChannelSettings = props => {
  const { setShowSettings, currentChannelUrl } = props;

  return (
    <div className="sendbird-app__settingspanel-wrap">
      {/* <h1>The Channel settings go here</h1> */}
      <ChannelSettings
        channelUrl={currentChannelUrl}
        onCloseClick={() => {
          setShowSettings(false);
        }}
      />
    </div>
  );
};

export default ChatChannelSettings;
