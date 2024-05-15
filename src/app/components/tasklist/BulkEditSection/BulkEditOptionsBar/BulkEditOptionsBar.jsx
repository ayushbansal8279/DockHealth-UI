/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo, useCallback } from 'react';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useParams } from 'react-router-dom';
import isEmpty from 'ramda/src/isEmpty';
import { bulkEditTasks as bulkEditTasksApi } from 'api/task-api';
import * as ModalActions from 'modal/actions';
import {
  checkIfTemplateTask,
  findIncompleteRequiredFields,
} from 'helpers/task-helpers';
import useActions from 'hooks/use-actions';
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
  bulkEditAssignUsers,
  bulkEditUnassignUsers,
  bulkEditUnassignAllUsers,
  bulkEditWorkflowStatus,
  bulkEditDueDate,
  bulkEditDelete,
  bulkEditComplete,
  bulkEditDueDateSuccess,
  bulkEditDuplicateTasksSuccess,
  refreshTaskBundle,
} from 'actions/task-actions';
import * as ActionTypes from 'actions/action-types';
import {
  getListDetailsTaskCounters,
  getTasksGroupsList,
} from 'actions/list-details-actions';
import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import { listCustomFieldsSelector } from 'selectors/list-details-selectors';
import BulkEditOption from 'components/bulk-edit/BulkEditOption/BulkEditOption';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import BulkEditBar from 'components/bulk-edit/BulkEditBar/BulkEditBar';
import { UserOrganizationRole } from 'helpers/user-helper';
import AccessRestrictor from 'components/access/AccessRestrictor/AccessRestrictor';
import BulkEditAssignToOption from './BulkEditAssignToOption';
import BulkEditDueDateOption from './BulkEditDueDateOption';
import BulkEditWorkflowStatusOption from './BulkEditWorkflowStatusOption';
import { Button } from './styled';

const { ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE } = UserOrganizationRole;

