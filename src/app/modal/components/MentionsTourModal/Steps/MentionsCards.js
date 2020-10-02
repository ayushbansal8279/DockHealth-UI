import React, { useEffect } from 'react';
import MentionsCardsImage from 'img/tour/mentions/mentions-cards';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import Spacing from 'components/common/Spacing';
import { StepContainer, Image, Title, Description } from './styled';

const MentionsCards = () => {
  useEffect(() => {
    onMentionsTourModalEvent('Mentions cards');
  }, []);

  return (
    <StepContainer>
      <Image height={460} src={MentionsCardsImage} alt="Mention card" />
      <Spacing vertical={3} />
      <Title>Patient and People details</Title>
      <Description>
        Hovering over the name of team members or patients will pop up detailed
        information about them.
      </Description>
    </StepContainer>
  );
};

export default MentionsCards;
