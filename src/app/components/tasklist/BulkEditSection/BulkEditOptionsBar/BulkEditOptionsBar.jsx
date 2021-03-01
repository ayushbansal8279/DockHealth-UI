/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  refreshTasksOnBulkAction,
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
        .then(() => {
          dispatch(
            AlertActions.showGlobalAlert(
              `${allSelectedTasksLength} STATUS CHANGED`,
            ),
          );

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (
            refreshTasksOnBulkAction &&
            typeof refreshTasksOnBulkAction === 'function'
          ) {
            refreshTasksOnBulkAction();
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
      refreshTasksOnBulkAction,
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
        .then(() => {
          dispatch(
            AlertActions.showGlobalAlert(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} DUE DATES CHANGED`
                : `${allSelectedTasksLength} DUE DATE CHANGED`,
            ),
          );

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (
            refreshTasksOnBulkAction &&
            typeof refreshTasksOnBulkAction === 'function'
          ) {
            refreshTasksOnBulkAction();
          }
        });
    },
    [
      allSelectedTasksIdentifiers,
      filters,
      dispatch,
      allSelectedTasksLength,
      onClose,
      refreshTasksOnBulkAction,
    ],
  );

  const handleChangeAssigneTasks = useCallback(
    assignedUser => {
      bulkEditAssignUser(
        allSelectedTasksIdentifiers,
        assignedUser,
        filters,
        searchValue,
      )(dispatch);

      bulkEditTasksApi({
        bulkEditType: 'ASSIGN',
        taskIdentifiers: allSelectedTasksIdentifiers,
        assignedToIdentifier: assignedUser?.userIdentifier,
      })
        .then(() => {
          dispatch(
            AlertActions.showGlobalAlert(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} TASKS ASSIGNED`
                : `${allSelectedTasksLength} TASK ASSIGNED`,
            ),
          );

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (
            refreshTasksOnBulkAction &&
            typeof refreshTasksOnBulkAction === 'function'
          ) {
            refreshTasksOnBulkAction();
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
      refreshTasksOnBulkAction,
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
      }).then(() => {
        if (
          refreshTasksOnBulkAction &&
          typeof refreshTasksOnBulkAction === 'function'
        ) {
          refreshTasksOnBulkAction();
        }

        dispatch(
          AlertActions.showGlobalAlert(
            allSelectedTasksLength > 1
              ? `${allSelectedTasksLength} TASKS DUPLICATED`
              : `${allSelectedTasksLength} TASK DUPLICATED`,
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
    refreshTasksOnBulkAction,
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
      }).then(() => {
        if (
          refreshTasksOnBulkAction &&
          typeof refreshTasksOnBulkAction === 'function'
        ) {
          refreshTasksOnBulkAction();
        }

        dispatch(
          AlertActions.showGlobalAlert(
            allSelectedTasksLength > 1
              ? `${allSelectedTasksLength} TASKS MOVED`
              : `${allSelectedTasksLength} TASK MOVED`,
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
    refreshTasksOnBulkAction,
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
        .then(() => {
          dispatch(getTasksGroupsList({ shouldSetRequestState: false }));
          dispatch(getListDetailsTaskCounters(taskListIdentifier));

          dispatch(
            AlertActions.showGlobalAlert(
              allSelectedTasksLength > 1
                ? `${allSelectedTasksLength} TASKS COMPLETED`
                : `${allSelectedTasksLength} TASK COMPLETED`,
            ),
          );

          if (onClose && typeof onClose === 'function') {
            onClose();
          }
        })
        .catch(() => {
          if (
            refreshTasksOnBulkAction &&
            typeof refreshTasksOnBulkAction === 'function'
          ) {
            refreshTasksOnBulkAction();
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
    refreshTasksOnBulkAction,
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
            .then(() => {
              dispatch(getTasksGroupsList({ shouldSetRequestState: false }));
              dispatch(getListDetailsTaskCounters(taskListIdentifier));
              dispatch(
                AlertActions.showGlobalAlert(
                  allSelectedTasksLength > 1
                    ? `${allSelectedTasksLength} TASKS DELETED`
                    : `${allSelectedTasksLength} TASK DELETED`,
                ),
              );

              if (onClose && typeof onClose === 'function') {
                onClose();
              }
            })
            .catch(() => {
              if (
                refreshTasksOnBulkAction &&
                typeof refreshTasksOnBulkAction === 'function'
              ) {
                refreshTasksOnBulkAction();
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
    refreshTasksOnBulkAction,
  ]);

  return (
    <Container open={allSelectedTasksLength > 0} isDisabled={isDisabled}>
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
          taskListIdentifier={taskListIdentifier}
          selectedTaskListIdentifiers={allSelectedTaskListIdentifiers}
          handleChangeAssigneTasks={handleChangeAssigneTasks}
          isDisabled={isDisabled}
        />
        <Button type="button" onClick={handleDeleteTasks} disabled={isDisabled}>
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
    </Container>
  );
};

export default BulkEditOptionsBar;
