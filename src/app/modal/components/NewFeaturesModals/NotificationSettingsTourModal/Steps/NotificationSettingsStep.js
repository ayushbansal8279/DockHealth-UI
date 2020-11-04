import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import NotificationSettingsImage from 'img/tour/notification-settings/notification-settings';
import { onNotificationSettingsTourModalEvent } from 'helpers/ga-event-helper';
import { Image, Title, Description } from './styled';

const NotificationSettingsStep = () => {
  useEffect(() => {
    onNotificationSettingsTourModalEvent('Notification settings');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image
        height={225}
        src={NotificationSettingsImage}
        alt="Notification settings"
      />
      <Spacing vertical={5} />
      <Title>2 ways to get notifications</Title>
      <Description>
        Get notifications via email or right in the Dock app - or both if you
        want to make sure your bases are covered. You can also choose not to get
        any notifications if you already get too many. Click the notifications
        bell in the upper right corner, then click the gear icon to set them up.
      </Description>
    </>
  );
};

export default NotificationSettingsStep;
