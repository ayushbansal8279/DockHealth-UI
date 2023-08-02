import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Dialog } from '@mui/material';
import {
  getPatientListIdentifierByUrlParameter,
  getPatientsListFiltersStorageKey,
  DefaultPatientsListType,
} from 'helpers/patient-list-helpers';
import { useBoolean } from 'hooks/useBoolean';
import sessionStorageHelper from 'helpers/session-storage-helper';
import {
  patientsListDetailsSelector,
  patientsSelector,
  isFetchingPatientsSelector,
  patientsListSearchPerformedSelector,
  // patientsListSearchTermSelector,
} from 'selectors/patients-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { isUserGuest, isUserViewOnly } from 'helpers/user-helper';
import { organizationSelector } from 'selectors/organization-selectors';
import { PatientEditContext } from 'context-api/patient-edit-context';
import * as PatientsActions from 'actions/patients-actions';
import * as PatientApi from 'api/patient-api';
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
import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import {
  downloadPatientImportTemplate,
  downloadPatientListData,
  getAllPatientAttachments,
} from 'api/patient-api';
import { PatientBulkActions } from 'api/patients-api';
import initializeAttachmentsSectionHooks from 'views/patient-details/PatientAttachments/hooks';
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

const MAX_PATIENT_ALL_RESULTS = 1000;

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientsView = () => {
  const dispatch = useDispatch();
  const { listIdentifier: listIdentifierParameter } = useParams();

  const listIdentifier = getPatientListIdentifierByUrlParameter(
    listIdentifierParameter,
  );
  // const searchValue = useSelector(patientsListSearchTermSelector);
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
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const isGuest = isUserGuest(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  const { emrIntegrationEnabled } = useSelector(organizationSelector) || {};

  useEffect(() => {
    dispatch(PatientsActions.initializePatientsListState(listIdentifier));
  }, [dispatch, listIdentifier]);

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

  const openDeleteConfirmationModal = useCallback(() => {
    const selectedPatientsCount = selectedPatients?.length;

    const modalProps = {
      title: `You want to delete ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 && 's'
      }`,
      description: `Are you sure you want to delete ${selectedPatientsCount} patient${
        selectedPatientsCount > 1 && 's'
      } ? This action cannot be undone.`,
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
    dispatch(openModal('DeleteConfirmation', modalProps));
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
        handleArchiveConfirm();
        dispatch(closeModal());
      },
      onClose: () => {
        dispatch(closeModal());
        setDeleteOption(false);
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleArchiveConfirm, selectedPatients]);

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
      const selectedFilters = sessionStorageHelper.getItem(
        getPatientsListFiltersStorageKey(listIdentifier),
      );
      const { data } = await downloadPatientListData(
        listIdentifier,
        selectedFilters,
        filename,
        includeAllAttributes,
      );
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.append(link);
      link.click();
    },
    [listIdentifier, listName],
  );

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
                <OptionsMenu
                  disablePortal
                  options={[
                    !isGuest &&
                      !isViewOnly &&
                      !emrIntegrationEnabled &&
                      listIdentifier ===
                        DefaultPatientsListType.ALL_PATIENTS && {
                        name: 'Import from Excel',
                        onClick: () => {
                          setImportPopupOpen(true);
                        },
                      },
                    !isGuest &&
                      !isViewOnly && {
                        name: 'Export to CSV',
                        onClick: () => {
                          handleDownloadPatientListData(false);
                        },
                      },
                    !isGuest &&
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
              </Box>
              <LayoutHeader.Title
                title={listName}
                description={listDescription}
              />
            </LayoutHeader>
          }
        >
          <PatientsViewContainer>
            <PatientsToolbar
              refreshPatientListOnUpload={refreshPatientListOnUpload}
              setImportPopoverOpen={setImportPopoverOpen}
            />
            <PatientsListContainer>
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
                  isFetching={isFetchingPatients && !patients}
                  refreshPatients={refreshPatients}
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
          <ImportPatientsModal
            closeModal={() => {
              setImportPopupOpen(false);
            }}
            downloadTemplate={downloadPatientImportTemplate}
            setImportPopoverOpen={setImportPopoverOpen}
            refreshPatientListOnUpload={refreshPatientListOnUpload}
            step={1}
          />
        </Dialog>
      </PatientEditContext.Provider>
    </PatientListColumnsConfigProvider>
  );
};

export default PatientsView;
