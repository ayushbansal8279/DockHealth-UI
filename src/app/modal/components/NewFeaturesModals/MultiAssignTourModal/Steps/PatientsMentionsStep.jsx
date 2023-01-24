import React, { useEffect } from 'react';
import PatientsMentionsImage from 'img/tour/mentions/patients-mentions-anim.gif';
import Spacing from 'components/common/Spacing';
import { onMentionsTourModalEvent } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const PatientsMentionsStep = () => {
  useEffect(() => {
    onMentionsTourModalEvent('Multi Assign modal', 'Patient mentions');
  }, []);

  return (
    <>
      <Image height={310} src={PatientsMentionsImage} alt="Mention" />
      <Spacing vertical={5} />
      <Title># Hashtag your Patients/Clients</Title>
      <Description>
        Never hunt for your patients/clients names again, now you can quickly
        assign a patient/client by typing # and their name.
      </Description>
    </>
  );
};

export default PatientsMentionsStep;
