import moment from 'moment';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { useMount } from 'react-use';
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
  display: inline-block;
  margin-bottom: 21px;
  height: 71px;
  width: 47px;
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

const NonEmptyListTable = styled.div`
  color: #303538;
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 0.25rem;
  grid-template-columns: 1fr;
`;

const ListRow = styled.div`
  background: ${props => (props.isHighlighted ? '#a6dcea' : '#fff')};
  cursor: pointer;
  grid-template-columns: ${props =>
    props.isCompact ? '0.75fr 0.25fr' : '0.5fr 0.15fr 0.15fr 0.1fr 0.1fr 4rem'};
  display: grid;
  font-size: 1rem;
  height: 4rem;

  & > * {
    align-items: center;
    display: flex;
    padding-left: 1.75rem;
    overflow: hidden;

    &:first-child {
      padding-left: 2.75rem;
    }

    &:last-child {
      padding: 0 1rem;
    }
  }
`;

const ListHeader = styled(ListRow)`
  cursor: default;
  font-size: 0.875rem;
  font-weight: 600;
  height: 2rem;
  text-transform: uppercase;
`;

const StyledLink = styled(Link)`
  color: #0ca1c7;
  filter: brightness(1);
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.25s ease-out;
  white-space: nowrap;

  &:hover {
    color: #0ca1c7;
    filter: brightness(1.35);
  }
`;

const QuickViewCell = styled.div`
  align-items: center;
  color: #0ca1c7;
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  justify-content: center;
`;

const QuickViewIcon = styled.img.attrs({
  src: PatientsDetailsIcon,
  alt: 'Show patient details',
})`
  width: 21px;
  height: 21px;
  max-width: none;
`;

const capitalize = text =>
  typeof text === 'string'
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : text;

const formatDateOfBirth = dob => dob && moment(dob).format('MMM D, YYYY');

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

const NonEmptyList = ({ patients, isCompact, highlightedPatient }) => {
  const dispatch = useDispatch();
  const selectPatient = useCallback(
    ({ patientIdentifier }) => () => {
      dispatch(highlightPatient(patientIdentifier));
    },
    [dispatch],
  );

  useMount(() => {
    selectPatient({ patientIdentifier: null });
  });

  return (
    <NonEmptyListTable listLength={patients?.length ?? 0}>
      <ListHeader isCompact={isCompact}>
        <div>Name</div>
        <div>MRN</div>
        {!isCompact && (
          <>
            <div>DOB</div>
            <div>Age</div>
            <div>Gender</div>
            <div>&nbsp;</div>
          </>
        )}
      </ListHeader>
      {patients.map(
        ({ patientIdentifier, mrn, lastName, firstName, middleName, dob, gender }) => (
          <ListRow
            key={patientIdentifier}
            isHighlighted={
              highlightedPatient && patientIdentifier === highlightedPatient.patientIdentifier
            }
            isCompact={isCompact}
            onClick={selectPatient({ patientIdentifier })}
          >
            <div>
              <StyledLink to={`/patient/${patientIdentifier}`}>
                {`${capitalize(lastName) || '—'}, ${capitalize(firstName) ||
                  '—'} ${capitalize(middleName) || ''}`}
              </StyledLink>
            </div>
            <div>{mrn}</div>
            {!isCompact && (
              <>
                <div>{formatDateOfBirth(dob)}</div>
                <div>{calculateAgeFromDateOfBirth(dob)}</div>
                <div>{capitalize(gender)}</div>
                <QuickViewCell>
                  <QuickViewIcon onClick={selectPatient({ patientIdentifier })} />
                </QuickViewCell>
              </>
            )}
          </ListRow>
        ),
      )}
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
