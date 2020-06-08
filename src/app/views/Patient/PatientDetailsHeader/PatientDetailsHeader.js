import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { patientDetailsSelector } from 'selectors/patient-selectors';
import {
  PatientDetailsHeaderContainer,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
} from './styled';

const PatientDetailsHeader = ({ patientDetails = {} }) => {
  const {
    firstName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    dob,
    patientIdentifier,
  } = patientDetails;
  return (
    <PatientDetailsHeaderContainer>
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
    </PatientDetailsHeaderContainer>
  );
};

const mapStateToProps = store => ({
  patientDetails: patientDetailsSelector(store),
});

export default connect(mapStateToProps)(PatientDetailsHeader);
