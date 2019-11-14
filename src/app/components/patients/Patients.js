import ProgressIcon from '@material-ui/core/CircularProgress/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  getAllPatients,
  getMyPatientsActive,
  getMyPatientsAll,
  loading,
} from '../../actions/patient-actions';
import PatientsCreation from './PatientCreation';
import PatientsHeader from './PatientsHeader';
import PatientsList from './PatientsList';
import PatientsSidebar from './PatientsSidebar';
import PatientsToolbar from './PatientsToolbar';

const FadeContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  padding-top: 100px;
`;

const PatientsListSpinner = ({ isFetching }) => (
  <FadeContainer>
    <Fade
      in={isFetching}
      unmountOnExit
      style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}
    >
      <ProgressIcon />
    </Fade>
  </FadeContainer>
);

const searchPatients = (patients, searchTerm) => {
  const searchTerms = searchTerm.toLowerCase().match(/[\S]+/g) || [];
  const compareField = (field, term) =>
    field && field.toLowerCase().includes(term);
  // eslint-disable-next-line max-len
  const termMatchesPatient = ({ mrn, lastName, firstName }) => term =>
    compareField(mrn, term) ||
    compareField(lastName, term) ||
    compareField(firstName, term);
  const isMatch = patient => searchTerms.every(termMatchesPatient(patient));
  return patients.filter(isMatch);
};

const PatientsLayout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loading());
    getMyPatientsAll()(dispatch);
  }, [dispatch]);

  const isFetching = useSelector(({ patientState }) => patientState.isFetching);
  const patients = useSelector(({ patientState }) => patientState.allPatients);
  const highlightedPatient = useSelector(({ patientState }) => {
    const { highlightedPatientId } = patientState;
    if (highlightedPatientId === null) {
      return null;
    }
    return patientState.allPatients.find(
      ({ patientId }) => patientId === +highlightedPatientId,
    );
  });
  const isCreatingPatient = useSelector(
    ({ patientState }) => patientState.isCreatingPatient,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = useCallback(
    e => {
      const { value } = e.target;
      setSearchTerm(value);
    },
    [setSearchTerm],
  );
  const handlePatientFilter = useCallback(
    selectedFilter => {
      // console.log(`selected filter: ${selectedFilter}`);
      if (selectedFilter === 'MY_PATIENTS') {
        getMyPatientsAll()(dispatch);
      } else if (selectedFilter === 'MY_PATIENTS_WITH_ACTIVE_TASKS') {
        getMyPatientsActive()(dispatch);
      } else {
        getAllPatients()(dispatch);
      }
    },
    [dispatch],
  );

  const filteredPatients = searchPatients(patients, searchTerm);
  const patientSidebarOpen = highlightedPatient || isCreatingPatient;

  return (
    <div>
      <PatientsHeader patientCount={patients.length} isFetching={isFetching} />
      <PatientsToolbar
        handleSearch={handleSearch}
        handlePatientFilter={handlePatientFilter}
      />
      <Grid container>
        {isFetching ? (
          <PatientsListSpinner isFetching={isFetching} />
        ) : (
          <Grid xs={patientSidebarOpen ? 4 : 12} item>
            <PatientsList
              patients={filteredPatients}
              isFiltered={searchTerm !== ''}
              isCompact={highlightedPatient !== null || isCreatingPatient}
              highlightedPatient={highlightedPatient}
            />
          </Grid>
        )}
        {highlightedPatient && (
          <Grid xs={8} item>
            <PatientsSidebar patient={highlightedPatient} />
          </Grid>
        )}
        {isCreatingPatient && (
          <Grid xs={8} item>
            <PatientsCreation />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

const Patients = () => <PatientsLayout />;

export default Patients;
