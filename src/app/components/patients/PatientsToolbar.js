import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import PatientsFilter from './PatientsFilter';
import PatientsSearch from './PatientsSearch';

const PatientsToolbarContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 41px 0 32px 43px;
`;

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
        {
          value: ALL_PATIENTS,
          description: 'All patients',
        },
        {
          value: MY_PATIENTS,
          description: 'My patients',
        },
        {
          value: MY_PATIENTS_WITH_ACTIVE_TASKS,
          description: 'My patients with active tasks',
        },
      ]}
    />
  );
};

const PatientsToolbar = ({ handleSearch }) => (
  <PatientsToolbarContainer>
    <PatientsToolbarFilter />
    <PatientsSearch onChange={handleSearch} style={{ marginLeft: '46px' }} />
  </PatientsToolbarContainer>);

export default PatientsToolbar;
