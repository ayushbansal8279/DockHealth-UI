import React, { useRef, useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import { useHistory, useParams } from 'react-router-dom';
import AddButton, {
  AddEntitiesContainer,
} from 'components/common/AddButton/AddButton';
import { useDispatch, useSelector } from 'react-redux';
import * as PatientsActions from 'actions/patients-actions';
// import { isUserGuestOrDockLite, isUserViewOnly } from 'helpers/user-helper';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import TasksStatusSwitchIcon from 'img/tasks-status-switch-icon.svg';
import {
  PATIENTS_LIST_ALL,
  PATIENTS_LIST_WITH_TASKS,
  PATIENTS_LIST_ARCHIVED,
  createPatientDetailsPath,
} from 'routing/helpers/paths';
import {
  DefaultPatientListUrl,
  DefaultPatientsListType,
} from 'helpers/patient-list-helpers';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import {
  currentPatientsListIdentifierSelector,
  // patientsListSearchTermSelector,
  filtersActiveSelector,
} from 'selectors/patients-selectors';

import FilterButton from 'components/filter/FilterButton/FilterButton';
import SearchInput from 'components/common/SearchInput/SearchInput';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import CustomizeToolbarButton from 'components/patients/CustomizeToolbarButton/CustomizeToolbarButton';
import Button from 'components/common/Button/Button';
import CreatePatientDrawer from '../CreatePatientDrawer/CreatePatientDrawer';
import PatientsFilter from '../PatientsFilter/PatientsFilter';
import {
  // InputWrapper,
  SearchHelperText,
  PatientsListImg,
  ButtonWrapper,
} from './styled';

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

const PatientsToolbar = () => {
  const [isSidebarOpen, setIsSidebarOpen, unsetIsSidebarOpen] =
    useBoolean(false);
  const { 0: filterOpen, 2: closeFilter, 3: toggleFilter } = useBoolean(false);
  const filterButtonReference = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  // const searchValue = useSelector(patientsListSearchTermSelector);
  const [searchValue, setSearchValue] = useState(null);
  const filtersActive = useSelector(filtersActiveSelector);
  const { emrIntegrationEnabled, emrIntegrationType } = useSelector(organizationSelector) || {};
  const listIdentifier = useSelector(currentPatientsListIdentifierSelector);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { listIdentifier: listIdentifierParameter } = useParams();

  // const isGuestOrDockLite = isUserGuestOrDockLite(currentUser);
  // const isViewOnly = isUserViewOnly(currentUser);

  // const [importPopupOpen, setImportPopupOpen] = useState(false);

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
    if (searchTerm === '') {
      dispatch(PatientsActions.clearPatientSearch());
    }
  };

  const handleSearch = useCallback(() => {
    dispatch(PatientsActions.searchPatients(searchValue));
  }, [dispatch, searchValue]);

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
      if (url) history.push(url);
    },
    [history],
  );

  const emrEntegrationExperience =
    listIdentifier === DefaultPatientsListType.ALL_PATIENTS &&
    emrIntegrationEnabled;

  return (
    <>
      <Box p="16px">
        <Box display="flex" width="100%">
          <Box display="flex" flex={1} alignItems="center">
            <Box width="300px">
              <SearchInput
                value={searchValue}
                onValueChange={handleSearchChange}
                onKeyEnter={handleSearch}
              />
            </Box>
            <Box m={1} />
            <ButtonWrapper>
              <Button fullWidth onClick={handleSearch} size="small">
                Search
              </Button>
            </ButtonWrapper>
            <Box>
              <ToolbarSelect
                options={OPTIONS}
                value={optionBasedUrl}
                name="patient-list-type"
                onChange={onListTypeChange}
                icon={
                  <PatientsListImg
                    src={TasksStatusSwitchIcon}
                    alt="list type icon"
                    iconColorFilterActive={iconColorFilterActiveItem?.value}
                  />
                }
                iconColorActive={iconColorActiveItem?.value}
              />
            </Box>
            <CustomizeToolbarButton
              iconColorFilterActive={iconColorFilterActiveItem?.value}
            />
            <Box m={1} />
            <FilterButton
              ref={filterButtonReference}
              active={filtersActive}
              onClick={toggleFilter}
              onClear={() => dispatch(PatientsActions.clearPatientsFilters())}
            />
          </Box>
          <AddEntitiesContainer>
            <AddButton onClick={setIsSidebarOpen}>
              ADD A {customerTypeLabel.toUpperCase()}
            </AddButton>
          </AddEntitiesContainer>
        </Box>
      </Box>
      {emrEntegrationExperience &&
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
      {!emrEntegrationExperience && !searchValue && (
        <>
          <SearchHelperText>
            Search by first name, last name or medical record number. You may
            filter to retrieve specific {customerTypeLabel.toLowerCase()}s in
            Dock.
          </SearchHelperText>
        </>
      )}
      <FilterPopover
        anchorEl={filterButtonReference.current}
        open={filterOpen}
        onClose={closeFilter}
      >
        <PatientsFilter />
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
