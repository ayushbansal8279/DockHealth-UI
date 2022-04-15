/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as ActionTypes from 'actions/action-types';
import { Grid } from '@material-ui/core';
import { lookupEMRPatient } from 'api/patient-api';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import { selectedPatientsSelector } from 'selectors/patients-selectors';
import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import TaskItemBulkEdit from '../../task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit';
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
  const dispatch = useDispatch();
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);
  const customPatientsList = useSelector(selectedPatientsSelector);
  const currentPatients = customPatientsList || patients;

  const setSelectedPatient = useCallback(
    data => {
      dispatch({
        type: ActionTypes.SET_SELECTED_PATIENT,
        identifier: data.patientIdentifier || data.id,
        isSelected: !data.isSelected,
      });
    },
    [dispatch],
  );

  useEffect(() => {
    return () => {
      dispatch({
        type: ActionTypes.UNSELECT_ALL_PATIENTS,
      });
    };
  }, [dispatch]);

  const columns = [
    {
      field: 'isSelected',
      headerName: '',
      renderHeader: renderColumnHeader,
      renderCell: ({ row }) => (
        <span>
          <TaskItemBulkEdit
            isChecked={row?.isSelected}
            onClick={() => setSelectedPatient(row)}
            isHovered
          />
        </span>
      ),
      width: 40,
    },
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
      valueGetter: parameters => {
        return `${parameters.getValue(parameters.id, 'lastName') ||
          ''}, ${parameters.getValue(parameters.id, 'firstName') || ''}`;
      },
    },
    {
      field: 'mrn',
      headerName: uniqueIdentifierLabel.toUpperCase(),
      renderHeader: renderColumnHeader,
      flex: 0.5,
    },
    {
      field: 'dob',
      headerName: 'DOB',
      renderHeader: renderColumnHeader,
      flex: 0.5,
      type: 'date',
      valueGetter: parameters => {
        return parameters.value
          ? new Date(`${parameters.value}T00:00:00`)
          : null;
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
        const dob1 = parameters1.api.getCellValue(parameters1.id, 'dob');
        const dob2 = parameters2.api.getCellValue(parameters2.id, 'dob');

        if (dob1 === dob2) {
          return 0;
        }

        if (sortModel[0]?.sort === 'asc' && sortModel[0]?.field === 'age') {
          // !IMPORTANT it is descending - MaterialUI has problem with passing correctly current order
          if (dob1 === null || dob1 === '') {
            return -1;
          }

          if (dob2 === null || dob2 === '') {
            return 1;
          }

          return dob2 < dob1 ? -1 : 1;
        }

        // !IMPORTANT it is ascending - MaterialUI has problem with passing correctly current order
        if (dob1 === null || dob1 === '') {
          return 1;
        }

        if (dob2 === null || dob2 === '') {
          return -1;
        }

        return dob1 < dob2 ? 1 : -1;
      },
    },
    {
      field: 'gender',
      headerName: 'GENDER',
      renderHeader: renderColumnHeader,
      flex: 0.5,
    },
  ];
  const formattedPatients = currentPatients?.map(patient => ({
    id: patient?.patientIdentifier || patient?.id,
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
          {currentPatients?.length > 0 && formattedPatients ? (
            <Grid container xs={12} item justify="center">
              <Grid item xs={12} xl={10} md={10} lg={10}>
                <NonEmptyListTable listLength={currentPatients?.length ?? 0}>
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
