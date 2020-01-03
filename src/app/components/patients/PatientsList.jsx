import moment from 'moment';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { createBreakpoint } from 'react-use';
import styled from 'styled-components';

import { highlightPatient } from '../../actions/patient-actions';
import PatientsDetailsIcon from '../../img/details.svg';
import PatientsEmptyIcon from '../../img/patients-empty.svg';

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
    <p>
      <strong>There have been no patients added.</strong>
    </p>
    <p>
      You can add patients using the button on the top-right. You can also
      contact us if you wish to view patients from LDAP or EMR.
    </p>
  </EmptyListContainer>
);

const EmptyFilteredList = () => (
  <EmptyListContainer>
    <EmptyListIcon>
      <img src={PatientsEmptyIcon} alt="Empty patients list" />
    </EmptyListIcon>
    <p>
      <strong>There are no matching patients.</strong>
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

    tr {
      cursor: pointer;
    }

    tr:nth-child(even) {
      background: none;
    }
  }

  th,
  td {
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

const NonEmptyListCell = ({ children }) => <td>{children || ' '}</td>;

const capitalize = text =>
  typeof text === 'string'
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : text;

const formatDateOfBirth = dob => dob && moment(dob).format('MMM. D, YYYY');

const calculateAgeFromDateOfBirth = dob => {
  if (!dob) {
    return '';
  }

  const yearsOld = moment().diff(moment(dob), 'years');

  if (yearsOld < 0) {
    return '';
  }

  const yearsLabel = yearsOld === 1 ? 'yr' : 'yrs';

  return `${yearsOld} ${yearsLabel}`;
};

const useBreakpoint = createBreakpoint({ md: 960, lg: 1280 });

const CompactWrapper = ({ children, isCompact }) => {
  const breakpoint = useBreakpoint();

  switch (breakpoint) {
    case 'md':
      return children;
    case 'lg':
      return !isCompact && children;
    default:
      return null;
  }
};

const NonEmptyList = ({ patients, isCompact, highlightedPatient }) => {
  const dispatch = useDispatch();
  const selectPatient = useCallback(
    ({ patientId }) => () => {
      dispatch(highlightPatient(patientId));
    },
    [dispatch],
  );

  return (
    <NonEmptyListTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>MRN</th>
          <CompactWrapper isCompact={isCompact}>
            <th>DOB</th>
            <th>Age</th>
            <th>Gender</th>
            <th>&nbsp;</th>
          </CompactWrapper>
        </tr>
      </thead>
      <tbody>
        {patients.map(
          ({
            patientId,
            mrn,
            lastName,
            firstName,
            middleName,
            dob,
            gender,
          }) => (
            <NonEmptyListRow
              key={patientId}
              isHighlighted={
                highlightedPatient && patientId === highlightedPatient.patientId
              }
              onClick={selectPatient({ patientId })}
            >
              <NonEmptyListCell>
                <StyledLink to={`/patient/${patientId}`}>
                  {`${capitalize(lastName) || '—'}, ${capitalize(firstName) ||
                    '—'} ${capitalize(middleName) || ''}`}
                </StyledLink>
              </NonEmptyListCell>
              <NonEmptyListCell>{mrn}</NonEmptyListCell>
              <CompactWrapper isCompact={isCompact}>
                <NonEmptyListCell>{formatDateOfBirth(dob)}</NonEmptyListCell>
                <NonEmptyListCell>
                  {calculateAgeFromDateOfBirth(dob)}
                </NonEmptyListCell>
                <NonEmptyListCell>{capitalize(gender)}</NonEmptyListCell>
                <QuickViewCell>
                  <QuickViewIcon onClick={selectPatient({ patientId })} />
                </QuickViewCell>
              </CompactWrapper>
            </NonEmptyListRow>
          ),
        )}
      </tbody>
    </NonEmptyListTable>
  );
};

const PatientsList = ({
  patients,
  isFiltered,
  isCompact,
  highlightedPatient,
}) => {
  if (patients.length === 0) {
    return isFiltered ? <EmptyFilteredList /> : <EmptyList />;
  }
  return (
    <NonEmptyList
      patients={patients}
      isCompact={isCompact}
      highlightedPatient={highlightedPatient}
    />
  );
};

export default PatientsList;
