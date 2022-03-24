/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { toggleCompleteTask, moveTask } from 'actions/task-actions';

const initializeTaskDrawerTopSectionHooks = ({
  onDelete,
  onDuplicate,
  closeTaskDrawer,
}) => {
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const templateBundleIdentifier = selectedTask?.templateBundleIdentifier;
  const currentUser = useSelector(userProfileSelector);
  const isTemplateTask = checkIfTemplateTask(selectedTask);
  const isDecisionTask = selectedTask?.intentType === 'DECISION';
  const isDecisionSelected = selectedTask?.taskOutcomes?.reduce(
    (accumulator, currentValue) => accumulator || currentValue.isSelected,
    false,
  );
  const isTaskStatusTogglingDisabled =
    isTemplateTask || (isDecisionTask && !isDecisionSelected);
  const dependencyTasksCount = selectedTask?.dependencyTasksCount;
  const dependencyTasksCompletedCount =
    selectedTask?.dependencyTasksCompletedCount;
  const isDependencyEmptyOrCompleted =
    dependencyTasksCount === dependencyTasksCompletedCount;

  const handleMoveTask = () => {
    const hasSubtasks = selectedTask.subTasksCount !== 0;

    const confirmAction = ({
      taskListIdentifier,
      taskGroupIdentifier,
      parentTaskIdentifier,
    }) => {
      dispatch(
        moveTask(
          selectedTask,
          { taskListIdentifier },
          taskGroupIdentifier || null,
          parentTaskIdentifier || null,
        ),
      );
      closeTaskDrawer();
    };

    const openMoveTasksWithSubtasksModal = destination =>
      dispatch(
        openModal('MoveTasksWithSubtasks', {
          confirm: () => confirmAction(destination),
        }),
      );

    dispatch(
      openModal('SelectTaskDestination', {
        tasksToMove: [selectedTask],
        confirmText: 'Move',
        confirm: hasSubtasks ? openMoveTasksWithSubtasksModal : confirmAction,
        preventClosingModal: hasSubtasks,
      }),
    );
  };

  const deleteTask = async () => {
    await onDelete({
      afterDelete: () => {
        dispatch(closeModal());
        closeTaskDrawer();
      },
      selectedTask,
    });
  };

  const openDeleteConfirmationModal = () => {
    dispatch(
      openModal('DeleteTaskConfirmation', {
        isSubtask: !!selectedTask.parentTaskIdentifier,
        confirm: () => deleteTask(),
      }),
    );
  };

  const duplicateTaskWithAttachments = async () => {
    await onDuplicate({
      afterDuplicate: () => {
        dispatch(closeModal());
        closeTaskDrawer();
      },
      selectedTask,
      includeAttachments: true,
    })();
  };

  const duplicateTask = async () => {
    await onDuplicate({
      afterDuplicate: () => {
        dispatch(closeModal());
        closeTaskDrawer();
      },
      selectedTask,
      includeAttachments: false,
    })();
  };
  const openDuplicateConfirmationModal = () => {
    const modalProps = {
      confirm: () => duplicateTaskWithAttachments(),
      skip: () => duplicateTask(),
    };
    dispatch(openModal('AttachmentsDuplicate', modalProps));
  };

  const duplicateTaskWithoutConfirmation = event => {
    onDuplicate({
      afterDuplicate: () => {
        closeTaskDrawer();
      },
      selectedTask,
      includeAttachments: false,
    })(event);
  };

  const onCompleteToggle = useCallback(
    event => {
      if (!isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted) {
        const hasIncompletedSubtasks =
          selectedTask.subtasks?.length > 0
            ? selectedTask.subtasks.find(
                subtask => subtask.status === 'INCOMPLETE',
              )
            : selectedTask.subTasksCount - selectedTask.subTasksCompletedCount >
              0;

        let isBundleTask = false;
        if (templateBundleIdentifier !== '') {
          isBundleTask = true;
        }

        if (selectedTask.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
          const modalProps = {
            confirm: () => {
              dispatch(closeModal());
              toggleCompleteTask(
                { ...selectedTask, templateBundleIdentifier },
                currentUser,
                isBundleTask,
              )(dispatch);
              setTimeout(() => {
                closeTaskDrawer();
              }, 1000);
            },
          };
          dispatch(openModal('CompleteAllTasks', modalProps));
        } else {
          toggleCompleteTask(
            { ...selectedTask, templateBundleIdentifier },
            currentUser,
            isBundleTask,
          )(dispatch);
          setTimeout(() => {
            closeTaskDrawer();
          }, 1000);
        }
      }
      event.stopPropagation();
    },
    [
      isTaskStatusTogglingDisabled,
      isDependencyEmptyOrCompleted,
      selectedTask,
      templateBundleIdentifier,
      dispatch,
      currentUser,
      closeTaskDrawer,
    ],
  );

  const handleShareTask = () => {
    dispatch(
      openModal('ShareTask', { taskIdentifiers: [selectedTask.identifier] }),
    );
  };

  return {
    selectedTask,
    handleMoveTask,
    openDeleteConfirmationModal,
    openDuplicateConfirmationModal,
    duplicateTaskWithoutConfirmation,
    onCompleteToggle,
    dispatch,
    isDependencyEmptyOrCompleted,
    isTaskStatusTogglingDisabled,
    isTemplateTask,
    handleShareTask,
  };
};

export default initializeTaskDrawerTopSectionHooks;
