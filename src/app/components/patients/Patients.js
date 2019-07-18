import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Fade from '@material-ui/core/Fade';
import ProgressIcon from '@material-ui/core/CircularProgress/CircularProgress';
import { getAllPatients, loading } from '../../actions/patient-actions';
import PatientsHeader from './PatientsHeader';
import PatientsToolbar from './PatientsToolbar';
import PatientsList from './PatientsList';

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

const PatientsLayout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    loading()(dispatch);
    getAllPatients()(dispatch);
  }, [dispatch]);

  const isFetching = useSelector(state => state.patientState.isFetching);
  const patients = useSelector(state => state.patientState.allPatients);

  return (
    <>
      <PatientsHeader patientCount={patients.length} isFetching={isFetching} />
      <PatientsToolbar />
      {isFetching
        ? <PatientsListSpinner isFetching={isFetching} />
        : <PatientsList patients={patients} />}
    </>
  );
};

const Patients = () => (
  <div className="off-canvas-content" data-off-canvas-content>
    <div className="row expanded collapse" style={{ minHeight: '100%' }}>
      <div className="large-12 columns" style={{ background: '#f5f8fa' }}>
        <PatientsLayout />
      </div>
    </div>
  </div>
);

export default Patients;
