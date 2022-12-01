/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as ActionTypes from 'actions/action-types';
import { Grid } from '@material-ui/core';
import { lookupEMRPatient } from 'api/patient-api';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { userProfileSelector } from 'selectors/user-selectors';
import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import TaskItemBulkEdit from '../../task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit';
import EmptyFilteredPatientsList from '../EmptyFilteredPatientsList/EmptyFilteredPatientsList';
import {
  NonEmptyListTable,
  ListLoaderContainer,
  BulkContainer,
} from './styled';
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

const renderCheckboxColumnHeader = ({ isListChecked, onListSelect }) => (
  <BulkContainer>
    <Checkbox isChecked={isListChecked} onClick={onListSelect} />
  </BulkContainer>
);

const PatientsList = ({
  isFiltered,
  patients,
  patientImportDetails,
  importPopoverOpen,
  setImportPopoverOpen,
  hasImportErrors,
  isFetching,
}) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(currentUser);

  const selectedPatientsCount = patients?.filter(p => p.isSelected).length;
  const patientsCount = patients?.length;
  const isListChecked =
    patientsCount &&
    selectedPatientsCount &&
    patientsCount === selectedPatientsCount;

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

  const handleListSelect = useCallback(() => {
    dispatch({
      type: isListChecked
        ? ActionTypes.UNSELECT_ALL_PATIENTS
        : ActionTypes.SELECT_ALL_PATIENTS,
    });
  }, [dispatch, isListChecked]);

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
      sortable: false,
      renderHeader: () =>
        renderCheckboxColumnHeader({
          isListChecked,
          onListSelect: handleListSelect,
        }),
      renderCell: ({ row }) => (
        <span>
          <TaskItemBulkEdit
            isChecked={row?.isSelected}
            onClick={() => setSelectedPatient(row)}
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

              history.push({
                pathname: `/core/patient/${patient.patientIdentifier}`,
                state: {
                  from: pathname,
                },
              });
            } else {
              history.push({
                pathname: `/core/patient/${patientIdentifier}`,
                state: {
                  from: pathname,
                },
              });
            }
          }}
          className="patient-cell"
        >
          {row.lastName}, {row.firstName}
        </span>
      ),
      flex: 1,
      valueGetter: parameters => {
        return `${parameters.row.lastName || ''}, ${parameters.row.firstName ||
          ''}`;
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
      headerName: 'GENDER AT BIRTH',
      renderHeader: renderColumnHeader,
      flex: 0.5,
    },
    {
      field: 'genderIdentity',
      headerName: 'GENDER IDENTIFY',
      renderHeader: renderColumnHeader,
      flex: 0.5,
    },
  ];
  const formattedPatients = patients?.map(patient => ({
    id: patient?.patientIdentifier || patient?.id || patient?.mrn,
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
          {patients?.length > 0 && formattedPatients ? (
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
