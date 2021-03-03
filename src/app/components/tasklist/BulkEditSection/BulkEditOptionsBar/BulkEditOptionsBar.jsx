/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { pluck } from 'ramda';
import { bulkEditTasks as bulkEditTasksApi } from 'api/task-api';
import palette from 'styles/palette';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import DuplicateIcon from 'img/bulk-edit/DuplicateIcon';
import CompleteIcon from 'img/bulk-edit/CompleteIcon';
import MoveIcon from 'img/bulk-edit/MoveIcon';
import DeleteIcon from 'img/bulk-edit/DeleteIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import * as AlertActions from 'alert/actions';
import {
  bulkEditAssignUser,
  bulkEditWorkflowStatus,
  bulkEditDueDate,
  bulkEditDelete,
  bulkEditComplete,
} from 'actions/task-actions';
import { getListDetailsTaskCounters } from 'actions/list-details-actions';
import { getTasksGroupsList } from 'sagas/list-details-saga';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';

import BulkEditAssignToOption from './BulkEditAssignToOption';
import BulkEditDueDateOption from './BulkEditDueDateOption';
import BulkEditWorkflowStatusOption from './BulkEditWorkflowStatusOption';

import {
  WrapperContainer,
  IconBox,
  CloseButton,
  CloseIcon,
  ButtonsWrapper,
  Container,
  TasksText,
  Button,
} from './styled';

const IconWithTooltip = ({ text, children }) => {
  if (text)
    return (
      <Tooltip placement="top" title={text}>
        {children}
      </Tooltip>
    );

  return children;
};

