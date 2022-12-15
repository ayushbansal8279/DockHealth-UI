/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  selectedTaskSelector,
  taskCustomFieldsSelector,
} from 'selectors/task-drawer-selectors';
import { toggleCompleteTask, moveTask } from 'actions/task-actions';
import { useParams, useHistory } from 'react-router-dom';
import { HOME_PATH } from 'routing/helpers/paths';

const initializeTaskDrawerTopSectionHooks = ({
  onDelete,
  onDuplicate,
  closeTaskDrawer,
}) => {
  const { identifier } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedTask = useSelector(selectedTaskSelector);
  const templateBundleIdentifier = selectedTask?.templateBundleIdentifier;
  const currentUser = useSelector(userProfileSelector);
  const { templates } = useSelector(taskCustomFieldsSelector);
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
      if (!identifier) {
        closeTaskDrawer();
      } else {
        history.push(HOME_PATH);
      }
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
    event => {
      const incompleteRequiredFields = templates.filter(field => {
        const { taskMetaData } = selectedTask;
        const { identifier: taskFieldIdentifier } = field;
        const matchingMetaData = taskMetaData.find(
          ({ customFieldIdentifier, value }) => {
            return (
              customFieldIdentifier === taskFieldIdentifier && /\s/g.test(value)
            );
          },
        );
        return (
          field.displayOptions.includes('TASK_REQUIRED') &&
          (matchingMetaData === undefined || matchingMetaData?.length === 0)
        );
      });

      const isRequiredFieldsIncomplete = incompleteRequiredFields.length > 0;

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

        if (isRequiredFieldsIncomplete) {
          const modalProps = {
            incompleteFields: incompleteRequiredFields,
          };
          dispatch(openModal('CompleteAllFields', modalProps));
        } else if (
          selectedTask.status === 'INCOMPLETE' &&
          hasIncompletedSubtasks
        ) {
          const modalProps = {
            confirm: () => {
              dispatch(closeModal());
              toggleCompleteTask(
                { ...selectedTask, templateBundleIdentifier },
                currentUser,
                isBundleTask,
              )(dispatch);
              if (!identifier) {
                setTimeout(() => {
                  closeTaskDrawer();
                }, 1000);
              }
            },
          };
          dispatch(openModal('CompleteAllTasks', modalProps));
        } else {
          toggleCompleteTask(
            { ...selectedTask, templateBundleIdentifier },
            currentUser,
            isBundleTask,
          )(dispatch);
          if (!identifier) {
            setTimeout(() => {
              closeTaskDrawer();
            }, 1000);
          }
        }
      }
      event.stopPropagation();
    },
    [
      isTaskStatusTogglingDisabled,
      isDependencyEmptyOrCompleted,
      selectedTask,
      templates,
      templateBundleIdentifier,
      dispatch,
      currentUser,
      identifier,
      closeTaskDrawer,
    ],
  );

  const handleShareTask = () => {
    dispatch(
      openModal('ShareTask', { taskIdentifier: selectedTask.identifier }),
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
