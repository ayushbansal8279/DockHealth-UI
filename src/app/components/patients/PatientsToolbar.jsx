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

const stopPropagation = event => {
  event.stopPropagation();
};

const PatientsToolbarFilter = ({ handlePatientFilter, deselectPatient }) => {
  const [filter, setFilter] = useState(MY_PATIENTS);
  const handleFilterChange = useCallback(
    event => {
      const { value } = event.target;
      setFilter(value);
      handlePatientFilter(value);
      deselectPatient();
    },
    [deselectPatient, handlePatientFilter],
  );

  return (
    <PatientsFilter
      stopPropagation={stopPropagation}
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

const PatientsToolbar = ({
  deselectPatient,
  handleSearch,
  handlePatientFilter,
}) => (
  <PatientsToolbarContainer onClick={deselectPatient}>
    <PatientsToolbarFilter
      handlePatientFilter={handlePatientFilter}
      deselectPatient={deselectPatient}
    />
    <PatientsSearch
      onChange={handleSearch}
      stopPropagation={stopPropagation}
      style={{ marginLeft: '46px' }}
    />
  </PatientsToolbarContainer>
);

export default PatientsToolbar;
