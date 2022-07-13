import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import React, { useCallback, useMemo, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
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
              optionsConfig={optionsConfig}
            />
          )}
        </BulkEditOptionsBarContainer>
      )}
    </BulkEditContext.Provider>
  );
};

export default BulkEditSection;
