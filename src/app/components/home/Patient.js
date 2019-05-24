import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PatientContainer = styled.div`
  font-size: 14px;
  color: #303538;
  line-height: 18px;
`;

const Patient = ({ patient, isCompact }) => (
  <PatientContainer to={`#/patient/${patient.patientId}`}>
    {`${patient.lastName}, ${patient.firstName} `}
    {!isCompact && <br />}
    {patient.mrn}
  </PatientContainer>
);

Patient.propTypes = {
  patient: PropTypes.shape({
    patientId: PropTypes.number,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    mrn: PropTypes.string,
  }).isRequired,
  isCompact: PropTypes.bool,
};

Patient.defaultProps = {
  isCompact: false,
};

export default Patient;
