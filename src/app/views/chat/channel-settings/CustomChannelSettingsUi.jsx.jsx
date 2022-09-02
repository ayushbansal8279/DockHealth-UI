import React, { useState, useCallback } from 'react';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import Label from '@sendbird/uikit-react/ui/Label';
import IconButton from '@sendbird/uikit-react/ui/IconButton';
import Icon from '@sendbird/uikit-react/ui/Icon';
import { selectedChatChannelSelector } from 'selectors/sendbird-selectors';
import { useSelector } from 'react-redux';
import UserPanel from './CustomUserPanel';
import LeaveChannel from './LeaveChannel';
import ChannelSettingsContext from './ChannelSettingsContext';
import { Typography, Colors } from './LabelTypography';
import ChannelProfile from './ChannelProfile';

const CustomChannelSettingsUI = props => {
  const state = useSendbirdStateContext();
  const [showLeaveChannelModal, setShowLeaveChannelModal] = useState(false);

  const logger = state?.config?.logger;

  const { invalidChannel, onCloseClick } = ChannelSettingsContext;
  const channel = useSelector(selectedChatChannelSelector);

  const { renderChannelProfile } = props;

  const handleLeaveChannel = useCallback(() => {
    setShowLeaveChannelModal(true);
  }, []);

  if (!channel || invalidChannel) {
    return (
      <div>
        <div className="sendbird-channel-settings__header">
          <Label type={Typography.H_2} color={Colors.ONBACKGROUND_1}>
            Conversation Information
          </Label>
          <Icon
            className="sendbird-channel-settings__close-icon"
            type="CLOSE"
            height="24px"
            width="24px"
            onClick={() => {
              logger.info('ChannelSettings: Click close');
              onCloseClick();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sendbird-channel-settings__header">
        <Label type={Typography.H_2} color={Colors.ONBACKGROUND_1}>
          Conversation Information
        </Label>
        <div className="sendbird-channel-settings__header-icon">
          <IconButton
            width="32px"
            height="32px"
            onClick={() => {
              logger.info('ChannelSettings: Click close');
              onCloseClick();
            }}
          >
            <Icon
              className="sendbird-channel-settings__close-icon"
              type="CLOSE"
              height="22px"
              width="22px"
            />
          </IconButton>
        </div>
      </div>
      <div className="sendbird-channel-settings__scroll-area">
        {renderChannelProfile() || <ChannelProfile />}
        <UserPanel />
        <div
          className={[
            'sendbird-channel-settings__panel-item',
            'sendbird-channel-settings__leave-channel',
          ].join(' ')}
          role="button"
          onKeyDown={handleLeaveChannel}
          onClick={handleLeaveChannel}
          tabIndex={0}
        >
          <Icon
            className={[
              'sendbird-channel-settings__panel-icon-left',
              'sendbird-channel-settings__panel-icon__leave',
            ].join(' ')}
            type="LEAVE"
            fillColor="ERROR"
            height="24px"
            width="24px"
          />
          <Label type={Typography.SUBTITLE_1} color={Colors.ONBACKGROUND_1}>
            Leave Conversation
          </Label>
        </div>
        {showLeaveChannelModal && (
          <LeaveChannel
            onCancel={() => {
              setShowLeaveChannelModal(false);
            }}
            onSubmit={() => {
              setShowLeaveChannelModal(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default CustomChannelSettingsUI;
