import React, { useEffect } from 'react';
// import ChannelPreview from '@sendbird/uikit-react/ChannelList/components/ChannelPreview';
import ChannelPreviewAction from '@sendbird/uikit-react/ChannelList/components/ChannelPreviewAction';
import { useChannelListContext } from '@sendbird/uikit-react/ChannelList/context';
import ChannelListHeader from '@sendbird/uikit-react/ChannelList/components/ChannelListHeader';
import AddChannel from '@sendbird/uikit-react/ChannelList/components/AddChannel';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { Title } from 'views/TaskTour/styled';
import ChatChannelPreview from './ChatChannelPreview';

export default function ChatChannelList(props) {
  const { setSelectedChannel, isFullView } = props;
  const { identifier } = useSelector(userProfileSelector);
  const { allChannels, initialized, loading } = useChannelListContext();

  useEffect(() => {
    if (allChannels && allChannels.length > 0 && isFullView) {
      setSelectedChannel(allChannels[0]);
    }
  }, [allChannels, isFullView, setSelectedChannel]);

  if (!initialized || loading) {
    return <CircularProgress />;
  }

  return (
    <div className="sendbird-app__channellist-wrap">
      <ChannelListHeader
        renderHeader={() => {
          return <Title>Channels</Title>;
        }}
        allowProfileEdit={false}
        renderIconButton={AddChannel}
      />
      {allChannels.map((channel, idx) => {
        return (
          <div key={channel.url}>
            <ChatChannelPreview
              channel={channel}
              currentUser={identifier}
              isActive={isFullView && idx === 0}
              renderChannelAction={() => {
                return (
                  <ChannelPreviewAction
                    channel={channel}
                    onLeaveChannel={() => {}}
                  />
                );
              }}
              onClick={() => {
                if (channel?.url) {
                  setSelectedChannel(channel);
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
