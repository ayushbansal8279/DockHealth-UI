import { Grid } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { beginPatientCreation } from '../../actions/patient-actions';
import AdornedButton from '../common/AdornedButton';
import PageContentHeader from '../common/PageContentHeader';
import Search from '../taskView/Search';
import PatientsFilter from './PatientsFilter';

const PatientSearchContainer = styled.div`
  margin-left: 2.5rem;
  width: 16rem;
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
}) => {
  const dispatch = useDispatch();

  const onAddPatientClick = useCallback(() => {
    dispatch(beginPatientCreation());
  }, [dispatch]);

  return (
    <PageContentHeader onClick={deselectPatient}>
      <Grid container alignItems="center" wrap="nowrap">
        <PatientsToolbarFilter
          handlePatientFilter={handlePatientFilter}
          deselectPatient={deselectPatient}
        />
        <PatientSearchContainer>
          <Search variant="outlined" fullWidth onChange={handleSearch} />
        </PatientSearchContainer>
      </Grid>
      <AdornedButton adornment={<AddIcon />} onClick={onAddPatientClick}>
        ADD A PATIENT
      </AdornedButton>
    </PageContentHeader>
  );
};

export default PatientsToolbar;
