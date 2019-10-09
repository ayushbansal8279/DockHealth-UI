import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Fade from '@material-ui/core/Fade';
import ProgressIcon from '@material-ui/core/CircularProgress/CircularProgress';
import {
  getAllPatients, getMyPatientsAll, getMyPatientsActive, loading,
} from '../../actions/patient-actions';
import PatientsHeader from './PatientsHeader';
import PatientsToolbar from './PatientsToolbar';
import PatientsList from './PatientsList';
import PatientsSidebar from './PatientsSidebar';
import PatientsCreation from './PatientCreation';

const FadeContainer = styled.div`
  display: flex;
  flex: 1;
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

const searchPatients = (patients, searchTerm) => {
  const searchTerms = searchTerm.toLowerCase().match(/[\S]+/g) || [];
  const compareField = (field, term) => field && field.toLowerCase().includes(term);
  const termMatchesPatient = ({ mrn, lastName, firstName }) => term => compareField(mrn, term)
      || compareField(lastName, term)
      || compareField(firstName, term);
  const isMatch = patient => searchTerms.every(termMatchesPatient(patient));
  return patients.filter(isMatch);
};

const PatientsBody = styled.div`
  display: flex;
`;

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
    if (highlightedPatientId === null) { return null; }
    return patientState.allPatients.find(({ patientId }) => patientId === +highlightedPatientId);
  });
  const isCreatingPatient = useSelector(({ patientState }) => patientState.isCreatingPatient);

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = useCallback((e) => {
    const { value } = e.target;
    setSearchTerm(value);
  }, [setSearchTerm]);
  const handlePatientFilter = useCallback((selectedFilter) => {
    // console.log(`selected filter: ${selectedFilter}`);
    if (selectedFilter === 'MY_PATIENTS') {
      getMyPatientsAll()(dispatch);
    } else if (selectedFilter === 'MY_PATIENTS_WITH_ACTIVE_TASKS') {
      getMyPatientsActive()(dispatch);
    } else {
      getAllPatients()(dispatch);
    }
  }, [dispatch]);

  const filteredPatients = searchPatients(patients, searchTerm);

  return (
    <div>
      <PatientsHeader patientCount={patients.length} isFetching={isFetching} />
      <PatientsToolbar handleSearch={handleSearch} handlePatientFilter={handlePatientFilter} />
      <PatientsBody>
        {isFetching
          ? <PatientsListSpinner isFetching={isFetching} />
          : (
            <div style={{ display: 'flex', flex: 1 }}>
              <PatientsList
                patients={filteredPatients}
                isFiltered={searchTerm !== ''}
                isCompact={highlightedPatient !== null || isCreatingPatient}
                highlightedPatient={highlightedPatient}
              />
            </div>
          )}
        {highlightedPatient && <PatientsSidebar patient={highlightedPatient} />}
        {isCreatingPatient && <PatientsCreation />}
      </PatientsBody>
    </div>
  );
};

const Patients = () => (
  <PatientsLayout />
);

export default Patients;
