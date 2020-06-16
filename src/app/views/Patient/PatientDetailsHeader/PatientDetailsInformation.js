import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import ArrowLeftIcon from 'img/arrow-left.svg';
import {
  PatientDetailsInformationContainer,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
  PatientDetails,
  NavigationBackIcon,
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
    <PatientName>
      <Link to="/patients">
        <NavigationBackIcon src={ArrowLeftIcon} />
      </Link>
      {[firstName, middleName, lastName].join(' ')}
    </PatientName>
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
