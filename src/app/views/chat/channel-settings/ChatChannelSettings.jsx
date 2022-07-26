import React, { useContext } from 'react';
import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import ChannelSettingsUI from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI';
import UserPanel from '@sendbird/uikit-react/ChannelSettings/components/UserPanel';
// import ChannelSettingsContext from './ChannelSettingsContext';
// import ChannelProfile from '@sendbird/uikit-react/ChannelSettings/components/ChannelProfile';
import CustomChannelSettingsProvider from './CustomChannelSettingsProvider';
import ChannelProfile from './ChannelProfile';
import SelectedChannelContext from '../SelectedChannelContext';

const ChatChannelSettings = props => {
  const { setShowSettings } = props;
  const { selectedChannel } = useContext(SelectedChannelContext);

  return (
    <div className="sendbird-app__settingspanel-wrap">
      <CustomChannelSettingsProvider channelUrl={selectedChannel.url}>
        <ChannelSettingsProvider
          channelUrl={selectedChannel.url}
          channel={selectedChannel}
          onCloseClick={() => {
            setShowSettings(false);
          }}
        >
          <ChannelSettingsUI
            renderModerationPanel={() => {
              return <UserPanel />;
            }}
            renderChannelProfile={() => {
              return <ChannelProfile />;
            }}
          />
        </ChannelSettingsProvider>
      </CustomChannelSettingsProvider>
    </div>
  );
};

export default ChatChannelSettings;
