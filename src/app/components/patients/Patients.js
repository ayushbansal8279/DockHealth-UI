import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';
import moment from 'moment';
import PatientsFilter from './PatientsFilter';
import PatientsSearch from './PatientsSearch';

const PatientsHeaderContainer = styled.div`
  display: flex;
  background: #fff;
  height: 88px;
  padding: 14px 40px 0 22px;
`;

const PatientsHeaderLeftSide = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-bottom: 6px;
`;

const PatientsHeaderHeading = styled.span`
  font-size: 36px;
  line-height: 42px;
  color: #303538;
`;

const PatientsHeaderSubheading = styled.span`
  font-size: 16px;
  line-height: 26px;
  color: #2e3a43;
`;

const PatientsHeader = ({ patientCount = 0 }) => (
  <PatientsHeaderContainer>
    <PatientsHeaderLeftSide>
      <PatientsHeaderHeading>My Patients</PatientsHeaderHeading>
      <PatientsHeaderSubheading>
        {`${patientCount} patients`}
      </PatientsHeaderSubheading>
    </PatientsHeaderLeftSide>
    {/* <div> */}
    {/* Add Patient */}
    {/* </div> */}
  </PatientsHeaderContainer>
);

const ALL_PATIENTS = 'ALL_PATIENTS';
const MY_PATIENTS = 'MY_PATIENTS';
const MY_PATIENTS_WITH_ACTIVE_TASKS = 'MY_PATIENTS_WITH_ACTIVE_TASKS';

const PatientsToolbarFilter = () => {
  const [filter, setFilter] = useState(ALL_PATIENTS);
  const handleFilterChange = useCallback((e) => {
    const { value } = e.target;
    setFilter(value);
  }, [setFilter]);

  return (
    <PatientsFilter
      onChange={handleFilterChange}
      value={filter}
      options={[
        { value: ALL_PATIENTS, description: 'All patients' },
        { value: MY_PATIENTS, description: 'My patients' },
        { value: MY_PATIENTS_WITH_ACTIVE_TASKS, description: 'My patients with active tasks' },
      ]}
    />
  );
};

const PatientsToolbarContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 41px 0 32px 43px;
`;

const PatientsToolbar = () => (
  <PatientsToolbarContainer>
    <PatientsToolbarFilter />
    <PatientsSearch onChange={() => {}} style={{ marginLeft: '46px' }} />
  </PatientsToolbarContainer>);

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

const capitalize = str => ((typeof str === 'string') ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const currentYear = moment();

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
          <NonEmptyListCell><StyledLink to={`/patient/${patientId}`}>{mrn}</StyledLink></NonEmptyListCell>
          <NonEmptyListCell>{capitalize(lastName)}</NonEmptyListCell>
          <NonEmptyListCell>{capitalize(firstName)}</NonEmptyListCell>
          <NonEmptyListCell>{dob && moment(dob).format('MMM. M, YYYY')}</NonEmptyListCell>
          <NonEmptyListCell>{dob && currentYear.diff(dob, 'years')}</NonEmptyListCell>
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

const PatientsLayoutContainer = styled.div``;

const PatientsLayout = ({ patients = [] }) => (
  <PatientsLayoutContainer>
    <PatientsHeader patientCount={patients.length} />
    <PatientsToolbar />
    <PatientsList patients={patients} />
  </PatientsLayoutContainer>
);

const Patients = ({ patients = [] }) => (
  <div className="off-canvas-content" data-off-canvas-content>
    <div className="row expanded collapse" style={{ minHeight: '100%' }}>
      <div className="large-12 columns" style={{ background: '#f5f8fa' }}>
        <PatientsLayout patients={patients} />
      </div>
    </div>
  </div>
);

Patients.propTypes = {
  patients: PropTypes.arrayOf(PropTypes.shape({
    patientId: PropTypes.number,
  })),
};

const patients = [
  {
    patientId: 35,
    mrn: '126',
    firstName: null,
    lastName: null,
    dob: '2015-08-11',
    gender: null,
    phoneHome: null,
    phoneMobile: null,
    email: null,
    creator: null,
    notes: null,
  },
  {
    patientId: 39,
    mrn: '123113123',
    firstName: '1234',
    lastName: '1234',
    dob: null,
    gender: 'female',
    phoneHome: '',
    phoneMobile: '',
    email: 'kjggg@gdgg.com',
    creator: null,
    notes: '',
  },
  {
    patientId: 44,
    mrn: '987654321',
    firstName: 'a',
    lastName: 'b',
    dob: null,
    gender: 'male',
    phoneHome: '',
    phoneMobile: '',
    email: 'a@b.c',
    creator: null,
    notes: '',
  },
  {
    patientId: 55,
    mrn: '12345666',
    firstName: 'Frank',
    lastName: 'Beans',
    dob: null,
    gender: 'male',
    phoneHome: '',
    phoneMobile: '',
    email: '',
    creator: null,
    notes: null,
  }];

Patients.defaultProps = {
  patients,
};

export default Patients;
