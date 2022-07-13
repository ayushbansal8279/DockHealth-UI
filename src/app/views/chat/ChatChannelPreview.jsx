import React, { useContext } from 'react';
import Badge from '@sendbird/uikit-react/ui/Badge';
import Icon, { IconColors, IconTypes } from '@sendbird/uikit-react/ui/Icon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Label, {
  LabelTypography,
  LabelColors,
} from '@sendbird/uikit-react/ui/Label';
import { LocalizationContext } from './ChannelLocalizationContext';
import '@sendbird/uikit-react/dist/index.css';
import {
  getChannelTitle,
  getTotalMembers,
  getLastMessageCreatedAt,
  getChannelUnreadMessageCount,
  getLastMessage,
} from './ChannelUtils';

export default function ChatChannelPreview({
  channel,
  currentUser,
  isActive,
  ChannelAction,
  onClick,
  tabIndex,
}) {
  const { userId } = currentUser;
  const { isBroadcast, isFrozen } = channel;
  const { stringSet, dateLocale } = useContext(LocalizationContext);
  return (
    <div
      className={[
        'sendbird-channel-preview',
        isActive ? 'sendbird-channel-preview--active' : '',
      ].join(' ')}
      role="link"
      onClick={onClick}
      onKeyPress={onClick}
      tabIndex={tabIndex}
    >
      <div className="sendbird-channel-preview__content">
        <div className="sendbird-channel-preview__content__upper">
          <div className="sendbird-channel-preview__content__upper__header">
            {isBroadcast && (
              <div className="sendbird-channel-preview__content__upper__header__broadcast-icon">
                <Icon
                  type={IconTypes.BROADCAST}
                  fillColor={IconColors.SECONDARY}
                  height="16px"
                  width="16px"
                />
              </div>
            )}
            {/* <Label
              className="sendbird-channel-preview__content__upper__header__channel-name"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              {getChannelTitle(channel, userId, stringSet)}
            </Label> */}
            <Label
              className="sendbird-channel-preview__content__upper__header__channel-name"
              type={LabelTypography.SUBTITLE_2}
              color={LabelColors.ONBACKGROUND_1}
            >
              <Tooltip title={getChannelTitle(channel, userId, stringSet)}>
                <span>{getChannelTitle(channel, userId, stringSet)}</span>
              </Tooltip>
            </Label>
            <Label
              className="sendbird-channel-preview__content__upper__header__total-members"
              type={LabelTypography.CAPTION_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {getTotalMembers(channel)}
            </Label>
            {isFrozen && (
              <div
                title="Frozen"
                className="sendbird-channel-preview__content__upper__header__frozen-icon"
              >
                <Icon
                  type={IconTypes.FREEZE}
                  fillColor={IconColors.PRIMARY}
                  height={12}
                  width={12}
                />
              </div>
            )}
          </div>
          <Label
            className="sendbird-channel-preview__content__upper__last-message-at"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {getLastMessageCreatedAt(channel, dateLocale)}
          </Label>
        </div>
        <div className="sendbird-channel-preview__content__lower">
          <Label
            className="sendbird-channel-preview__content__lower__last-message"
            type={LabelTypography.BODY_2}
            color={LabelColors.ONBACKGROUND_3}
          >
            {getLastMessage(channel)}
          </Label>
          <div className="sendbird-channel-preview__content__lower__unread-message-count">
            {getChannelUnreadMessageCount(channel) ? ( // return number
              <Badge count={getChannelUnreadMessageCount(channel)} />
            ) : null}
          </div>
        </div>
      </div>
      <div className="sendbird-channel-preview__action">{ChannelAction}</div>
    </div>
  );
}
