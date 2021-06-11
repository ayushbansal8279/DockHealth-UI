/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { Grid } from '@material-ui/core';
import { isEmpty } from 'ramda';

import useBoolean from 'hooks/useBoolean';
import { showGlobalErrorAlert } from 'alert/actions';
import * as PatientApi from 'api/patient-api';
import { setHeader } from 'actions/template-actions';
import { organizationSelector } from 'selectors/organization-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import SearchInput from 'components/common/SearchInput/SearchInput';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import { getPatientsList } from 'api/patients-api';
import PatientsList from './PatientsList/PatientsList';
import PatientsToolbar from './PatientsToolbar/PatientsToolbar';
import PatientSidebar from './PatientSidebar/PatientSidebar';
import {
  PatientsViewContainer,
  PatientsListDescription,
  InputWrapper,
  SearchHelperText,
  PatientsListContainer,
  SidebarInnerContainer,
} from './styled';

const parsePatientsListIdentifier = listIdentifier => {
  if (!listIdentifier)
    return {
      listIdentifier: 'ALL_PATIENTS',
      listType: 'DEFAULT',
    };

  if (listIdentifier === 'active')
    return {
      listIdentifier: 'ACTIVE_PATIENTS',
      listType: 'DEFAULT',
    };

  return {
    listIdentifier,
    listType: 'CUSTOM',
  };
};

const handleAfterPatientCreation = ({ patientIdentifier }, history) => {
  history.push(`/core/patient/${patientIdentifier}`);
};

const PatientsView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { listIdentifier: listIdentifierParameter } = useParams();

  const { listIdentifier } = parsePatientsListIdentifier(
    listIdentifierParameter,
  );
  const { emrIntegrationEnabled } = useSelector(organizationSelector) || {};
  const { orgUserRole } = useSelector(userProfileSelector);
  const isGuest = orgUserRole === 'GUEST';

  const patientsListContainerReference = useRef(null);
  const [patientsListDetails, setPatientsListDetails] = useState({});
  const [patients, setPatients] = useState(null);
  const [isFetchingPatients, setIsFetchingPatients] = useState(true);
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

  const fetchPatients = useCallback(() => {
    setIsFetchingPatients(true);
    getPatientsList(listIdentifier)
      .then(data => {
        const fetchedData = { ...data };
        setPatients(fetchedData.patients);
        setIsFetchingPatients(false);
        delete fetchedData.patients;
        setPatientsListDetails(fetchedData);
      })
      .catch(() => {
        setIsFetchingPatients(false);
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, listIdentifier]);

  useEffect(() => {
    setSearchValue('');
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (!isEmpty(patientsListDetails)) {
      dispatch(
        setHeader({
          layout: [
            {
              key: 'patients-view-header',
              component: (
                <>
                  <GenericHeader>
                    {patientsListDetails?.listName}
                    <PatientsListDescription>
                      {patientsListDetails?.listDescription}
                    </PatientsListDescription>
                  </GenericHeader>
                </>
              ),
            },
          ],
        }),
      );
    }
  }, [dispatch, patientsListDetails]);

  const fetchPatientsBySearchTerm = useCallback(searchTerm => {
    PatientApi.getPatientsByCriteria(searchTerm)
      .then(fetchedPatients => {
        setPatients(fetchedPatients);
        setIsFetchingPatients(false);
      })
      .catch(() => {
        setIsFetchingPatients(false);
      });
  }, []);

  const searchPatientsBySearchTermWithDebounce = useCallback(
    debounce(value => {
      setIsFetchingPatients(true);
      fetchPatientsBySearchTerm(value);
    }, 300),
    [],
  );

  const refreshPatients = useCallback(() => {
    if (searchValue) {
      fetchPatientsBySearchTerm(searchValue);
    } else {
      fetchPatients();
    }
  }, [searchValue, fetchPatients, fetchPatientsBySearchTerm]);

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

  const handleSearchChange = useCallback(
    searchTerm => {
      setSearchValue(searchTerm);
      if (!searchTerm && emrIntegrationEnabled) {
        searchPatientsBySearchTermWithDebounce.cancel();
        setPatients(null);
      } else {
        searchPatientsBySearchTermWithDebounce(searchTerm);
      }
    },
    [emrIntegrationEnabled, searchPatientsBySearchTermWithDebounce],
  );

  return (
    <PatientsViewContainer>
      <PatientsToolbar
        hasPatients
        refreshPatientList={refreshPatientList}
        patientImportDetails={patientImportDetails}
        setImportPopoverOpen={setImportPopoverOpen}
        isGuest={isGuest}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onAddPatientClick={setIsSidebarOpen}
        hideButtons={
          emrIntegrationEnabled || patientsListDetails?.listType !== 'DEFAULT'
        }
      />
      {patientsListDetails?.patientListIdentifier === 'ALL_PATIENTS' &&
        emrIntegrationEnabled && (
          <Grid container xs={12} justify="center">
            <Grid item xs={8}>
              <InputWrapper hasValue={searchValue}>
                <SearchInput
                  value={searchValue}
                  onValueChange={handleSearchChange}
                />
                {!searchValue && (
                  <SearchHelperText>
                    Dock is connected to your EHR. Please search by name or
                    medical record number to find a patient.
                  </SearchHelperText>
                )}
              </InputWrapper>
            </Grid>
          </Grid>
        )}
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
          </Grid>
          {isSidebarOpen && (
            <Grid sm={6} item container direction="column">
              <SidebarInnerContainer
                height={patientsListContainerReference.current?.clientHeight}
              >
                <PatientSidebar
                  onPatientCreated={patient =>
                    handleAfterPatientCreation(patient, history)
                  }
                  onClose={unsetIsSidebarOpen}
                />
              </SidebarInnerContainer>
            </Grid>
          )}
        </Grid>
      </PatientsListContainer>
    </PatientsViewContainer>
  );
};

export default PatientsView;
