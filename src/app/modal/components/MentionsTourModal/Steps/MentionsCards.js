import React, { useEffect } from 'react';
import MentionsCardsImage from 'img/tour/mentions/mentions-cards';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import { StepContainer, Image, Title, Description } from './styled';

const MentionsCards = () => {
  useEffect(() => {
    onMentionsTourModalEvent('Mentions cards');
  }, []);

  return (
    <StepContainer>
      <Image height={510} src={MentionsCardsImage} alt="Mention card" />
      <Title>Patient and People details</Title>
      <Description>
        Hovering over the name of team members or patients will pop up detailed
        information about them.
      </Description>
    </StepContainer>
  );
};

export default MentionsCards;
