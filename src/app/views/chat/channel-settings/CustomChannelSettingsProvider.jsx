import React, { useCallback, useMemo, useState } from 'react';
import { UserProfileProvider } from './UserProfileContext';
import ChannelSettingsContext from './ChannelSettingsContext';
import uuidv4 from './uuid';

const ChannelSettingsProvider = (props) => {
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

  const forceUpdateUI = useCallback(() => {
    setChannelUpdateId(uuidv4());
  }, [setChannelUpdateId]);

  const value = useMemo(
    () => ({
      channelUrl,
      onCloseClick,
      onChannelModified,
      onBeforeUpdateChannel,
      queries,
      setChannelUpdateId,
      forceUpdateUI,
      channel,
      invalidChannel,
    }),
    [
      channelUrl,
      onCloseClick,
      onChannelModified,
      onBeforeUpdateChannel,
      queries,
      setChannelUpdateId,
      forceUpdateUI,
      channel,
      invalidChannel,
    ],
  );

  return (
    <ChannelSettingsContext.Provider value={value}>
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
