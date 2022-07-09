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
  userProfileSelector,
} from 'selectors/user-selectors';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import { updateListPreferences } from 'actions/task-list-actions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import {
  getAllPatientCustomFields,
  getAllTaskListCustomFields,
} from '../api/custom-fields-api';
import { translateInitialColumnsConfig, translateStateToApi } from './helpers';

export const ColumnsConfigContext = createContext();

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

  const organizationCustomFields = useSelector(
    organizationCustomFieldsSelector,
  );
  const OrganizationCustomFieldsPreferences = useSelector(
    userPreferencesSelector,
  );

  const currentPreferences = useMemo(() => {
    if (currentList) {
      return currentList?.listType === 'PUBLIC'
        ? currentList?.listDisplayColumns
        : currentList?.listUsers?.find(u => u.identifier === userIdentifier)
            ?.listDisplayColumns;
    }
    return OrganizationCustomFieldsPreferences;
  }, [OrganizationCustomFieldsPreferences, currentList, userIdentifier]);

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
    const mergedPreferencesAndFields = joinedColumnsData
      .filter(f => f.identifier !== 'TASK_DESCRIPTION')
      .map(field => ({
        ...field,
        isChecked: !!currentPreferences?.includes(field.identifier),
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

  const value = {
    columns,
    setColumns: setColumnsAndUpdateApi,
    setColumnsToState,
    currentList,
    setCurrentList,
    viewSpecificConfig,
    setViewSpecificConfig,
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
      columns: translateInitialColumnsConfig(
        TASK_ITEM_BASE_COLUMN_CONFIG,
      ).map(f => ({ ...f, isChecked: true })),
      setColumns: () => {
        throw new Error(
          'if you want to use setColumns, useColumnsConfig must be used within a ColumnsConfigProvider',
        );
      },
    };
  }
  return context;
}
