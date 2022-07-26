import React, { useContext } from 'react';
import { ChannelListProvider } from '@sendbird/uikit-react/ChannelList/context';
import ChatChannelList from './ChatChannelList';
import ChatConversation from './channel/ChatConversation';
import SelectedChannelContext from './SelectedChannelContext';
import '@sendbird/uikit-react/dist/index.css';

export default function Chat() {
  const { setSelectedChannel, selectedChannel } = useContext(
    SelectedChannelContext,
  );

  return (
    <div className="sendbird-app__wrap">
      {selectedChannel !== null ? (
        <ChatConversation currentChannelUrl={selectedChannel.url} />
      ) : (
        <ChannelListProvider>
          <ChatChannelList setSelectedChannel={setSelectedChannel} />
        </ChannelListProvider>
      )}
    </div>
  );
}