const BULK_EDIT_BASE_CONFIG = {
  [BulkEditOptionsConfig.DUPLICATE_OPTION]: true,
  [BulkEditOptionsConfig.MOVE_OPTION]: true,
  [BulkEditOptionsConfig.COMPLETE_OPTION]: true,
  [BulkEditOptionsConfig.STATUS_OPTION]: true,
  [BulkEditOptionsConfig.DUE_DATE_OPTION]: true,
  [BulkEditOptionsConfig.EDIT_CUSTOM_FIELDS_OPTION]: true,
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
  const modalActions = useActions(ModalActions);

  const allTasksSameType = useMemo(
    () =>
      (parentTasks.length > 0 && subtasks.length === 0) ||
      (subtasks.length > 0 && parentTasks.length === 0),
    [parentTasks, subtasks],
  );

  const allParentTasksHaveRelatedSubtasks = useMemo(
    () =>
      parentTasks.every(
        (parentTask) =>
          parentTask?.subTasksCount === parentTask?.subTasksCompletedCount ||
          parentTask?.subTasksCount ===
            subtasks?.filter(
              (subtask) =>
                subtask?.parentTaskIdentifier === parentTask?.taskIdentifier,
            )?.length,
      ),
    [parentTasks, subtasks],
  );

  const organizationCustomFields = useSelector(
    organizationCustomFieldsSelector,
  );
  const listCustomFields = useSelector(listCustomFieldsSelector);

  const allTaskCustomFields = useMemo(
    () => [...(organizationCustomFields ?? []), ...(listCustomFields ?? [])],
    [organizationCustomFields, listCustomFields],
  );

  const allRequiredFieldsExist = useMemo(
    () =>
      parentTasks.every((parentTask) => {
        const incompleteRequiredFields = findIncompleteRequiredFields(
          allTaskCustomFields,
          parentTask,
        );
        const isRequiredFieldsAreIncomplete =
          incompleteRequiredFields.length > 0;
        return !isRequiredFieldsAreIncomplete;
      }),
    [allTaskCustomFields, parentTasks],
  );

  const allTasksAreRelated = useMemo(
    () =>
      parentTasks.every((parentTask) => {
        if (parentTask?.subTasksCount === 0) return true;

        const relatedCount = subtasks?.filter(
          (subtask) =>
            subtask?.parentTaskIdentifier === parentTask?.taskIdentifier,
        )?.length;

        if (relatedCount === 0 && parentTask?.subTasksCount > 0) return true;

        return relatedCount > 0;
      }) &&
      subtasks?.every((subtask) =>
        parentTasks?.find(
          (parentTask) =>
            parentTask?.taskIdentifier === subtask.parentTaskIdentifier,
        ),
      ),
    [parentTasks, subtasks],
  );

  const disabledMoveAction = useMemo(
    () => !allTasksSameType && !allTasksAreRelated,
    [allTasksSameType, allTasksAreRelated],
  );

  const allSelectedTasks = useMemo(
    () => [...parentTasks, ...subtasks],
    [parentTasks, subtasks],
  );

  const allSelectedTasksIdentifiers = useMemo(
    () => [
      ...parentTasks
        ?.filter((t) => t?.itemType === 'TASK')
        ?.map(({ identifier }) => identifier),
      ...subtasks?.map(({ identifier }) => identifier),
    ],
    [parentTasks, subtasks],
  );

  const allSelectedWorkflowIdentifiers = useMemo(
    () => [
      ...parentTasks
        ?.filter((t) => t?.itemType === 'BUNDLE')
        ?.map(({ identifier }) => identifier),
    ],
    [parentTasks],
  );

  const allSelectedTasksLength = allSelectedTasks.length;

  const allSelectedTaskListIdentifiers = useMemo(
    () =>
      [...(parentTasks || []), ...(subtasks || [])].reduce(
        (accumulator, task) =>
          !checkIfTemplateTask(task) && task?.taskList
            ? [...accumulator, task?.taskList.taskListIdentifier]
            : accumulator,
        [],
      ),
    [parentTasks, subtasks],
  );

  const updateTasks = useCallback(
    (tasks) => {
      for (const task of tasks)
        dispatch({
          type: ActionTypes.UPDATE_TASK_SUCCESS,
          task,
        });
    },
    [dispatch],
  );

  const addTasks = useCallback(
    (tasks) => {
      for (const task of tasks.reverse())
        dispatch({
          type: ActionTypes.ADD_TASK_SUCCESS,
          task,
        });
    },
    [dispatch],
  );

  const deleteTasks = useCallback(
    (tasks) => {
      for (const task of tasks)
        dispatch({
          type: ActionTypes.DELETE_TASK,
          taskIdentifier: task.taskIdentifier,
        });
    },
    [dispatch],
  );

  const refreshTaskWorkflows = useCallback(
    (workflowIdentifiers) => {
      for (const identifier of workflowIdentifiers) {
        dispatch(refreshTaskBundle(identifier));
      }
    },
    [dispatch],
  );

  const handleChangeWorkflowStatusTasks = useCallback(
    (workflowStatus) => {
      bulkEditWorkflowStatus(
        allSelectedTasksIdentifiers,
        workflowStatus,
        filters,
        searchValue,
      )(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'STATUS',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
        workflowStatusIdentifier: workflowStatus?.identifier || null,
      })
        .then(({ transactionIdentifier }) => {
          refreshTaskWorkflows(allSelectedWorkflowIdentifiers);
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
      allSelectedWorkflowIdentifiers,
      allSelectedTasksLength,
      shouldRefreshTasksEveryTime,
      refreshTasks,
      onClose,
      updateTasks,
      refreshTaskWorkflows,
    ],
  );

  const handleChangeDateTasks = useCallback(
    (dueDate) => {
      bulkEditDueDate(allSelectedTasksIdentifiers, dueDate, filters)(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'DUE_DATE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
        dueDate,
      })
        .then(({ transactionIdentifier }) => {
          dispatch(
            bulkEditDueDateSuccess(allSelectedTasksIdentifiers, dueDate),
          );
          refreshTaskWorkflows(allSelectedWorkflowIdentifiers);
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
      allSelectedWorkflowIdentifiers,
      allSelectedTasksLength,
      shouldRefreshTasksEveryTime,
      refreshTasks,
      onClose,
      updateTasks,
      refreshTaskWorkflows,
    ],
  );

  const handleChangeAssigneeTasks = useCallback(
    /**
     *
     * @param {Array} selectedUsers users to send over api, assigned users list or newly unassigned users list
     * @param {'assignment' | 'unassignment', 'unassign_all'} assignOption
     */
    (selectedUsers, assignOption) => {
      // NOTE: update assignees in redux state
      if (assignOption === 'unassign_all') {
        bulkEditUnassignAllUsers(allSelectedTasksIdentifiers)(dispatch);
      } else {
        const methods = {
          assignment: bulkEditAssignUsers,
          unassignment: bulkEditUnassignUsers,
        };
        methods[assignOption]?.(
          allSelectedTasksIdentifiers,
          selectedUsers,
        )(dispatch);
      }

      // NOTE: prepare payload for api
      const payload = {
        bulkEditType: 'ASSIGN',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
      };

      const selectedUserIdentifiers = selectedUsers?.map(
        ({ userIdentifier }) => userIdentifier,
      );

      switch (assignOption) {
        case 'assignment':
          payload.assignedToIdentifiers = selectedUserIdentifiers;
          break;
        case 'unassignment':
          payload.unassignedToIdentifiers = selectedUserIdentifiers;
          break;
        case 'unassign_all':
          payload.unAssignAll = true;
          break;
        default:
      }

      // send api request
      bulkEditTasksApi(payload)
        .then(({ transactionIdentifier }) => {
          refreshTaskWorkflows(allSelectedWorkflowIdentifiers);
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
      dispatch,
      allSelectedWorkflowIdentifiers,
      allSelectedTasksLength,
      shouldRefreshTasksEveryTime,
      refreshTasks,
      updateTasks,
      refreshTaskWorkflows,
    ],
  );

  const handleDuplicateTasks = useCallback(() => {
    const anyTaskHasAttachment = allSelectedTasks?.some(
      (task) => task?.attachments?.length > 0,
    );

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const confirmAction = (includeAttachmentsForDuplication = false) => {
      onMultiSelectAction('Duplicated');

      return bulkEditTasksApi({
        bulkEditType: 'DUPLICATE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
        includeAttachmentsForDuplication,
        includePatientForDuplication: true,
      }).then(({ transactionIdentifier, tasks: duplicatedTasks }) => {
        dispatch(bulkEditDuplicateTasksSuccess(duplicatedTasks));

        if (refreshTasks && typeof refreshTasks === 'function') {
          refreshTasks();
        }
        refreshTaskWorkflows(allSelectedWorkflowIdentifiers);

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
    allSelectedWorkflowIdentifiers,
    dispatch,
    refreshTasks,
    allSelectedTasksLength,
    onClose,
    shouldRefreshTasksEveryTime,
    deleteTasks,
    refreshTaskWorkflows,
  ]);

  const handleMoveTasks = useCallback(async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const standardConfirmAction = (selectedDestination) => {
      onMultiSelectAction('Moved');

      return bulkEditTasksApi({
        bulkEditType: 'MOVE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
        ...selectedDestination,
      }).then(({ transactionIdentifier }) => {
        if (refreshTasks && typeof refreshTasks === 'function') {
          refreshTasks();
        }
        refreshTaskWorkflows(allSelectedWorkflowIdentifiers);

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
    const moveTaskConfig = await (function () {
      if (
        parentTasks.length > 0 &&
        subtasks.length === 0 &&
        parentTasks?.every((task) => task?.subTasksCount === 0)
      ) {
        return { tasks: parentTasks, confirmAction: standardConfirmAction };
      }
      if (subtasks.length > 0 && parentTasks.length === 0) {
        return { tasks: subtasks, confirmAction: standardConfirmAction };
      }

      const formattedSelectedTasks = parentTasks.map((parentTask) => ({
        ...parentTasks,
        subtasks: subtasks?.filter(
          (subtask) =>
            subtask?.parentTaskIdentifier === parentTask.taskIdentifier,
        ),
      }));

      const anyTaskIsIncomplete = formattedSelectedTasks?.some(
        (task) => task?.subTasksCount !== task?.subtasks?.length,
      );

      return {
        tasks: formattedSelectedTasks,
        confirmAction: anyTaskIsIncomplete
          ? (selectedDestination) =>
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
    allSelectedWorkflowIdentifiers,
    dispatch,
    onClose,
    parentTasks,
    refreshTasks,
    subtasks,
    refreshTaskWorkflows,
  ]);

  const handleCompleteTasks = useCallback(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const confirmAction = () => {
      bulkEditComplete(allSelectedTasksIdentifiers, currentUser)(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'COMPLETE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
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
                  for (const task of tasks)
                    task.parentTaskIdentifier &&
                    (isEmpty(filters) || !filters) &&
                    !searchValue
                      ? updateTasks([task])
                      : addTasks([task]);
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

    if (!allRequiredFieldsExist) {
      const modalProps = {
        incompleteFields: [],
      };
      modalActions.openModal('CompleteAllFields', modalProps);
      return;
    }

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
    allRequiredFieldsExist,
    allParentTasksHaveRelatedSubtasks,
    allSelectedTasksIdentifiers,
    currentUser,
    dispatch,
    allSelectedWorkflowIdentifiers,
    taskListIdentifier,
    allSelectedTasksLength,
    shouldRefreshTasksEveryTime,
    refreshTasks,
    onClose,
    filters,
    searchValue,
    updateTasks,
    addTasks,
    modalActions,
  ]);

  const handleEditFields = useCallback(() => {
    dispatch(
      openModal('TaskListCustomFieldsBulkEdit', {
        taskIdentifiers: selectedTasks.parentTasks?.map(
          ({ taskIdentifier }) => taskIdentifier,
        ),
        taskListIdentifier,
        customFields: allTaskCustomFields,
        onSave: () => {
          dispatch(closeModal());
        },
      }),
    );
  }, [dispatch, selectedTasks, taskListIdentifier, allTaskCustomFields]);

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
            taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
          })
            .then(({ transactionIdentifier }) => {
              dispatch(getTasksGroupsList());
              dispatch(getListDetailsTaskCounters(taskListIdentifier));

              if (refreshTasks && typeof refreshTasks === 'function') {
                refreshTasks();
              }

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
    allSelectedWorkflowIdentifiers,
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
      numberOfSelectedItems={allSelectedTasksLength}
      isDisabled={isDisabled}
      onClose={onClose}
      includedWorkflow={
        !!allSelectedTasks.find((t) => t?.itemType === 'BUNDLE')
      }
    >
      <>
        {mergedConfig[BulkEditOptionsConfig.DUPLICATE_OPTION] && (
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
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
          </AccessRestrictor>
        )}
        {mergedConfig[BulkEditOptionsConfig.MOVE_OPTION] && (
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
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
          </AccessRestrictor>
        )}
        {mergedConfig[BulkEditOptionsConfig.COMPLETE_OPTION] && (
          <Button
            type="button"
            onClick={handleCompleteTasks}
            disabled={isDisabled}
          >
            <BulkEditOption
              iconComponent={CompleteIcon}
              title="Complete"
              isDisabled={isDisabled}
            />
          </Button>
        )}
        {mergedConfig[BulkEditOptionsConfig.EDIT_CUSTOM_FIELDS_OPTION] && (
          <Button
            type="button"
            onClick={handleEditFields}
            disabled={isDisabled}
          >
            <BulkEditOption
              iconComponent={AppRegistrationIcon}
              title="Edit Fields"
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
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
            <BulkEditDueDateOption
              handleChangeDateTasks={handleChangeDateTasks}
              isDisabled={isDisabled}
            />
          </AccessRestrictor>
        )}
        {mergedConfig[BulkEditOptionsConfig.ASSIGN_OPTION] && (
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
            <BulkEditAssignToOption
              selectedTaskListIdentifiers={allSelectedTaskListIdentifiers}
              handleChangeAssigneTasks={handleChangeAssigneeTasks}
              isDisabled={isDisabled}
              selectedTasks={selectedTasks}
            />
          </AccessRestrictor>
        )}
        {mergedConfig[BulkEditOptionsConfig.DELETE_OPTION] && (
          <AccessRestrictor
            allowedToRoles={[ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE]}
          >
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
          </AccessRestrictor>
        )}
      </>
    </BulkEditBar>
  );
};

export default BulkEditOptionsBar;
