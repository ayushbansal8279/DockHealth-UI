import React, { useContext } from 'react';
import SBProvider from '@sendbird/uikit-react/SendbirdProvider';
import { ChannelListProvider } from '@sendbird/uikit-react/ChannelList/context';
import ChatChannelList from './ChatChannelList';
import ChatConversation from './ChatConversation';
import SelectedChannelContext from './SelectedChannelContext';
import '@sendbird/uikit-react/dist/index.css';

export default function Chat(props) {
  const appId =
    process.env.SENDBIRD_APP_ID ?? 'D11A4B11-21AD-4025-9D8C-2BCF693C814C';
  const { userId, name, profileUrl } = props;

  const { setSelectedChannel, selectedChannel } = useContext(
    SelectedChannelContext,
  );

  return (
    <div className="sendbird-app__wrap">
      <SBProvider
        appId={appId}
        userId={userId}
        nickname={name}
        profileUrl={profileUrl}
      >
        {selectedChannel !== null ? (
          <ChatConversation currentChannelUrl={selectedChannel.url} />
        ) : (
          <ChannelListProvider>
            <ChatChannelList setSelectedChannel={setSelectedChannel} />
          </ChannelListProvider>
        )}
      </SBProvider>
    </div>
  );
}
