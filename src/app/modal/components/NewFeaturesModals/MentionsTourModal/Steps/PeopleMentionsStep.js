import React, { useEffect } from 'react';
import PeopleMentionsImage from 'img/tour/mentions/people-mentions-anim.gif';
import Spacing from 'components/common/Spacing';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const PeopleMentionsStep = () => {
  useEffect(() => {
    onMentionsTourModalEvent('People mentions');
  }, []);

  return (
    <>
      <Image height={310} src={PeopleMentionsImage} alt="Mention" />
      <Spacing vertical={5} />
      <Title>@mention and @assign</Title>
      <Description>
        Quickly assign and write comments to your coworkers with the @ symbol
        and they’ll get a direct notification.
      </Description>
    </>
  );
};

export default PeopleMentionsStep;
