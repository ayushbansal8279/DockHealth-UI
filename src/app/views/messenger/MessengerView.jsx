import React from 'react';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import { App as SendbirdApp } from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';
import { Container, ColorSet } from './styled';

const MessengerView = () => {
  const { name, identifier } = useSelector(userProfileSelector);
  const APP_ID =
    process.env.REACT_APP_SENDBIRD_APP_ID ??
    `24640D15-4167-4FC7-8FD6-EE9F733441B0`;

  return (
    <ViewLayout header={<BasicLayoutHeader title="Messenger" />}>
      <Container>
        <SendbirdApp
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

export default MessengerView;
