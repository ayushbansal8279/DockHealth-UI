import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PatientContainer = styled.div`
  font-size: 16px;
  color: #303538;
  line-height: 18px;
  ${props =>
    props.padded &&
    `
    align-items: center;
    display: flex;
    height: 34px;
  `}
`;

const Patient = ({ patient, isCompact, style, padded }) => (
  <PatientContainer style={style} padded={padded}>
    {`${patient.lastName}, ${patient.firstName} `}
    {!isCompact && <br />}
    {patient.mrn}
  </PatientContainer>
);

Patient.propTypes = {
  patient: PropTypes.shape({
    patientIdentifier: PropTypes.string,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    mrn: PropTypes.string,
  }).isRequired,
  isCompact: PropTypes.bool,
  padded: PropTypes.bool,
};

Patient.defaultProps = {
  isCompact: false,
  padded: false,
};

export default Patient;
