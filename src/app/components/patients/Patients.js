import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import Fade from '@material-ui/core/Fade';
import ProgressIcon from '@material-ui/core/CircularProgress/CircularProgress';
import { loading, getAllPatients } from '../../actions/patient-actions';
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

const PatientsHeader = ({ patientCount = 0, isFetching }) => (
  <PatientsHeaderContainer>
    <PatientsHeaderLeftSide>
      <PatientsHeaderHeading>My Patients</PatientsHeaderHeading>
      <PatientsHeaderSubheading>
        {isFetching ? '' : `${patientCount} patients`}
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

const PatientsToolbarSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = useCallback((e) => {
    const { value } = e.target;
    setSearchTerm(value);
  }, [setSearchTerm]);

  return (<PatientsSearch onChange={handleSearch} style={{ marginLeft: '46px' }} />);
};

const PatientsToolbarContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 41px 0 32px 43px;
`;

const PatientsToolbar = () => (
  <PatientsToolbarContainer>
    <PatientsToolbarFilter />
    <PatientsToolbarSearch />
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

const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 100px;
`;

const PatientsListSpinner = ({ isFetching }) => (
  <FadeContainer>
    <Fade in={isFetching} unmountOnExit style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}>
      <ProgressIcon />
    </Fade>
  </FadeContainer>
);

const PatientsLayout = ({ patients = [], fetchPatients, isFetching }) => {
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return (
    <div>
      <PatientsHeader patientCount={patients.length} isFetching={isFetching} />
      <PatientsToolbar />
      {isFetching
        ? <PatientsListSpinner isFetching={isFetching} />
        : <PatientsList patients={patients} />}
    </div>
  );
};

const mapStateToProps = state => ({
  isFetching: state.patientState.isFetching,
  patients: state.patientState.allPatients,
});

const mapDispatchToProps = dispatch => ({
  fetchPatients: () => {
    loading()(dispatch);
    getAllPatients()(dispatch);
  },
});

const ConnectedPatientsLayout = connect(mapStateToProps, mapDispatchToProps)(PatientsLayout);

const Patients = () => (
  <div className="off-canvas-content" data-off-canvas-content>
    <div className="row expanded collapse" style={{ minHeight: '100%' }}>
      <div className="large-12 columns" style={{ background: '#f5f8fa' }}>
        <ConnectedPatientsLayout />
      </div>
    </div>
  </div>
);

PatientsLayout.propTypes = {
  patients: PropTypes.arrayOf(PropTypes.shape({
    patientId: PropTypes.number,
  })),
};

PatientsLayout.defaultProps = {
  patients: [],
};

export default Patients;
