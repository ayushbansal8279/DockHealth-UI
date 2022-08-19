import React, { useContext, useState } from 'react';
import Label from '@sendbird/uikit-react/ui/Label';
import Icon from '@sendbird/uikit-react/ui/Icon';
import Badge from '@sendbird/uikit-react/ui/Badge';
import { LocalizationContext } from '../channel/ChannelLocalizationContext';
import { Colors, Typography } from './LabelTypography';
// import MemberList from '../ModerationPanel/MemberList';
import MemberList from './MemberList';
import ChannelSettingsContext from './ChannelSettingsContext';

const kFormatter = number => {
  return Math.abs(number) > 999
    ? `${(Math.abs(number) / 1000).toFixed(1)}K`
    : number;
};

const UserPanel = () => {
  const { stringSet } = useContext(LocalizationContext);
  const [showAccordion, setShowAccordion] = useState(false);
  const { channel } = useContext(ChannelSettingsContext);
  return (
    <>
      <MemberList />
      {/* <div
        className={[
          'sendbird-channel-settings__panel-item',
          'sendbird-channel-settings__members',
        ].join(' ')}
        role="switch"
        aria-checked={showAccordion}
        onKeyDown={() => setShowAccordion(!showAccordion)}
        onClick={() => setShowAccordion(!showAccordion)}
        tabIndex={0}
      >
        <Icon
          className="sendbird-channel-settings__panel-icon-left"
          type="MEMBERS"
          fillColor="PRIMARY"
          height="24px"
          width="24px"
        />
        <Label type={Typography.SUBTITLE_1} color={Colors.ONBACKGROUND_1}>
          {stringSet.CHANNEL_SETTING__MEMBERS__TITLE}
          <Badge count={kFormatter(channel?.memberCount)} />
        </Label>
        <Icon
          className={[
            'sendbird-channel-settings__panel-icon-right',
            'sendbird-channel-settings__panel-icon--chevron',
            showAccordion ? 'sendbird-channel-settings__panel-icon--open' : '',
          ].join(' ')}
          type="CHEVRON_RIGHT"
          height="24px"
          width="24px"
        />
      </div>
      {showAccordion && <MemberList />} */}
    </>
  );
};

export default UserPanel;
