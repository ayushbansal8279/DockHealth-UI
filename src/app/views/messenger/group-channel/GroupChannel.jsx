// import React, { useState } from 'react';
import React from 'react';
import {
  Channel as SBConversation,
  // ChannelSettings as SBChannelSettings,
  withSendBird,
} from 'sendbird-uikit';

function GroupChannel(props) {
  const { currentChannelUrl } = props;

  // useState
  // const [showSettings, setShowSettings] = useState(false);
  // const [currentChannelUrl, setCurrentChannelUrl] = useState("sendbird_group_channel_140571109_e686fc399df276dcda6e240337836d33c4c79397");

  // const header = headerProps => {
  //   return (
  //     <div propspassed className="handle">
  //       <h3>{headerProps.channel.name}</h3>
  //     </div>
  //   );
  // };

  return (
    <div className="customized-app1">
      <div className="sendbird-app__wrap1">
        <div className="sendbird-app__conversation-wrap1">
          <SBConversation
            channelUrl={currentChannelUrl}
            // onChatHeaderActionClick={() => {
            //   setShowSettings(false);
            // }}
            // renderChatHeader={header}
          />
        </div>
        {/* {showSettings && (
          <div className="sendbird-app__settingspanel-wrap">
            <SBChannelSettings
              channelUrl={currentChannelUrl}
              onCloseClick={() => {
                setShowSettings(false);
              }}
            />
          </div>
        )} */}
      </div>
    </div>
  );
}

export default withSendBird(GroupChannel);
