import React, { useCallback } from 'react';
import moment from 'moment';
// import { useHistory } from 'react-router-dom';
import CrossIcon from 'img/notifications/cross';
// import * as ActionTypes from 'actions/action-types';
import { useDispatch } from 'react-redux';
import {
  ActivityAlertsItemContainer,
  ActivityAlertsItemHeader,
  ActivityAlertsItemOrganizationLabel,
  ActivityAlertItemTitle,
  ActivityAlertsItemTime,
  ActivityAlertsItemClearLabel,
  StyledCrossIcon,
  StyledFooter,
} from 'components/activity-alerts/ActivityAlertsItem/styled';
import { openPopover } from 'actions/sendbird-actions';
import ChatMessageIcon from '../Icons/ChatImageIcon';

const ChatAlertItem = ({
  itemAlert,
  onClearAlert,
  withCrossIcon,
  closeAlerts,
}) => {
  const dispatch = useDispatch();

  const { message: messageAlert, channel } = itemAlert;
  const {
    message: messageContent,
    createdAt,
    _sender: { nickname: senderNickname },
  } = messageAlert;
  const { members } = channel;
  const nickNames = members.map(member => member.nickname).join(', ');

  const onGoFunction = useCallback(() => {
    dispatch(openPopover(channel));
    closeAlerts();
  }, [channel, closeAlerts, dispatch]);

  const formattedNickNames =
    nickNames?.length > 65
      ? `${nickNames.slice(0, 65).replace(/\s*$/, '')}...`
      : nickNames;

  const formattedMessage = `${
    messageContent?.length > 300
      ? `${messageContent.slice(0, 300).replace(/\s*$/, '')}...`
      : messageContent
  }`;

  return (
    <ActivityAlertsItemContainer>
      <ActivityAlertsItemHeader>
        <div>
          <ChatMessageIcon />
          <ActivityAlertsItemOrganizationLabel>
            {formattedNickNames}
          </ActivityAlertsItemOrganizationLabel>
        </div>
        <div>
          <ActivityAlertsItemTime>
            {moment(createdAt).fromNow()}
          </ActivityAlertsItemTime>
          {withCrossIcon && (
            <StyledCrossIcon
              src={CrossIcon}
              alt="cross"
              onClick={onClearAlert}
            />
          )}
          {!withCrossIcon && (
            <ActivityAlertsItemClearLabel onClick={onClearAlert}>
              Clear
            </ActivityAlertsItemClearLabel>
          )}
        </div>
      </ActivityAlertsItemHeader>
      <ActivityAlertItemTitle>From: {senderNickname}</ActivityAlertItemTitle>
      <>
        <p>{formattedMessage}</p>
      </>
      {/* <ActivityAlertItemSubTitle>{formattedSubtitle}</ActivityAlertItemSubTitle> */}
      {onGoFunction && (
        <StyledFooter>
          <span onClick={onGoFunction}>Go</span>
        </StyledFooter>
      )}
    </ActivityAlertsItemContainer>
  );
};

const ChatActivityAlertsItem = ({
  itemAlert,
  onClearAlert,
  withCrossIcon,
  closeAlerts,
}) => (
  <ChatAlertItem
    itemAlert={itemAlert}
    onClearAlert={onClearAlert}
    withCrossIcon={withCrossIcon}
    closeAlerts={closeAlerts}
  />
);

export default ChatActivityAlertsItem;
