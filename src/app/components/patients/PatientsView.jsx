import { Fade, Grid } from '@material-ui/core';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader } from 'actions/header-actions';
import {
  getAllPatients,
  getMyPatientsActive,
  getMyPatientsAll,
  highlightPatient,
  getLatestPatientImportDetails,
} from 'actions/patient-actions';
import Loader from '../common/Loader/Loader';
import GenericHeader from '../common/GenericHeader';
import PatientsList from './PatientsList';
import PatientsSidebar from './PatientsSidebar';
import PatientsToolbar from './PatientsToolbar';
import {
  FadeContainer,
  PatientsListContainer,
  PatientsViewContainer,
  SidebarInnerContainer,
  SideClickListener,
} from './PatientsView.Styled';

const PatientsListSpinner = ({ isFetching }) => (
  <FadeContainer>
    <Fade
      in={isFetching}
      unmountOnExit
      style={{ transitionDelay: isFetching ? '800ms' : '0ms' }}
    >
      <Loader />
    </Fade>
  </FadeContainer>
);

const compareField = (field, term) => field?.toLowerCase().includes(term);

const termMatchesPatient = ({ mrn, lastName, firstName }) => term =>
  compareField(mrn, term) ||
  compareField(lastName, term) ||
  compareField(firstName, term);

const searchPatients = (patients, searchTerm) => {
  const searchTerms = searchTerm.toLowerCase().match(/\S+/g) || [];
  const isMatch = patient => searchTerms.every(termMatchesPatient(patient));
  return patients.filter(isMatch);
};

/* eslint-disable sonarjs/cognitive-complexity */
const PatientsView = () => {
  const dispatch = useDispatch();

  const patientsListContainerReference = useRef(null);

  const isFetching = useSelector(({ patientState }) => patientState.isFetching);
  const patients = useSelector(({ patientState }) => patientState.allPatients);
  const highlightedPatient = useSelector(({ patientState }) => {
    const { highlightedPatientIdentifier } = patientState;
    if (highlightedPatientIdentifier === null) {
      return null;
    }
    return patientState.allPatients.find(
      ({ patientIdentifier }) =>
        patientIdentifier === highlightedPatientIdentifier,
    );
  });
  const patientImportDetails = useSelector(
    ({ patientState }) => patientState.patientImportDetails,
  );

  const isCreatingPatient = useSelector(
    ({ patientState }) => patientState.isCreatingPatient,
  );

  const patientCount = patients?.length ?? 0;

  const orgUserRole = useSelector(
    store => store.userState.userProfile?.orgUserRole,
  );

  const isGuest = orgUserRole === 'GUEST';

  useEffect(() => {
    setHeader(dispatch)({
      layout: [
        {
          key: 'patients-header',
          component: <GenericHeader>Patients</GenericHeader>,
        },
      ],
    });
  }, [patientCount, isFetching, dispatch]);

  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback(
    event => {
      const { value } = event.target;
      setSearchTerm(value);
      deselectPatient();
    },
    [deselectPatient, setSearchTerm],
  );

  const refreshPatientList = useCallback(
    async counter => {
      const importDetails = await getLatestPatientImportDetails()(dispatch);
      let refreshCounter = 1;
      if (counter) {
        refreshCounter = counter;
      }
      if (
        importDetails &&
        importDetails.createdDateTime &&
        refreshCounter < 10 &&
        importDetails.completePercentage < 100
      ) {
        setTimeout(() => {
          refreshCounter += 1;
          refreshPatientList(refreshCounter);
        }, 1000);
      }
    },
    [dispatch],
  );

  const handlePatientFilter = useCallback(
    selectedFilter => {
      if (selectedFilter === 'MY_PATIENTS') {
        getMyPatientsAll()(dispatch);
      } else if (selectedFilter === 'MY_PATIENTS_WITH_ACTIVE_TASKS') {
        getMyPatientsActive()(dispatch);
      } else {
        getAllPatients()(dispatch);
        getLatestPatientImportDetails()(dispatch);
        setTimeout(() => {
          refreshPatientList(1);
        }, 1000);
      }
    },
    [dispatch, refreshPatientList],
  );

  const filteredPatients = searchPatients(patients, searchTerm);

  const isCompact = highlightedPatient || isCreatingPatient;

  return (
    <PatientsViewContainer>
      <PatientsToolbar
        handleSearch={handleSearch}
        handlePatientFilter={handlePatientFilter}
        deselectPatient={deselectPatient}
        hasPatients={!(patients.length === 0 && searchTerm === '')}
        patientImportDetails={patientImportDetails}
        refreshPatientList={refreshPatientList}
        isGuest={isGuest}
      />
      <PatientsListContainer ref={patientsListContainerReference}>
        <Grid container>
          {isFetching ? (
            <PatientsListSpinner isFetching={isFetching} />
          ) : (
            <Grid container sm={isCompact ? 6 : 12} item direction="column">
              <PatientsList
                patients={filteredPatients}
                isFiltered={searchTerm !== ''}
                isCompact={isCompact}
                highlightedPatient={highlightedPatient}
                patientImportDetails={patientImportDetails}
                refreshPatientList={refreshPatientList}
                isGuest={isGuest}
              />
              <SideClickListener onClick={deselectPatient} />
            </Grid>
          )}
          {(highlightedPatient || isCreatingPatient) && (
            <Grid sm={6} item container direction="column">
              <SidebarInnerContainer
                height={patientsListContainerReference.current?.clientHeight}
              >
                <PatientsSidebar
                  patient={isCreatingPatient ? null : highlightedPatient}
                />
                <SideClickListener onClick={deselectPatient} />
              </SidebarInnerContainer>
            </Grid>
          )}
        </Grid>
      </PatientsListContainer>
    </PatientsViewContainer>
  );
};

export default PatientsView;
