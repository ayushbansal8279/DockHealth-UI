import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import PatientProfileIntroImage from 'img/tour/patient-profile/patient-profile-intro.svg';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const PatientProfileIntroStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Patient Profile modal', 'Patient Profile Intro');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image
        height={295}
        src={PatientProfileIntroImage}
        alt="Patient Profile"
      />
      <Spacing vertical={5} />
      <Title>Enhanced Patient Profile</Title>
      <Description>
        The patient profile now has dedicated areas for tasks, notes and files!
      </Description>
    </>
  );
};

export default PatientProfileIntroStep;
