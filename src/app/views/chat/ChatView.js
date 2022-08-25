import React, { useState } from 'react';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import withSendBird from '@sendbird/uikit-react/withSendBird';
import { ChannelListProvider } from '@sendbird/uikit-react/ChannelList/context';
import { useSelector } from 'react-redux';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import ChatConversation from './channel/ChatConversation';
import ChatChannelList from './ChatChannelList';
import ShowSettingsContext from './ShowSettingsContext';
import { Container } from './styled';
import './sendbird-styles.css';

const ChatView = () => {
  const selectedChannel = useSelector(selectedChatChannelSelector);

  const [showSettings, setShowSettings] = useState(false);

  const showSettingsValue = {
    showSettings,
    setShowSettings,
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Chat" isChat />}>
      <Container>
        <div className="full-view-chat sendbird-app__wrap">
          <ShowSettingsContext.Provider value={showSettingsValue}>
            <ChannelListProvider>
              <ChatChannelList className="full-view-chat" isFullView />
            </ChannelListProvider>
            <ChatConversation currentChannelUrl={selectedChannel?.url} />
          </ShowSettingsContext.Provider>
        </div>
      </Container>
    </ViewLayout>
  );
};

export default withSendBird(ChatView);
