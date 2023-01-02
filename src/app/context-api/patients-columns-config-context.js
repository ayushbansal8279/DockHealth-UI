import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import {
  userPreferencesSelector,
  // OrganizationWidthFieldsPreferencesSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { updateListPreferences } from 'actions/patients-actions';
import { CUSTOM_FIELD_TYPES } from 'helpers/custom-fields-helpers';
import {
  PATIENT_BASE_COLUMN_CONFIG,
  PatientHeaderColumn,
} from 'helpers/patient-list-helpers';
import { getAllPatientCustomFields } from '../api/custom-fields-api';
import {
  getInitialColumnWidth,
  translateInitialColumnsConfig,
  translateStateToApi,
} from './helpers';

export const PatientListColumnsConfigContext = createContext();

const columnsAlwaysVisible = [PatientHeaderColumn.PATIENT];

export function PatientListColumnsConfigProvider({
  children,
  initialColumns = PATIENT_BASE_COLUMN_CONFIG,
  hideCustomColumns,
  hidePatientCustomColumns,
}) {
  const dispatch = useDispatch();

  const { userIdentifier } = useSelector(userProfileSelector);

  const [currentPatientList, setCurrentPatientList] = useState(null);
  const [patientCustomColumns, setPatientCustomColumns] = useState([]);
  const [columns, setColumnsToState] = useState([]);
  const [viewSpecificConfig, setViewSpecificConfig] = useState(initialColumns);
  const [hasWidthPreferences, setHasWidthPreferences] = useState(false);

  const organizationCustomFields = useSelector(
    organizationCustomFieldsSelector,
  );
  const OrganizationCustomFieldsPreferences = useSelector(
    userPreferencesSelector,
  );
  // const OrganizationWidthFieldsPreferences = useSelector(
  //   OrganizationWidthFieldsPreferencesSelector,
  // );

  const currentPreferences = useMemo(() => {
    if (currentPatientList) {
      const displayColumns = currentPatientList?.listDisplayColumns;
      if (displayColumns) {
        // apply always visible at first if are not specified
        return [...columnsAlwaysVisible, ...displayColumns];
      }
      return [...columnsAlwaysVisible];
    }
    return OrganizationCustomFieldsPreferences;
  }, [OrganizationCustomFieldsPreferences, currentPatientList]);

  // const currentWidthPreferences = useMemo(() => {
  //   if (currentList) {
  //     let displayColumns =
  //       currentList?.listType === 'PUBLIC'
  //         ? currentList?.listDisplayColumnPrefs
  //         : currentList?.listUsers?.find(u => u.identifier === userIdentifier)
  //             ?.listDisplayColumnPrefs;
  //     if (!displayColumns || displayColumns.length === 0) {
  //       displayColumns = currentList?.listDisplayColumnPrefs;
  //     }
  //     return displayColumns;
  //   }
  //   return OrganizationWidthFieldsPreferences;
  // }, [OrganizationWidthFieldsPreferences, currentList, userIdentifier]);

  // useEffect(() => {
  //   if (currentWidthPreferences) {
  //     setHasWidthPreferences(true);
  //   } else {
  //     setHasWidthPreferences(false);
  //   }
  // }, [currentWidthPreferences]);

  const setColumnsAndUpdateApi = useCallback(
    newState => {
      setColumnsToState(newState);
      if (currentPatientList) {
        dispatch(
          updateListPreferences(
            {
              listDisplayColumns: translateStateToApi(newState),
            },
            currentPatientList?.patientListIdentifier,
            userIdentifier,
          ),
        );
      }
    },
    [currentPatientList, dispatch, userIdentifier],
  );

  useEffect(() => {
    // collect data
    const joinedColumnsData = [
      // regular fields data
      ...translateInitialColumnsConfig(viewSpecificConfig),
      // patient level custom fields
      ...patientCustomColumns,
    ];

    // join preferences to data
    const mergedPreferencesAndFields = joinedColumnsData.map(field => ({
      ...field,
      isChecked:
        !!currentPreferences?.includes(field.identifier) ||
        columnsAlwaysVisible?.includes(field.identifier),
      // columnWidth: Number(
      //   currentWidthPreferences?.find(
      //     c => c.displayColumn === field?.identifier && c.width !== 'NaN',
      //   )?.width || getInitialColumnWidth(field),
      // ),
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
    currentPatientList,
    currentPreferences,
    initialColumns,
    organizationCustomFields,
    patientCustomColumns,
    viewSpecificConfig,
  ]);

  useEffect(() => {
    if (!hidePatientCustomColumns) {
      // eslint-disable-next-line sonarjs/no-identical-functions
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
    currentPatientList,
  ]);

  const setColumnWidth = useCallback(
    ({ columnIdentifier, columnWidth }) => {
      setHasWidthPreferences(true);
      const updatedState = columns.map(c =>
        columnIdentifier === c.identifier ? { ...c, columnWidth } : c,
      );
      setColumnsToState(updatedState);
    },
    [columns],
  );

  const value = {
    columns,
    setColumns: setColumnsAndUpdateApi,
    setColumnsToState,
    setColumnWidth,
    currentPatientList,
    setCurrentPatientList,
    viewSpecificConfig,
    setViewSpecificConfig,
    hasWidthPreferences,
  };

  return (
    <PatientListColumnsConfigContext.Provider value={value}>
      {children}
    </PatientListColumnsConfigContext.Provider>
  );
}

export function usePatientListColumnsConfig() {
  const context = useContext(PatientListColumnsConfigContext);
  if (context === undefined) {
    return {
      columns: translateInitialColumnsConfig(PATIENT_BASE_COLUMN_CONFIG).map(
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
