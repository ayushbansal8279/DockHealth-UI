import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TASK_ITEM_BASE_COLUMN_CONFIG } from 'helpers/task-helpers';
import { useDispatch, useSelector } from 'react-redux';
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import {
  userPreferencesSelector,
  OrganizationWidthFieldsPreferencesSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import { updateListPreferences } from 'actions/task-list-actions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import { TaskHeaderColumn } from 'components/tasklist/TasksHeader/helpers';
import {
  getAllPatientCustomFields,
  getAllTaskListCustomFields,
} from '../api/custom-fields-api';
import {
  getInitialColumnWidth,
  translateInitialColumnsConfig,
  translateStateToApi,
  translateWidthToApi,
} from './helpers';

export const ColumnsConfigContext = createContext();

const columnsAlwaysVisible = [
  TaskHeaderColumn.DESCRIPTION,
  TaskHeaderColumn.SUBTASKS_COUNT,
];

export function ColumnsConfigProvider({
  children,
  initialColumns = TASK_ITEM_BASE_COLUMN_CONFIG,
  hideCustomColumns,
  hidePatientCustomColumns,
}) {
  const dispatch = useDispatch();

  const { userIdentifier } = useSelector(userProfileSelector);

  const [currentList, setCurrentList] = useState(null);
  const [patientCustomColumns, setPatientCustomColumns] = useState([]);
  const [taskListCustomColumns, setTaskListCustomColumns] = useState([]);
  const [columns, setColumnsToState] = useState([]);
  const [viewSpecificConfig, setViewSpecificConfig] = useState(initialColumns);
  const [hasWidthPreferences, setHasWidthPreferences] = useState(false);

  const organizationCustomFields = useSelector(
    organizationCustomFieldsSelector,
  );
  const OrganizationCustomFieldsPreferences = useSelector(
    userPreferencesSelector,
  );
  const OrganizationWidthFieldsPreferences = useSelector(
    OrganizationWidthFieldsPreferencesSelector,
  );

  const currentPreferences = useMemo(() => {
    if (currentList) {
      let displayColumns =
        currentList?.listType === 'PUBLIC'
          ? currentList?.listDisplayColumns
          : currentList?.listUsers?.find(u => u.identifier === userIdentifier)
              ?.listDisplayColumns;
      if (!displayColumns || displayColumns.length === 0) {
        displayColumns = [currentList?.listDisplayColumns];
      }
      if (!displayColumns.includes(columnsAlwaysVisible[0])) {
        // apply always visible at first if are not specified
        return [...columnsAlwaysVisible, ...displayColumns];
      }
      return displayColumns;
    }
    return OrganizationCustomFieldsPreferences;
  }, [OrganizationCustomFieldsPreferences, currentList, userIdentifier]);

  const currentWidthPreferences = useMemo(() => {
    if (currentList) {
      let displayColumns =
        currentList?.listType === 'PUBLIC'
          ? currentList?.listDisplayColumnPrefs
          : currentList?.listUsers?.find(u => u.identifier === userIdentifier)
              ?.listDisplayColumnPrefs;
      if (!displayColumns || displayColumns.length === 0) {
        displayColumns = currentList?.listDisplayColumnPrefs;
      }
      return displayColumns;
    }
    return OrganizationWidthFieldsPreferences;
  }, [OrganizationWidthFieldsPreferences, currentList, userIdentifier]);

  useEffect(() => {
    if (currentWidthPreferences) {
      setHasWidthPreferences(true);
    } else {
      setHasWidthPreferences(false);
    }
  }, [currentWidthPreferences]);

  const setColumnsAndUpdateApi = useCallback(
    newState => {
      setColumnsToState(newState);
      if (currentList) {
        dispatch(
          updateListPreferences(
            {
              listDisplayColumns: translateStateToApi(newState),
            },
            currentList.taskListIdentifier,
            userIdentifier,
          ),
        );
      } else {
        dispatch(
          updateCurrentUserPreferences({
            listDisplayColumns: translateStateToApi(newState),
          }),
        );
      }
    },
    [currentList, dispatch, userIdentifier],
  );

  useEffect(() => {
    if (currentList?.taskListIdentifier && !hideCustomColumns) {
      getAllTaskListCustomFields(currentList.taskListIdentifier).then(data => {
        setTaskListCustomColumns(
          data.map(d => ({
            ...d,
            _customFieldType: CUSTOM_FIELD_TYPES.TASK_LIST,
          })),
        );
      });
    }
  }, [currentList, hideCustomColumns]);

  useEffect(() => {
    // collect data
    const joinedColumnsData = [
      // regular fields data
      ...translateInitialColumnsConfig(viewSpecificConfig),
      // org level custom fields
      ...organizationCustomFields.map(d => ({
        ...d,
        _customFieldType: CUSTOM_FIELD_TYPES.ORGANIZATION,
      })),
      // list level fields data - if a list exists
      ...(currentList ? taskListCustomColumns : []),
      // patient level custom fields
      ...patientCustomColumns,
    ];

    // join preferences to data
    const mergedPreferencesAndFields = joinedColumnsData.map(field => ({
      ...field,
      isChecked:
        !!currentPreferences?.includes(field.identifier) ||
        columnsAlwaysVisible?.includes(field.identifier),
      columnWidth: Number(
        currentWidthPreferences?.find(
          c => c.displayColumn === field?.identifier && c.width !== 'NaN',
        )?.width || getInitialColumnWidth(field),
      ),
    }));

    // sort data by defined order
    const fieldsWithOrder = mergedPreferencesAndFields
      .filter(f => currentPreferences?.includes(f.identifier))
      .sort((a, b) => {
        return (
          currentPreferences?.indexOf(a.identifier) -
          currentPreferences?.indexOf(b.identifier)
        );
      });
    const fieldsWithoutOrder = mergedPreferencesAndFields.filter(
      f => !currentPreferences?.includes(f.identifier),
    );

    setColumnsToState([...fieldsWithOrder, ...fieldsWithoutOrder]);
  }, [
    currentList,
    currentPreferences,
    currentWidthPreferences,
    initialColumns,
    organizationCustomFields,
    patientCustomColumns,
    taskListCustomColumns,
    viewSpecificConfig,
  ]);

  useEffect(() => {
    if (!hidePatientCustomColumns) {
      getAllPatientCustomFields().then(data => {
        setPatientCustomColumns(
          data.map(d => ({
            ...d,
            _customFieldType: CUSTOM_FIELD_TYPES.PATIENT,
          })),
        );
      });
    }
  }, [
    OrganizationCustomFieldsPreferences,
    hideCustomColumns,
    hidePatientCustomColumns,
    currentList,
  ]);

  const setColumnWidth = useCallback(
    ({ columnIdentifier, columnWidth }) => {
      setHasWidthPreferences(true);
      const updatedState = columns.map(c =>
        columnIdentifier === c.identifier ? { ...c, columnWidth } : c,
      );

      if (currentList) {
        dispatch(
          updateListPreferences(
            {
              listDisplayColumnPrefs: translateWidthToApi(updatedState),
            },
            currentList.taskListIdentifier,
            userIdentifier,
          ),
        );
      } else {
        dispatch(
          updateCurrentUserPreferences({
            listDisplayColumnPrefs: translateWidthToApi(updatedState),
          }),
        );
      }
      setColumnsToState(updatedState);
    },
    [columns, currentList, dispatch, userIdentifier],
  );

  const value = {
    columns,
    setColumns: setColumnsAndUpdateApi,
    setColumnsToState,
    setColumnWidth,
    currentList,
    setCurrentList,
    viewSpecificConfig,
    setViewSpecificConfig,
    hasWidthPreferences,
  };

  return (
    <ColumnsConfigContext.Provider value={value}>
      {children}
    </ColumnsConfigContext.Provider>
  );
}

export function useColumnsConfig() {
  const context = useContext(ColumnsConfigContext);
  if (context === undefined) {
    return {
      columns: translateInitialColumnsConfig(TASK_ITEM_BASE_COLUMN_CONFIG).map(
        f => ({
          ...f,
          isChecked: true,
          columnWidth: getInitialColumnWidth(f),
        }),
      ),
      setColumns: () => {
        throw new Error(
          'if you want to use setColumns, useColumnsConfig must be used within a ColumnsConfigProvider',
        );
      },
    };
  }
  return context;
}
