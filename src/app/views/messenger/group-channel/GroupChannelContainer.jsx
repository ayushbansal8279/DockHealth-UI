import React from 'react';
import { SendBirdProvider as SBProvider } from 'sendbird-uikit';
import GroupChannel from './GroupChannel';
import { MessageContainer, HandleBar } from './styled';
import 'sendbird-uikit/dist/index.css';
import './sendbird-styles.css';

function GroupChannelContainer(props) {
  const { identifier, name, channelUrl } = props;
  const appId =
    process.env.SENDBIRD_APP_ID ?? 'D11A4B11-21AD-4025-9D8C-2BCF693C814C';

  return (
    <MessageContainer>
      <HandleBar className="handle" />
      <SBProvider appId={appId} userId={identifier} nickname={name}>
        <GroupChannel currentChannelUrl={channelUrl} className="handle" />
      </SBProvider>
    </MessageContainer>
  );
}

export default GroupChannelContainer;
