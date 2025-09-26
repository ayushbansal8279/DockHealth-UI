import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import {
  setCurrentUserGroup,
  unsetCurrentUserGroup,
} from 'actions/user-groups-actions';
import {
  BulkEditProvider,
  BulkEditContext,
} from 'context-api/bulk-edit-context';
import BulkEditSection from 'components/workspace/BulkEditSection/BulkEditSection';
import {
  Box,
  Dialog,
  FormGroup,
  ListItemText,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { getAllProfileTypes } from 'api/profile-type-api';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { showGlobalErrorAlert } from 'alert/actions';
import ProfileUndoAlert from '../ProfileUndoAlert/ProfileUndoAlert';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import ProfileDrawer from 'components/custom-profile/CustomProfilesList/ProfileDrawer';
import SearchInput from 'components/common/SearchInput/SearchInput';
import Popover from 'ui-toolkit/Element/Popover';
import Toolbar from 'ui-toolkit/Composite/Toolbar';
import { Paper } from 'ui-toolkit/Element';
import CustomizeIcon from 'img/customize-icon.svg';
import { CustomizeImg } from 'components/patients/CustomizeToolbarButton/styled';
import ToolbarButton from '../../tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';
import ProfileFilter from '../ProfileFilter/ProfileFilter';
import OptionsMenu from '../../common/OptionsMenu/OptionsMenu';
import {
  MoreVert,
  Archive,
  Delete,
  AppRegistration,
} from '@mui/icons-material';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import {
  isUserGuestOrDockLite,
  isUserViewOnly,
} from '@/app/helpers/user-helper';
import {
  downloadProfileData,
  downloadProfileImportTemplate,
  getAllProfiles,
  uploadProfileData,
} from '@/app/api/profile-api';
import {
  initializeProfileTypeState,
  updateProfileListPreferences,
  profileBulkArchive,
  profileBulkDelete,
  getProfiles,
  profileBulkUnarchive,
  profileBulkRecover,
  showProfileUndo,
} from '@/app/actions/profile-actions';
import { openModal, closeModal } from 'modal/actions';
import { getProfileListPreferences } from '@/app/api/profile-type-api';
import ImportDataModal from '@/app/modal/components/ImportDataModal/ImportDataModal';
import ToolbarSelect from '../../tasklist/ToolbarSelect/ToolbarSelect';
import { ProfileStatus, ProfileQueryType } from '@/app/helpers/profile-helpers';
import TasksStatusSwitchIcon from 'img/tasks-status-switch-icon.svg';
import { PatientsListImg } from 'components/patients/PatientsToolbar/styled';
import ReusableDataGrid from './DataGrid/DataGrid';
import DateLabel from '../../common/DateLabel/DateLabel';
import { StyledLink } from './styled';
import RelationshipLinks from '../RelationshipLinks';
import TaskItemBulkEdit from '../../task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit';
import { BulkEditSectionContainer } from '@/app/views/user-group/styled';

const DATASET_SIZE_THRESHOLD = 100;

const CustomProfileListContent = ({
  profileTypeIdentifier,
  groupIdentifier: groupIdentifierProp,
  fetchProfiles,
  showHeader = true,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const groupIdentifier =
    groupIdentifierProp ||
    getUserGroupIdentifierByUrlParameter(groupIdentifierProp);

  useEffect(() => {
    if (groupIdentifier) {
      dispatch(setCurrentUserGroup(groupIdentifier));

      return () => {
        dispatch(unsetCurrentUserGroup());
      };
    }
  }, [dispatch, groupIdentifier]);

  const handleRecordClick = ({ id }, event) => {
    history.push(`/custom-objects/${profileTypeIdentifier}/${id}`);
  };

  const [open, setOpen] = useState(null);

  const handleClose = () => {
    setOpen(null);
  };

  const [profileTypes, setProfileTypes] = useState([]);
  const [profileTypeFields, setProfileTypeFields] = useState([]);
  const [currentProfileType, setCurrentProfileType] = useState('');
  const [filters, setFilters] = useState([]);
  const profiles = useSelector((state) => state.profile?.profiles || []);
  const filteredProfilesFromRedux = useSelector(
    (state) => state.profile?.filteredProfiles || [],
  );
  const isFetchingProfiles = useSelector(
    (state) => state.profile?.isFetchingProfiles || false,
  );
  const isFilteringProfiles = useSelector(
    (state) => state.profile?.isFilteringProfiles || false,
  );
  const [searchPhrase, setSearchPhrase] = useState('');
  const [profileStatus, setProfileStatus] = useState(ProfileStatus.ALL);
  const loading = isFetchingProfiles || isFilteringProfiles;
  const [useLocalFiltering, setUseLocalFiltering] = useState(true);
  const currentUser = useSelector(userProfileSelector);
  const [importPopupOpen, setImportPopupOpen] = useState(false);
  const apiRef = useGridApiRef();

  const isGuestOrDockLite = isUserGuestOrDockLite(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

  const bulkEditContext = useContext(BulkEditContext);
  const {
    selectedItems,
    selectableItems,
    setSelectableItems,
    toggleItem,
    toggleAllItems,
    isListChecked,
    resetOptions,
  } = bulkEditContext;

  const renderCheckboxColumnHeader = ({ isListChecked, onListSelect }) => (
    <Box>
      <Checkbox isChecked={isListChecked} onClick={onListSelect} />
    </Box>
  );

  const fetchProfilesInternal = useCallback(
    (status = ProfileStatus.ALL) => {
      dispatch(getProfiles(profileTypeIdentifier, status));
    },
    [dispatch, profileTypeIdentifier],
  );

  const fetchProfileTypesInternal = useCallback(() => {
    getAllProfileTypes()
      .then((data) => {
        setProfileTypes(data);
        const selectedProfileType = data.find(
          (profileType) => profileType.identifier === profileTypeIdentifier,
        );
        setCurrentProfileType(selectedProfileType);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, profileTypeIdentifier]);

  const fetchProfileTypeFieldsInternal = useCallback(() => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypeFields(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, profileTypeIdentifier]);

  const fetchFiltersInternal = useCallback(() => {
    getProfileListPreferences(profileTypeIdentifier).then(setFilters);
  }, [profileTypeIdentifier]);

  useEffect(() => {
    fetchProfileTypesInternal();
    fetchProfileTypeFieldsInternal();
    fetchFiltersInternal();
  }, [
    fetchProfileTypesInternal,
    fetchProfileTypeFieldsInternal,
    fetchFiltersInternal,
  ]);

  useEffect(() => {
    fetchProfilesInternal();
  }, [fetchProfilesInternal]);

  const handleBulkAction = useCallback(
    async (action, status) => {
      const profileIdentifiers = selectedItems?.map((p) => p.identifier) ?? [];

      try {
        if (action === profileBulkDelete) {
          await dispatch(
            action(profileIdentifiers, profileTypeIdentifier, profileStatus),
          );
          dispatch(
            showProfileUndo(
              'DELETE',
              profileIdentifiers,
              profileTypeIdentifier,
              profileStatus,
            ),
          );
        } else if (action === profileBulkArchive) {
          await dispatch(
            action(
              profileIdentifiers,
              profileTypeIdentifier,
              status,
              profileStatus,
            ),
          );
          dispatch(
            showProfileUndo(
              'ARCHIVE',
              profileIdentifiers,
              profileTypeIdentifier,
              profileStatus,
            ),
          );
        } else {
          await dispatch(
            action(
              profileIdentifiers,
              profileTypeIdentifier,
              status,
              profileStatus,
            ),
          );
        }
        resetOptions();
      } catch (err) {
        console.error('Bulk action failed:', err);
      }
    },
    [
      dispatch,
      selectedItems,
      profileTypeIdentifier,
      profileStatus,
      resetOptions,
    ],
  );

  const handleBulkArchive = useCallback(() => {
    handleBulkAction(profileBulkArchive, ProfileStatus.ARCHIVED);
  }, [handleBulkAction]);

  const handleBulkDelete = useCallback(() => {
    handleBulkAction(profileBulkDelete);
  }, [handleBulkAction]);

  const handleBulkEditCustomFields = useCallback(() => {
    const profileIdentifiers = selectedItems?.map((p) => p.identifier) ?? [];
    dispatch(
      openModal('ProfileCustomFieldsBulkEditModal', {
        profileIdentifiers,
        profileTypeIdentifier,
        profileStatus,
        onCloseModal: () => {
          resetOptions?.();
          dispatch(closeModal());
        },
      }),
    );
  }, [
    dispatch,
    selectedItems,
    profileTypeIdentifier,
    profileStatus,
    resetOptions,
  ]);

  const handleUndo = useCallback(
    (undoOperation) => {
      if (!undoOperation) return;

      const {
        operationType,
        profileIdentifiers,
        profileTypeIdentifier,
        profileStatus,
      } = undoOperation;

      if (operationType === 'ARCHIVE') {
        dispatch(
          profileBulkUnarchive(
            profileIdentifiers,
            profileTypeIdentifier,
            profileStatus,
          ),
        );
      } else if (operationType === 'DELETE') {
        dispatch(
          profileBulkRecover(
            profileIdentifiers,
            profileTypeIdentifier,
            profileStatus,
          ),
        );
      }
    },
    [dispatch],
  );

  const openBulkArchiveConfirmationModal = useCallback(() => {
    const selectedProfilesCount = selectedItems?.length;
    const modalProps = {
      title: `You want to archive ${selectedProfilesCount} profile${
        selectedProfilesCount > 1 ? 's' : ''
      }`,
      description: `Are you sure you want to archive ${selectedProfilesCount} profile${
        selectedProfilesCount > 1 ? 's' : ''
      }?`,
      confirmButtonText: 'Archive',
      confirm: () => {
        handleBulkArchive();
        dispatch(closeModal());
      },
      onClose: () => {
        dispatch(closeModal());
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleBulkArchive, selectedItems]);

  const openBulkDeleteConfirmationModal = useCallback(() => {
    const selectedProfilesCount = selectedItems?.length;
    const modalProps = {
      title: `You want to delete ${selectedProfilesCount} profile${
        selectedProfilesCount > 1 ? 's' : ''
      }`,
      description: `Are you sure you want to delete ${selectedProfilesCount} profile${
        selectedProfilesCount > 1 ? 's' : ''
      }? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      confirm: () => {
        handleBulkDelete();
        dispatch(closeModal());
      },
      onClose: () => {
        dispatch(closeModal());
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [dispatch, handleBulkDelete, selectedItems]);

  const bulkOptions = useMemo(
    () => [
      {
        key: 'editFields',
        title: 'Edit Fields',
        icon: AppRegistration,
        onClick: handleBulkEditCustomFields,
      },
      {
        key: 'archive',
        title: 'Archive',
        icon: Archive,
        onClick: openBulkArchiveConfirmationModal,
      },
      {
        key: 'delete',
        title: 'Delete',
        icon: Delete,
        onClick: openBulkDeleteConfirmationModal,
      },
    ],
    [
      openBulkArchiveConfirmationModal,
      openBulkDeleteConfirmationModal,
      handleBulkEditCustomFields,
    ],
  );

  useEffect(() => {
    if (bulkEditContext.setBulkOptions) {
      bulkEditContext.setBulkOptions(bulkOptions);
    }
  }, [bulkOptions]);

  const PROFILE_STATUS_OPTIONS = Object.values(ProfileStatus).map((status) => ({
    value: status,
    label: status.charAt(0) + status.slice(1).toLowerCase(),
  }));

  useEffect(() => {
    if (showHeader) {
      dispatch(initializeProfileTypeState(currentProfileType));
    }
  }, [dispatch, profileTypeIdentifier, currentProfileType, showHeader]);

  const removeDuplicatesByIdentifier = (profiles) => {
    return Array.from(new Map(profiles.map((p) => [p.identifier, p])).values());
  };

  const handleProfileStatusChange = useCallback(
    (newStatus) => {
      setProfileStatus(newStatus);
      fetchProfilesInternal(newStatus);
    },
    [fetchProfilesInternal],
  );

  const handleProfileAddClick = () => {
    setOpen(true);
  };

  const handleSearchInputChange = (value) => {
    setSearchPhrase(value);
  };

  const buttonReference = useRef(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const handlePopoverOpen = () => {
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  const handleFilterChange = (field) => () => {
    const updatedFilters = filters.includes(field.identifier)
      ? filters.filter((filter) => filter !== field.identifier)
      : [...filters, field.identifier];

    setFilters(updatedFilters);

    dispatch(
      updateProfileListPreferences(
        {
          listDisplayColumns: updatedFilters,
        },
        profileTypeIdentifier,
      ),
    );
  };

  const handleDownloadProfileData = () => {
    const filename = `Dock ${currentProfileType?.name}.csv`;
    downloadProfileData(profileTypeIdentifier, filename);
  };

  const columns = [
    ...(isGuestOrDockLite || isViewOnly
      ? []
      : [
          {
            field: 'isSelected',
            headerName: 'SELECT',
            flex: 0.1,
            sortable: false,
            headerClassName: 'no-sort-icon',
            renderHeader: () =>
              renderCheckboxColumnHeader({
                isListChecked,
                onListSelect: toggleAllItems,
              }),
            renderCell: ({ row }) => {
              return (
                <TaskItemBulkEdit
                  isChecked={row?.isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(row.id);
                  }}
                  isDisabled={false}
                />
              );
            },
          },
        ]),
    ...filters
      .map((filterIdentifier) => {
        const field = profileTypeFields.find(
          (field) => field.identifier === filterIdentifier,
        );
        return field
          ? {
              field: field.identifier,
              headerName: field.name,
              flex: 1,
              filterable: true,
              sortable: true,
              valueGetter: (params) => {
                return params.row[field.name] ?? '';
              },
              renderCell: (params) => {
                const value = params.row[field.name];

                if (field.fieldType === 'DATE' && value) {
                  return (
                    <DateLabel date={value.date} dueDateIntent={value.intent} />
                  );
                }

                if (field.fieldType === 'HYPERLINK') {
                  if (!value) return '';
                  return (
                    <StyledLink
                      href={value.startsWith('http') ? value : `//${value}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {value}
                    </StyledLink>
                  );
                }

                if (field.fieldType === 'RELATIONSHIP') {
                  const refs = params.row[field.name];
                  return (
                    <RelationshipLinks
                      refs={refs}
                      relatedProfileType={field.relatedProfileType.identifier}
                    />
                  );
                }

                return value;
              },
            }
          : null;
      })
      .filter(Boolean),
  ];

  // TODO: fix filter
  const filteredProfiles = useMemo(() => {
    let profilesToFilter = profiles;

    if (filteredProfilesFromRedux.length > 0) {
      profilesToFilter = filteredProfilesFromRedux.filter((profile) => {
        if (useLocalFiltering) return true;
        return (
          profileStatus === ProfileStatus.ALL ||
          profile.profileStatus === profileStatus
        );
      });
    }

    return (
      profilesToFilter?.filter((profile) => {
        const matchesSearch = profile.fields?.some((field) =>
          (field.values || []).some(
            (val) =>
              typeof val === 'string' &&
              val.toLowerCase().includes(searchPhrase.toLowerCase()),
          ),
        );

        return matchesSearch;
      }) || []
    );
  }, [
    profiles,
    filteredProfilesFromRedux,
    searchPhrase,
    useLocalFiltering,
    profileStatus,
  ]);

  const profilesWithSelection = useMemo(() => {
    return (
      filteredProfiles?.map((profile) => ({
        isSelected: false,
        ...profile,
      })) || []
    );
  }, [filteredProfiles]);

  useEffect(() => {
    if (filteredProfiles) {
      setSelectableItems(profilesWithSelection);
    }
  }, [filteredProfiles, setSelectableItems]);

  const rows =
    selectableItems
      ?.filter((profile) =>
        profile.fields?.some((field) =>
          (field.values || []).some(
            (val) =>
              typeof val === 'string' &&
              val.toLowerCase().includes(searchPhrase.toLowerCase()),
          ),
        ),
      )
      .map((profile) => {
        const rowData = {
          id: profile.identifier,
          ...profile,
        };

        filters.forEach((filterIdentifier) => {
          const fieldConfig = profileTypeFields.find(
            (field) => field.identifier === filterIdentifier,
          );

          if (fieldConfig) {
            const profileField = profile.fields?.find(
              (field) => field.profileTypeFieldIdentifier === filterIdentifier,
            );

            if (profileField) {
              let value = '';

              switch (profileField.profileTypeFieldType) {
                case 'TEXT':
                case 'NUMBER':
                case 'BOOLEAN':
                case 'LONG_TEXT':
                  value = profileField.values?.[0] || '';
                  break;

                case 'MULTI_SELECT':
                case 'PICK_LIST':
                  value =
                    profileField.references
                      ?.map((r) => r.displayValue)
                      .join(', ') ||
                    profileField.values?.join(', ') ||
                    '';
                  break;

                case 'RELATIONSHIP':
                  value = profileField.references || [];
                  break;

                case 'HYPERLINK':
                  value = profileField.values?.[0] || '';
                  break;

                case 'DATE':
                  value = {
                    date: profileField.values?.[0] || '',
                    intent: profileField.dateTimeIntents?.[0] || null,
                  };
                  break;

                default:
                  value = '';
              }

              rowData[fieldConfig.name] = value;
            } else {
              rowData[fieldConfig.name] = '';
            }
          }
        });

        return rowData;
      }) || [];

  return (
    <>
      <ViewLayout
        header={
          showHeader && (
            <LayoutHeader>
              <Box
                position="absolute"
                top={currentProfileType?.description ? 17 : 27}
                left={10}
              >
                <OptionsMenu
                  disablePortal
                  options={[
                    !isGuestOrDockLite &&
                      !isViewOnly && {
                        name: 'Import from CSV',
                        onClick: () => {
                          setImportPopupOpen(true);
                        },
                      },
                    !isGuestOrDockLite &&
                      !isViewOnly && {
                        name: 'Export to CSV',
                        onClick: () => {
                          handleDownloadProfileData();
                        },
                      },
                  ]}
                >
                  <MoreVert color="primary" />
                </OptionsMenu>
              </Box>
              <LayoutHeader.Title
                title={currentProfileType?.name}
                description={currentProfileType?.description}
              />
            </LayoutHeader>
          )
        }
      >
        <ProfileDrawer
          title={currentProfileType?.name}
          open={open}
          profileTypeIdentifier={profileTypeIdentifier}
          types={profileTypeFields}
          onClose={handleClose}
          onUpdate={() => {
            fetchProfilesInternal();
          }}
          addMode
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            m: !showHeader ? '0px 32px 0px 32px ' : '16px 32px 0px 32px ',
          }}
        >
          <Box display="flex" alignItems="start" my={!showHeader ? 0 : 2}>
            <Box display="flex" alignItems="center" my={0.4} mr={2}>
              <ToolbarSelect
                options={PROFILE_STATUS_OPTIONS}
                value={profileStatus}
                name="profile-status-filter"
                onChange={(event) =>
                  handleProfileStatusChange(event?.target?.value)
                }
                icon={
                  <PatientsListImg
                    src={TasksStatusSwitchIcon}
                    alt="profile status icon"
                  />
                }
              />
            </Box>
            <Toolbar>
              <div style={{ marginTop: '3px' }}>
                <ToolbarButton
                  ref={buttonReference}
                  icon={
                    <CustomizeImg src={CustomizeIcon} alt="view type icon" />
                  }
                  onClick={handlePopoverOpen}
                  isOpen={isPopoverOpen}
                  active={isPopoverOpen}
                  hasPopover
                >
                  Customize
                </ToolbarButton>
              </div>
            </Toolbar>
            <Popover
              anchorEl={buttonReference?.current}
              open={isPopoverOpen}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Paper
                sx={{
                  p: 1,
                }}
              >
                <strong>Custom Columns</strong>
                <FormGroup>
                  {profileTypeFields.map((field) => {
                    return (
                      <MenuItem
                        key={field.identifier}
                        onClick={handleFilterChange(field)}
                      >
                        <Switch checked={filters.includes(field.identifier)} />
                        <Box mx={0.5} />
                        <ListItemText>{field.name}</ListItemText>
                      </MenuItem>
                    );
                  })}
                </FormGroup>
              </Paper>
            </Popover>
            <Box display="flex" alignItems="center" my={0.4} mx={2}>
              <ProfileFilter
                profileTypeIdentifier={profileTypeIdentifier}
                fetchProfiles={fetchProfilesInternal}
              />
            </Box>
            <Box display="flex" alignItems="center" width="400px" my={0.4}>
              <SearchInput
                value={searchPhrase}
                onValueChange={handleSearchInputChange}
              />
            </Box>
          </Box>
          <Box m={1} />
          <Box display="flex" alignItems="center">
            <ToolbarButton
              icon={
                <span style={{ marginLeft: '-5px' }}>
                  <AddIcon />
                </span>
              }
              onClick={handleProfileAddClick}
              isOpen={open}
              active={open}
            >
              <span style={{ marginLeft: '-5px' }}>
                Add a {currentProfileType?.name}
              </span>
            </ToolbarButton>
          </Box>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            m: '16px 32px 48px 32px ',
            minHeight: 0,
          }}
        >
          <ReusableDataGrid
            columns={columns}
            rows={rows}
            loading={loading}
            apiRef={apiRef}
            onRecordClick={handleRecordClick}
            showSearch={false}
          />
        </Box>
      </ViewLayout>
      <BulkEditSection>
        <BulkEditSectionContainer></BulkEditSectionContainer>
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
          downloadTemplate={() =>
            downloadProfileImportTemplate(profileTypeIdentifier)
          }
          step={1}
          label="object"
          uploadFunction={uploadProfileData}
          identifier={profileTypeIdentifier}
        />
      </Dialog>
      <ProfileUndoAlert onUndo={handleUndo} />
    </>
  );
};

const CustomProfileList = (props) => {
  return (
    <BulkEditProvider viewType="profiles">
      <CustomProfileListContent {...props} />
    </BulkEditProvider>
  );
};

export default CustomProfileList;
