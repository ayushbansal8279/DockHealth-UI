/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ascend, compose, propOr, sortWith, toLower } from 'ramda';
import * as ActionTypes from 'actions/action-types';
import { Grid } from '@mui/material';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { lookupEMRPatient } from 'api/patient-api';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDLabel,
} from 'helpers/customer-type-helper';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { usePatientListColumnsConfig } from 'context-api/patients-columns-config-context';
import { PatientColumn } from 'helpers/patient-list-helpers';

import { patientsListSelector } from 'selectors/patients-selectors';
import moment from 'moment';
import { formatPhoneNumber } from 'helpers/utility-functions';
import TaskItemBulkEdit from 'components/task/StandardTaskItem/TaskItemComponents/TaskItemBulkEdit';
import PatientImportPopover from '../PatientImportPopover/PatientImportPopover';
import EmptyFilteredPatientsList from '../EmptyFilteredPatientsList/EmptyFilteredPatientsList';
import {
  NonEmptyListTable,
  ListLoaderContainer,
  BulkContainer,
  Text,
  PatientCell,
} from './styled';
import { StyledDataGrid } from './DataGridStyles';

const renderColumnHeader = (props) => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <Tooltip placement="top" title={headerName}>
          <Text width={colDef.width - 35}>{headerName}</Text>
        </Tooltip>
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
  isFiltered = false,
  patients,
  patientImportDetails,
  importPopoverOpen,
  setImportPopoverOpen,
  hasImportErrors,
  isFetching,
  refreshPatients,
  isDynamicPatientList,
}) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDLabel(
    currentUser,
    currentOrganization,
  );

  const [dataGridSortModel, setDataGridSortModel] = useState();

  const selectedPatientsCount = patients?.filter((p) => p.isSelected).length;
  const patientsCount = patients?.length;
  const isListChecked =
    patientsCount &&
    selectedPatientsCount &&
    patientsCount === selectedPatientsCount;

  const patientsList = useSelector(patientsListSelector);

  const { columns: columnsData, setCurrentPatientList } =
    usePatientListColumnsConfig();

  const columnsDataSorted = useMemo(
    () =>
      sortWith(
        [
          ascend(propOr(0, 'sortIndex')),
          ascend(compose(toLower, propOr('', 'name'))),
        ],
        columnsData,
      ),
    [columnsData],
  );

  const formattedPatients = useMemo(
    () =>
      patients?.map((patient) => {
        const metaData = patient.patientMetaData?.map((pmd) => {
          return {
            key: pmd.customFieldIdentifier,
            value:
              pmd.displayName ||
              pmd.value ||
              pmd.displayNames?.sort().toString(),
          };
        });
        const patientDetails = {
          id: patient?.patientIdentifier || patient?.id || patient?.mrn,
          ...patient,
        };
        metaData?.forEach((element) => {
          patientDetails[element.key] = element.value;
        });
        return patientDetails;
      }),
    [patients],
  );

  useEffect(() => {
    return () => {
      dispatch({
        type: ActionTypes.UNSELECT_ALL_PATIENTS,
      });
    };
  }, [dispatch]);

  useEffect(() => {
    setCurrentPatientList(patientsList?.listDetails);
    setDataGridSortModel(null);
  }, [setCurrentPatientList, patientsList]);

  const setSelectedPatient = useCallback(
    (data) => {
      dispatch({
        type: ActionTypes.SET_SELECTED_PATIENT,
        identifier: data.patientIdentifier || data.id,
        isSelected: !data.isSelected,
      });
    },
    [dispatch],
  );

  // when the checkbox header is clicked
  const handleListSelect = useCallback(() => {
    dispatch({
      type: isListChecked
        ? ActionTypes.UNSELECT_ALL_PATIENTS
        : ActionTypes.SELECT_ALL_PATIENTS,
    });
  }, [dispatch, isListChecked]);

  const handleSortChange = useCallback(
    (sortModel) => {
      if (
        !dataGridSortModel ||
        sortModel.length === 0 ||
        dataGridSortModel[0]?.field !== sortModel[0]?.field ||
        dataGridSortModel[0]?.sort !== sortModel[0]?.sort
      ) {
        setDataGridSortModel(sortModel);

        if (sortModel.length > 0) {
          localStorage.setItem('PATIENT_LIST_SORT_COLUMN', sortModel[0]?.field);
          localStorage.setItem('PATIENT_LIST_SORT_ORDER', sortModel[0]?.sort);
        } else {
          localStorage.removeItem('PATIENT_LIST_SORT_COLUMN');
          localStorage.removeItem('PATIENT_LIST_SORT_ORDER');
        }
      }
    },
    [dataGridSortModel],
  );

  const columns = useMemo(
    () =>
      [
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
            <PatientCell
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
              <Tooltip
                placement="top"
                title={`${row.lastName}, ${row.firstName}`}
              >
                <Text width="180">
                  {row.lastName}, {row.firstName}
                </Text>
              </Tooltip>
            </PatientCell>
          ),
          width: 200,
          valueGetter: (parameters) => {
            return `${parameters.row.lastName || ''}, ${
              parameters.row.firstName || ''
            }`;
          },
        },
        {
          field: 'mrn',
          headerName: uniqueIdentifierLabel.toUpperCase(),
          renderHeader: renderColumnHeader,
          width: 100,
          renderCell: ({ row }) => (
            <Tooltip placement="top" title={row.mrn}>
              <Text width="80">{row.mrn}</Text>
            </Tooltip>
          ),
        },
        {
          field: 'dob',
          headerName: 'DOB',
          renderHeader: renderColumnHeader,
          width: 100,
          type: 'date',
          valueGetter: (parameters) => {
            return parameters.value
              ? new Date(`${parameters.value}T00:00:00`)
              : null;
          },
        },
        {
          field: 'age',
          headerName: 'AGE',
          renderHeader: renderColumnHeader,
          width: 70,
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
          headerName: 'SEX',
          renderHeader: renderColumnHeader,
          width: 80,
        },
        {
          field: 'genderIdentity',
          headerName: 'GENDER',
          renderHeader: renderColumnHeader,
          width: 100,
        },
        {
          field: 'email',
          headerName: 'EMAIL',
          renderHeader: renderColumnHeader,
          width: 140,
          renderCell: ({ row }) => (
            <Tooltip placement="top" title={row.email}>
              <Text width="120">{row.email}</Text>
            </Tooltip>
          ),
          align: 'left',
        },
        {
          field: 'phoneMobile',
          headerName: 'MOBILE',
          renderHeader: renderColumnHeader,
          renderCell: ({ row }) => (
            <Tooltip placement="top" title={formatPhoneNumber(row.phoneMobile)}>
              <Text width="120">{formatPhoneNumber(row.phoneMobile)}</Text>
            </Tooltip>
          ),
          width: 140,
        },
        {
          field: 'phoneHome',
          headerName: 'HOME',
          renderHeader: renderColumnHeader,
          renderCell: ({ row }) => (
            <Tooltip placement="top" title={formatPhoneNumber(row.phoneHome)}>
              <Text width="120">{formatPhoneNumber(row.phoneHome)}</Text>
            </Tooltip>
          ),
          width: 140,
        },
      ]
        .filter((column) => {
          return (
            columnsDataSorted.find(
              (data) =>
                PatientColumn[data.identifier] === column.field ||
                column.field === 'isSelected',
            )?.isChecked ?? false
          );
        })
        .concat(
          columnsDataSorted
            .filter(
              (column) => column.targetType === 'PATIENT' && column.isChecked,
            )
            .map((column) => ({
              field: column.identifier,
              headerName: column.name,
              renderHeader: renderColumnHeader,
              width: 140,
              renderCell: ({ row }) => (
                <Tooltip placement="top" title={row[column.identifier]}>
                  <Text width="120">{row[column.identifier]}</Text>
                </Tooltip>
              ),
              sortComparator: (v1, v2, parameters1, parameters2) => {
                const { api } = parameters2;
                const sortModel = api.getSortModel();
                const compareValue1 = v1 || '';
                const compareValue2 = v2 || '';
                // eslint-disable-next-line sonarjs/no-collapsible-if
                if (
                  column.fieldType === 'DATE' &&
                  compareValue1 !== '' &&
                  compareValue2 !== ''
                ) {
                  const parameter1Date = moment(compareValue1);
                  const parameter2Date = moment(compareValue2);
                  if (sortModel[0]?.sort === 'desc') {
                    if (parameter1Date.isAfter(parameter2Date)) {
                      return 1;
                    }
                    if (parameter1Date.isBefore(parameter2Date)) {
                      return -1;
                    }
                    return 0;
                  }
                  if (parameter1Date.isBefore(parameter2Date)) {
                    return -1;
                  }
                  if (parameter1Date.isAfter(parameter2Date)) {
                    return 1;
                  }
                  return 0;
                }
                return compareValue1.localeCompare(compareValue2);
              },
            })),
        ),
    [
      columnsDataSorted,
      customerTypeLabel,
      handleListSelect,
      history,
      isListChecked,
      pathname,
      setSelectedPatient,
      uniqueIdentifierLabel,
    ],
  );

  useEffect(() => {
    const defaultSortField = localStorage.getItem('PATIENT_LIST_SORT_COLUMN');
    const defaultSortOrder = localStorage.getItem('PATIENT_LIST_SORT_ORDER');

    const defaultSortAvailable = columns.find(
      (column) => column?.field === defaultSortField,
    );

    // set the model once on load
    if (!dataGridSortModel) {
      setDataGridSortModel(
        defaultSortAvailable
          ? [
              {
                field: defaultSortField,
                sort: defaultSortOrder,
              },
            ]
          : undefined,
      );
    }
  }, [columns, dataGridSortModel]);

  return (
    <>
      {isFetching ? (
        <ListLoaderContainer>
          <ListSkeletonLoader header />
        </ListLoaderContainer>
      ) : (
        <>
          {patients?.length > 0 && formattedPatients ? (
            <Grid container xs={12} item justifyContent="center">
              <Grid item xs={12} xl={11} md={12} lg={11}>
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
                    showColumnRightBorder
                    showCellRightBorder
                    onSortModelChange={handleSortChange}
                    sortModel={
                      dataGridSortModel &&
                      columns.some(
                        (column) =>
                          column?.field === dataGridSortModel[0]?.field,
                      )
                        ? dataGridSortModel
                        : undefined
                    }
                  />
                </NonEmptyListTable>
              </Grid>
            </Grid>
          ) : (
            <>
              {!isDynamicPatientList && (
                <EmptyFilteredPatientsList
                  isFiltered={isFiltered}
                  isFetching={isFetching}
                  refreshPatients={refreshPatients}
                />
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
