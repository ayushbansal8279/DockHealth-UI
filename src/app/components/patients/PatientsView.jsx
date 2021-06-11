/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { Grid } from '@material-ui/core';
import { getPatientsByCriteria } from 'api/patient-api';
import { isEmpty } from 'ramda';
import { showGlobalErrorAlert } from 'alert/actions';
import { setHeader } from 'actions/template-actions';
import { organizationSelector } from 'selectors/organization-selectors';
import SearchInput from 'components/common/SearchInput/SearchInput';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import { getPatientsList } from 'api/patients-api';
import PatientsList from './PatientsList/PatientsList';
import {
  PatientsViewContainer,
  PatientsListDescription,
  InputWrapper,
  SearchHelperText,
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

const PatientsView = () => {
  const dispatch = useDispatch();
  const { listIdentifier: listIdentifierParameter } = useParams();

  const { listIdentifier } = parsePatientsListIdentifier(
    listIdentifierParameter,
  );
  const { emrIntegrationEnabled } = useSelector(organizationSelector) || {};

  const [patientsListDetails, setPatientsListDetails] = useState({});
  const [patients, setPatients] = useState(null);
  const [isFetchingPatients, setIsFetchingPatients] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
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
        dispatch(showGlobalErrorAlert());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listIdentifier]);

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
    getPatientsByCriteria(searchTerm)
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

  useEffect(() => {
    if (!searchValue && emrIntegrationEnabled) {
      searchPatientsBySearchTermWithDebounce.cancel();
      setPatients(null);
    } else {
      searchPatientsBySearchTermWithDebounce(searchValue);
    }
  }, [
    searchPatientsBySearchTermWithDebounce,
    searchValue,
    emrIntegrationEnabled,
  ]);

  return (
    <PatientsViewContainer>
      {patientsListDetails?.patientListIdentifier === 'ALL_PATIENTS' &&
        emrIntegrationEnabled && (
          <Grid container xs={12} justify="center">
            <Grid item xs={8}>
              <InputWrapper hasValue={searchValue}>
                <SearchInput
                  value={searchValue}
                  onValueChange={setSearchValue}
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
      <Grid container sm={12} item direction="column">
        <PatientsList
          patients={patients}
          isFiltered={searchValue !== ''}
          // isCompact={isSidebarOpen}
          // patientImportDetails={patientImportDetails}
          // refreshPatientList={refreshPatientList}
          // importPopoverOpen={importPopoverOpen}
          // setImportPopoverOpen={setImportPopoverOpen}
          // hasImportErrors={hasImportErrors}
          // isGuest={isGuest}
          isFetching={isFetchingPatients}
          // onAddPatientClick={setIsSidebarOpen}
          // emrIntegrationEnabled={emrIntegrationEnabled}
        />
        {/* <SideClickListener /> */}
      </Grid>
    </PatientsViewContainer>
  );
};

export default PatientsView;
