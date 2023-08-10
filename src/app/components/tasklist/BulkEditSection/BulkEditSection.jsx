import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import React, { useCallback, useMemo, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { BulkEditOptionsConfig } from 'helpers/bulk-edit-helpers';
import { isMemberAdmin } from 'helpers/list-members-helper';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
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
  const currentUser = useSelector(userProfileSelector);
  const currentTasklist = useSelector(currentTaskListSelector);

  const isListAdmin = useMemo(() => {
    const currentUserMember = currentTasklist?.listUsers?.find(
      u => u.identifier === currentUser?.identifier,
    );
    const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);
    return isMemberAdmin(currentUserMember) || isOwnerOrAdmin;
  }, [currentUser, currentTasklist]);

  const restrictedConfig = {};
  const setConfig = (configName, themeSettingNameForBulk, themeSettingName) => {
    const enabledBulkItem =
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === themeSettingNameForBulk,
      ) || {};
    const enabledItem =
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === themeSettingName,
      ) || {};
    let enabledValue = enabledBulkItem?.value !== 'false';
    if (enabledItem && !isListAdmin) {
      enabledValue = enabledItem?.value !== 'false';
    }
    restrictedConfig[configName] = enabledValue;
  };
  setConfig(
    BulkEditOptionsConfig.DUPLICATE_OPTION,
    'bulk.option.duplicate.enabled',
    'list.tasks.member.duplicate.enabled',
  );
  setConfig(
    BulkEditOptionsConfig.MOVE_OPTION,
    'bulk.option.move.enabled',
    'list.tasks.member.move.list.enabled',
  );
  setConfig(
    BulkEditOptionsConfig.COMPLETE_OPTION,
    'bulk.option.complete.enabled',
    'list.tasks.non-assignee.complete.enabled',
  );
  setConfig(
    BulkEditOptionsConfig.STATUS_OPTION,
    'bulk.option.status.enabled',
    'list.tasks.member.edit.status.enabled',
  );
  setConfig(
    BulkEditOptionsConfig.DUE_DATE_OPTION,
    'bulk.option.duedate.enabled',
    'list.tasks.member.edit.duedate.enabled',
  );
  setConfig(
    BulkEditOptionsConfig.DELETE_OPTION,
    'bulk.option.delete.enabled',
    'list.tasks.member.delete.enabled',
  );
  setConfig(
    BulkEditOptionsConfig.ASSIGN_OPTION,
    'bulk.option.assignment.enabled',
    'list.tasks.member.edit.assignment.enabled',
  );

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
      parentTasks: extractedTasks.parentTasks,
      subtasks: extractedTasks.subtasks,
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
