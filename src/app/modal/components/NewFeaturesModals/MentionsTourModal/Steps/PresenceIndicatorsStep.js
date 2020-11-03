import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import PresenceIndicatorsImage from 'img/tour/mentions/presence-indicators-anim.gif';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import { Image, Title, Description } from './styled';

const PresenceIndicatorsStep = () => {
  useEffect(() => {
    onMentionsTourModalEvent('Presence indicators');
  }, []);

  return (
    <>
      <Spacing vertical={6} />
      <Image src={PresenceIndicatorsImage} alt="Who is online?" />
      <Spacing vertical={4} />
      <Title>See who’s online</Title>
      <Description>
        Know in an instant the status of the people in your organization. This
        new feature will tell you whether your team members are online, offline
        or idle.
      </Description>
    </>
  );
};

export default PresenceIndicatorsStep;
