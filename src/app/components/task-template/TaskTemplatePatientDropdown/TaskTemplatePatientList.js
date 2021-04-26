import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { changePatientForTemplateBundle } from 'actions/template-bundle-actions';
import { openModal } from 'modal/actions';
import MagnifierIcon from 'img/magnifier';
import { getPatientsByCriteria } from 'api/patient-api';
import {
  Input,
  InputBox,
  ListContainer,
  Row,
  PatientName,
  StyledGrid,
  LoaderItem,
  LoaderContainer,
  NoPatientFound,
  UnassignRow,
} from './styled';

const UNASSIGNED_KEY = 'UNASSIGNED';

const TaskTemplatePatientList = ({
  taskGroupIdentifier,
  templateBundleIdentifier,
  selectedPatientIdentifier,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  const inputReference = useRef(null);

  useEffect(() => {
    if (inputReference) {
      // eslint-disable-next-line no-unused-expressions
      inputReference?.current?.focus();
    }
  }, [inputReference]);

  const dispatch = useDispatch();

  const displayUnassignedOption =
    'unassigned'.includes(searchValue.toLowerCase()) &&
    selectedPatientIdentifier;

  const fetchPatients = useCallback(
    value =>
      getPatientsByCriteria(value).then(fetchedPatients => {
        setPatients(fetchedPatients);
        return fetchedPatients;
      }),
    [],
  );

  const fetchPatientsWithDebounce = useCallback(
    debounce(value => {
      fetchPatients(value).then(() => {
        setIsLoadingPatients(false);
      });
    }, 300),
    [],
  );

  const onPatientInputChange = useCallback(
    event => {
      const value = event?.target?.value;
      if (value !== '') {
        setIsLoadingPatients(true);
        fetchPatientsWithDebounce(value);
        setSearchValue(value);
      } else {
        fetchPatientsWithDebounce.cancel();
        setIsLoadingPatients(false);
        setPatients([]);
      }
    },
    [fetchPatientsWithDebounce],
  );

  return (
    <>
      <InputBox>
        <img src={MagnifierIcon} alt="magnifier" />
        <Input
          ref={inputReference}
          placeholder="Search patient"
          onChange={onPatientInputChange}
        />
      </InputBox>
      {isLoadingPatients && (
        <LoaderContainer>
          <LoaderItem />
          <LoaderItem />
          <LoaderItem />
        </LoaderContainer>
      )}
      {!isLoadingPatients && patients.length === 0 && searchValue !== '' && (
        <NoPatientFound>No patient found</NoPatientFound>
      )}
      {!isLoadingPatients && (
        <ListContainer>
          {displayUnassignedOption && (
            <UnassignRow withBorder={patients.length !== 0}>
              <Row
                type="button"
                isSelected={!selectedPatientIdentifier}
                onClick={() =>
                  dispatch(
                    openModal('UnassignPatient', {
                      confirm: () =>
                        dispatch(
                          changePatientForTemplateBundle(
                            templateBundleIdentifier,
                            taskGroupIdentifier,
                            UNASSIGNED_KEY,
                          ),
                        ),
                    }),
                  )
                }
              >
                Unassign
              </Row>
            </UnassignRow>
          )}
          {!isLoadingPatients &&
            patients.length !== 0 &&
            patients?.map(patient => (
              <Row
                type="button"
                isSelected={
                  selectedPatientIdentifier === patient?.patientIdentifier
                }
                onClick={() =>
                  selectedPatientIdentifier
                    ? dispatch(
                        openModal('AssignPatient', {
                          confirm: () =>
                            dispatch(
                              changePatientForTemplateBundle(
                                templateBundleIdentifier,
                                taskGroupIdentifier,
                                patient?.patientIdentifier,
                              ),
                            ),
                          patientName: patient?.lastName
                            ? `${patient?.lastName}, ${patient?.firstName}`
                            : patient?.firstName,
                        }),
                      )
                    : dispatch(
                        changePatientForTemplateBundle(
                          templateBundleIdentifier,
                          taskGroupIdentifier,
                          patient?.patientIdentifier,
                        ),
                      )
                }
              >
                <Grid container>
                  <PatientName item xs={6}>
                    {patient?.lastName
                      ? `${patient?.lastName}, ${patient?.firstName}`
                      : patient?.firstName}
                  </PatientName>
                  <StyledGrid item xs={3}>
                    {patient?.mrn}
                  </StyledGrid>
                  <Grid item xs={3}>
                    {patient?.age}
                  </Grid>
                </Grid>
              </Row>
            ))}
        </ListContainer>
      )}
    </>
  );
};

export default TaskTemplatePatientList;
