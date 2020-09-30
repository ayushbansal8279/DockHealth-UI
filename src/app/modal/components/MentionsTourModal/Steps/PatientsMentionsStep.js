import React, { useEffect } from 'react';
import PatientsMentionsImage from 'img/tour/mentions/patients-mentions';
import Spacing from 'components/common/Spacing';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import { StepContainer, Image, Title, Description } from './styled';

const PatientsMentionsStep = () => {
  useEffect(() => {
    onMentionsTourModalEvent('Patient mentions');
  }, []);

  return (
    <StepContainer>
      <Image height={310} src={PatientsMentionsImage} alt="Mention" />
      <Spacing vertical={5} />
      <Title># Hashtag your Patients</Title>
      <Description>
        Never hunt for your patients names again, now you can quickly assign a
        patient by typing # and their name.
      </Description>
    </StepContainer>
  );
};

export default PatientsMentionsStep;
