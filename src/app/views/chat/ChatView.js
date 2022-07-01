import React from 'react';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import SendBirdApp from '@sendbird/uikit-react/App';
// import 'sendbird-uikit/dist/index.css';
import { Container, ColorSet } from './styled';
import './sendbird-styles.css';

const ChatView = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const APP_ID =
    process.env.REACT_APP_SENDBIRD_APP_ID ??
    `D11A4B11-21AD-4025-9D8C-2BCF693C814C`;

  return (
    <ViewLayout header={<BasicLayoutHeader title="Chat" />}>
      <Container>
        <SendBirdApp
          appId={APP_ID}
          userId={identifier}
          nickname={name}
          colorSet={ColorSet}
          useReaction
          useMessageGrouping
        />
      </Container>
    </ViewLayout>
  );
};

export default ChatView;
