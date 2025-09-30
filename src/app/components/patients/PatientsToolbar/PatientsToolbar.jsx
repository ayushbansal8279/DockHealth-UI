import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { Box } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import { useHistory, useParams } from 'react-router-dom';
import { AddEntitiesContainer } from 'components/common/AddButton/AddButton';
import { useDispatch, useSelector } from 'react-redux';
import * as PatientsActions from 'actions/patients-actions';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import StatusSwitchIcon from 'img/status-switch-icon.svg';
import {
  PATIENTS_LIST_ALL,
  PATIENTS_LIST_WITH_TASKS,
  PATIENTS_LIST_ARCHIVED,
  createPatientDetailsPath,
} from 'routing/helpers/paths';
import {
  DefaultPatientListUrl,
  DefaultPatientsListType,
  PatientsListType,
} from 'helpers/patient-list-helpers';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  currentPatientsListIdentifierSelector,
  patientsListSearchTermSelector,
  filtersActiveSelector,
} from 'selectors/patients-selectors';

import FilterButton from 'components/filter/FilterButton/FilterButton';
import SearchInput from 'components/common/SearchInput/SearchInput';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import CustomizeToolbarButton from 'components/patients/CustomizeToolbarButton/CustomizeToolbarButton';
import CreatePatientDrawer from '../CreatePatientDrawer/CreatePatientDrawer';
import PatientsFilter from '../PatientsFilter/PatientsFilter';
import { SearchHelperText, ToolbarIconImg } from './styled';
import ToolbarButton from '../../tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';
import pluralize from 'pluralize';

const OPTIONS = [
  {
    label: 'All Active',
    value: DefaultPatientsListType.ALL_PATIENTS,
    url: PATIENTS_LIST_ALL,
  },
  {
    label: 'Active (with Tasks)',
    value: DefaultPatientsListType.ACTIVE_PATIENTS,
    url: PATIENTS_LIST_WITH_TASKS,
  },
  {
    label: 'Archived',
    value: DefaultPatientsListType.ARCHIVED_PATIENTS,
    url: PATIENTS_LIST_ARCHIVED,
  },
];

