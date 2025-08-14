import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import PatientProfileIntroImage from 'img/tour/patient-profile/patient-profile-intro.svg';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const PatientProfileIntroStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Patient Object modal', 'Patient Object Intro');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image height={295} src={PatientProfileIntroImage} alt="Patient Object" />
      <Spacing vertical={5} />
      <Title>Enhanced Patient Object</Title>
      <Description>
        The patient object now has dedicated areas for tasks, notes and files!
      </Description>
    </>
  );
};

export default PatientProfileIntroStep;
