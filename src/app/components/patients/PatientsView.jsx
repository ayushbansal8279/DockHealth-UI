/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useBoolean from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import * as PatientApi from 'api/patient-api';
import PatientsList from './PatientsList/PatientsList';
import PatientsToolbar from './PatientsToolbar/PatientsToolbar';
import {
  PatientsListContainer,
  PatientsViewContainer,
  SidebarInnerContainer,
  SideClickListener,
} from './styled';
import PatientSidebar from './PatientSidebar/PatientSidebar';

const PatientsView = () => {
  const patientsListContainerReference = useRef(null);

  const [patients, setPatients] = useState([]);
  const [isFetchingPatients, setIsFetchingPatients] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [patientImportDetails, setPatientImportDetails] = useState(null);
  const [importPopoverOpen, setImportPopoverOpen] = useState(false);
  const [
    hasImportErrors,
    setHasImportErrors,
    unsetHasImportErrors,
  ] = useBoolean(false);
  const [isSidebarOpen, setIsSidebarOpen, unsetIsSidebarOpen] = useBoolean(
    false,
  );

  const { orgUserRole } = useSelector(userProfileSelector);
  const isGuest = orgUserRole === 'GUEST';
  const { emrIntegrationEnabled } = useSelector(organizationSelector) || {};

  const fetchMyPatientsList = useCallback(() => {
    PatientApi.getMyPatientsAll()
      .then(patientsResponse => {
        setPatients(patientsResponse);
        setIsFetchingPatients(false);
      })
      .catch(() => {
        setIsFetchingPatients(false);
      });
  }, []);

  const fetchPatientsBySearchTerm = useCallback(searchTerm => {
    PatientApi.getPatientsByName(searchTerm)
      .then(fetchedPatients => {
        setPatients(fetchedPatients);
        setIsFetchingPatients(false);
      })
      .catch(() => {
        setIsFetchingPatients(false);
      });
  }, []);

  const refreshPatients = useCallback(() => {
    if (searchValue) {
      fetchPatientsBySearchTerm(searchValue);
    } else {
      fetchMyPatientsList();
    }
  }, [searchValue, fetchMyPatientsList, fetchPatientsBySearchTerm]);

  useEffect(() => {
    setIsFetchingPatients(true);
    refreshPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPatientList = useCallback(
    async counter => {
      const importDetails = await PatientApi.getLatestPatientImportDetails();
      setPatientImportDetails(importDetails);
      let refreshCounter = 1;
      if (counter) {
        refreshCounter = counter;
        unsetHasImportErrors();
        refreshPatients();
      }
      if (
        importDetails &&
        importDetails.createdDateTime &&
        refreshCounter < 15 &&
        importDetails.completePercentage < 100
      ) {
        setTimeout(() => {
          refreshCounter += 1;
          refreshPatientList(refreshCounter);
        }, 1000);
      } else if (
        refreshCounter === 15 &&
        importDetails.completePercentage === 0
      ) {
        setHasImportErrors();
      }
    },
    [refreshPatients, setHasImportErrors, unsetHasImportErrors],
  );

  const searchPatientsBySearchTermWithDebounce = useCallback(
    debounce(value => {
      fetchPatientsBySearchTerm(value);
    }, 300),
    [],
  );

  const handleSearchChange = newSearchValue => {
    setSearchValue(newSearchValue);

    if (newSearchValue) {
      searchPatientsBySearchTermWithDebounce(newSearchValue);
    } else {
      searchPatientsBySearchTermWithDebounce.cancel();
      setIsFetchingPatients(true);
      fetchMyPatientsList();
    }
  };

  return (
    <PatientsViewContainer>
      <PatientsToolbar
        hasPatients
        refreshPatientList={refreshPatientList}
        patientImportDetails={patientImportDetails}
        setImportPopoverOpen={setImportPopoverOpen}
        isGuest={isGuest}
        emrIntegrationEnabled={emrIntegrationEnabled}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onAddPatientClick={setIsSidebarOpen}
        hideButtons={emrIntegrationEnabled}
      />

      <PatientsListContainer ref={patientsListContainerReference}>
        <Grid container>
          <Grid container sm={isSidebarOpen ? 6 : 12} item direction="column">
            <PatientsList
              patients={patients}
              isFiltered={searchValue !== ''}
              isCompact={isSidebarOpen}
              patientImportDetails={patientImportDetails}
              refreshPatientList={refreshPatientList}
              importPopoverOpen={importPopoverOpen}
              setImportPopoverOpen={setImportPopoverOpen}
              hasImportErrors={hasImportErrors}
              isGuest={isGuest}
              isFetching={isFetchingPatients}
              onAddPatientClick={setIsSidebarOpen}
              emrIntegrationEnabled={emrIntegrationEnabled}
            />
            <SideClickListener />
          </Grid>
          {isSidebarOpen && (
            <Grid sm={6} item container direction="column">
              <SidebarInnerContainer
                height={patientsListContainerReference.current?.clientHeight}
              >
                <PatientSidebar
                  onPatientCreated={refreshPatients}
                  onClose={unsetIsSidebarOpen}
                />
                <SideClickListener onClick={unsetIsSidebarOpen} />
              </SidebarInnerContainer>
            </Grid>
          )}
        </Grid>
      </PatientsListContainer>
    </PatientsViewContainer>
  );
};

export default PatientsView;
