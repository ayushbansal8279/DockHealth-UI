import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import withSendbird from '@sendbird/uikit-react/withSendbird';
import { ChannelListProvider } from '@sendbird/uikit-react/ChannelList/context';
import { useSelector } from 'react-redux';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import { userHasDockChatFeatureSelector } from 'selectors/user-selectors';
import ChatConversation from './channel/ChatConversation';
import ChatChannelList from './ChatChannelList';
import ShowSettingsContext from './ShowSettingsContext';
import { Container } from './styled';
import './sendbird-styles.css';

const ChatView = () => {
  const history = useHistory();
  const selectedChannel = useSelector(selectedChatChannelSelector);

  const [showSettings, setShowSettings] = useState(false);

  const showSettingsValue = useMemo(
    () => ({
      showSettings,
      setShowSettings,
    }),
    [showSettings, setShowSettings],
  );

  const dockChatAvailable = useSelector(userHasDockChatFeatureSelector);
  if (!dockChatAvailable) {
    history.push(`/core/home`);
  }

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

export default withSendbird(ChatView);
