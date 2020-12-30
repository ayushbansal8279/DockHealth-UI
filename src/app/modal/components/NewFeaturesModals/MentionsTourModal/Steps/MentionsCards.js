import React, { useEffect } from 'react';
import MentionsCardsImage from 'img/tour/mentions/mentions-cards-anim.gif';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import Spacing from 'components/common/Spacing';
import { Image, Title, Description } from '../../styled';

const MentionsCards = () => {
  useEffect(() => {
    onMentionsTourModalEvent('Mentions cards');
  }, []);

  return (
    <>
      <Image height={350} src={MentionsCardsImage} alt="Mention card" />
      <Spacing vertical={4} />
      <Title>Patient and People details</Title>
      <Description>
        Hovering over the name of team members or patients will pop up detailed
        information about them.
      </Description>
    </>
  );
};

export default MentionsCards;
