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
import * as PatientsActions from 'actions/patients-actions';
import { Grid, Link } from '@mui/material';
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
import { patientHeaderMap, PatientColumn } from 'helpers/patient-list-helpers';

import { patientsListSelector } from 'selectors/patients-selectors';
import moment from 'moment';
import palette from 'styles/palette';
import { formatPhoneNumber, showToast } from 'helpers/utility-functions';
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
import { closeModal, openModal } from '@/app/modal/actions';
import DropDownEditCell from '../../common/DataGridEditCells/DropDownEditCell';
import TextEditCell from '../../common/DataGridEditCells/TextEditCell';
import BooleanEditCell from '../../common/DataGridEditCells/BooleanEditCell';
import MultiDropdownEditCell from '../../common/DataGridEditCells/MultiDropDownEditCell';
import NumberEditCell from '../../common/DataGridEditCells/NumberEditCell';
import DateTimeEditCell from '../../common/DataGridEditCells/DateTimeEditCell';
import CustomFieldLongTextEditor from '../../common/DataGridEditCells/CustomFieldLongTextEditor';

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
  const [pinnedColumns, setPinnedColumns] = useState({
    left: ['isSelected', 'patient'],
    right: ['actions']
  });

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

  const pinnedColumnsStart = ["isSelected", "PATIENT"];
  const pinnedColumnsEnd = ["actions"];

  const [columnOrder, setColumnOrder] = useState([]);

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
    if (patientsList?.listDetails?.listDisplayColumns) {
      const filteredOrder = patientsList.listDetails.listDisplayColumns.filter(
        (col) => !pinnedColumnsStart.includes(col)
      );

      setColumnOrder([...pinnedColumnsStart, ...filteredOrder, ...pinnedColumnsEnd]);
    }
  }, [patientsList]);

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

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel],
  );

  const handleSaveClick = useCallback(
    (id) => () => {
      confirmSave(id);
    },
    [confirmSave],
  );

  const handleCancelClick = useCallback(
    (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    },
    [rowModesModel],
  );

  const handleRowModesModelChange = useCallback((newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }, []);

  function calculateAge(dob) {
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const processRowUpdate = useCallback(
    async (newRow, oldRow) => {
      try {
        const customColumnIdentifiers = columnsDataSorted
          .filter((column) => column.targetType === 'PATIENT' && column.isChecked)
          .map((column) => column.identifier);

        const updatedMetaData = [...(oldRow.patientMetaData || [])];

        customColumnIdentifiers.forEach((identifier) => {
          if (newRow[identifier] !== undefined) {
            const index = updatedMetaData.findIndex(
              (meta) => meta.customFieldIdentifier === identifier
            );

            if (index !== -1) {
              updatedMetaData[index].value = newRow[identifier];
              if (typeof newRow[identifier] === 'object') {
                updatedMetaData[index].values = updatedMetaData[index].value.values;
                delete updatedMetaData[index].value;
              }
            } else {
              if (typeof newRow[identifier] === 'object' && newRow[identifier] !== null && 'values' in newRow[identifier]) {
                updatedMetaData.push({
                  customFieldIdentifier: identifier,
                  values: newRow[identifier].values,
                });
              } else {
                updatedMetaData.push({
                  customFieldIdentifier: identifier,
                  value: newRow[identifier],
                });
              }
            }
          }
        });

        newRow.patientMetaData = updatedMetaData;

        if (newRow.dob) {
          newRow.dob = moment(newRow.dob).format('MM/DD/YYYY')
        }
        else {
          newRow.dob = null;
        }

        await updatePatientById.mutateAsync(newRow);

        showToast({
          status: 'success',
          title: 'Updated successfully',
        });
        return newRow;
      } catch (error) {
        console.error('processRowUpdate error', error);
        return oldRow;
      }
    },
    [updatePatientById],
  );

  const handlePinnedColumnsChange = useCallback((updatedPinnedColumns) => {
    setPinnedColumns(updatedPinnedColumns);
  }, []);

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
      editable: false,
      preProcessEditCellProps: preProcessFullNameEditCellProps,
      renderEditCell: (params) => <FullNameEditCell {...params} />,
    },
    {
      field: 'mrn',
      headerName: uniqueIdentifierLabel.toUpperCase(),
      // renderHeader: renderColumnHeader,
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
      valueGetter: ({ value }) => value ? moment(value).format('MM/DD/YYYY') : '',
      valueSetter: ({ value, row }) => {
        const formattedDate = value ? moment(value).format('MM/DD/YYYY') : null;
        return { ...row, dob: formattedDate };
      },
      sortComparator: (v1, v2) => {
        const date1 = new Date(v1);
        const date2 = new Date(v2);

        if (!date1 || isNaN(date1)) return 1;
        if (!date2 || isNaN(date2)) return -1;

        return date1 - date2;
      },
      editable: true,
      renderEditCell: (params) => <DateEditCell {...params} />,
    },
    {
      field: 'age',
      headerName: 'AGE',
      renderHeader: renderColumnHeader,
      width: 70,
      sortComparator: (_v1, _v2, parameters1, parameters2) => {
        const dob1 = parameters1.api.getCellValue(parameters1.id, 'dob');
        const dob2 = parameters2.api.getCellValue(parameters2.id, 'dob');

        if (!dob1) return 1;
        if (!dob2) return -1;

        const age1 = calculateAge(new Date(dob1));
        const age2 = calculateAge(new Date(dob2));

        return age1 - age2;
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
          <Text>{row.email}</Text>
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
          <Text>{formatPhoneNumber(row.phoneMobile)}</Text>
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
          <Text>{formatPhoneNumber(row.phoneHome)}</Text>
        </Tooltip>
      ),
      width: 140,
      editable: true,
      preProcessEditCellProps: preProcessPhoneEditCellProps,
      renderEditCell: (params) => <PhoneEditCell {...params} />,
    },
  ];

  function confirmSave(id) {
    dispatch(
      openModal('SavePatient', {
        description: 'Are you sure you want to save these changes?',
        confirm: () => {
          setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: false },
          });
          dispatch(closeModal());
        },
        onClose: () => {
          dispatch(closeModal());
        },
      }),
    );
  }

  const getRenderEditCell = (fieldType, options = [], name) => {
    switch (fieldType) {
      case 'PICK_LIST':
        return (params) => <DropDownEditCell {...params} options={options} name={name} />;
      case 'MULTI_SELECT':
        return (params) => <MultiDropdownEditCell {...params} options={options} name={name} />;
      case 'DATE':
        return (params) => <DateTimeEditCell {...params} />;
      case 'LONG_TEXT':
        return (params) => <CustomFieldLongTextEditor {...params} name={name} />;
      case 'TEXT':
      case 'HYPERLINK':
        return (params) => <TextEditCell {...params} name={name} />;
      case 'BOOLEAN':
        return (params) => <BooleanEditCell {...params} name={name} />;
      case 'NUMBER':
        return (params) => <NumberEditCell {...params} name={name} />;
      default:
        return null;
    }
  };

  const getColumnWidth = (fieldType) => {
    switch (fieldType) {
      case 'PICK_LIST':
        return 150;
      case 'MULTI_SELECT':
        return 300;
      case 'DATE':
        return 150;
      case 'TEXT':
        return 150;
      case 'LONG_TEXT':
        return 150;
      case 'HYPERLINK':
        return 150;
      case 'BOOLEAN':
        return 120;
      case 'NUMBER':
        return 200;
      default:
        return 100;
    }
  };

  const actionsColumn = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
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
          renderCell: (params) => {
            const { row } = params;
            if (column.fieldType === 'HYPERLINK') {
              const link = row[column.identifier]
              return (
                <Tooltip placement="top" title={row[column.identifier]}>
                  <Link
                    href={link?.startsWith('http') ? link : `//${link}`}
                    target="_blank"
                    sx={{
                      color: palette.blueOcean,
                      fontFamily: 'Outfit',
                      textDecoration: 'none',
                      '&:hover': {
                        color: palette.brightBlue,
                      },
                    }}
                  >
                    {link}
                  </Link>
                </Tooltip>
              );
            }
            if (column.fieldType === 'DATE') {
              return (<DateTimeEditCell {...params} readOnly />)
            }
            else {
              let displayValue = row[column.identifier];

              if (column.fieldType === 'MULTI_SELECT') {
                if (typeof displayValue === 'object' && displayValue !== null) {
                  displayValue = row[column.identifier].value
                }
              }
              else if (column.fieldType === 'PICK_LIST') {
                const selectedOption = column.options?.find(option => option.identifier === displayValue);
                displayValue = selectedOption ? selectedOption.name : displayValue;
              }

              return (
                <Tooltip placement="top" title={displayValue}>
                  <Text>{displayValue}</Text>
                </Tooltip>
              );
            }
          },
          editable: true,
          renderEditCell: getRenderEditCell(column.fieldType, column.options, column.name),
          width: getColumnWidth(column.fieldType, column),
          sortComparator: (v1, v2, parameters1, parameters2) => {
            const { api } = parameters2;
            const sortModel = api.getSortModel();
            const compareValue1 = v1 || '';
            const compareValue2 = v2 || '';
            // eslint-disable-next-line sonarjs/no-collapsible-if
            if (column.fieldType === 'NUMBER') {
              return Number(compareValue1) - Number(compareValue2);
            }
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

  const orderedColumns = columnOrder
    ?.map((field) =>
      columns.find(
        (col) =>
          col.field?.toUpperCase() === field?.toUpperCase() ||
        col.headerName === (patientHeaderMap[field] || field || ''),
      )
    )
    .filter(Boolean);

  const pinnedColumnsAtEnd = pinnedColumnsEnd
    ?.map((field) =>
      columns.find((col) => col.field === field || col.headerName === field)
    )
    .filter(Boolean);

  if (pinnedColumnsAtEnd.length) {
    orderedColumns.push(...pinnedColumnsAtEnd);
  }

  const handleColumnOrderChange = ({ column, oldIndex, targetIndex }) => {
    setColumnOrder((prevOrder) => {
      const newOrder = [...prevOrder];

      if (pinnedColumnsStart.includes(newOrder[oldIndex])) return prevOrder;

      const movedColumn = newOrder.splice(oldIndex, 1)[0];
      newOrder.splice(targetIndex, 0, movedColumn);

      const setup = newOrder.filter(
        (item) => !pinnedColumnsStart.includes(item) && !pinnedColumnsEnd.includes(item)
      );

      dispatch(PatientsActions.updatePatientsListPreferences({
        patientListIdentifier: patientsList?.listDetails?.patientListIdentifier,
        setup: {listDisplayColumns: setup}
      }))

      return newOrder;
    });
  };

  return (
    <>
      {isFetching ? (
        <ListLoaderContainer>
          <ListSkeletonLoader header />
        </ListLoaderContainer>
      ) : (
        <>
          {patients?.length > 0 && formattedPatients ? (
            <Grid container xs={12} item justifyContent="center" >
              <Grid item xs={12} xl={11} md={12} lg={11} >
                <NonEmptyListTable listLength={patients?.length ?? 0}>
                  <StyledDataGrid
                    apiRef={apiRef}
                    getRowId={(row) => row.patientIdentifier}
                    columns={orderedColumns}
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
                    pinnedColumns={pinnedColumns}
                    onPinnedColumnsChange={handlePinnedColumnsChange}
                    onColumnOrderChange={handleColumnOrderChange}
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
