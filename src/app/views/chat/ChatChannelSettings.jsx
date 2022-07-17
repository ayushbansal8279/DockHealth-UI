import React, { useContext } from 'react';
import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import ChannelSettingsUI from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI';
import UserPanel from '@sendbird/uikit-react/ChannelSettings/components/UserPanel';
import SelectedChannelContext from './SelectedChannelContext';
// import AdminPanel from '@sendbird/uikit-react/ChannelSettings/components/AdminPanel';

const ChatChannelSettings = props => {
  const { setShowSettings } = props;
  const { selectedChannel } = useContext(SelectedChannelContext);

  return (
    <div className="sendbird-app__settingspanel-wrap">
      <ChannelSettingsProvider
        channelUrl={selectedChannel.url}
        onCloseClick={() => {
          setShowSettings(false);
        }}
      >
        <ChannelSettingsUI
          renderModerationPanel={() => {
            return <UserPanel />;
          }}
        />
      </ChannelSettingsProvider>
    </div>
  );
};

export default ChatChannelSettings;
