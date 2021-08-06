import React, { useEffect } from 'react';
import PatientCustomFieldsImage from 'img/tour/patient-custom-field/patient-custom-field';
import Spacing from 'components/common/Spacing';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const PatientCustomFieldsStep = () => {
  useEffect(() => {
    onTourModalStepEnter(
      'Patient Custom Fields modal',
      'Patient Patient Custom Fields',
    );
  }, []);

  return (
    <>
      <Spacing vertical={5} />
      <Image
        height={310}
        src={PatientCustomFieldsImage}
        alt="Patient Custom Fields"
      />
      <Spacing vertical={5} />
      <Title>Custom fields for Patients</Title>
      <Description>
        Add new data elements you want to track for Patients or Clients. If you
        are an Admin, refer to the Settings menu to add custom fields.
      </Description>
    </>
  );
};

export default PatientCustomFieldsStep;