const PatientsToolbar = ({
  searchValue,
  setSearchValue,
  workspaceIdentifier = null,
  placeholder = 'Search',
}) => {
  const [isSidebarOpen, setIsSidebarOpen, unsetIsSidebarOpen] =
    useBoolean(false);
  const [finalFilter, setFinalFilter] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [isSavePopupOpen, setSavePopupOpen] = useState(false);
  const [editIdentifier, setEditIdentifier] = useState('');
  const [customFinalFilter, setCustomFinalFilter] = useState({});
  const [customFilteredData, setCustomFilteredData] = useState({});
  const { 0: filterOpen, 2: closeFilter, 3: toggleFilter } = useBoolean(false);
  const filterButtonReference = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const searchText = useSelector(patientsListSearchTermSelector);
  const filtersActive = useSelector(filtersActiveSelector);
  const listIdentifier = useSelector(currentPatientsListIdentifierSelector);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { listIdentifier: listIdentifierParameter } = useParams();

  const iconColorFilterActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.filter',
    ) || {};
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const handleSearchChange = (searchTerm) => {
    setSearchValue(searchTerm);
    dispatch(PatientsActions.changePatientsSearchTerm(searchTerm));
    dispatch(PatientsActions.clearPatients());
    dispatch(PatientsActions.clearPatientSearch());
  };

  const handleSearch = useCallback(() => {
    dispatch(PatientsActions.searchPatients(searchValue, workspaceIdentifier));
  }, [dispatch, searchValue, workspaceIdentifier]);

  const optionBasedUrl = useMemo(
    () =>
      Object.keys(DefaultPatientListUrl).find(
        (key) => DefaultPatientListUrl[key] === listIdentifierParameter,
      ),
    [listIdentifierParameter],
  );

  const onListTypeChange = useCallback(
    (event) => {
      const { value } = event.target;
      const { url } = OPTIONS.find((o) => o.value === value);

      if (!url) return;

      const updatedUrl = workspaceIdentifier
        ? url.replace('/core', `/core/workspace/${workspaceIdentifier}`)
        : url;

      history.push(updatedUrl);
    },
    [history, workspaceIdentifier],
  );

  const { emrIntegrationEnabled, emrIntegrationType } =
    currentOrganization || {};

  const emrEntegrationExperience =
    listIdentifier === DefaultPatientsListType.ALL_PATIENTS &&
    emrIntegrationEnabled;
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.add.enabled',
    ) || {};
  const patientAddEnabled =
    !emrIntegrationEnabled ||
    (emrIntegrationEnabled && quickAddPatientEnabledItem?.value === 'true');

  const isDynamicPatientList =
    listIdentifierParameter?.toUpperCase() ===
    PatientsListType.DYNAMIC.toUpperCase();

  useEffect(() => {
    setSearchValue(searchText);
  }, [searchText]);

  return (
    <>
      <Box>
        <Box display="flex" width="100%">
          <Box
            display="flex"
            flex={1}
            alignItems="center"
            maxWidth="fit-content"
          >
            <Box>
              <CustomizeToolbarButton
                iconColorFilterActive={iconColorFilterActiveItem?.value}
              />
            </Box>
            <Box mx={0.5} />
            {!isDynamicPatientList && (
              <Box>
                <ToolbarSelect
                  options={OPTIONS}
                  value={optionBasedUrl}
                  name="patient-list-type"
                  onChange={onListTypeChange}
                  icon={
                    <ToolbarIconImg
                      src={StatusSwitchIcon}
                      alt="list type icon"
                      iconColorFilterActive={iconColorFilterActiveItem?.value}
                    />
                  }
                  iconColorActive={iconColorActiveItem?.value}
                  spaceAfterLabel
                />
              </Box>
            )}
            <Box mx={0.5} />
            {!isDynamicPatientList && (
              <FilterButton
                ref={filterButtonReference}
                active={filtersActive}
                onClick={toggleFilter}
                isOpen={filterOpen}
                onClear={() => dispatch(PatientsActions.clearPatientsFilters())}
              />
            )}
            <Box mx={0.5} />

            {/* <Box m={1} />
            {!isDynamicPatientList && (
              <ButtonWrapper onClick={handleSearch}>Search</ButtonWrapper>
            )} */}
            {/* {!isDynamicPatientList && (
              <Box>
                <ToolbarSelect
                  options={OPTIONS}
                  value={optionBasedUrl}
                  name="patient-list-type"
                  onChange={onListTypeChange}
                  icon={
                    <PatientsListImg
                      src={StatusSwitchIcon }
                      alt="list type icon"
                      iconColorFilterActive={iconColorFilterActiveItem?.value}
                    />
                  }
                  iconColorActive={iconColorActiveItem?.value}
                />
              </Box>
            )} */}
            {/* <Box m={1} /> */}
            {/* <Box>
              <CustomizeToolbarButton
                iconColorFilterActive={iconColorFilterActiveItem?.value}
              />
            </Box> */}
            {/* <Box m={1} /> */}
            {/* {!isDynamicPatientList && (
              <FilterButton
                ref={filterButtonReference}
                active={filtersActive}
                onClick={toggleFilter}
                isOpen={filterOpen}
                onClear={() => dispatch(PatientsActions.clearPatientsFilters())}
              />
            )} */}
          </Box>
          {!isDynamicPatientList && (
            <SearchInput
              value={searchValue}
              onValueChange={handleSearchChange}
              onKeyEnter={handleSearch}
              isPatientSearchInput
              placeholder={placeholder}
            />
          )}
          {!isDynamicPatientList &&
            patientAddEnabled &&
            listIdentifier &&
            (listIdentifier === DefaultPatientsListType.ALL_PATIENTS ||
              listIdentifier === DefaultPatientsListType.ACTIVE_PATIENTS) && (
              <AddEntitiesContainer>
                <ToolbarButton
                  icon={
                    <span style={{ marginLeft: '-5px' }}>
                      <AddIcon />
                    </span>
                  }
                  onClick={setIsSidebarOpen}
                >
                  <span style={{ marginLeft: '-5px' }}>
                    Add a {customerTypeLabel}
                  </span>
                </ToolbarButton>
              </AddEntitiesContainer>
            )}
        </Box>
      </Box>
      {!isDynamicPatientList &&
        emrEntegrationExperience &&
        !searchValue &&
        (emrIntegrationType === 'FHIR' ? (
          <SearchHelperText>
            Dock is connected to your EHR. Search by medical record number. You
            may filter to retrieve specific patients in Dock.
          </SearchHelperText>
        ) : (
          <SearchHelperText>
            Dock is connected to your EHR. Search by first name, last name or
            medical record number. You may filter to retrieve specific patients
            in Dock.
          </SearchHelperText>
        ))}
      {!isDynamicPatientList && !emrEntegrationExperience && !searchValue && (
        <>
          <SearchHelperText>
            Search by first name, last name or medical record number. You may
            filter to retrieve specific{' '}
            {pluralize(customerTypeLabel).toLowerCase()} in Dock.
          </SearchHelperText>
        </>
      )}
      <FilterPopover
        anchorEl={filterButtonReference.current}
        open={filterOpen}
        onClose={closeFilter}
      >
        <PatientsFilter
          filterButtonReference={filterButtonReference}
          closeFilter={closeFilter}
          finalFilter={finalFilter}
          setFinalFilter={setFinalFilter}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          isSavePopupOpen={isSavePopupOpen}
          setSavePopupOpen={setSavePopupOpen}
          editIdentifier={editIdentifier}
          setEditIdentifier={setEditIdentifier}
          customFinalFilter={customFinalFilter}
          setCustomFinalFilter={setCustomFinalFilter}
          customFilteredData={customFilteredData}
          setCustomFilteredData={setCustomFilteredData}
        />
      </FilterPopover>
      <CreatePatientDrawer
        onPatientCreated={({ patientIdentifier }) =>
          history.push(createPatientDetailsPath(patientIdentifier))
        }
        onClose={unsetIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
    </>
  );
};

export default PatientsToolbar;
