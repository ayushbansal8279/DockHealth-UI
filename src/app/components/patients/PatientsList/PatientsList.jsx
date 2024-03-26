/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ascend, compose, propOr, sortWith, toLower } from 'ramda';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import pick from 'ramda/src/pick';
import {
  GridRowModes,
  GridActionsCellItem,
  useGridApiRef,
  GridRowEditStopReasons,
} from '@mui/x-data-grid-premium';
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
import palette from 'styles/palette';
import { formatPhoneNumber } from 'helpers/utility-functions';
import { dateFormatter } from 'helpers/date-formatter';
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
import FullNameEditCell, {
  setFullName,
  preProcessFullNameEditCellProps,
  getFullName,
} from '@/app/components/common/DataGridEditCells/FullNameEditCell';
import DateEditCell from '@/app/components/common/DataGridEditCells/DateEditCell';
import GenderSelectCell from '@/app/components/common/DataGridEditCells/GenderSelectCell';
import PhoneEditCell, {
  preProcessPhoneEditCellProps,
} from '@/app/components/common/DataGridEditCells/PhoneEditCell';
import { useGenderIdentitiesQuery } from '@/app/react-query/reference/useGenderIdentitiesQuery';
import {
  GENDER_OPTIONS_BIRTH,
  convertGenderIdentitiesToSelectOptions,
} from '@/app/types/gender';
import { getValueLabelHashFromOptions } from '@/app/helpers/select-option-helper';
import { useUpdatePatientById } from '@/app/react-query/patients/useUpdatePatientById';

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

const handleRowEditStop = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
  }
};

const genderBirthOptionHash =
  getValueLabelHashFromOptions(GENDER_OPTIONS_BIRTH);

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
  searchValue,
}) => {
  const updatePatientById = useUpdatePatientById();
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
  const genderIdentityOptionsQuery = useGenderIdentitiesQuery();

  const { columns: columnsData, setCurrentPatientList } =
    usePatientListColumnsConfig();

  // datagrid related states
  const apiRef = useGridApiRef();
  const [rowModesModel, setRowModesModel] = useState({});

  const genderIdentityOptions = useMemo(
    () =>
      convertGenderIdentitiesToSelectOptions(
        genderIdentityOptionsQuery.data ?? [],
      ),
    [genderIdentityOptionsQuery.data],
  );

  const genderIdentityOptionsHash = useMemo(
    () => getValueLabelHashFromOptions(genderIdentityOptions),
    [genderIdentityOptions],
  );

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

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = async (newRow, oldRow) => {
    try {
      const params = pick(
        [
          'patientIdentifier',
          'firstName',
          'middleName',
          'lastName',
          'gender',
          'genderIdentity',
          'dob',
          'mrn',
          'phoneMobile',
          'phoneHome',
        ],
        newRow,
      );
      // params.dob =
      await updatePatientById.mutateAsync(params);

      return newRow;
    } catch (error) {
      console.error('processRowUpdate error', error);
      return oldRow;
    }
  };

  const defaultColumns = [
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
          <Tooltip placement="top" title={`${row.lastName}, ${row.firstName}`}>
            <Text width="180">
              {row.lastName}, {row.firstName}
            </Text>
          </Tooltip>
        </PatientCell>
      ),
      width: 200,
      valueGetter: getFullName,
      valueSetter: setFullName,
      editable: true,
      preProcessEditCellProps: preProcessFullNameEditCellProps,
      renderEditCell: (params) => <FullNameEditCell {...params} />,
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
      editable: true,
    },
    {
      field: 'dob',
      headerName: 'DOB',
      renderHeader: renderColumnHeader,
      width: 150,
      valueGetter: ({ value }) => dateFormatter(value, 'M/d/yyyy'),
      valueSetter: ({ value, row }) => ({
        ...row,
        dob: dateFormatter(value, 'yyyy-MM-dd'),
      }),
      editable: true,
      renderEditCell: (params) => <DateEditCell {...params} />,
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
      width: 100,
      valueFormatter: ({ value }) => genderBirthOptionHash[value],
      editable: true,
      renderEditCell: (params) => (
        <GenderSelectCell options={GENDER_OPTIONS_BIRTH} {...params} />
      ),
    },
    {
      field: 'genderIdentity',
      headerName: 'GENDER',
      renderHeader: renderColumnHeader,
      width: 150,
      valueFormatter: ({ value }) => genderIdentityOptionsHash[value],
      editable: true,
      renderEditCell: (params) => (
        <GenderSelectCell options={genderIdentityOptions} {...params} />
      ),
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
      editable: true,
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
      editable: true,
      preProcessEditCellProps: preProcessPhoneEditCellProps,
      renderEditCell: (params) => <PhoneEditCell {...params} />,
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
      editable: true,
      preProcessEditCellProps: preProcessPhoneEditCellProps,
      renderEditCell: (params) => <PhoneEditCell {...params} />,
    },
  ];

  const actionsColumn = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 80,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon sx={{ color: palette.lightBlue }} />}
            label="Save"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CloseIcon sx={{ color: palette.unknownGrey1 }} />}
            label="Cancel"
            onClick={handleCancelClick(id)}
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon sx={{ color: palette.lightBlue }} />}
          label="Edit"
          onClick={handleEditClick(id)}
        />,
      ];
    },
  };

  const columns = defaultColumns
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
        .filter((column) => column.targetType === 'PATIENT' && column.isChecked)
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
    )
    .concat([actionsColumn]);

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
                    apiRef={apiRef}
                    getRowId={(row) => row.patientIdentifier}
                    columns={columns}
                    editMode="row"
                    rows={formattedPatients}
                    headerHeight={45}
                    getRowHeight={() => 'auto'}
                    hideFooterSelectedRowCount
                    disableColumnMenu
                    disableSelectionOnClick
                    showColumnRightBorder
                    showCellRightBorder
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    onSortModelChange={handleSortChange}
                    processRowUpdate={processRowUpdate}
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
                  searchValue={searchValue}
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
