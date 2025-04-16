/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo, useCallback, useState } from 'react';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useParams } from 'react-router-dom';
import isEmpty from 'ramda/src/isEmpty';
import { bulkEditTasks as bulkEditTasksApi } from 'api/task-api';
import * as ModalActions from 'modal/actions';
import {
  checkDateTimeIntent,
  checkIfTemplateTask,
  DueDateIntent,
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
import {
  selectedUserOrganizationSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import {
  bulkEditTasks,
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
import {
  checkIfUserIsOrganizationAdmin,
  UserOrganizationRole,
} from 'helpers/user-helper';
import AccessRestrictor from 'components/access/AccessRestrictor/AccessRestrictor';
import BulkEditAssignToOption from './BulkEditAssignToOption';
import BulkEditDueDateOption from './BulkEditDueDateOption';
import BulkEditWorkflowStatusOption from './BulkEditWorkflowStatusOption';
import { Button } from './styled';
import moment from 'moment';
import { currentTaskListSelector } from '@/app/selectors/task-list-selectors';
import { isMemberAdmin } from '@/app/helpers/list-members-helper';

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
  allTasks = [],
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const currentUser = useSelector(userProfileSelector);
  const selectedOrganization = useSelector(selectedUserOrganizationSelector);
  const currentTasklist = useSelector(currentTaskListSelector);
  const dispatch = useDispatch();
  const { taskListIdentifier } = useParams();
  const filters = useSelector(selectedFiltersInMegaFilterSelector);
  const { parentTasks = [], subtasks = [] } = selectedTasks;
  const modalActions = useActions(ModalActions);
  const [bulkTasksDueDate, setBulkTasksDueDate] = useState();
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
    () =>
      taskListIdentifier
        ? [...(organizationCustomFields ?? []), ...(listCustomFields ?? [])]
        : organizationCustomFields ?? [],
    [organizationCustomFields, listCustomFields, taskListIdentifier],
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

  const isListAdmin = useMemo(() => {
    const currentUserMember = currentTasklist?.listUsers?.find(
      (u) => u.identifier === currentUser?.identifier,
    );
    const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);
    return isMemberAdmin(currentUserMember) || isOwnerOrAdmin;
  }, [currentUser, currentTasklist]);

  const checkIsCreatorOrIsAssigneeToAllSelectedTasks = useMemo(() => {
    const currentUserIdentifier = currentUser.userIdentifier;
    return allSelectedTasks.every((task) => {
      const isCreator = task.creator.userIdentifier === currentUserIdentifier;

      const isAssigned = task.assignedToUsers.some(
        (user) => user.userIdentifier === currentUserIdentifier,
      );

      return isCreator || isAssigned;
    });
  }, [allSelectedTasks]);

  const nonAssigneeCompleteDisabled = useMemo(() => {
    const nonAssigneeCompleteDisabledItem =
      selectedOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.non-assignee.complete.enabled',
      ) || {};

    return (
      nonAssigneeCompleteDisabledItem &&
      nonAssigneeCompleteDisabledItem?.value === 'true' &&
      !checkIsCreatorOrIsAssigneeToAllSelectedTasks &&
      !isListAdmin
    );
  }, [
    checkIsCreatorOrIsAssigneeToAllSelectedTasks,
    selectedOrganization,
    isListAdmin,
  ]);

  const allSelectedTasksIdentifiers = useMemo(
    () => [
      ...parentTasks
        ?.filter((t) => t?.itemType === 'TASK')
        ?.map(({ identifier }) => identifier),
      ...subtasks?.map(({ identifier }) => identifier),
    ],
    [parentTasks, subtasks],
  );

  const allSelectedTasksPatientIdentifiers = useMemo(() => {
    return [
      ...parentTasks
        ?.filter((t) => t?.itemType === 'TASK')
        ?.map(({ patient }) => patient?.patientIdentifier),
      ...subtasks?.map(({ patient }) => patient?.patientIdentifier),
    ];
  }, [parentTasks, subtasks]);

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

      const dueDateIntent = checkDateTimeIntent(dueDate);

      bulkEditTasksApi({
        bulkEditType: 'DUE_DATE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
        dueDate: dueDate
          ? dueDateIntent === DueDateIntent.DATE
            ? moment.utc(dueDate).startOf('day').toISOString()
            : moment(dueDate).toISOString()
          : null,
        dueDateIntent: dueDate ? dueDateIntent : DueDateIntent.DATE,
      })
        .then(({ transactionIdentifier }) => {
          dispatch(
            bulkEditDueDateSuccess(allSelectedTasksIdentifiers, dueDate),
          );
          setBulkTasksDueDate(dueDate);
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

          // if (onClose && typeof onClose === 'function') {
          //   onClose();
          // }
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
      // onClose,
      updateTasks,
      refreshTaskWorkflows,
    ],
  );

  const handleChangeAssigneeTasks = useCallback(
    /**
     *
     * @param {Array} selectedUsers users to send over api, assigned users list or newly unassigned users list
     * @param {'assignment' | 'unassignment' | 'unassign_all'} assignOption
     */
    (selectedUsers, assignOption) => {
      // NOTE: prepare payload for api
      const payload = {
        bulkEditType: 'ASSIGN',
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
      };

      const selectedUserIdentifiers = selectedUsers?.map(
        ({ userIdentifier, identifier }) => userIdentifier ?? identifier,
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
      // bulkEditTasksApi(payload)
      //   .then(({ transactionIdentifier }) => {
      //     dispatch(
      //       AlertActions.showGlobalAlertWithUndo(
      //         allSelectedTasksLength > 1
      //           ? `${allSelectedTasksLength} TASKS ASSIGNED`
      //           : `${allSelectedTasksLength} TASK ASSIGNED`,
      //         transactionIdentifier,
      //         ({ tasks }) => {
      //           if (
      //             shouldRefreshTasksEveryTime &&
      //             refreshTasks &&
      //             typeof refreshTasks === 'function'
      //           ) {
      //             refreshTasks();
      //           } else {
      //             updateTasks(tasks);
      //           }
      //         },
      //       ),
      //     );
      //     // bulkEditTasks(
      //     //   payload,
      //     //   allSelectedTasksLength,
      //     //   shouldRefreshTasksEveryTime,
      //     //   refreshTasks,
      //     //   updateTasks,
      //     // )(dispatch);
      //     // NOTE: update assignees in redux state
      //     if (assignOption === 'unassign_all') {
      //       bulkEditUnassignAllUsers(
      //         allSelectedTasksIdentifiers?.length === 0 &&
      //           allSelectedWorkflowIdentifiers?.length > 0
      //           ? allSelectedWorkflowIdentifiers
      //           : allSelectedTasksIdentifiers,
      //       )(dispatch);
      //     } else {
      //       const methods = {
      //         assignment: bulkEditAssignUsers,
      //         unassignment: bulkEditUnassignUsers,
      //       };
      //       methods[assignOption]?.(
      //         allSelectedTasksIdentifiers?.length === 0 &&
      //           allSelectedWorkflowIdentifiers?.length > 0
      //           ? allSelectedWorkflowIdentifiers
      //           : allSelectedTasksIdentifiers,
      //         selectedUsers,
      //       )(dispatch);
      //     }

      //     if (
      //       shouldRefreshTasksEveryTime &&
      //       refreshTasks &&
      //       typeof refreshTasks === 'function'
      //     ) {
      //       refreshTasks();
      //     }
      //   })
      //   .catch(() => {
      //     if (refreshTasks && typeof refreshTasks === 'function') {
      //       refreshTasks();
      //     }
      //   });
      const callback = (error, response) => {
        if (error) {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        } else {
          const { transactionIdentifier } = response;
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
        }
        if (assignOption === 'unassign_all') {
          bulkEditUnassignAllUsers(
            allSelectedTasksIdentifiers?.length === 0 &&
              allSelectedWorkflowIdentifiers?.length > 0
              ? allSelectedWorkflowIdentifiers
              : allSelectedTasksIdentifiers,
          )(dispatch);
        } else {
          const methods = {
            assignment: bulkEditAssignUsers,
            unassignment: bulkEditUnassignUsers,
          };
          methods[assignOption]?.(
            allSelectedTasksIdentifiers?.length === 0 &&
              allSelectedWorkflowIdentifiers?.length > 0
              ? allSelectedWorkflowIdentifiers
              : allSelectedTasksIdentifiers,
            selectedUsers,
          )(dispatch);
        }

        if (
          shouldRefreshTasksEveryTime &&
          refreshTasks &&
          typeof refreshTasks === 'function'
        ) {
          refreshTasks();
        }
      };
      dispatch(bulkEditTasks(payload, callback));
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
    const itemTasks = allTasks
      .filter((task) => task.itemType === 'TASK')
      .map((task) => ({
        identifier: task.identifier,
        ...(task.templateTaskIdentifier && {
          templateTaskIdentifier: task.templateTaskIdentifier,
        }),
      }));

    const itemBundles = allTasks
      .filter((task) => task.itemType === 'BUNDLE')
      .map((bundle) => ({
        identifier: bundle.identifier,
        tasks: bundle.tasks || [],
      }));

    const bundleTaskIdentifiers = new Set(
      itemBundles.flatMap((bundle) => bundle.tasks),
    );

    const unmatchedTasks = itemTasks.filter(
      (task) => !bundleTaskIdentifiers.has(task.identifier),
    );

    if (unmatchedTasks.some((task) => task.templateTaskIdentifier)) {
      dispatch(
        modalActions.openModal('Alert', {
          description:
            'Moving workflow tasks is not permitted. Please unselect tasks that belong to a workflow.',
          confirm: () => {
            dispatch(modalActions.closeModal());
          },
        }),
      );
      return;
    }

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
        modalLabel: 'Move to List',
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
                  for (const task of tasks) {
                    if (
                      task.parentTaskIdentifier &&
                      (isEmpty(filters) || !filters) &&
                      !searchValue
                    ) {
                      updateTasks([task]);
                    } else {
                      addTasks([task]);
                    }
                  }
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
        taskIdentifiers: allSelectedTasksIdentifiers,
        taskWorkflowIdentifiers: allSelectedWorkflowIdentifiers,
        patientIdentifiers: allSelectedTasksPatientIdentifiers,
        customFields: allTaskCustomFields,
        onSave: () => {
          dispatch(closeModal());
        },
      }),
    );
  }, [
    dispatch,
    allSelectedTasksIdentifiers,
    allTaskCustomFields,
    allSelectedWorkflowIdentifiers,
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
      includedWorkflow={allSelectedTasks.some((t) => t?.itemType === 'BUNDLE')}
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
            disabled={isDisabled || nonAssigneeCompleteDisabled}
          >
            <BulkEditOption
              iconComponent={CompleteIcon}
              title="Complete"
              isDisabled={isDisabled || nonAssigneeCompleteDisabled}
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
              selectedDate={bulkTasksDueDate}
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
              isBulkEdit
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
