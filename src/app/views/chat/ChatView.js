import React, { useState } from 'react';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import SBProvider from '@sendbird/uikit-react/SendbirdProvider';
import withSendBird from '@sendbird/uikit-react/withSendBird';
import { ChannelListProvider } from '@sendbird/uikit-react/ChannelList/context';
import ChatConversation from './channel/ChatConversation';
import ChatChannelList from './ChatChannelList';
import SelectedChannelContext from './SelectedChannelContext';
import ShowSettingsContext from './ShowSettingsContext';
import { Container, ColorSet } from './styled';
import './sendbird-styles.css';

const ChatView = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const APP_ID =
    process.env.REACT_APP_SENDBIRD_APP_ID ??
    `D11A4B11-21AD-4025-9D8C-2BCF693C814C`;

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
              <SBProvider
                appId={APP_ID}
                userId={identifier}
                nickname={name}
                colorSet={ColorSet}
              >
                <ChannelListProvider>
                  <ChatChannelList
                    className="full-view-chat"
                    setSelectedChannel={setSelectedChannel}
                    isFullView
                  />
                </ChannelListProvider>
                <ChatConversation currentChannelUrl={selectedChannel?.url} />
              </SBProvider>
            </ShowSettingsContext.Provider>
          </SelectedChannelContext.Provider>
        </div>
      </Container>
    </ViewLayout>
  );
};

export default withSendBird(ChatView);
