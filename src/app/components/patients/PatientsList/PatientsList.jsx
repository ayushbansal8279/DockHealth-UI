/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { lookupEMRPatient } from 'api/patient-api';
import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import PatientListLoader from '../PatientsListLoader/PatientListLoader';
import EmptyPatientsList from '../EmptyPatientsList/EmptyPatientsList';
import EmptyFilteredPatientsList from '../EmptyFilteredPatientsList/EmptyFilteredPatientsList';
import { NonEmptyListTable } from './styled';
import { StyledDataGrid } from './DataGridStyles';

const renderColumnHeader = props => {
  const { colDef, api, field } = props;
  const { headerName } = colDef;
  const { sorting } = api.getState();
  const { sortModel } = sorting;
  const showArrowPlaceholder =
    sortModel.length === 0 || sortModel[0].field !== field;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <span>{headerName}</span>
      </div>
      {showArrowPlaceholder && (
        <IconButton className="Sorting-Arrow" size="small">
          <ArrowUpwardIcon fontSize="inherit" />
        </IconButton>
      )}
    </>
  );
};

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
      renderHeader: renderColumnHeader,
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
      flex: 1,
      sortComparator: (v1, v2, parameters1, parameters2) => {
        if (
          parameters1.row.lastName?.toLowerCase() ===
          parameters2.row.lastName?.toLowerCase()
        ) {
          if (
            parameters1.row.firstName?.toLowerCase() >
            parameters2.row.firstName?.toLowerCase()
          )
            return 1;
          if (
            parameters1.row.firstName?.toLowerCase() <
            parameters2.row.firstName?.toLowerCase()
          )
            return -1;
        }

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
    },
    {
      field: 'mrn',
      headerName: 'MRN',
      renderHeader: renderColumnHeader,
      flex: 0.5,
      sortComparator: (v1, v2, parameters1, parameters2) => {
        const { api } = parameters2;
        const sortModel = api.getSortModel();

        if (parameters1.row.mrn === parameters2.row.mrn) {
          return 0;
        }

        if (sortModel[0]?.sort === 'asc' && sortModel[0]?.field === 'mrn') {
          // !IMPORTANT it is descending - MaterialUI has problem with passing correctly current order
          if (parameters1.row.mrn === null || parameters1.row.mrn === '') {
            return -1;
          }

          if (parameters2.row.mrn === null || parameters2.row.mrn === '') {
            return 1;
          }

          return parameters2.row.mrn < parameters1.row.mrn ? 1 : -1;
        }

        // !IMPORTANT it is ascending - MaterialUI has problem with passing correctly current order
        if (parameters1.row.mrn === null || parameters1.row.mrn === '') {
          return 1;
        }

        if (parameters2.row.mrn === null || parameters2.row.mrn === '') {
          return -1;
        }

        return parameters1.row.mrn < parameters2.row.mrn ? -1 : 1;
      },
    },
    {
      field: 'dob',
      headerName: 'DOB',
      renderHeader: renderColumnHeader,
      flex: 0.5,
      sortComparator: (v1, v2, parameters1, parameters2) => {
        const { api } = parameters2;
        const sortModel = api.getSortModel();

        if (parameters1.row.dob === parameters2.row.dob) {
          return 0;
        }

        if (sortModel[0]?.sort === 'asc' && sortModel[0]?.field === 'dob') {
          // !IMPORTANT it is descending - MaterialUI has problem with passing correctly current order
          if (parameters1.row.dob === null || parameters1.row.dob === '') {
            return -1;
          }

          if (parameters2.row.dob === null || parameters2.row.dob === '') {
            return 1;
          }

          return parameters2.row.dob < parameters1.row.dob ? 1 : -1;
        }

        // !IMPORTANT it is ascending - MaterialUI has problem with passing correctly current order
        if (parameters1.row.dob === null || parameters1.row.dob === '') {
          return 1;
        }

        if (parameters2.row.dob === null || parameters2.row.dob === '') {
          return -1;
        }

        return parameters1.row.dob < parameters2.row.dob ? -1 : 1;
      },
    },
    {
      field: 'age',
      headerName: 'AGE',
      renderHeader: renderColumnHeader,
      flex: 0.5,
      sortComparator: (v1, v2, parameters1, parameters2) => {
        const { api } = parameters2;
        const sortModel = api.getSortModel();

        if (parameters1.row.dob === parameters2.row.dob) {
          return 0;
        }

        if (sortModel[0]?.sort === 'asc' && sortModel[0]?.field === 'age') {
          // !IMPORTANT it is descending - MaterialUI has problem with passing correctly current order
          if (parameters1.row.dob === null || parameters1.row.dob === '') {
            return -1;
          }

          if (parameters2.row.dob === null || parameters2.row.dob === '') {
            return 1;
          }

          return parameters2.row.dob < parameters1.row.dob ? -1 : 1;
        }

        // !IMPORTANT it is ascending - MaterialUI has problem with passing correctly current order
        if (parameters1.row.dob === null || parameters1.row.dob === '') {
          return 1;
        }

        if (parameters2.row.dob === null || parameters2.row.dob === '') {
          return -1;
        }

        return parameters1.row.dob < parameters2.row.dob ? 1 : -1;
      },
    },
    {
      field: 'gender',
      headerName: 'GENDER',
      renderHeader: renderColumnHeader,
      flex: 0.5,
      sortComparator: (v1, v2, parameters1, parameters2) => {
        const { api } = parameters2;
        const sortModel = api.getSortModel();

        if (
          parameters1.row.gender?.toLowerCase() ===
          parameters2.row.gender?.toLowerCase()
        ) {
          return 0;
        }

        if (sortModel[0]?.sort === 'asc' && sortModel[0]?.field === 'gender') {
          // !IMPORTANT it is descending - MaterialUI has problem with passing correctly current order
          if (
            parameters1.row.gender === null ||
            parameters1.row.gender === ''
          ) {
            return -1;
          }

          if (
            parameters2.row.gender === null ||
            parameters2.row.gender === ''
          ) {
            return 1;
          }

          return parameters2.row.gender?.toLowerCase() <
            parameters1.row.gender?.toLowerCase()
            ? 1
            : -1;
        }

        // !IMPORTANT it is ascending - MaterialUI has problem with passing correctly current order
        if (parameters1.row.gender === null || parameters1.row.gender === '') {
          return 1;
        }

        if (parameters2.row.gender === null || parameters2.row.gender === '') {
          return -1;
        }

        return parameters1.row.gender?.toLowerCase() <
          parameters2.row.gender?.toLowerCase()
          ? -1
          : 1;
      },
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
            <Grid container xs={12} item justify="center">
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
            </Grid>
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
