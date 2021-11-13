/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
// eslint-disable-next-line import/no-named-as-default
import { useBoolean } from 'hooks/useBoolean';
import { taskListsSelector } from 'selectors/task-list-selectors';
import { toggleCompleteTask } from 'actions/task-actions';
import useActions from 'hooks/use-actions';
import * as ListDetailsActions from 'actions/list-details-actions';
import { ListDetailsSagaActions } from 'sagas/list-details-saga';

const initializeTaskDrawerTopSectionHooks = ({
  onDelete,
  onDuplicate,
  closeTaskDrawer,
  selectedTask,
  currentUser,
  templateBundleIdentifier,
  isTaskStatusTogglingDisabled,
  isDependencyEmptyOrCompleted,
}) => {
  const filedInInputReference = useRef(null);
  const dispatch = useDispatch();
  const taskLists = useSelector(taskListsSelector);

  const listDetailsSagaActions = useActions(ListDetailsSagaActions);
  const listDetailsActions = useActions(ListDetailsActions);

  const [
    isFiledInPopoverOpen,
    openFiledInPopover,
    closeFiledInPopover,
  ] = useBoolean(false);

  const [filedInInputValue, setFiledInInputValue] = useState('');

  const onFiledInInputChange = useCallback((_event, value, reason) => {
    if (reason === 'input') {
      setFiledInInputValue(value);
    }
  }, []);

  const taskMenuReference = useRef(null);
  const [
    isTaskMenuPopoverOpen,
    openTaskMenuPopover,
    closeTaskMenuPopover,
  ] = useBoolean(false);

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
            ? selectedTask.subtasks.find(subtask => subtask.status === 'INCOMPLETE')
            : selectedTask.subTasksCount - selectedTask.subTasksCompletedCount > 0;

        var isBundleTask = false;
        if(templateBundleIdentifier != ""){
          isBundleTask = true;
        }

        if (selectedTask.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
          const taskListIdentifier = selectedTask.taskListIdentifier;
          const modalProps = {
            confirm: () => {
              dispatch(closeModal());
              toggleCompleteTask({ ...selectedTask, templateBundleIdentifier }, currentUser, isBundleTask)(dispatch);
              setTimeout(() => {
                closeTaskDrawer();
              }, 1000);
              
            },
          };
          dispatch(openModal('CompleteAllTasks', modalProps));
        } else {
          toggleCompleteTask({ ...selectedTask, templateBundleIdentifier }, currentUser, isBundleTask)(dispatch);
          setTimeout(() => {
            closeTaskDrawer();
          }, 1000);
        }
      }
      event.stopPropagation();
    },
    [
      currentUser,
      templateBundleIdentifier,
      toggleCompleteTask,
      selectedTask,
      isTaskStatusTogglingDisabled,
      isDependencyEmptyOrCompleted,
      openModal,
      closeModal,
    ],
  );

  return {
    filedInInputReference,
    isFiledInPopoverOpen,
    openFiledInPopover,
    closeFiledInPopover,
    filedInInputValue,
    onFiledInInputChange,
    taskMenuReference,
    isTaskMenuPopoverOpen,
    openTaskMenuPopover,
    closeTaskMenuPopover,
    openDeleteConfirmationModal,
    openDuplicateConfirmationModal,
    duplicateTaskWithoutConfirmation,
    onCompleteToggle,
    taskLists,
    dispatch,
  };
};

export default initializeTaskDrawerTopSectionHooks;
