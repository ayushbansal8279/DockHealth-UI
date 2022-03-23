/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty, pluck } from 'ramda';
import { bulkEditTasks as bulkEditTasksApi } from 'api/task-api';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { BulkEditOptionsConfig } from 'helpers/bulk-edit-helpers';
import palette from 'styles/palette';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import DuplicateIcon from 'img/bulk-edit/DuplicateIcon';
import CompleteIcon from 'img/bulk-edit/CompleteIcon';
import MoveIcon from 'img/bulk-edit/MoveIcon';
import DeleteIcon from 'img/bulk-edit/DeleteIcon';
import { onMultiSelectAction } from 'helpers/ga-event-helper';
import Tooltip from 'components/common/Tooltip/Tooltip';
import * as AlertActions from 'alert/actions';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  bulkEditAssignUser,
  bulkEditWorkflowStatus,
  bulkEditDueDate,
  bulkEditDelete,
  bulkEditComplete,
  bulkEditDueDateSuccess,
  bulkEditDuplicateTasksSuccess,
} from 'actions/task-actions';
import * as ActionTypes from 'actions/action-types';
import {
  getListDetailsTaskCounters,
  getTasksGroupsList,
} from 'actions/list-details-actions';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import BulkEditBar from 'components/bulk-edit/BulkEditBar/BulkEditBar';
import BulkEditAssignToOption from './BulkEditAssignToOption';
import BulkEditDueDateOption from './BulkEditDueDateOption';
import BulkEditWorkflowStatusOption from './BulkEditWorkflowStatusOption';

import { Button } from './styled';

const BULK_EDIT_BASE_CONFIG = {
  [BulkEditOptionsConfig.DUPLICATE_OPTION]: true,
  [BulkEditOptionsConfig.MOVE_OPTION]: true,
  [BulkEditOptionsConfig.COMPLETE_OPTION]: true,
  [BulkEditOptionsConfig.STATUS_OPTION]: true,
  [BulkEditOptionsConfig.DUE_DATE_OPTION]: true,
  [BulkEditOptionsConfig.ASSIGN_OPTION]: true,
  [BulkEditOptionsConfig.DELETE_OPTION]: true,
};

