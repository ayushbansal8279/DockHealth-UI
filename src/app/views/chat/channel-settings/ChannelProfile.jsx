import React, { useState, useContext } from 'react';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import ChannelAvatar from '@sendbird/uikit-react/ui/ChannelAvatar';
import TextButton from '@sendbird/uikit-react/ui/TextButton';
import Label from '@sendbird/uikit-react/ui/Label';
import { useSelector } from 'react-redux';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import EditDetails from './EditDetailsModal';
import { LocalizationContext } from '../channel/ChannelLocalizationContext';
import { Typography, Colors } from './LabelTypography';

const ChannelProfile = () => {
  const state = useSendbirdStateContext();
  const { stringSet } = useContext(LocalizationContext);
  const [showModal, setShowModal] = useState(false);

  const userId = state?.config?.userId;
  const theme = state?.config?.theme || 'light';
  const isOnline = state?.config?.isOnline;
  const disabled = !isOnline;

  const selectedChannel = useSelector(selectedChatChannelSelector);

  const getChannelName = () => {
    if (selectedChannel?.name && selectedChannel?.name !== 'Group Channel') {
      return selectedChannel.name;
    }
    if (selectedChannel?.name === 'Group Channel' || !selectedChannel?.name) {
      return (selectedChannel?.members || [])
        .map((member) => member.nickname || stringSet.NO_NAME)
        .join(', ');
    }

    return stringSet.NO_TITLE;
  };

  return (
    <div className="sendbird-channel-profile">
      <div className="sendbird-channel-profile--inner">
        <div className="sendbird-channel-profile__avatar">
          <ChannelAvatar
            channel={selectedChannel}
            userId={userId}
            theme={theme}
            width={80}
            height={80}
          />
        </div>
        <Label
          className="sendbird-channel-profile__title"
          type={Typography.SUBTITLE_2}
          color={Colors.ONBACKGROUND_1}
        >
          {getChannelName()}
        </Label>
        <TextButton
          disabled={false}
          className="sendbird-channel-profile__edit"
          onClick={() => {
            if (disabled) {
              return;
            }
            setShowModal(true);
          }}
          notUnderline
        >
          <Label
            type={Typography.BUTTON_1}
            color={disabled ? Colors.ONBACKGROUND_2 : Colors.PRIMARY}
          >
            Edit
          </Label>
        </TextButton>
        {showModal && (
          <EditDetails
            onCancel={() => setShowModal(false)}
            onSubmit={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChannelProfile;
