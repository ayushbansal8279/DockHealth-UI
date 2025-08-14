import React, { useEffect } from 'react';
import PatientProfileFilesImage from 'img/tour/patient-profile/patient-profile-files.svg';
import Spacing from 'components/common/Spacing';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const PatientProfileFilesStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Patient Object modal', 'Patient Object Files');
  }, []);

  return (
    <>
      <Spacing vertical={5} />
      <Image height={310} src={PatientProfileFilesImage} alt="Patient Object" />
      <Spacing vertical={5} />
      <Title>Patient Files</Title>
      <Description>
        Add files and documents to a patient&apos;s object for better
        organization and access to key information.
      </Description>
    </>
  );
};

export default PatientProfileFilesStep;
