import React, { useEffect, useCallback } from 'react';
import ChannelPreviewAction from '@sendbird/uikit-react/ChannelList/components/ChannelPreviewAction';
import { useChannelListContext } from '@sendbird/uikit-react/ChannelList/context';
import ChannelListHeader from '@sendbird/uikit-react/ChannelList/components/ChannelListHeader';
import { userProfileSelector } from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import { CircularProgress } from '@material-ui/core';
import { Title } from 'views/TaskTour/styled';
import { selectChannel } from 'actions/sendbird-actions';
import CustomAddChannel from './add-channel/CustomAddChannel';
import ChatChannelPreview from './ChatChannelPreview';
import { ChannelListTitle } from './styled';

export default function ChatChannelList(props) {
  const { isFullView } = props;
  const { identifier } = useSelector(userProfileSelector);
  const { allChannels, initialized, loading } = useChannelListContext();
  const dispatch = useDispatch();
  const selectedChannel = useSelector(selectedChatChannelSelector);

  useEffect(() => {
    if (
      allChannels &&
      allChannels.length > 0 &&
      isFullView &&
      !selectedChannel
    ) {
      // setSelectedChannel(allChannels[0]);
      dispatch(selectChannel(allChannels[0]));
    }
  }, [allChannels, dispatch, isFullView, selectedChannel]);

  const handleClick = useCallback(
    channel => () => {
      if (channel?.url) {
        dispatch(selectChannel(channel));
      }
    },
    [dispatch],
  );

  if (!initialized || loading) {
    return <CircularProgress />;
  }

  return (
    <div className="sendbird-app__channellist-wrap">
      <ChannelListHeader
        renderHeader={() => {
          return <ChannelListTitle>Conversations</ChannelListTitle>;
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
              onClick={handleClick(channel)}
            />
          </div>
        );
      })}
    </div>
  );
}
