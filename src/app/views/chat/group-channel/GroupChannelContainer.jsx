import React from 'react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import GroupChannel from './GroupChannel';
import { MessageContainer, HandleBar } from './styled';
// import 'sendbird-uikit/dist/index.css';
import './sendbird-styles.css';

function GroupChannelContainer(props) {
  const { identifier, name, channelUrl } = props;
  const appId =
    process.env.SENDBIRD_APP_ID ?? 'D11A4B11-21AD-4025-9D8C-2BCF693C814C';

  return (
    <>
      <HandleBar className="handle" />
      <MessageContainer className="handle">
        <SendbirdProvider appId={appId} userId={identifier} nickname={name}>
          <GroupChannel currentChannelUrl={channelUrl} />
        </SendbirdProvider>
      </MessageContainer>
    </>
  );
}

export default GroupChannelContainer;
