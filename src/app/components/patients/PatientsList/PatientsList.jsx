/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { lookupEMRPatient } from 'api/patient-api';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import EmptyFilteredPatientsList from '../EmptyFilteredPatientsList/EmptyFilteredPatientsList';
import { NonEmptyListTable, ListLoaderContainer } from './styled';
import { StyledDataGrid } from './DataGridStyles';

const renderColumnHeader = props => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <span>{headerName}</span>
      </div>
    </>
  );
};

const PatientsList = ({
  isFiltered,
  patients,
  patientImportDetails,
  importPopoverOpen,
  setImportPopoverOpen,
  hasImportErrors,
  isFetching,
}) => {
  const history = useHistory();
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);

  const columns = [
    {
      field: 'patient',
      headerName: customerTypeLabel.toUpperCase(),
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
      headerName: uniqueIdentifierLabel.toUpperCase(),
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
        <ListLoaderContainer>
          <ListSkeletonLoader header />
        </ListLoaderContainer>
      ) : (
        <>
          {patients?.length > 0 ? (
            <Grid container xs={12} item justify="center">
              <Grid item xs={12} xl={10} md={10} lg={10}>
                <NonEmptyListTable listLength={patients?.length ?? 0}>
                  <StyledDataGrid
                    columns={columns}
                    rows={formattedPatients}
                    rowHeight={35}
                    headerHeight={45}
                    hideFooterSelectedRowCount
                    autoHeight
                    disableColumnMenu
                    disableSelectionOnClick
                  />
                </NonEmptyListTable>
              </Grid>
            </Grid>
          ) : (
            <EmptyFilteredPatientsList isFiltered={isFiltered} />
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
