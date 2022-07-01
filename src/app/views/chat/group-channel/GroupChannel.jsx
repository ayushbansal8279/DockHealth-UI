// import React, { useState } from 'react';
import React from 'react';
import withSendBird from '@sendbird/uikit-react/withSendBird';
import Channel from '@sendbird/uikit-react/Channel';

function GroupChannel(props) {
  const { currentChannelUrl } = props;

  return (
    <div className="customized-app1">
      <div className="sendbird-app__wrap1">
        <div className="sendbird-app__conversation-wrap1">
          <Channel
            channelUrl={currentChannelUrl}
            // onChatHeaderActionClick={() => {
            //   setShowSettings(false);
            // }}
            // renderChatHeader={header}
          />
        </div>
      </div>
    </div>
  );
}

export default withSendBird(GroupChannel);
