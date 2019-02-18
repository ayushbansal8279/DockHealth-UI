import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';

const StyledLink = styled(Link)`
  font-size: 14px;
  color: #303538;
  line-height: 18px;
`;

const Patient = ({ patient }) => (
  <StyledLink to={`#/patient/${patient.patientId}`}>
    {`${patient.lastName}, ${patient.firstName} `}
    {patient.mrn}
  </StyledLink>
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
