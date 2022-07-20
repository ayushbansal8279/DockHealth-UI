import React, {useEffect, useState, useContext} from "react";
import { ChannelListProvider } from "@sendbird/uikit-react/ChannelList/context";
import ChannelUI from "@sendbird/uikit-react/Channel/components/ChannelUI";
import { useChannelListContext } from "@sendbird/uikit-react/ChannelList/context";
import ChannelListUI from "@sendbird/uikit-react/ChannelList/components/ChannelListUI";
import { ChannelProvider } from "@sendbird/uikit-react/Channel/context";
import SelectedChannelContext from "./SelectedChannelContext";

const ExpandedChatView = () => {
  const { allChannels,currentChannel } = useChannelListContext();
  const [currentChannelUrl, setCurrentChannelUrl] = useState(null);

  const { setSelectedChannel, selectedChannel } = useContext(
    SelectedChannelContext,
  );

  // useEffect(()=>{
  //     if(allChannels && allChannels[1]){
  //         setCurrentChannelUrl(allChannels[1]);
  //     }

  // console.log(`all channels ${JSON.stringify(allChannels)}`);
  // }, [,]);

  return (
    <div className="sendbird-app__wrap">
      <div className="sendbird-app__channellist-wrap">
        <ChannelListProvider
          onChannelSelect={channel => {
            console.log(`on channel select called: ${channel}`);
            if (channel && channel.url) {
              setCurrentChannelUrl(channel.url);
            }
          }}
        >
          <ChannelListUI />
        </ChannelListProvider>
      </div>
      <div className="sendbird-app__conversation-wrap">
        <ChannelProvider channelUrl={selectedChannel ?? currentChannelUrl}>
          <ChannelUI />
        </ChannelProvider>
      </div>
    </div>
  );
};

export default ExpandedChatView;
