import React, { useContext } from 'react';
import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import ChannelSettingsUI from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI';
import UserPanel from '@sendbird/uikit-react/ChannelSettings/components/UserPanel';
import CustomChannelSettingsProvider from './CustomChannelSettingsProvider';
import ChannelProfile from './ChannelProfile';
import SelectedChannelContext from '../SelectedChannelContext';

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
        <CustomChannelSettingsProvider
          channelUrl={selectedChannel.url}
          channel={selectedChannel}
        >
          <ChannelSettingsUI
            renderModerationPanel={() => {
              return <UserPanel />;
            }}
            renderChannelProfile={() => {
              return <ChannelProfile />;
            }}
          />
        </CustomChannelSettingsProvider>
      </ChannelSettingsProvider>
    </div>
  );
};

export default ChatChannelSettings;
