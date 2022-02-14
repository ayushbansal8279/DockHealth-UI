import * as React from 'react';
import { TASK_ITEM_BASE_COLUMN_CONFIG } from 'helpers/task-helpers';
import { useSelector } from 'react-redux';
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import {
  userProfileCustomFieldsSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { locationParametersSelector } from 'location/selectors';
import { listCustomFieldsSelector } from 'selectors/list-details-selectors';
import { currentTaskListCustomFieldsPreferencesSelector } from '../selectors/task-list-selectors';

export const ColumnsConfigContext = React.createContext();

export function ColumnsConfigProvider({ children }) {
  const [columnsConfig, setColumnsConfig] = React.useState(
    TASK_ITEM_BASE_COLUMN_CONFIG,
  );
  const [customColumnsConfig, setCustomColumnsConfig] = React.useState([]);
  const value = {
    columnsConfig,
    setColumnsConfig,
    customColumnsConfig,
    setCustomColumnsConfig,
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

  React.useEffect(() => {
    const currentCustomFieldsPreferences = taskListIdentifier
      ? ListCustomFieldsPreferences
      : OrganizationCustomFieldsPreferences;

    const currentCustomFields = taskListIdentifier
      ? [...organizationCustomFields, ...specificListCustomFields]
      : organizationCustomFields;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ListCustomFieldsPreferences,
    OrganizationCustomFieldsPreferences,
    organizationCustomFields,
    specificListCustomFields,
    taskListIdentifier,
  ]);

  return (
    <ColumnsConfigContext.Provider value={value}>
      {children}
    </ColumnsConfigContext.Provider>
  );
}

export function useColumnsConfig() {
  const context = React.useContext(ColumnsConfigContext);
  if (context === undefined) {
    return {
      columnsConfig: TASK_ITEM_BASE_COLUMN_CONFIG,
      customColumnsConfig: [],
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
    };
  }
  return context;
}
