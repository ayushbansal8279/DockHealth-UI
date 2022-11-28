import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Dialog, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useBoolean } from 'hooks/useBoolean';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as PatientsActions from 'actions/patients-actions';
import { downloadPatientImportTemplate } from 'api/patient-api';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import TasksStatusSwitchIcon from 'img/tasks-status-switch-icon';
import {
  PATIENTS_LIST_ALL,
  PATIENTS_LIST_ARCHIVED,
  createPatientDetailsPath,
} from 'routing/helpers/paths';
import {
  DefaultPatientListUrl,
  DefaultPatientsListType,
} from 'helpers/patient-list-helpers';
import { organizationSelector } from 'selectors/organization-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  currentPatientsListIdentifierSelector,
  patientsListSearchTermSelector,
  filtersActiveSelector,
} from 'selectors/patients-selectors';

import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import AdornedButton from 'components/common/AdornedButton/AdornedButton';
import SearchInput from 'components/common/SearchInput/SearchInput';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import CustomizeToolbarButton from 'components/patients/CustomizeToolbarButton/CustomizeToolbarButton';
import CreatePatientDrawer from '../CreatePatientDrawer/CreatePatientDrawer';
import PatientsFilter from '../PatientsFilter/PatientsFilter';
import { ImportButton, InputWrapper, SearchHelperText } from './styled';

const OPTIONS = [
  {
    label: 'All Patients',
    value: DefaultPatientsListType.ALL_PATIENTS,
    url: PATIENTS_LIST_ALL,
  },
  {
    label: 'Archived Patients',
    value: DefaultPatientsListType.ARCHIVED_PATIENTS,
    url: PATIENTS_LIST_ARCHIVED,
  },
];

const PatientsToolbar = ({ refreshPatientList, setImportPopoverOpen }) => {
  const [isSidebarOpen, setIsSidebarOpen, unsetIsSidebarOpen] = useBoolean(
    false,
  );
  const { 0: filterOpen, 2: closeFilter, 3: toggleFilter } = useBoolean(false);
  const filterButtonReference = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const searchValue = useSelector(patientsListSearchTermSelector);
  const filtersActive = useSelector(filtersActiveSelector);
  const { emrIntegrationEnabled } = useSelector(organizationSelector) || {};
  const listIdentifier = useSelector(currentPatientsListIdentifierSelector);
  const currentUser = useSelector(userProfileSelector);
  const { orgUserRole } = currentUser || {};
  const customerTypeLabel = getCustomerTypeLabel(currentUser).toUpperCase();
  const { listIdentifier: listIdentifierParameter } = useParams();

  const isGuest = orgUserRole === 'GUEST';

  const [importPopupOpen, setImportPopupOpen] = useState(false);

  const handleSearchChange = searchTerm => {
    dispatch(PatientsActions.changePatientsSearchTerm(searchTerm));
  };

  const optionBasedUrl = useMemo(
    () =>
      Object.keys(DefaultPatientListUrl).find(
        key => DefaultPatientListUrl[key] === listIdentifierParameter,
      ),
    [listIdentifierParameter],
  );

  const onListTypeChange = useCallback(
    event => {
      const { value } = event.target;
      const { url } = OPTIONS.find(o => o.value === value);
      if (url) history.push(url);
    },
    [history],
  );

  return listIdentifier === DefaultPatientsListType.ALL_PATIENTS &&
    emrIntegrationEnabled ? (
    <Box width="100%">
      <InputWrapper hasValue={searchValue}>
        <SearchInput value={searchValue} onValueChange={handleSearchChange} />
        {!searchValue && (
          <SearchHelperText>
            Dock is connected to your EHR. Please search by name or medical
            record number to find a patient.
          </SearchHelperText>
        )}
      </InputWrapper>
    </Box>
  ) : (
    <>
      <Box p="16px">
        <Box display="flex" width="100%">
          <Box display="flex" flex={1} alignItems="center">
            <Box width="300px">
              <SearchInput
                value={searchValue}
                onValueChange={handleSearchChange}
              />
            </Box>
            <Box m={1} />
            <Box>
              <ToolbarSelect
                options={OPTIONS}
                value={optionBasedUrl}
                name="patient-list-type"
                onChange={onListTypeChange}
                icon={<img src={TasksStatusSwitchIcon} alt="view type icon" />}
              />
            </Box>
            <Box m={1} />
            <FilterButton
              ref={filterButtonReference}
              active={filtersActive}
              onClick={toggleFilter}
              onClear={() => dispatch(PatientsActions.clearPatientsFilters())}
            />
            <CustomizeToolbarButton />
          </Box>
          <Box display="flex" alignItems="center">
            {!isGuest &&
              !emrIntegrationEnabled &&
              listIdentifier === DefaultPatientsListType.ALL_PATIENTS && (
                <>
                  <ImportButton
                    onClick={() => {
                      setImportPopupOpen(true);
                    }}
                  >
                    IMPORT {customerTypeLabel}S FROM EXCEL
                  </ImportButton>
                  <Box m={1} />
                  <AdornedButton
                    adornment={<AddIcon />}
                    onClick={setIsSidebarOpen}
                  >
                    ADD A {customerTypeLabel}
                  </AdornedButton>
                </>
              )}
          </Box>
        </Box>
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
            refreshPatientList={refreshPatientList}
            step={1}
          />
        </Dialog>
      </Box>
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
