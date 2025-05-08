import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams , useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Dialog } from '@mui/material';
import {
  getPatientListIdentifierByUrlParameter,
  getPatientsListFiltersStorageKey,
  DefaultPatientsListType,
  PatientsListType,
} from 'helpers/patient-list-helpers';
import { useBoolean } from 'hooks/useBoolean';
import {
  patientsListDetailsSelector,
  patientsSelector,
  isFetchingPatientsSelector,
  patientsListSearchPerformedSelector,
  selectedDynamicPatientListFilterSelector,
} from 'selectors/patients-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { isUserGuestOrDockLite, isUserViewOnly } from 'helpers/user-helper';
import { organizationSelector } from 'selectors/organization-selectors';
import { PatientEditContext } from 'context-api/patient-edit-context';
import * as PatientsActions from 'actions/patients-actions';
import * as PatientApi from 'api/patient-api';
import Spacing from 'components/common/Spacing';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import PatientLabels from 'views/patient-details/PatientLabels/PatientLabels';
import BulkEditSection from 'components/patients/BulkEditSection/BulkEditSection';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import { getTaskListForUser } from 'api/task-list-api';
import { openModal, closeModal } from 'modal/actions';
import { PatientListColumnsConfigProvider } from 'context-api/patients-columns-config-context';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  downloadPatientImportTemplate,
  downloadPatientListData,
  getAllPatientAttachments,
} from 'api/patient-api';
import { PatientBulkActions } from 'api/patients-api';
import initializeAttachmentsSectionHooks from 'views/patient-details/PatientAttachments/hooks';
import AddButton, {
  AddEntitiesContainer,
} from 'components/common/AddButton/AddButton';
import {
  getQuickFilters,
  quickContextTypes,
} from 'actions/mega-filter-actions';
import { quickFiltersSelector } from 'selectors/mega-filter-selectors';
import PatientsList from './PatientsList/PatientsList';
import PatientsToolbar from './PatientsToolbar/PatientsToolbar';
import BulkEditCreateTask from './BulkEditSection/BulkEditOptionsBar/BulkEditCreateTask';
import {
  PatientsViewContainer,
  PatientsListContainer,
  RefineSearchText,
  BulkEditSectionContainer,
  TaskTemplateApplicatorContainer,
  ContentWrapper,
} from './styled';
import localStorageHelper from '@/app/helpers/local-storage-helper';
import sessionStorageHelper from '@/app/helpers/session-storage-helper';
import ImportDataModal from '@/app/modal/components/ImportDataModal/ImportDataModal';
import { uploadPatientData } from '@/app/api/patient-api';

