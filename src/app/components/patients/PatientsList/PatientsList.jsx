/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { lookupEMRPatient } from 'api/patient-api';
import SafariFixGrid from 'components/common/SafariFixGrid';
import { Grid } from '@material-ui/core';
import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import PatientListLoader from '../PatientsListLoader/PatientListLoader';
import EmptyPatientsList from '../EmptyPatientsList/EmptyPatientsList';
import EmptyFilteredPatientsList from '../EmptyFilteredPatientsList/EmptyFilteredPatientsList';
import { NonEmptyListTable } from './styled';

import { StyledDataGrid } from './DataGridStyles';

const PatientsList = ({
  patients,
  isFiltered,
  highlightedPatientIdentifier,
  patientImportDetails,
  refreshPatientList,
  importPopoverOpen,
  setImportPopoverOpen,
  hasImportErrors,
  isGuest,
  isFetching,
  onAddPatientClick,
  emrIntegrationEnabled,
}) => {
  const [importPopupOpen, setImportPopupOpen] = useState(false);
  const history = useHistory();

  const columns = [
    {
      field: 'patient',
      headerName: 'PATIENT',
      sortComparator: (v1, v2, parameters1, parameters2) => {
        if (
          parameters1.row.lastName?.toLowerCase() >
          parameters2.row.lastName?.toLowerCase()
        )
          return 1;
        if (
          parameters1.row.lastName?.toLowerCase() <
          parameters2.row.lastName?.toLowerCase()
        )
          return -1;

        return 0;
      },
      flex: 1,
      renderCell: ({ row }) => (
        <span
          onClick={async () => {
            const { fromEMR, patientIdentifier } = row;
            if (fromEMR) {
              const patient = await lookupEMRPatient(patientIdentifier);

              history.push(`/core/patient/${patient.patientIdentifier}`);
            } else {
              history.push(`/core/patient/${patientIdentifier}`);
            }
          }}
          className="patient-cell"
        >
          {row.lastName}, {row.firstName}
        </span>
      ),
    },
    {
      field: 'mrn',
      headerName: 'MRN',
      flex: 0.5,
    },
    {
      field: 'dob',
      headerName: 'DOB',
      flex: 0.5,
    },
    {
      field: 'age',
      headerName: 'AGE',
      flex: 0.5,
    },
    {
      field: 'gender',
      headerName: 'GENDER',
      flex: 0.5,
    },
  ];

  const formattedPatients = patients?.map(patient => ({
    id: patient?.patientIdentifier,
    ...patient,
  }));
  return (
    <>
      {isFetching ? (
        <PatientListLoader />
      ) : (
        <>
          {patients?.length > 0 ? (
            <SafariFixGrid container xs={12} item justify="center">
              <Grid item xs={8}>
                <NonEmptyListTable
                  listLength={patients?.length ?? 0}
                  highlightedPatientIdentifier={highlightedPatientIdentifier}
                >
                  <StyledDataGrid
                    columns={columns}
                    rows={formattedPatients}
                    rowHeight={35}
                    headerHeight={45}
                    hideFooter
                    hideFooterPagination
                    autoHeight
                    disableColumnMenu
                    disableSelectionOnClick
                  />
                </NonEmptyListTable>
              </Grid>
            </SafariFixGrid>
          ) : (
            <>
              {isFiltered || isGuest || emrIntegrationEnabled ? (
                <EmptyFilteredPatientsList />
              ) : (
                <>
                  <EmptyPatientsList
                    onAddPatientClick={onAddPatientClick}
                    importPopupOpen={importPopupOpen}
                    setImportPopupOpen={setImportPopupOpen}
                    setImportPopoverOpen={setImportPopoverOpen}
                    refreshPatientList={refreshPatientList}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
      {importPopoverOpen && (
        <PatientImportPopover
          closePopover={() => {
            setImportPopoverOpen(false);
          }}
          patientImportDetails={patientImportDetails}
          hasImportErrors={hasImportErrors}
        />
      )}
    </>
  );
};

export default PatientsList;
