/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  createContext,
} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import {
  getPatientListIdentifierByUrlParameter,
  DefaultPatientsListType,
} from 'helpers/patient-list-helpers';
import { useBoolean } from 'hooks/useBoolean';
import {
  selectedPatientsSelector,
  patientsListDetailsSelector,
  patientsSelector,
  isFetchingPatientsSelector,
  patientsListSearchTermSelector,
} from 'selectors/patients-selectors';
import * as PatientsActions from 'actions/patients-actions';
import * as PatientApi from 'api/patient-api';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import BulkEditSection from 'components/patients/BulkEditSection/BulkEditSection';
import { applyTaskTemplate } from 'actions/list-details-actions';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import PatientsList from './PatientsList/PatientsList';
import PatientsToolbar from './PatientsToolbar/PatientsToolbar';
import EmptyListViewWithQuickAddTask from './BulkEditSection/BulkEditOptionsBar/BulkEditCreateTask';
import {
  PatientsViewContainer,
  PatientsListContainer,
  RefineSearchText,
  BulkEditSectionContainer,
  TaskTemplateApplicatorContainer,
} from './styled';

export const PatientEditContext = createContext({});

const MAX_PATIENT_ALL_RESULTS = 1000;

const PatientsView = () => {
  const dispatch = useDispatch();
  const { listIdentifier: listIdentifierParameter } = useParams();

  const allPatients = useSelector(selectedPatientsSelector);

  const listIdentifier = getPatientListIdentifierByUrlParameter(
    listIdentifierParameter,
  );
  const searchValue = useSelector(patientsListSearchTermSelector);
  const listDetails = useSelector(patientsListDetailsSelector);
  const isFetchingPatients = useSelector(isFetchingPatientsSelector);
  const patients = useSelector(patientsSelector);
  const { listName, listDescription } = listDetails || {};

  const [createTaskOption, setCreateTaskOption] = useState(false);
  const [createWorkflowOption, setCreateWorkflowOption] = useState(false);
  const [addLabelOption, setAddLabelOption] = useState(false);
  const [deleteOption, setDeleteOption] = useState(false);

  const [patientImportDetails, setPatientImportDetails] = useState(null);
  const [importPopoverOpen, setImportPopoverOpen] = useState(false);
  const [
    hasImportErrors,
    setHasImportErrors,
    unsetHasImportErrors,
  ] = useBoolean(false);

  useEffect(() => {
    dispatch(PatientsActions.initializePatientsListState(listIdentifier));
  }, [dispatch, listIdentifier]);

  const refreshPatients = useCallback(() => {
    dispatch(PatientsActions.getCurrentPatients());
  }, [dispatch]);

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

  const selectedPatients = useMemo(() => {
    return allPatients?.filter(
      patient => patient?.isSelected === true && patient,
    );
  }, [allPatients]);

  const bulkEditIsActive = useMemo(() => {
    return selectedPatients?.length > 0;
  }, [selectedPatients]);

  const turnOffAllOptions = useCallback(() => {
    setCreateTaskOption(false);
    setCreateWorkflowOption(false);
    setAddLabelOption(false);
    setDeleteOption(false);
  }, []);

  const toggleCreateTaskOption = useCallback(() => {
    turnOffAllOptions();
    setCreateTaskOption(previous => !previous);
  }, [turnOffAllOptions]);
  const toggleCreateWorkflowOption = useCallback(() => {
    turnOffAllOptions();
    setCreateWorkflowOption(previous => !previous);
  }, [turnOffAllOptions]);
  const toggleAddLabelOption = useCallback(() => {
    turnOffAllOptions();
    setAddLabelOption(previous => !previous);
  }, [turnOffAllOptions]);
  const toggleDeleteOption = useCallback(() => {
    turnOffAllOptions();
    setDeleteOption(previous => !previous);
  }, [turnOffAllOptions]);

  const providerValue = useMemo(
    () => ({
      bulkEditIsActive,
      selectedPatients,
      selectedOptions: {
        createTaskOption,
        createWorkflowOption,
        addLabelOption,
        deleteOption,
      },
      selectedOptionsHandler: {
        toggleCreateTaskOption,
        toggleCreateWorkflowOption,
        toggleAddLabelOption,
        toggleDeleteOption,
        turnOffAllOptions,
      },
    }),
    [
      addLabelOption,
      bulkEditIsActive,
      createTaskOption,
      createWorkflowOption,
      deleteOption,
      selectedPatients,
      toggleAddLabelOption,
      toggleCreateTaskOption,
      toggleCreateWorkflowOption,
      toggleDeleteOption,
      turnOffAllOptions,
    ],
  );

  // const applyTemplate = useCallback(
  //   ({ taskTemplateIdentifier, taskGroupIdentifier }) =>
  //     dispatch(
  //       applyTaskTemplate({
  //         taskTemplateIdentifier,
  //         taskListIdentifier,
  //         taskGroupIdentifier,
  //       }),
  //     ),
  //   [dispatch, taskListIdentifier],
  // );

  // const handleTemplateSelect = useCallback(
  //   template => {
  //     applyTemplate({
  //       taskTemplateIdentifier: template?.identifier,
  //       taskGroupIdentifier,
  //     });
  //   },
  //   [applyTemplate, taskGroupIdentifier],
  // );

  const handleTemplateSelect = useCallback(() => {
    console.log('handleTemplateSelect');
  }, []);

  return (
    <>
      <PatientEditContext.Provider value={providerValue}>
        <ViewLayout
          header={
            <BasicLayoutHeader title={listName} description={listDescription} />
          }
        >
          <PatientsViewContainer>
            <PatientsToolbar
              refreshPatientList={refreshPatientList}
              setImportPopoverOpen={setImportPopoverOpen}
            />
            <PatientsListContainer>
              <Grid container>
                {listIdentifier === DefaultPatientsListType.ALL_PATIENTS &&
                  patients?.length >= MAX_PATIENT_ALL_RESULTS && (
                    <RefineSearchText>
                      Please further refine search, too many results!
                    </RefineSearchText>
                  )}
                <PatientsList
                  isFiltered={searchValue}
                  patients={patients}
                  patientImportDetails={patientImportDetails}
                  importPopoverOpen={importPopoverOpen}
                  setImportPopoverOpen={setImportPopoverOpen}
                  hasImportErrors={hasImportErrors}
                  isFetching={isFetchingPatients && !patients}
                />
              </Grid>
            </PatientsListContainer>
          </PatientsViewContainer>
        </ViewLayout>
        <BulkEditSection>
          <BulkEditSectionContainer>
            {createTaskOption && <EmptyListViewWithQuickAddTask />}
            {createWorkflowOption && (
              <TaskTemplateApplicatorContainer>
                <TaskTemplateApplicator
                  onTemplateSelect={handleTemplateSelect}
                />
              </TaskTemplateApplicatorContainer>
            )}
          </BulkEditSectionContainer>
        </BulkEditSection>
      </PatientEditContext.Provider>
    </>
  );
};

export default PatientsView;
