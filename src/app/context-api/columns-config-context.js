import React, { createContext, useContext, useEffect, useState } from 'react';
import { TASK_ITEM_BASE_COLUMN_CONFIG } from 'helpers/task-helpers';
import { useSelector } from 'react-redux';
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import {
  userProfileCustomFieldsSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { locationParametersSelector } from 'location/selectors';
import { listCustomFieldsSelector } from 'selectors/list-details-selectors';
import { sortAlphabetical } from 'helpers/custom-fields-helpers';
import { currentTaskListCustomFieldsPreferencesSelector } from '../selectors/task-list-selectors';
import { getAllPatientCustomFields } from '../api/custom-fields-api';

export const ColumnsConfigContext = createContext();

export function ColumnsConfigProvider({
  children,
  initialColumns = TASK_ITEM_BASE_COLUMN_CONFIG,
  hideCustomColumns,
  hidePatientCustomColumns,
}) {
  const [columnsConfig, setColumnsConfig] = useState(initialColumns);
  const [customColumnsConfig, setCustomColumnsConfig] = useState([]);
  const [patientCustomColumnsConfig, setPatientCustomColumnsConfig] = useState(
    [],
  );
  const [columnsOrder, setColumnsOrder] = useState();
  const value = {
    columnsOrder,
    setColumnsOrder,
    columnsConfig,
    setColumnsConfig,
    customColumnsConfig,
    setCustomColumnsConfig,
    patientCustomColumnsConfig,
    setPatientCustomColumnsConfig,
  };
  const { userIdentifier } = useSelector(userProfileSelector);

  const organizationCustomFields = useSelector(
    organizationCustomFieldsSelector,
  );
  const specificListCustomFields = useSelector(listCustomFieldsSelector) || [];

  const ListCustomFieldsPreferences = useSelector(
    currentTaskListCustomFieldsPreferencesSelector(userIdentifier),
  );
  const OrganizationCustomFieldsPreferences = useSelector(
    userProfileCustomFieldsSelector,
  );
  const { taskListIdentifier } = useSelector(locationParametersSelector);

  const sortedAlphabeticalAllCustomFields = React.useMemo(() => {
    return sortAlphabetical([
      ...organizationCustomFields,
      ...specificListCustomFields,
    ]);
  }, [organizationCustomFields, specificListCustomFields]);

  const sortedAlphabeticalOrganizationCustomFields = React.useMemo(() => {
    return sortAlphabetical([...organizationCustomFields]);
  }, [organizationCustomFields]);

  useEffect(() => {
    if (!hideCustomColumns && !hidePatientCustomColumns) {
      const currentCustomFieldsPreferences = taskListIdentifier
        ? ListCustomFieldsPreferences
        : OrganizationCustomFieldsPreferences;

      getAllPatientCustomFields().then(data => {
        const currentPatientCustomFields = sortAlphabetical(
          data.filter(c => c.contextType === 'CUSTOM'),
        );
        if (currentPatientCustomFields && currentCustomFieldsPreferences) {
          const mergedPreferencesAndFields = currentPatientCustomFields.map(
            field => {
              if (
                currentCustomFieldsPreferences.find(
                  id => id === field.identifier,
                )
              ) {
                return { ...field, isChecked: true };
              }
              return { ...field, isChecked: false };
            },
          );
          setPatientCustomColumnsConfig(mergedPreferencesAndFields);
        }
      });
    }
  }, [
    ListCustomFieldsPreferences,
    OrganizationCustomFieldsPreferences,
    hideCustomColumns,
    hidePatientCustomColumns,
    taskListIdentifier,
  ]);

  useEffect(() => {
    if (!hideCustomColumns) {
      const currentCustomFieldsPreferences = taskListIdentifier
        ? ListCustomFieldsPreferences
        : OrganizationCustomFieldsPreferences;

      const currentCustomFields = taskListIdentifier
        ? sortedAlphabeticalAllCustomFields
        : sortedAlphabeticalOrganizationCustomFields;

      if (currentCustomFields && currentCustomFieldsPreferences) {
        const mergedPreferencesAndFields = currentCustomFields.map(field => {
          if (
            currentCustomFieldsPreferences.find(id => id === field.identifier)
          ) {
            return { ...field, isChecked: true };
          }
          return { ...field, isChecked: false };
        });
        setCustomColumnsConfig(mergedPreferencesAndFields);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ListCustomFieldsPreferences,
    OrganizationCustomFieldsPreferences,
    organizationCustomFields,
    specificListCustomFields,
    taskListIdentifier,
    hideCustomColumns,
  ]);

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
      patientCustomColumnsConfig: [],
      columnsConfig: TASK_ITEM_BASE_COLUMN_CONFIG,
      customColumnsConfig: [],
      columnsOrder: {},
      setColumnsOrder: () => {
        throw new Error(
          'if you want to use setColumnsOrder, useColumnsConfig must be used within a ColumnsConfigProvider',
        );
      },
      setColumnsConfig: () => {
        throw new Error(
          'if you want to use setColumnsConfig, useColumnsConfig must be used within a ColumnsConfigProvider',
        );
      },
      setCustomColumnsConfig: () => {
        throw new Error(
          'if you want to use setCustomColumnsConfig, useColumnsConfig must be used within a ColumnsConfigProvider',
        );
      },
      setPatientCustomColumnsConfig: () => {
        throw new Error(
          'if you want to use setPatientCustomColumnsConfig, useColumnsConfig must be used within a ColumnsConfigProvider',
        );
      },
    };
  }
  return context;
}
