import React from 'react';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import { MentionItem } from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientMention = ({ mention, className, children }) => {
  return (
    <MentionItem className={className}>
      <PatientCard patientIdentifier={mention.identifier}>
        {children}
      </PatientCard>
    </MentionItem>
  );
};

export default PatientMention;
