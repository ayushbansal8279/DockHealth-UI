import React from 'react';
import moment from 'moment';
import {
  PatientDetailsInformationContainer,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
  PatientDetails,
} from './styled';

const PatientDetailsInformation = ({
  firstName,
  middleName,
  lastName,
  email,
  phoneMobile,
  phoneHome,
  dob,
  patientIdentifier,
  gender,
}) => (
  <PatientDetailsInformationContainer>
    <PatientName>{[firstName, middleName, lastName].join(' ')}</PatientName>
    <PatientDetails>
      {dob && gender && (
        <>
          <PatientInfo>
            {moment(dob).format('MM/DD/YYYY')}{' '}
            {moment().diff(moment(dob), 'years')} {'y/o '}
            {gender?.charAt(0)?.toUpperCase()}
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
    </PatientDetails>
  </PatientDetailsInformationContainer>
);

export default PatientDetailsInformation;
