import React, { useEffect } from 'react';
import PatientProfileLabelsImage from 'img/tour/patient-profile/patient-profile-labels.svg';
import Spacing from 'components/common/Spacing';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const PatientProfileLabelsStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Patient Profile modal', 'Patient Profile Labels');
  }, []);

  return (
    <>
      <Spacing vertical={5} />
      <Image
        height={310}
        src={PatientProfileLabelsImage}
        alt="Patient Profile"
      />
      <Spacing vertical={5} />
      <Title>Patient Labels</Title>
      <Description>
        Now you can enhance a patient&apos;s record with tags to highlight key
        elements of their profiles.
      </Description>
    </>
  );
};

export default PatientProfileLabelsStep;