const BulkEditOptionsBar = ({
  selectedTasks = [],
  onClose,
  isDisabled,
  refreshTasks,
  currentUser,
  searchValue,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
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
      ...parentTasks?.map(({ taskIdentifier }) => taskIdentifier),
      ...subtasks?.map(({ taskIdentifier }) => taskIdentifier),
    ],
    [parentTasks, subtasks],
  );

  const allSelectedTasksLength = useMemo(() => allSelectedTasks.length, [
    allSelectedTasks,
  ]);

  const allSelectedTaskListIdentifiers = useMemo(
    () => [
      ...parentTasks?.map(task => task.taskList?.taskListIdentifier),
      ...subtasks?.map(task => task.taskList?.taskListIdentifier),
    ],
    [parentTasks, subtasks],
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
        workflowStatus,
      })
        .then(({ transactionIdentifier }) => {
          dispatch(
            AlertActions.showGlobalAlertWithUndo(
              `${allSelectedTasksLength} STATUS CHANGED`,
              transactionIdentifier,
              refreshTasks,
            ),
          );

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });
    },
    [
      allSelectedTasksIdentifiers,
      filters,
      searchValue,
      dispatch,
      allSelectedTasksLength,
      onClose,
      refreshTasks,
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
            AlertActions.showGlobalAlertWithUndo(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} DUE DATES CHANGED`
                : `${allSelectedTasksLength} DUE DATE CHANGED`,
              transactionIdentifier,
              refreshTasks,
            ),
          );

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });
    },
    [
      allSelectedTasksIdentifiers,
      filters,
      dispatch,
      allSelectedTasksLength,
      onClose,
      refreshTasks,
    ],
  );

  const handleChangeAssigneTasks = useCallback(
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
              refreshTasks,
            ),
          );
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });
    },
    [
      allSelectedTasksIdentifiers,
      filters,
      searchValue,
      dispatch,
      allSelectedTasksLength,
      refreshTasks,
    ],
  );

  const handleDuplicateTasks = useCallback(() => {
    const anyTaskHasAttachment = allSelectedTasks?.some(
      task => task?.hasAttachments,
    );

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const confirmAction = (includeAttachmentsForDuplication = false) =>
      bulkEditTasksApi({
        bulkEditType: 'DUPLICATE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        includeAttachmentsForDuplication,
      }).then(({ transactionIdentifier }) => {
        if (refreshTasks && typeof refreshTasks === 'function') {
          refreshTasks();
        }

        dispatch(
          AlertActions.showGlobalAlertWithUndo(
            allSelectedTasksLength > 1
              ? `${allSelectedTasksLength} TASKS DUPLICATED`
              : `${allSelectedTasksLength} TASK DUPLICATED`,
            transactionIdentifier,
            refreshTasks,
          ),
        );

        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });

    if (anyTaskHasAttachment) {
      dispatch(
        openModal('DuplicateTask', {
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
  ]);

  const handleMoveTasks = useCallback(async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const standardConfirmAction = selectedDestination =>
      bulkEditTasksApi({
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
          dispatch(getTasksGroupsList({ shouldSetRequestState: false }));
          dispatch(getListDetailsTaskCounters(taskListIdentifier));

          dispatch(
            AlertActions.showGlobalAlertWithUndo(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} TASKS COMPLETED`
                : `${allSelectedTasksLength} TASK COMPLETED`,
              transactionIdentifier,
              refreshTasks,
            ),
          );

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (refreshTasks && typeof refreshTasks === 'function') {
            refreshTasks();
          }
        });
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
    onClose,
    refreshTasks,
  ]);

  const handleDeleteTasks = useCallback(() => {
    dispatch(
      openModal('BulkDeleteTasks', {
        hasIncompleteParentTasks: !allParentTasksHaveRelatedSubtasks,
        confirm: () => {
          bulkEditDelete(allSelectedTasksIdentifiers)(dispatch);

          bulkEditTasksApi({
            bulkEditType: 'DELETE',
            taskIdentifiers: allSelectedTasksIdentifiers,
          })
            .then(({ transactionIdentifier }) => {
              dispatch(getTasksGroupsList({ shouldSetRequestState: false }));
              dispatch(getListDetailsTaskCounters(taskListIdentifier));
              dispatch(
                AlertActions.showGlobalAlertWithUndo(
                  allSelectedTasksLength > 1
                    ? `${allSelectedTasksLength} TASKS DELETED`
                    : `${allSelectedTasksLength} TASK DELETED`,
                  transactionIdentifier,
                  refreshTasks,
                ),
              );

              if (onClose && typeof onClose === 'function') {
                onClose();
              }
            })
            .catch(() => {
              if (refreshTasks && typeof refreshTasks === 'function') {
                refreshTasks();
              }
            });
        },
      }),
    );
  }, [
    dispatch,
    allParentTasksHaveRelatedSubtasks,
    allSelectedTasksIdentifiers,
    allSelectedTasksLength,
    taskListIdentifier,
    onClose,
    refreshTasks,
  ]);

  return (
    <Container open={allSelectedTasksLength > 0} isDisabled={isDisabled}>
      {allSelectedTasksLength > 0 && (
        <>
          <TasksText>
            {`${allSelectedTasksLength} Task${
              allSelectedTasksLength > 1 ? 's' : ''
            } Selected`}
          </TasksText>
          <ButtonsWrapper>
            <Button
              type="button"
              onClick={handleDuplicateTasks}
              disabled={isDisabled}
            >
              <WrapperContainer disabled={isDisabled}>
                <IconBox>
                  <DuplicateIcon />
                </IconBox>
                <p>Duplicate</p>
              </WrapperContainer>
            </Button>
            <IconWithTooltip
              text={
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
                <WrapperContainer disabled={disabledMoveAction || isDisabled}>
                  <IconBox>
                    <MoveIcon />
                  </IconBox>
                  <p>Move</p>
                </WrapperContainer>
              </Button>
            </IconWithTooltip>
            <Button
              type="button"
              onClick={handleCompleteTasks}
              disabled={isDisabled}
            >
              <WrapperContainer disabled={isDisabled}>
                <IconBox>
                  <CompleteIcon />
                </IconBox>
                <p>Complete</p>
              </WrapperContainer>
            </Button>
            <BulkEditWorkflowStatusOption
              handleChangeWorkflowStatusTasks={handleChangeWorkflowStatusTasks}
              isDisabled={isDisabled}
            />
            <BulkEditDueDateOption
              handleChangeDateTasks={handleChangeDateTasks}
              isDisabled={isDisabled}
            />
            <BulkEditAssignToOption
              selectedTaskListIdentifiers={allSelectedTaskListIdentifiers}
              handleChangeAssigneTasks={handleChangeAssigneTasks}
              isDisabled={isDisabled}
              selectedTasks={selectedTasks}
            />
            <Button
              type="button"
              onClick={handleDeleteTasks}
              disabled={isDisabled}
            >
              <WrapperContainer color={palette.oPlusRed} disabled={isDisabled}>
                <IconBox>
                  <DeleteIcon />
                </IconBox>
                <p>Delete</p>
              </WrapperContainer>
            </Button>
            <CloseButton type="button" onClick={onClose} disabled={isDisabled}>
              <CloseIcon />
            </CloseButton>
          </ButtonsWrapper>
        </>
      )}
    </Container>
  );
};

export default BulkEditOptionsBar;
