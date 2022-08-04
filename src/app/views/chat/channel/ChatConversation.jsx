import React, { useState, useContext, useEffect } from 'react';
import withSendBird from '@sendbird/uikit-react/withSendBird';
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context';
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI';
import ChatChannelSettings from '../channel-settings/ChatChannelSettings';
import ShowSettingsContext from '../ShowSettingsContext';
import SelectedChannelContext from '../SelectedChannelContext';

const ChatChannelConversation = props => {
  const { currentChannelUrl } = props;

  const { setShowChatPopover } = useContext(SelectedChannelContext);
  const { setShowSettings, showSettings } = useContext(ShowSettingsContext);

  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setShowChatPopover(true);
  }, [setShowChatPopover]);

  return (
    <>
      <div className="sendbird-app__conversation-wrap">
        <ChannelProvider
          channelUrl={currentChannelUrl}
          showSearchIcon={false}
          onChatHeaderActionClick={() => {
            setShowSettings(true);
          }}
          onSearchClick={() => {
            setShowSettings(false);
            setShowSearch(!showSearch);
          }}
        >
          <ChannelUI />
        </ChannelProvider>
      </div>
      {showSettings && (
        <ChatChannelSettings setShowSettings={setShowSettings} />
      )}
    </>
  );
};

export default withSendBird(ChatChannelConversation);
