import { Grid, Dialog } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import {
  beginPatientCreation,
  loading,
  downloadPatientImportTemplate,
} from 'actions/patient-actions';

import styled from 'styled-components';
import Button from 'components/common/Button/Button';
import Search from 'components/taskView/Search/Search';
import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import AdornedButton from '../common/AdornedButton';
import PageContentHeader from '../common/PageContentHeader';
import Spacing from '../common/Spacing';
import PatientsFilter from './PatientsFilter';

const StyledButton = styled(Button)`
  && {
  }
`;

const ImportPatientsButtonWrapper = styled.div`
  width: 550px;
`;

const ALL_PATIENTS = 'ALL_PATIENTS';
const MY_PATIENTS = 'MY_PATIENTS';
const MY_PATIENTS_WITH_ACTIVE_TASKS = 'MY_PATIENTS_WITH_ACTIVE_TASKS';

const stopPropagation = event => {
  event.stopPropagation();
};

const PatientsToolbarFilter = ({ handlePatientFilter, deselectPatient }) => {
  const [filter, setFilter] = useState(ALL_PATIENTS);
  const dispatch = useDispatch();
  const handleFilterChange = useCallback(
    event => {
      const { value } = event.target;
      dispatch(loading());
      setFilter(value);
      handlePatientFilter(value);
      deselectPatient();
    },
    [deselectPatient, dispatch, handlePatientFilter],
  );

  useMount(() => {
    handleFilterChange({ target: { value: filter } });
  });

  return (
    <PatientsFilter
      stopPropagation={stopPropagation}
      onChange={handleFilterChange}
      value={filter}
      options={[
        {
          value: ALL_PATIENTS,
          description: 'All patients',
        },
        {
          value: MY_PATIENTS,
          description: 'My patients',
        },
        {
          value: MY_PATIENTS_WITH_ACTIVE_TASKS,
          description: 'My patients with active tasks',
        },
      ]}
    />
  );
};

const PatientsToolbar = ({
  deselectPatient,
  handleSearch,
  handlePatientFilter,
  hasPatients,
  refreshPatientList,
  setImportPopoverOpen,
  isGuest,
  currentOrganization,
}) => {
  const dispatch = useDispatch();

  const [importPopupOpen, setImportPopupOpen] = useState(false);

  const onAddPatientClick = useCallback(() => {
    dispatch(beginPatientCreation());
  }, [dispatch]);

  return (
    <PageContentHeader onClick={deselectPatient}>
      <Grid container alignItems="center" wrap="nowrap">
        <PatientsToolbarFilter
          handlePatientFilter={handlePatientFilter}
          deselectPatient={deselectPatient}
        />
        <Spacing horizontal={4} />
        <Search onChange={handleSearch} />
      </Grid>
      {hasPatients && !isGuest && !currentOrganization.emrIntegrationEnabled && (
        <>
          <ImportPatientsButtonWrapper>
            <StyledButton
              variant="contained"
              onClick={() => {
                setImportPopupOpen(true);
              }}
            >
              IMPORT PATIENTS FROM EXCEL
            </StyledButton>
          </ImportPatientsButtonWrapper>
          <AdornedButton adornment={<AddIcon />} onClick={onAddPatientClick}>
            ADD A PATIENT
          </AdornedButton>
        </>
      )}
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
    </PageContentHeader>
  );
};

export default PatientsToolbar;
