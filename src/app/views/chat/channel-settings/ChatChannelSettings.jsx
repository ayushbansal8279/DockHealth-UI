import React, { useCallback, useContext, useEffect } from 'react';
import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import CustomChannelSettingsProvider from './CustomChannelSettingsProvider';
import ChannelProfile from './ChannelProfile';
import CustomChannelSettingsUI from './CustomChannelSettingsUi.jsx';
import SelectedChannelContext from '../SelectedChannelContext';
import ShowSettingsContext from '../ShowSettingsContext';

const ChatChannelSettings = () => {
  const { selectedChannel, setShowChatPopover } = useContext(
    SelectedChannelContext,
  );
  const { setShowSettings } = useContext(ShowSettingsContext);

  const handleOnCloseClick = useCallback(() => {
    setShowSettings(false);
  }, [setShowSettings]);

  useEffect(() => {
    setShowChatPopover(true);
  }, [setShowChatPopover]);

  return (
    <div className="sendbird-app__settingspanel-wrap">
      <ChannelSettingsProvider
        channelUrl={selectedChannel.url}
        onCloseClick={handleOnCloseClick}
      >
        <CustomChannelSettingsProvider
          channelUrl={selectedChannel.url}
          channel={selectedChannel}
          onCloseClick={handleOnCloseClick}
        >
          <CustomChannelSettingsUI
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
