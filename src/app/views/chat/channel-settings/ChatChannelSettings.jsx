import React, { useCallback, useContext } from 'react';
import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import { useSelector } from 'react-redux';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import CustomChannelSettingsProvider from './CustomChannelSettingsProvider';
import ChannelProfile from './ChannelProfile';
import CustomChannelSettingsUI from './CustomChannelSettingsUi.jsx';
import ShowSettingsContext from '../ShowSettingsContext';
import ChannelSettingsUI from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI';

const ChatChannelSettings = () => {
  const selectedChannel = useSelector(selectedChatChannelSelector);
  const { setShowSettings } = useContext(ShowSettingsContext);

  const handleOnCloseClick = useCallback(() => {
    setShowSettings(false);
  }, [setShowSettings]);

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
          <ChannelSettingsUI
          // renderChannelProfile={() => {
          //   return <ChannelProfile />;
          // }}
          />
        </CustomChannelSettingsProvider>
      </ChannelSettingsProvider>
    </div>
  );
};

export default ChatChannelSettings;
