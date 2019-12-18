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
  highlightPatient,
} from '../../actions/patient-actions';
import PatientsCreation from './PatientCreation';
import PatientsHeader from './PatientsHeader';
import PatientsList from './PatientsList';
import PatientsSidebar from './PatientsSidebar';
import PatientsToolbar from './PatientsToolbar';
import CubesLoader from '../common/CubesLoader';

const FadeContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  padding-top: 100px;
`;

const SideClickListener = styled.div`
  flex: 1;
`;

const PatientsListSpinner = ({ isFetching }) => (
  <FadeContainer>
    <Fade
      in={isFetching}
      unmountOnExit
      style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}
    >
      <CubesLoader size={40} />
    </Fade>
  </FadeContainer>
);

const compareField = (field, term) =>
  field && field.toLowerCase().includes(term);

const termMatchesPatient = ({ mrn, lastName, firstName }) => term =>
  compareField(mrn, term) ||
  compareField(lastName, term) ||
  compareField(firstName, term);

const searchPatients = (patients, searchTerm) => {
  const searchTerms = searchTerm.toLowerCase().match(/\S+/g) || [];
  // eslint-disable-next-line max-len
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
    event => {
      const { value } = event.target;
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

  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
  }, [dispatch]);

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
          <Grid
            container
            md={12}
            lg={highlightedPatient || isCreatingPatient ? 6 : 12}
            item
            direction="column"
          >
            <PatientsList
              patients={filteredPatients}
              isFiltered={searchTerm !== ''}
              isCompact={highlightedPatient !== null || isCreatingPatient}
              highlightedPatient={highlightedPatient}
            />
            <SideClickListener onClick={deselectPatient} />
          </Grid>
        )}
        {highlightedPatient && (
          <Grid md={12} lg={6} item container direction="column">
            <PatientsSidebar patient={highlightedPatient} />
            <SideClickListener onClick={deselectPatient} />
          </Grid>
        )}
        {isCreatingPatient && (
          <Grid md={12} lg={6} item container direction="column">
            <PatientsCreation />
            <SideClickListener onClick={deselectPatient} />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default PatientsLayout;
