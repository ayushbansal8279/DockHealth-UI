import React, { useEffect, useState } from 'react';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
// import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
// import { RenderUserProfileProps } from '../../../types';
// import { UserProfileProvider } from '../../../lib/UserProfileContext';
import ChannelSettingsContext from './ChannelSettingsContext';
import { UserProfileProvider } from './UserProfileContext';
import uuidv4 from './uuid';

const CustomChannelSettingsProvider = props => {
  const {
    children,
    className,
    channelUrl,
    channel,
    onCloseClick,
    onChannelModified,
    onBeforeUpdateChannel,
    queries,
  } = props;

  console.log(`channelurl in provider: ${channelUrl}`);

  // fetch store from <SendbirdProvider />
  // const globalStore = useSendbirdStateContext();
  // const { config, stores } = globalStore;
  // const { sdkStore } = stores;
  // const { logger } = config;

  // const { initialized } = sdkStore;
  // const sdk = sdkStore?.sdk;

  // hack to keep track of channel updates by triggering useEffect
  const [setChannelUpdateId] = useState(uuidv4());
  // const [channel, setChannel] = useState(null);
  const [invalidChannel] = useState(false);

  const forceUpdateUI = () => {
    setChannelUpdateId(uuidv4());
  };

  // useEffect(() => {
  //   console.log('ChannelSettings: Setting up');
  //   if (!channelUrl || !initialized || !sdk) {
  //     console.log(
  //       'ChannelSettings: Setting up failed',
  //       'No channelUrl or sdk uninitialized',
  //     );
  //     setInvalidChannel(false);
  //   } else {
  //     if (!sdk || !sdk.groupChannel) {
  //       console.log(`sdk keys: ${Object.keys(sdk)}`);
  //       console.log('ChannelSettings: No GroupChannel');
  //       return;
  //     }
  //     sdk.groupChannel.getChannel(channelUrl).then(groupChannel => {
  //       if (!groupChannel) {
  //         console.log('ChannelSettings: Channel not found');
  //         setInvalidChannel(true);
  //       } else {
  //         console.log('ChannelSettings: Fetched group channel', groupChannel);
  //         setInvalidChannel(false);
  //         setChannel(groupChannel);
  //       }
  //     });
  //   }
  // }, [channelUrl, initialized, channelUpdateId, logger, sdk]);

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

// const useChannelSettingsContext = useContext(ChannelSettingsContext);

export default CustomChannelSettingsProvider;
