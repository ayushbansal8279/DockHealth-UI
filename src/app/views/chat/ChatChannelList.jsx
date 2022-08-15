import React, { useEffect, useContext } from 'react';
import ChannelPreviewAction from '@sendbird/uikit-react/ChannelList/components/ChannelPreviewAction';
import { useChannelListContext } from '@sendbird/uikit-react/ChannelList/context';
import ChannelListHeader from '@sendbird/uikit-react/ChannelList/components/ChannelListHeader';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { Title } from 'views/TaskTour/styled';
import CustomAddChannel from './add-channel/CustomAddChannel';
import SelectedChannelContext from './SelectedChannelContext';
import ChatChannelPreview from './ChatChannelPreview';

export default function ChatChannelList(props) {
  const { isFullView } = props;
  const { identifier } = useSelector(userProfileSelector);
  const { allChannels, initialized, loading } = useChannelListContext();

  const {
    setSelectedChannel,
    selectedChannel,
    setShowChatPopover,
  } = useContext(SelectedChannelContext);

  useEffect(() => {
    setShowChatPopover(true);
  }, [setShowChatPopover]);

  useEffect(() => {
    const passedChannel = JSON.parse(
      sessionStorage.getItem('selectedChannelUrl'),
    );
    if (passedChannel) {
      setSelectedChannel(passedChannel);
      sessionStorage.removeItem('selectedChannelUrl');
    }
  });

  useEffect(() => {
    if (
      allChannels &&
      allChannels.length > 0 &&
      isFullView &&
      !selectedChannel
    ) {
      setSelectedChannel(allChannels[0]);
    }
  }, [allChannels, isFullView, selectedChannel, setSelectedChannel]);

  if (!initialized || loading) {
    return <CircularProgress />;
  }

  return (
    <div className="sendbird-app__channellist-wrap">
      <ChannelListHeader
        renderHeader={() => {
          return <Title>Conversations</Title>;
        }}
        allowProfileEdit={false}
        renderIconButton={CustomAddChannel}
      />
      {allChannels.map(channel => {
        return (
          <div key={channel.url}>
            <ChatChannelPreview
              channel={channel}
              currentUser={identifier}
              isActive={isFullView && selectedChannel === channel}
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
                  setShowChatPopover(true);
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
