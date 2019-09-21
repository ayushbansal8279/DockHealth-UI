import styled from 'styled-components';
import React, { useCallback } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import PatientsDetailsIcon from '../../img/details.svg';
import PatientsEmptyIcon from '../../img/patients-empty.svg';
import { highlightPatient } from '../../actions/patient-actions';

const EmptyListContainer = styled.div`
  background: #fff;
  padding: 41px 24px 50px 24px;
  text-align: center;
  flex: 1;
`;

const EmptyListIcon = styled.div`
  //background: #000;
  display: inline-block;
  margin-bottom: 21px;
  height: 71px;
  width: 47px;
`;

const NonEmptyListRow = styled.tr`
  ${({ isHighlighted }) => isHighlighted && '&&& { background: #a6dcea; }'}
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

const EmptyFilteredList = () => (
  <EmptyListContainer>
    <EmptyListIcon><img src={PatientsEmptyIcon} alt="Empty patients list" /></EmptyListIcon>
    <p><strong>There are no matching patients.</strong></p>
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
    padding-left: 28px;
    :first-of-type {
      padding-left: 43px;    
    }
  }
  
  td {
    font-size: 16px;
  }
`;

const StyledLink = styled(Link)`
  color: #0ca1c7;
`;

const QuickViewCell = styled.td`
  text-align: right;
  font-size: 16px;
  font-weight: 600;
  color: #0ca1c7;
  padding-right: 27px;
`;

const QuickViewIcon = styled.img.attrs({
  src: PatientsDetailsIcon,
  alt: 'Show patient details',
})`
  width: 21px;
  height: 21px;
  max-width: none;
`;

const NonEmptyListCell = ({ children }) => (<td>{children || ' '}</td>);

const capitalize = str => ((typeof str === 'string')
  ? str.charAt(0).toUpperCase() + str.slice(1)
  : str);
const formatDateOfBirth = dob => dob && moment(dob).format('MMM. M, YYYY');

const calculateAgeFromDateOfBirth = (dob) => {
  if (!dob) {
    return null;
  }

  const now = moment();
  const dayAgo = moment().subtract(1, 'day');
  const clampedDob = moment.min(dayAgo, moment(dob));
  const diff = now.diff(clampedDob, 'days');
  return moment.duration(diff, 'days').humanize();
};

const NonEmptyList = ({ patients, isCompact, highlightedPatient }) => {
  const dispatch = useDispatch();
  const selectPatient = useCallback((e) => {
    const patientId = e.target.getAttribute('data-patient');
    dispatch(highlightPatient(patientId));
  }, [dispatch]);

  return (
    <NonEmptyListTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>MRN</th>
          <th>DOB</th>
          <th>Age</th>
          {!isCompact && <th>Gender</th>}
          <th />
        </tr>
      </thead>
      <tbody>
        {patients.map(({
          patientId, mrn, lastName, firstName, middleName, dob, gender,
        }) => (
          <NonEmptyListRow
            key={patientId}
            isHighlighted={highlightedPatient && patientId === highlightedPatient.patientId}
          >
            <NonEmptyListCell>
              <StyledLink to={`/patient/${patientId}`}>
                {`${capitalize(lastName) || '—'}, ${capitalize(firstName) || '—'} ${capitalize(middleName) || ''}`}
              </StyledLink>
            </NonEmptyListCell>
            <NonEmptyListCell>{mrn}</NonEmptyListCell>
            <NonEmptyListCell>{formatDateOfBirth(dob)}</NonEmptyListCell>
            <NonEmptyListCell>{calculateAgeFromDateOfBirth(dob)}</NonEmptyListCell>
            {!isCompact && <NonEmptyListCell>{capitalize(gender)}</NonEmptyListCell>}
            <QuickViewCell>
              <QuickViewIcon onClick={selectPatient} data-patient={patientId} />
            </QuickViewCell>
          </NonEmptyListRow>
        ))}
      </tbody>
    </NonEmptyListTable>);
};

const PatientsList = ({
  patients, isFiltered, isCompact, highlightedPatient,
}) => {
  if (patients.length === 0) {
    return isFiltered ? <EmptyFilteredList /> : <EmptyList />;
  }
  return (
    <NonEmptyList
      patients={patients}
      isCompact={isCompact}
      highlightedPatient={highlightedPatient}
    />);
};

export default PatientsList;
