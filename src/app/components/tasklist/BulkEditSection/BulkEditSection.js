import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import React, { useCallback, useMemo, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import { BulkEditOptionsConfig } from 'helpers/bulk-edit-helpers';
import BulkEditOptionsBar from './BulkEditOptionsBar/BulkEditOptionsBar';
import { BulkEditOptionsBarContainer } from './styled';

export const BulkEditContext = createContext({});

const BulkEditSection = ({
  children,
  allTasks = [],
  refreshTasks,
  disabled,
  searchValue,
  shouldRefreshTasksEveryTime,
  optionsConfig,
}) => {
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const restrictedConfig = {};
  const setConfig = (configName, themeSettingName) => {
    const enabledItem =
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === themeSettingName,
      ) || {};
    const enabledValue = enabledItem?.value !== 'false';
    restrictedConfig[configName] = enabledValue;
  };
  setConfig(
    BulkEditOptionsConfig.DUPLICATE_OPTION,
    'bulk.option.duplicate.enabled',
  );
  setConfig(BulkEditOptionsConfig.MOVE_OPTION, 'bulk.option.move.enabled');
  setConfig(
    BulkEditOptionsConfig.COMPLETE_OPTION,
    'bulk.option.complete.enabled',
  );
  setConfig(BulkEditOptionsConfig.STATUS_OPTION, 'bulk.option.status.enabled');
  setConfig(
    BulkEditOptionsConfig.DUE_DATE_OPTION,
    'bulk.option.duedate.enabled',
  );
  setConfig(BulkEditOptionsConfig.DELETE_OPTION, 'bulk.option.delete.enabled');

  const mergedConfig = useMemo(
    () => ({
      ...restrictedConfig,
      ...optionsConfig,
    }),
    [optionsConfig, restrictedConfig],
  );

  const selectedTasks = useMemo(() => {
    if (disabled || !Array.isArray(allTasks)) {
      return null;
    }
    const extractedTasks = extractTasksAndSubtasks(allTasks);
    return {
      parentTasks: extractedTasks.parentTasks.filter(
        ({ selected }) => selected,
      ),
      subtasks: extractedTasks.subtasks.filter(({ selected }) => selected),
    };
  }, [allTasks, disabled]);

  const isTaskDrawerOpen = useSelector(taskDrawerOpenSelector);
  const dispatch = useDispatch();

  const onClearBulkEditTasks = useCallback(() => {
    dispatch(TaskActions.unselectAllTasks());
  }, [dispatch]);

  const bulkEditIsActive = useMemo(
    () =>
      selectedTasks?.parentTasks?.length > 0 ||
      selectedTasks?.subtasks?.length > 0,
    [selectedTasks],
  );

  const providerValue = useMemo(
    () => ({
      bulkEditIsActive,
      bulkEditEnabled: !disabled,
    }),
    [bulkEditIsActive, disabled],
  );

  return (
    <BulkEditContext.Provider value={providerValue}>
      {children}
      {!disabled && (
        <BulkEditOptionsBarContainer isOpen={bulkEditIsActive}>
          {bulkEditIsActive && (
            <BulkEditOptionsBar
              selectedTasks={selectedTasks}
              onClose={onClearBulkEditTasks}
              isDisabled={isTaskDrawerOpen}
              refreshTasks={refreshTasks}
              searchValue={searchValue}
              shouldRefreshTasksEveryTime={shouldRefreshTasksEveryTime}
              optionsConfig={mergedConfig}
            />
          )}
        </BulkEditOptionsBarContainer>
      )}
    </BulkEditContext.Provider>
  );
};

export default BulkEditSection;
