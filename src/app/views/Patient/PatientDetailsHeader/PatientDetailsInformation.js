import React from 'react';
import moment from 'moment';
import {
  PatientDetailsInformationContainer,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
} from './styled';

const PatientDetailsInformation = ({
  firstName,
  lastName,
  email,
  phoneMobile,
  phoneHome,
  dob,
  patientIdentifier,
}) => (
  <PatientDetailsInformationContainer>
    <PatientName>
      {firstName} {lastName}
    </PatientName>
    {email && (
      <>
        <PatientInfo>{email}</PatientInfo>
        <PatientInfoDivider />
      </>
    )}
    {phoneMobile && (
      <>
        <PatientInfo>M {phoneMobile}</PatientInfo>
        <PatientInfoDivider />
      </>
    )}
    {phoneHome && (
      <>
        <PatientInfo>H {phoneHome}</PatientInfo>
        <PatientInfoDivider />
      </>
    )}
    {dob && (
      <>
        <PatientInfo>
          {moment().diff(moment(dob), 'years')} y/o{' '}
          {moment(dob).format('MM/DD/YYYY')}
        </PatientInfo>
        <PatientInfoDivider />
      </>
    )}
    {patientIdentifier && (
      <>
        <PatientInfo>ID# {patientIdentifier}</PatientInfo>
        <PatientInfoDivider />
      </>
    )}
  </PatientDetailsInformationContainer>
);

export default PatientDetailsInformation;