const BulkEditOptionsBar = ({
  selectedTasks = {},
  onClose,
  isDisabled,
  refreshTasks,
  searchValue,
  shouldRefreshTasksEveryTime,
  optionsConfig,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const currentUser = useSelector(userProfileSelector);
  const dispatch = useDispatch();
  const { taskListIdentifier } = useParams();
  const filters = useSelector(selectedFiltersInMegaFilterSelector);
  const { parentTasks = [], subtasks = [] } = selectedTasks;

  const allTasksSameType = useMemo(
    () =>
      (parentTasks.length > 0 && subtasks.length === 0) ||
      (subtasks.length > 0 && parentTasks.length === 0),
    [parentTasks, subtasks],
  );

  const allParentTasksHaveRelatedSubtasks = useMemo(
    () =>
      parentTasks.every(
        parentTask =>
          parentTask?.subTasksCount === parentTask?.subTasksCompletedCount ||
          parentTask?.subTasksCount ===
            subtasks?.filter(
              subtask =>
                subtask?.parentTaskIdentifier === parentTask?.taskIdentifier,
            )?.length,
      ),
    [parentTasks, subtasks],
  );

  const allTasksAreRelated = useMemo(
    () =>
      parentTasks.every(parentTask => {
        if (parentTask?.subTasksCount === 0) return true;

        const relatedCount = subtasks?.filter(
          subtask =>
            subtask?.parentTaskIdentifier === parentTask?.taskIdentifier,
        )?.length;

        if (relatedCount === 0 && parentTask?.subTasksCount > 0) return true;

        return relatedCount > 0;
      }) &&
      subtasks?.every(subtask =>
        parentTasks?.find(
          parentTask =>
            parentTask?.taskIdentifier === subtask.parentTaskIdentifier,
        ),
      ),
    [parentTasks, subtasks],
  );

  const disabledMoveAction = useMemo(
    () => !allTasksSameType && !allTasksAreRelated,
    [allTasksSameType, allTasksAreRelated],
  );

  const allSelectedTasks = useMemo(() => [...parentTasks, ...subtasks], [
    parentTasks,
    subtasks,
  ]);

  const allSelectedTasksIdentifiers = useMemo(
    () => [
      ...parentTasks?.map(({ identifier }) => identifier),
      ...subtasks?.map(({ identifier }) => identifier),
    ],
    [parentTasks, subtasks],
  );

  const allSelectedTasksLength = allSelectedTasks.length;

  const allSelectedTaskListIdentifiers = useMemo(
    () =>
      [...(parentTasks || []), ...(subtasks || [])].reduce(
        (accumulator, task) =>
          !checkIfTemplateTask(task) && task.taskList
            ? [...accumulator, task.taskList.taskListIdentifier]
            : accumulator,
        [],
      ),
    [parentTasks, subtasks],
  );

  const updateTasks = useCallback(
    tasks => {
      tasks.forEach(task =>
        dispatch({
          type: ActionTypes.UPDATE_TASK_SUCCESS,
          task,
        }),
      );
    },
    [dispatch],
  );

  const addTasks = useCallback(
    tasks => {
      tasks.reverse().forEach(task =>
        dispatch({
          type: ActionTypes.ADD_TASK_SUCCESS,
          task,
        }),
      );
    },
    [dispatch],
  );

  const deleteTasks = useCallback(
    tasks => {
      tasks.forEach(task =>
        dispatch({
          type: ActionTypes.DELETE_TASK,
          taskIdentifier: task.taskIdentifier,
        }),
      );
    },
    [dispatch],
  );

  const handleChangeWorkflowStatusTasks = useCallback(
    workflowStatus => {
      bulkEditWorkflowStatus(
        allSelectedTasksIdentifiers,
        workflowStatus,
        filters,
        searchValue,
      )(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'STATUS',
        taskIdentifiers: allSelectedTasksIdentifiers,
        workflowStatusIdentifier: workflowStatus?.identifier || null,
      })
        .then(({ transactionIdentifier }) => {
          dispatch(
            AlertActions.showGlobalAlertWithUndo(
              `${allSelectedTasksLength} STATUS CHANGED`,
              transactionIdentifier,
              ({ tasks }) => {
                if (
                  shouldRefreshTasksEveryTime &&
                  refreshTasks &&
                  typeof refreshTasks === 'function'
                ) {
                  refreshTasks();
                } else {
                  updateTasks(tasks);
                }
              },
            ),
          );

          if (
            shouldRefreshTasksEveryTime &&
            refreshTasks &&
            typeof refreshTasks === 'function'
          ) {
            refreshTasks();
          }

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });
      onMultiSelectAction('Workflow status changed');
    },
    [
      allSelectedTasksIdentifiers,
      filters,
      searchValue,
      dispatch,
      allSelectedTasksLength,
      shouldRefreshTasksEveryTime,
      refreshTasks,
      onClose,
      updateTasks,
    ],
  );

  const handleChangeDateTasks = useCallback(
    dueDate => {
      bulkEditDueDate(allSelectedTasksIdentifiers, dueDate, filters)(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'DUE_DATE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        dueDate,
      })
        .then(({ transactionIdentifier }) => {
          dispatch(
            bulkEditDueDateSuccess(allSelectedTasksIdentifiers, dueDate),
          );
          dispatch(
            AlertActions.showGlobalAlertWithUndo(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} DUE DATES CHANGED`
                : `${allSelectedTasksLength} DUE DATE CHANGED`,
              transactionIdentifier,
              ({ tasks }) => {
                if (
                  shouldRefreshTasksEveryTime &&
                  refreshTasks &&
                  typeof refreshTasks === 'function'
                ) {
                  refreshTasks();
                } else {
                  updateTasks(tasks);
                }
              },
            ),
          );

          if (
            shouldRefreshTasksEveryTime &&
            refreshTasks &&
            typeof refreshTasks === 'function'
          ) {
            refreshTasks();
          }

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });
      onMultiSelectAction('Due date changed');
    },
    [
      allSelectedTasksIdentifiers,
      filters,
      dispatch,
      allSelectedTasksLength,
      shouldRefreshTasksEveryTime,
      refreshTasks,
      onClose,
      updateTasks,
    ],
  );

  const handleChangeAssigneeTasks = useCallback(
    selectedUsers => {
      bulkEditAssignUser(
        allSelectedTasksIdentifiers,
        selectedUsers,
        filters,
        searchValue,
      )(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'ASSIGN',
        taskIdentifiers: allSelectedTasksIdentifiers,
        assignedToIdentifiers: pluck('userIdentifier', selectedUsers),
      })
        .then(({ transactionIdentifier }) => {
          dispatch(
            AlertActions.showGlobalAlertWithUndo(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} TASKS ASSIGNED`
                : `${allSelectedTasksLength} TASK ASSIGNED`,
              transactionIdentifier,
              ({ tasks }) => {
                if (
                  shouldRefreshTasksEveryTime &&
                  refreshTasks &&
                  typeof refreshTasks === 'function'
                ) {
                  refreshTasks();
                } else {
                  updateTasks(tasks);
                }
              },
            ),
          );

          if (
            shouldRefreshTasksEveryTime &&
            refreshTasks &&
            typeof refreshTasks === 'function'
          ) {
            refreshTasks();
          }
          onClose();
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });
      onMultiSelectAction('Assigned');
    },
    [
      allSelectedTasksIdentifiers,
      filters,
      searchValue,
      dispatch,
      allSelectedTasksLength,
      shouldRefreshTasksEveryTime,
      refreshTasks,
      onClose,
      updateTasks,
    ],
  );

  const handleDuplicateTasks = useCallback(() => {
    const anyTaskHasAttachment = allSelectedTasks?.some(
      task => task?.attachments?.length > 0,
    );

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const confirmAction = (includeAttachmentsForDuplication = false) => {
      onMultiSelectAction('Duplicated');

      return bulkEditTasksApi({
        bulkEditType: 'DUPLICATE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        includeAttachmentsForDuplication,
      }).then(({ transactionIdentifier, tasks: duplicatedTasks }) => {
        dispatch(bulkEditDuplicateTasksSuccess(duplicatedTasks));

        if (refreshTasks && typeof refreshTasks === 'function') {
          refreshTasks();
        }

        dispatch(
          AlertActions.showGlobalAlertWithUndo(
            allSelectedTasksLength > 1
              ? `${allSelectedTasksLength} TASKS DUPLICATED`
              : `${allSelectedTasksLength} TASK DUPLICATED`,
            transactionIdentifier,
            ({ tasks }) => {
              if (
                shouldRefreshTasksEveryTime &&
                refreshTasks &&
                typeof refreshTasks === 'function'
              ) {
                refreshTasks();
              } else {
                deleteTasks(tasks);
              }
            },
          ),
        );

        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });
    };

    if (anyTaskHasAttachment) {
      dispatch(
        openModal('AttachmentsDuplicate', {
          confirm: () => confirmAction(true),
          skip: () => confirmAction(false),
        }),
      );
    } else {
      confirmAction();
    }
  }, [
    allSelectedTasks,
    allSelectedTasksIdentifiers,
    refreshTasks,
    dispatch,
    allSelectedTasksLength,
    onClose,
    shouldRefreshTasksEveryTime,
    deleteTasks,
  ]);

  const handleMoveTasks = useCallback(async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const standardConfirmAction = selectedDestination => {
      onMultiSelectAction('Moved');

      return bulkEditTasksApi({
        bulkEditType: 'MOVE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        ...selectedDestination,
      }).then(({ transactionIdentifier }) => {
        if (refreshTasks && typeof refreshTasks === 'function') {
          refreshTasks();
        }

        dispatch(
          AlertActions.showGlobalAlertWithUndo(
            allSelectedTasksLength > 1
              ? `${allSelectedTasksLength} TASKS MOVED`
              : `${allSelectedTasksLength} TASK MOVED`,
            transactionIdentifier,
            refreshTasks,
          ),
        );

        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });
    };

    // eslint-disable-next-line func-names
    const moveTaskConfig = await (function() {
      if (
        parentTasks.length > 0 &&
        subtasks.length === 0 &&
        parentTasks?.every(task => task?.subTasksCount === 0)
      ) {
        return { tasks: parentTasks, confirmAction: standardConfirmAction };
      }
      if (subtasks.length > 0 && parentTasks.length === 0) {
        return { tasks: subtasks, confirmAction: standardConfirmAction };
      }

      const formattedSelectedTasks = parentTasks.map(parentTask => ({
        ...parentTasks,
        subtasks: subtasks?.filter(
          subtask =>
            subtask?.parentTaskIdentifier === parentTask.taskIdentifier,
        ),
      }));

      const anyTaskIsIncomplete = formattedSelectedTasks?.some(
        task => task?.subTasksCount !== task?.subtasks?.length,
      );

      return {
        tasks: formattedSelectedTasks,
        confirmAction: anyTaskIsIncomplete
          ? selectedDestination =>
              dispatch(
                openModal('MoveTasksWithSubtasks', {
                  confirm: () => standardConfirmAction(selectedDestination),
                }),
              )
          : standardConfirmAction,
        preventClosingModal: anyTaskIsIncomplete,
      };
    })();

    const { tasks, confirmAction, preventClosingModal } = moveTaskConfig;

    dispatch(
      openModal('SelectTaskDestination', {
        tasksToMove: tasks,
        confirmText: 'Move',
        confirm: confirmAction,
        preventClosingModal,
      }),
    );
  }, [
    allSelectedTasksIdentifiers,
    allSelectedTasksLength,
    dispatch,
    onClose,
    parentTasks,
    refreshTasks,
    subtasks,
  ]);

  const handleCompleteTasks = useCallback(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const confirmAction = () => {
      bulkEditComplete(allSelectedTasksIdentifiers, currentUser)(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'COMPLETE',
        taskIdentifiers: allSelectedTasksIdentifiers,
      })
        .then(({ transactionIdentifier }) => {
          dispatch(getTasksGroupsList());
          dispatch(getListDetailsTaskCounters(taskListIdentifier));

          dispatch(
            AlertActions.showGlobalAlertWithUndo(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} TASKS COMPLETED`
                : `${allSelectedTasksLength} TASK COMPLETED`,
              transactionIdentifier,
              ({ tasks }) => {
                if (
                  shouldRefreshTasksEveryTime &&
                  refreshTasks &&
                  typeof refreshTasks === 'function'
                ) {
                  refreshTasks();
                } else {
                  tasks.forEach(task =>
                    task.parentTaskIdentifier &&
                    (isEmpty(filters) || !filters) &&
                    !searchValue
                      ? updateTasks([task])
                      : addTasks([task]),
                  );
                }
              },
            ),
          );

          if (
            shouldRefreshTasksEveryTime &&
            refreshTasks &&
            typeof refreshTasks === 'function'
          ) {
            refreshTasks();
          }

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });

      onMultiSelectAction('Status changed');
    };

    if (allParentTasksHaveRelatedSubtasks) {
      confirmAction();
    } else {
      dispatch(
        openModal('BulkCompleteTasks', {
          confirm: confirmAction,
        }),
      );
    }
  }, [
    allParentTasksHaveRelatedSubtasks,
    allSelectedTasksIdentifiers,
    currentUser,
    dispatch,
    taskListIdentifier,
    allSelectedTasksLength,
    shouldRefreshTasksEveryTime,
    refreshTasks,
    onClose,
    filters,
    searchValue,
    updateTasks,
    addTasks,
  ]);

  const handleDeleteTasks = useCallback(() => {
    dispatch(
      openModal('DeleteConfirmation', {
        title: 'Delete tasks',
        description: allParentTasksHaveRelatedSubtasks
          ? 'Are you sure you want to delete these tasks? This action cannot be undone.'
          : 'Deleting these tasks will also delete related subtasks. This action cannot be undone.',
        confirm: () => {
          bulkEditDelete(allSelectedTasksIdentifiers)(dispatch);

          bulkEditTasksApi({
            bulkEditType: 'DELETE',
            taskIdentifiers: allSelectedTasksIdentifiers,
          })
            .then(({ transactionIdentifier }) => {
              dispatch(getTasksGroupsList());
              dispatch(getListDetailsTaskCounters(taskListIdentifier));
              dispatch(
                AlertActions.showGlobalAlertWithUndo(
                  allSelectedTasksLength > 1
                    ? `${allSelectedTasksLength} TASKS DELETED`
                    : `${allSelectedTasksLength} TASK DELETED`,
                  transactionIdentifier,
                  ({ tasks }) => {
                    if (
                      shouldRefreshTasksEveryTime &&
                      refreshTasks &&
                      typeof refreshTasks === 'function'
                    ) {
                      refreshTasks();
                    } else {
                      addTasks(tasks);
                    }
                  },
                ),
              );

              if (
                shouldRefreshTasksEveryTime &&
                refreshTasks &&
                typeof refreshTasks === 'function'
              ) {
                refreshTasks();
              }

              dispatch(closeModal());
              if (onClose && typeof onClose === 'function') {
                onClose();
              }
            })
            .catch(() => {
              if (refreshTasks && typeof refreshTasks === 'function') {
                refreshTasks();
              }
            });
          onMultiSelectAction('Deleted');
        },
      }),
    );
  }, [
    dispatch,
    allParentTasksHaveRelatedSubtasks,
    allSelectedTasksIdentifiers,
    taskListIdentifier,
    allSelectedTasksLength,
    shouldRefreshTasksEveryTime,
    refreshTasks,
    onClose,
    addTasks,
  ]);

  const mergedConfig = useMemo(
    () => ({
      ...BULK_EDIT_BASE_CONFIG,
      ...optionsConfig,
    }),
    [optionsConfig],
  );

  return (
    <BulkEditBar
      numberOfSelectedTasks={allSelectedTasksLength}
      isDisabled={isDisabled}
      onClose={onClose}
    >
      <>
        {mergedConfig[BulkEditOptionsConfig.DUPLICATE_OPTION] && (
          <Button
            type="button"
            onClick={handleDuplicateTasks}
            disabled={isDisabled}
          >
            <BulkEditOption
              iconComponent={DuplicateIcon}
              title="Duplicate"
              isDisabled={isDisabled}
            />
          </Button>
        )}
        {mergedConfig[BulkEditOptionsConfig.MOVE_OPTION] && (
          <Tooltip
            placement="top"
            title={
              disabledMoveAction
                ? 'Cannot move subtasks without main tasks'
                : null
            }
          >
            <Button
              type="button"
              disabled={disabledMoveAction || isDisabled}
              onClick={handleMoveTasks}
            >
              <BulkEditOption
                iconComponent={MoveIcon}
                title="Move"
                isDisabled={disabledMoveAction || isDisabled}
              />
            </Button>
          </Tooltip>
        )}
        {mergedConfig[BulkEditOptionsConfig.COMPLETE_OPTION] && (
          <Button
            type="button"
            onClick={handleCompleteTasks}
            disabled={isDisabled}
          >
            <BulkEditOption
              iconComponent={CompleteIcon}
              title="Delete"
              isDisabled={isDisabled}
            />
          </Button>
        )}
        {mergedConfig[BulkEditOptionsConfig.STATUS_OPTION] && (
          <BulkEditWorkflowStatusOption
            handleChangeWorkflowStatusTasks={handleChangeWorkflowStatusTasks}
            isDisabled={isDisabled}
          />
        )}
        {mergedConfig[BulkEditOptionsConfig.DUE_DATE_OPTION] && (
          <BulkEditDueDateOption
            handleChangeDateTasks={handleChangeDateTasks}
            isDisabled={isDisabled}
          />
        )}
        {mergedConfig[BulkEditOptionsConfig.ASSIGN_OPTION] && (
          <BulkEditAssignToOption
            selectedTaskListIdentifiers={allSelectedTaskListIdentifiers}
            handleChangeAssigneTasks={handleChangeAssigneeTasks}
            isDisabled={isDisabled}
            selectedTasks={selectedTasks}
          />
        )}
        {mergedConfig[BulkEditOptionsConfig.DELETE_OPTION] && (
          <Button
            type="button"
            onClick={handleDeleteTasks}
            disabled={isDisabled}
          >
            <BulkEditOption
              iconComponent={DeleteIcon}
              title="Delete"
              color={palette.oPlusRed}
              isDisabled={isDisabled}
            />
          </Button>
        )}
      </>
    </BulkEditBar>
  );
};

export default BulkEditOptionsBar;
