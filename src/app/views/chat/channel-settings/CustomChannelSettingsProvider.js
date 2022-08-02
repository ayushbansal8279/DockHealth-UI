import React, { useState } from 'react';
import { UserProfileProvider } from './UserProfileContext';
import ChannelSettingsContext from './ChannelSettingsContext';
import uuidv4 from './uuid';

const ChannelSettingsProvider = props => {
  const {
    children,
    className,
    channelUrl,
    onCloseClick,
    onChannelModified,
    onBeforeUpdateChannel,
    queries,
    channel,
  } = props;

  const [setChannelUpdateId] = useState(uuidv4());
  const invalidChannel = false;

  const forceUpdateUI = () => {
    setChannelUpdateId(uuidv4());
  };

  return (
    <ChannelSettingsContext.Provider
      value={{
        channelUrl,
        onCloseClick,
        onChannelModified,
        onBeforeUpdateChannel,
        queries,
        setChannelUpdateId,
        forceUpdateUI,
        channel,
        invalidChannel,
      }}
    >
      <UserProfileProvider
        renderUserProfile={props?.renderUserProfile}
        disableUserProfile={props?.disableUserProfile}
      >
        <div className={`sendbird-channel-settings ${className}`}>
          {children}
        </div>
      </UserProfileProvider>
    </ChannelSettingsContext.Provider>
  );
};

export default ChannelSettingsProvider;
