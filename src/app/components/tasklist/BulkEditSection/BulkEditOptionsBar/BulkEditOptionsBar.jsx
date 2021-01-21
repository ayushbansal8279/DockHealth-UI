/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { bulkEditTasks as bulkEditTasksApi } from 'api/task-api';
import palette from 'styles/palette';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import DuplicateIcon from 'img/bulk-edit/DuplicateIcon';
import CompleteIcon from 'img/bulk-edit/CompleteIcon';
import MoveIcon from 'img/bulk-edit/MoveIcon';
import DeleteIcon from 'img/bulk-edit/DeleteIcon';
import Tooltip from 'components/common/Tooltip/Tooltip';
import * as AlertActions from 'alert/actions';
import BulkEditAssignToOption from './BulkEditAssignToOption';
import BulkEditDueDateOption from './BulkEditDueDateOption';
import BulkEditWorkflowStatusOption from './BulkEditWorkflowStatusOption';

import {
  IconButton,
  IconBox,
  CloseButton,
  CloseIcon,
  ButtonsWrapper,
  Container,
  TasksText,
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const { taskListIdentifier } = useParams();
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

  const handleChangeWorkflowStatusTasks = useCallback(
    workflowStatus => {
      bulkEditTasksApi({
        bulkEditType: 'STATUS',
        taskIdentifiers: allSelectedTasksIdentifiers,
        workflowStatus,
      }).then(() => {
        if (
          refreshTasksOnBulkAction &&
          typeof refreshTasksOnBulkAction === 'function'
        ) {
          refreshTasksOnBulkAction();
        }

        dispatch(
          AlertActions.showGlobalAlert(
            `${allSelectedTasksLength} STATUS CHANGED`,
          ),
        );

        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });
    },
    [
      allSelectedTasksIdentifiers,
      refreshTasksOnBulkAction,
      dispatch,
      allSelectedTasksLength,
      onClose,
    ],
  );

  const handleChangeDateTasks = useCallback(
    dueDate => {
      bulkEditTasksApi({
        bulkEditType: 'DUE_DATE',
        taskIdentifiers: allSelectedTasksIdentifiers,
        dueDate,
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
              ? `${allSelectedTasksLength} DUE DATES CHANGED`
              : `${allSelectedTasksLength} DUE DATE CHANGED`,
          ),
        );

        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });
    },
    [
      allSelectedTasksIdentifiers,
      refreshTasksOnBulkAction,
      dispatch,
      allSelectedTasksLength,
      onClose,
    ],
  );

  const handleChangeAssigneTasks = useCallback(
    assignedUserIdentifier => {
      bulkEditTasksApi({
        bulkEditType: 'ASSIGN',
        taskIdentifiers: allSelectedTasksIdentifiers,
        assignedToIdentifier: assignedUserIdentifier,
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
              ? `${allSelectedTasksLength} TASKS ASSIGNED`
              : `${allSelectedTasksLength} TASK ASSIGNED`,
          ),
        );

        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });
    },
    [
      allSelectedTasksIdentifiers,
      refreshTasksOnBulkAction,
      dispatch,
      allSelectedTasksLength,
      onClose,
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
                openModal('BulkMoveTasks', {
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
    const confirmAction = () =>
      bulkEditTasksApi({
        bulkEditType: 'COMPLETE',
        taskIdentifiers: allSelectedTasksIdentifiers,
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
              ? `${allSelectedTasksLength} TASKS COMPLETED`
              : `${allSelectedTasksLength} TASK COMPLETED`,
          ),
        );

        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });

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
    refreshTasksOnBulkAction,
    dispatch,
    allSelectedTasksLength,
    onClose,
  ]);

  const handleDeleteTasks = useCallback(() => {
    dispatch(
      openModal('BulkDeleteTasks', {
        hasIncompleteParentTasks: !allParentTasksHaveRelatedSubtasks,
        confirm: () => {
          bulkEditTasksApi({
            bulkEditType: 'DELETE',
            taskIdentifiers: allSelectedTasksIdentifiers,
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
                  ? `${allSelectedTasksLength} TASKS DELETED`
                  : `${allSelectedTasksLength} TASK DELETED`,
              ),
            );

            if (onClose && typeof onClose === 'function') {
              onClose();
            }
          });
        },
      }),
    );
  }, [
    dispatch,
    allParentTasksHaveRelatedSubtasks,
    allSelectedTasksIdentifiers,
    refreshTasksOnBulkAction,
    allSelectedTasksLength,
    onClose,
  ]);

  return (
    <Container open={allSelectedTasksLength > 0} isDisabled={isDisabled}>
      <TasksText>
        {`${allSelectedTasksLength} Task${
          allSelectedTasksLength > 1 ? 's' : ''
        } Selected`}
      </TasksText>
      <ButtonsWrapper>
        <IconButton
          type="button"
          onClick={handleDuplicateTasks}
          disabled={isDisabled}
        >
          <IconBox>
            <DuplicateIcon />
          </IconBox>
          <p>Duplicate</p>
        </IconButton>
        <IconWithTooltip
          text={
            disabledMoveAction
              ? 'Cannot move subtasks without main tasks'
              : null
          }
        >
          <IconButton
            type="button"
            disabled={disabledMoveAction || isDisabled}
            onClick={handleMoveTasks}
          >
            <IconBox>
              <MoveIcon />
            </IconBox>
            <p>Move</p>
          </IconButton>
        </IconWithTooltip>
        <IconButton
          type="button"
          onClick={handleCompleteTasks}
          disabled={isDisabled}
        >
          <IconBox>
            <CompleteIcon />
          </IconBox>
          <p>Complete</p>
        </IconButton>
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
          handleChangeAssigneTasks={handleChangeAssigneTasks}
          isDisabled={isDisabled}
        />
        <IconButton
          type="button"
          color={palette.oPlusRed}
          onClick={handleDeleteTasks}
          disabled={isDisabled}
        >
          <IconBox>
            <DeleteIcon />
          </IconBox>
          <p>Delete</p>
        </IconButton>
        <CloseButton type="button" onClick={onClose} disabled={isDisabled}>
          <CloseIcon />
        </CloseButton>
      </ButtonsWrapper>
    </Container>
  );
};

export default BulkEditOptionsBar;
