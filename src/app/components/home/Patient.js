import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PatientContainer = styled.div`
  font-size: 14px;
  color: #303538;
  line-height: 18px;
`;

const Patient = ({ patient }) => (
  <PatientContainer to={`#/patient/${patient.patientId}`}>
    {`${patient.lastName}, ${patient.firstName} `}
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
};

export default Patient;
