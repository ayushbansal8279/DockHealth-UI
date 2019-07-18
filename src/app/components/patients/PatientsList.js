import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router';
import moment from './Patients';

const EmptyListContainer = styled.div`
  background: #fff;
  padding: 41px 24px 50px 24px;
  text-align: center;
`;

const EmptyListIcon = styled.div`
  background: #000;
  display: inline-block;
  margin-bottom: 21px;
  height: 71px;
  width: 47px;
`;

const EmptyList = () => (
  <EmptyListContainer>
    <EmptyListIcon />
    <p><strong>There have been no patients added.</strong></p>
    <p>
      You can add patients using the button on the top-right.
      You can also contact us if you wish to view patients from LDAP or EMR.
    </p>
  </EmptyListContainer>
);

const NonEmptyListTable = styled.table`
  border-spacing: 0 4px;
  color: #303538;
  white-space: nowrap;
  
  thead {
    background: #fff;
    font-size: 14px;
    line-height: 15px;
    
    th:last-child {
      width: 100%;
    }
  }
  
  tbody {
    line-height: 49px;
    font-weight: 600;
  
    tr:nth-child(even) {
      background: none;
    }
  }
  
  th, td {
    padding-left: 43px;
  }
  
  td {
    font-size: 16px;
  }
`;

const StyledLink = styled(Link)`
  color: #0ca1c7;
`;

const NonEmptyListCell = ({ children }) => (<td>{children || <i>—</i>}</td>);

const capitalize = str => ((typeof str === 'string')
  ? str.charAt(0).toUpperCase() + str.slice(1)
  : str);
const formatDateOfBirth = dob => dob && moment(dob).format('MMM. M, YYYY');
const calculateAgeFromDateOfBirth = dob => dob && moment().diff(dob, 'years');

const NonEmptyList = ({ patients }) => (
  <NonEmptyListTable>
    <thead>
      <tr>
        <th>MRN</th>
        <th>Last Name</th>
        <th>First Name</th>
        <th>DOB</th>
        <th>Age</th>
        <th>Gender</th>
      </tr>
    </thead>
    <tbody>
      {patients.map(({
        patientId, mrn, lastName, firstName, dob, gender,
      }) => (
        <tr key={patientId}>
          <NonEmptyListCell>
            <StyledLink to={`/patient/${patientId}`}>{mrn}</StyledLink>
          </NonEmptyListCell>
          <NonEmptyListCell>{capitalize(lastName)}</NonEmptyListCell>
          <NonEmptyListCell>{capitalize(firstName)}</NonEmptyListCell>
          <NonEmptyListCell>{formatDateOfBirth(dob)}</NonEmptyListCell>
          <NonEmptyListCell>{calculateAgeFromDateOfBirth(dob)}</NonEmptyListCell>
          <NonEmptyListCell>{capitalize(gender)}</NonEmptyListCell>
        </tr>
      ))}
    </tbody>
  </NonEmptyListTable>);

const PatientsList = ({ patients }) => (
  <>
    {patients.length === 0
      ? <EmptyList />
      : <NonEmptyList patients={patients} />}
  </>);

export default PatientsList;
