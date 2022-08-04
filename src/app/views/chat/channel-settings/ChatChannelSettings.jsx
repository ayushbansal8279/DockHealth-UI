import React, { useContext, useEffect } from 'react';
import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import ChannelSettingsUI from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI';
import UserPanel from '@sendbird/uikit-react/ChannelSettings/components/UserPanel';
import CustomChannelSettingsProvider from './CustomChannelSettingsProvider';
import ChannelProfile from './ChannelProfile';
import SelectedChannelContext from '../SelectedChannelContext';
import ShowSettingsContext from '../ShowSettingsContext';

const ChatChannelSettings = () => {
  const { selectedChannel, setShowChatPopover } = useContext(
    SelectedChannelContext,
  );
  const { setShowSettings } = useContext(ShowSettingsContext);

  useEffect(() => {
    setShowChatPopover(true);
  }, [setShowChatPopover]);

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
