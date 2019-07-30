import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Fade from '@material-ui/core/Fade';
import ProgressIcon from '@material-ui/core/CircularProgress/CircularProgress';
import { getAllPatients, loading } from '../../actions/patient-actions';
import PatientsHeader from './PatientsHeader';
import PatientsToolbar from './PatientsToolbar';
import PatientsList from './PatientsList';
import PatientsSidebar from './PatientsSidebar';

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
    getAllPatients()(dispatch);
  }, [dispatch]);

  const isFetching = useSelector(({ patientState }) => patientState.isFetching);
  const patients = useSelector(({ patientState }) => patientState.allPatients);
  const highlightedPatient = useSelector(({ patientState }) => {
    const { highlightedPatientId } = patientState;
    if (highlightedPatientId === null) { return null; }
    return patientState.allPatients.find(({ patientId }) => patientId === +highlightedPatientId);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = useCallback((e) => {
    const { value } = e.target;
    setSearchTerm(value);
  }, [setSearchTerm]);

  const filteredPatients = searchPatients(patients, searchTerm);

  return (
    <>
      <PatientsHeader patientCount={patients.length} isFetching={isFetching} />
      <PatientsToolbar handleSearch={handleSearch} />
      <PatientsBody>
        {isFetching
          ? <PatientsListSpinner isFetching={isFetching} />
          : (
            <PatientsList
              patients={filteredPatients}
              isFiltered={searchTerm !== ''}
              isCompact={highlightedPatient !== null}
              highlightedPatient={highlightedPatient}
            />
          )}
        {highlightedPatient && <PatientsSidebar patient={highlightedPatient} />}
      </PatientsBody>
    </>
  );
};

const Patients = () => (
  <div className="off-canvas-content" data-off-canvas-content>
    <div className="row expanded collapse" style={{ minHeight: '100%' }}>
      <div className="columns" style={{ background: '#f5f8fa' }}>
        <PatientsLayout />
      </div>
    </div>
  </div>
);

export default Patients;
