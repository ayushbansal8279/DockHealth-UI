import React, { useState } from 'react';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import withSendBird from '@sendbird/uikit-react/withSendBird';
import { ChannelListProvider } from '@sendbird/uikit-react/ChannelList/context';
import ChatConversation from './channel/ChatConversation';
import ChatChannelList from './ChatChannelList';
import SelectedChannelContext from './SelectedChannelContext';
import ShowSettingsContext from './ShowSettingsContext';
import { Container } from './styled';
import './sendbird-styles.css';

const ChatView = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const value = { selectedChannel, setSelectedChannel };

  const [showSettings, setShowSettings] = useState(false);
  const showSettingsValue = { showSettings, setShowSettings };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Chat" isChat />}>
      <Container>
        <div className="full-view-chat sendbird-app__wrap">
          <SelectedChannelContext.Provider value={value}>
            <ShowSettingsContext.Provider value={showSettingsValue}>
              <ChannelListProvider>
                <ChatChannelList
                  className="full-view-chat"
                  setSelectedChannel={setSelectedChannel}
                  isFullView
                />
              </ChannelListProvider>
              <ChatConversation currentChannelUrl={selectedChannel?.url} />
            </ShowSettingsContext.Provider>
          </SelectedChannelContext.Provider>
        </div>
      </Container>
    </ViewLayout>
  );
};

export default withSendBird(ChatView);
