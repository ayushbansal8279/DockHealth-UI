import React, { useState, useRef } from 'react';
import { Dialog, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useBoolean } from 'hooks/useBoolean';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as PatientsActions from 'actions/patients-actions';
import { downloadPatientImportTemplate } from 'api/patient-api';
import { DefaultPatientsListType } from 'helpers/patient-list-helpers';
import { organizationSelector } from 'selectors/organization-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  currentPatientsListIdentifierSelector,
  patientsListSearchTermSelector,
  filtersActiveSelector,
} from 'selectors/patients-selectors';
import { createPatientDetailsPath } from 'routing/helpers/paths';
import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import FilterButton from 'components/filter/FilterButton/FilterButton';
import AdornedButton from 'components/common/AdornedButton/AdornedButton';
import SearchInput from 'components/common/SearchInput/SearchInput';
import FilterPopover from 'components/filter/FilterPopover/FilterPopover';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import CreatePatientDrawer from '../CreatePatientDrawer/CreatePatientDrawer';
import { ImportButton, InputWrapper, SearchHelperText } from './styled';
import PatientsFilter from '../PatientsFilter/PatientsFilter';

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

  const isGuest = orgUserRole === 'GUEST';

  const [importPopupOpen, setImportPopupOpen] = useState(false);

  const handleSearchChange = searchTerm => {
    dispatch(PatientsActions.changePatientsSearchTerm(searchTerm));
  };

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
            <FilterButton
              ref={filterButtonReference}
              active={filtersActive}
              onClick={toggleFilter}
              onClear={() => dispatch(PatientsActions.clearPatientsFilters())}
            />
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