const MAX_PATIENT_ALL_RESULTS = 1000;

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientsView = () => {
  const dispatch = useDispatch();
  const { listIdentifier: listIdentifierParameter } = useParams();

  const listIdentifier = getPatientListIdentifierByUrlParameter(
    listIdentifierParameter,
  );
  const [searchValue, setSearchValue] = useState(null);
  const searchPerformed = useSelector(patientsListSearchPerformedSelector);
  const listDetails = useSelector(patientsListDetailsSelector);
  const isFetchingPatients = useSelector(isFetchingPatientsSelector);
  const patients = useSelector(patientsSelector);
  const { listName, listDescription } = listDetails || {};

  const [createTaskOption, setCreateTaskOption] = useState(false);
  const [createWorkflowOption, setCreateWorkflowOption] = useState(false);
  const [addLabelOption, setAddLabelOption] = useState(false);
  const [deleteOption, setDeleteOption] = useState(false);
  const [archiveOption, setArchiveOption] = useState(false);
  const [unarchiveOption, setUnarchiveOption] = useState(false);

  const [patientImportDetails, setPatientImportDetails] = useState(null);
  const [importPopoverOpen, setImportPopoverOpen] = useState(false);
  const [hasImportErrors, setHasImportErrors, unsetHasImportErrors] =
    useBoolean(false);

  const [importPopupOpen, setImportPopupOpen] = useState(false);

  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const { organizationIdentifier } = useSelector(organizationSelector);
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const isGuestOrDockLite = isUserGuestOrDockLite(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  const { emrIntegrationEnabled } = useSelector(organizationSelector) || {};
  const isDynamicPatientList =
    listIdentifierParameter?.toUpperCase() ===
    PatientsListType.DYNAMIC.toUpperCase();

  const quickFiltersList = useSelector(quickFiltersSelector);
  const selectedDynamicPatientListFilterId = useSelector(
    selectedDynamicPatientListFilterSelector,
  );

  const selectedQuickFilter = useMemo(() => {
    return (
      quickFiltersList?.find(
        ({ quickFilterIdentifier }) =>
          quickFilterIdentifier === selectedDynamicPatientListFilterId,
      ) || null
    );
  }, [quickFiltersList, selectedDynamicPatientListFilterId]);

  const { 0: filterOpen, 2: closeFilter, 3: toggleFilter } = useBoolean(false);

  useEffect(() => {
    const patientListIdentifier = listIdentifier;
    if (!isDynamicPatientList) {
      dispatch(
        PatientsActions.initializePatientsListState(patientListIdentifier),
      );
    }
  }, [dispatch, isDynamicPatientList, listIdentifier]);

  useEffect(() => {
    if (isDynamicPatientList && selectedQuickFilter) {
      const patientListIdentifier = DefaultPatientsListType.ALL_PATIENTS;
      dispatch(
        PatientsActions.initializeDynamicPatientsListState(
          patientListIdentifier,
        ),
      );
    }
  }, [dispatch, isDynamicPatientList, selectedQuickFilter]);

  useEffect(() => {
    if (isDynamicPatientList) {
      dispatch(
        getQuickFilters({
          organizationIdentifier,
          contextType: quickContextTypes.PATIENTS,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPatients = useCallback(() => {
    dispatch(PatientsActions.getCurrentPatients());
  }, [dispatch]);

  const refreshPatientListOnUpload = useCallback(
    async (counter) => {
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
          refreshPatientListOnUpload(refreshCounter);
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
    return patients?.filter((patient) => patient?.isSelected);
  }, [patients]);

  const bulkEditIsActive = useMemo(() => {
    return selectedPatients?.length > 0;
  }, [selectedPatients]);

  const handleDeleteConfirm = useCallback(() => {
    const assignedPatients = selectedPatients?.map((patient) => {
      return patient.patientIdentifier;
    });
    dispatch(
      PatientsActions.patientBulkDeletePatient({
        assignedPatients,
        listIdentifier,
      }),
    );
  }, [dispatch, listIdentifier, selectedPatients]);

  const handleArchiveConfirm = useCallback(() => {
    const assignedPatients = selectedPatients?.map((patient) => {
      return patient.patientIdentifier;
    });
    dispatch(
      PatientsActions.patientBulkUpdatePatient({
        assignedPatients,
        listIdentifier,
        bulkOperationType: PatientBulkActions.ARCHIVE_PATIENT,
      }),
    );
  }, [dispatch, listIdentifier, selectedPatients]);

  const handleUnArchiveConfirm = useCallback(() => {
    const assignedPatients = selectedPatients?.map((patient) => {
      return patient.patientIdentifier;
    });
    dispatch(
      PatientsActions.patientBulkUpdatePatient({
        assignedPatients,
        listIdentifier,
        bulkOperationType: PatientBulkActions.UNARCHIVE_PATIENT,
      }),
    );
  }, [dispatch, listIdentifier, selectedPatients]);

  const openDeleteConfirmationModal = useCallback(() => {
    const selectedPatientsCount = selectedPatients?.length;

    const modalProps = {
      title: `You want to delete ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 ? 's' : ''
      }`,
      description: `Are you sure you want to delete ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 ? 's' : ''
      }? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      confirm: () => {
        handleDeleteConfirm();
        dispatch(closeModal());
      },
      onClose: () => {
        dispatch(closeModal());
        setDeleteOption(false);
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleDeleteConfirm, selectedPatients]);

  const openArchiveConfirmationModal = useCallback(() => {
    const selectedPatientsCount = selectedPatients?.length;

    const modalProps = {
      title: `You want to archive ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 && 's'
      }`,
      description: `Are you sure you want to archive ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 && 's'
      } ?`,
      confirmButtonText: 'Archive',
      confirm: () => {
        handleArchiveConfirm();
        dispatch(closeModal());
      },
      onClose: () => {
        dispatch(closeModal());
        setDeleteOption(false);
      },
    };
    dispatch(openModal('ArchivePatient', modalProps));
  }, [dispatch, handleArchiveConfirm, selectedPatients]);

  const openUnarchiveConfirmationModal = useCallback(() => {
    const selectedPatientsCount = selectedPatients?.length;

    const modalProps = {
      title: `You want to unarchive ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 ? 's' : ''
      }`,
      description: `Are you sure you want to unarchive ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 ? 's' : ''
      }?`,
      confirmButtonText: 'Unarchive',
      confirm: () => {
        handleUnArchiveConfirm();
        dispatch(closeModal());
      },
      onClose: () => {
        dispatch(closeModal());
        setDeleteOption(false);
      },
    };
    dispatch(openModal('UnarchivePatient', modalProps));
  }, [dispatch, handleUnArchiveConfirm, selectedPatients]);

  const turnOffAllOptions = useCallback(() => {
    setCreateTaskOption(false);
    setCreateWorkflowOption(false);
    setAddLabelOption(false);
    setDeleteOption(false);
    setArchiveOption(false);
    setUnarchiveOption(false);
  }, []);

  const toggleCreateTaskOption = useCallback(() => {
    turnOffAllOptions();
    setCreateTaskOption((previous) => !previous);
  }, [turnOffAllOptions]);
  const toggleCreateWorkflowOption = useCallback(() => {
    turnOffAllOptions();
    setCreateWorkflowOption((previous) => !previous);
  }, [turnOffAllOptions]);
  const toggleAddLabelOption = useCallback(() => {
    turnOffAllOptions();
    setAddLabelOption((previous) => !previous);
  }, [turnOffAllOptions]);
  const toggleDeleteOption = useCallback(() => {
    turnOffAllOptions();
    openDeleteConfirmationModal();
    setDeleteOption((previous) => !previous);
  }, [turnOffAllOptions, openDeleteConfirmationModal]);
  const toggleArchiveOption = useCallback(() => {
    turnOffAllOptions();
    openArchiveConfirmationModal();
    setArchiveOption((previous) => !previous);
  }, [turnOffAllOptions, openArchiveConfirmationModal]);
  const toggleUnarchiveOption = useCallback(() => {
    turnOffAllOptions();
    openUnarchiveConfirmationModal();
    setUnarchiveOption((previous) => !previous);
  }, [openUnarchiveConfirmationModal, turnOffAllOptions]);
  const { getMemoPatientAttachment } = initializeAttachmentsSectionHooks();

  const downloadFiles = useCallback(
    async (patientIdentifiers) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const attachments = await getAllPatientAttachments(patientIdentifiers);
      let timeout = 0;
      attachments.map(async ({ attachmentIdentifier, fileName }) => {
        timeout += 500;
        setTimeout(async () => {
          const { data } = await getMemoPatientAttachment(attachmentIdentifier);
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.append(link);
          link.click();
        }, timeout);
      });
    },
    [getMemoPatientAttachment],
  );

  const providerValue = useMemo(
    () => ({
      bulkEditIsActive,
      selectedPatients,
      selectedOptions: {
        createTaskOption,
        createWorkflowOption,
        addLabelOption,
        deleteOption,
        archiveOption,
        unarchiveOption,
      },
      selectedOptionsHandler: {
        toggleCreateTaskOption,
        toggleCreateWorkflowOption,
        toggleAddLabelOption,
        toggleDeleteOption,
        toggleArchiveOption,
        toggleUnarchiveOption,
        turnOffAllOptions,
        downloadFiles,
      },
    }),
    [
      bulkEditIsActive,
      selectedPatients,
      createTaskOption,
      createWorkflowOption,
      addLabelOption,
      deleteOption,
      archiveOption,
      unarchiveOption,
      toggleCreateTaskOption,
      toggleCreateWorkflowOption,
      toggleAddLabelOption,
      toggleDeleteOption,
      toggleArchiveOption,
      toggleUnarchiveOption,
      turnOffAllOptions,
      downloadFiles,
    ],
  );

  const handleTemplateSelect = useCallback(
    (template) => {
      const assignedPatients = selectedPatients?.map((patient) => {
        return patient.patientIdentifier;
      });

      dispatch(
        openModal('ListPicker', {
          enableSelectingGroupStep: true,
          fetchMethod: getTaskListForUser,
          confirm: (listId, taskGroupIdentifier) =>
            dispatch(
              PatientsActions.patientBulkCreateWorkflow({
                workflowIdentifier: template.identifier,
                taskListIdentifier: listId,
                assignedToUsers: assignedPatients,
                taskGroupIdentifier,
              }),
            ),
        }),
      );
    },
    [dispatch, selectedPatients],
  );

  const handleDownloadPatientListData = useCallback(
    async (includeAllAttributes) => {
      const filename = `Dock ${listName}.csv`;
      let selectedFilters = localStorageHelper.getItem(
        getPatientsListFiltersStorageKey(listIdentifier),
      );
      if (!selectedFilters) {
        selectedFilters = sessionStorageHelper.getItem(
          getPatientsListFiltersStorageKey(listIdentifier),
        );
      }
      await downloadPatientListData(
        listIdentifier,
        selectedFilters,
        filename,
        includeAllAttributes,
      );
    },
    [listIdentifier, listName],
  );

  const onEditPatientList = useCallback(() => {
    dispatch(
      openModal('AddPatientToList', {
        patientsList: listDetails,
      }),
    );
  }, [dispatch, listDetails]);

  const onEditDynamicPatientList = useCallback(() => {
    toggleFilter();
  }, [toggleFilter]);

  const history = useHistory();

  const patientImportStatus = () => {
    history.push('/patients/import/tracker');
  };

  return (
    <PatientListColumnsConfigProvider>
      <PatientEditContext.Provider value={providerValue}>
        <ViewLayout
          header={
            <LayoutHeader>
              <Box
                position="absolute"
                top={listDescription ? 17 : 27}
                left={10}
              >
                {!isDynamicPatientList && (
                  <OptionsMenu
                    disablePortal
                    options={[
                      !isGuestOrDockLite &&
                        !isViewOnly &&
                        !emrIntegrationEnabled &&
                        listIdentifier ===
                          DefaultPatientsListType.ALL_PATIENTS && {
                          name: 'Import from Excel or CSV',
                          onClick: () => {
                            setImportPopupOpen(true);
                          },
                        },
                        !isGuestOrDockLite &&
                        !isViewOnly &&
                        !emrIntegrationEnabled &&
                        listIdentifier ===
                          DefaultPatientsListType.ALL_PATIENTS &&
                        {
                          name: 'View Import Status',
                          onClick: () => {patientImportStatus()}
                        },
                      !isGuestOrDockLite &&
                        !isViewOnly && {
                          name: 'Export to CSV',
                          onClick: () => {
                            handleDownloadPatientListData(false);
                          },
                        },
                      !isGuestOrDockLite &&
                        !isViewOnly && {
                          name: 'Export to CSV (All Attributes)',
                          onClick: () => {
                            handleDownloadPatientListData(true);
                          },
                        },
                    ]}
                  >
                    <MoreVert color="primary" />
                  </OptionsMenu>
                )}
              </Box>
              <LayoutHeader.Title
                title={
                  isDynamicPatientList
                    ? `Dynamic Patient List - ${
                        selectedQuickFilter?.name || ''
                      }`
                    : listName
                }
                description={isDynamicPatientList ? '' : listDescription}
              />
            </LayoutHeader>
          }
        >
          <PatientsViewContainer>
            <PatientsToolbar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              refreshPatientListOnUpload={refreshPatientListOnUpload}
              setImportPopoverOpen={setImportPopoverOpen}
            />
            <PatientsListContainer>
              {listIdentifier && listIdentifier.length === 36 && (
                <AddEntitiesContainer>
                  <AddButton onClick={onEditPatientList}>
                    Manage Patient List
                  </AddButton>
                  <Spacing horizontal={5} />
                </AddEntitiesContainer>
              )}
              {/* {isDynamicPatientList && (
                <AddEntitiesContainer>
                  <AddButton onClick={onEditDynamicPatientList}>
                    Edit Dynamic Patient List
                  </AddButton>
                  <Spacing horizontal={5} />
                </AddEntitiesContainer>
              )} */}
              <Grid>
                {listIdentifier === DefaultPatientsListType.ALL_PATIENTS &&
                  patients?.length >= MAX_PATIENT_ALL_RESULTS && (
                    <RefineSearchText>
                      Only displaying limited number of profiles. Please further
                      refine search!
                    </RefineSearchText>
                  )}
                <PatientsList
                  isFiltered={searchPerformed}
                  patients={patients}
                  patientImportDetails={patientImportDetails}
                  importPopoverOpen={importPopoverOpen}
                  setImportPopoverOpen={setImportPopoverOpen}
                  hasImportErrors={hasImportErrors}
                  isFetching={isFetchingPatients}
                  refreshPatients={refreshPatients}
                  isDynamicPatientList={isDynamicPatientList}
                  searchValue={searchValue}
                />
              </Grid>
            </PatientsListContainer>
          </PatientsViewContainer>
        </ViewLayout>
        <BulkEditSection>
          <BulkEditSectionContainer>
            {createTaskOption && (
              <BulkEditCreateTask
                iconColorActive={iconColorActiveItem?.value}
              />
            )}
            {createWorkflowOption && (
              <TaskTemplateApplicatorContainer>
                <TaskTemplateApplicator
                  onTemplateSelect={handleTemplateSelect}
                  bulkApply
                  iconColorActive={iconColorActiveItem?.value}
                />
              </TaskTemplateApplicatorContainer>
            )}
            {addLabelOption && (
              <TaskTemplateApplicatorContainer>
                <ContentWrapper>
                  <PatientLabels isPatientBulk />
                </ContentWrapper>
              </TaskTemplateApplicatorContainer>
            )}
          </BulkEditSectionContainer>
        </BulkEditSection>
        <Dialog
          open={importPopupOpen}
          onClose={() => setImportPopupOpen(false)}
          PaperProps={{
            elevation: 0,
            square: true,
            style: {},
          }}
        >
          <ImportDataModal
            closeModal={() => {
              setImportPopupOpen(false);
            }}
            downloadTemplate={downloadPatientImportTemplate}
            setImportPopoverOpen={setImportPopoverOpen}
            refreshPatientListOnUpload={refreshPatientListOnUpload}
            step={1}
            label="patient"
            uploadFunction={uploadPatientData}
          />
        </Dialog>
        {/* <FilterPopover open={filterOpen} onClose={closeFilter}>
          <PatientsFilter />
        </FilterPopover> */}
      </PatientEditContext.Provider>
    </PatientListColumnsConfigProvider>
  );
};

export default PatientsView;
