/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import useBoolean from 'hooks/useBoolean';
import { taskListsSelector } from 'selectors/task-list-selectors';

const initializeTaskDrawerTopSectionHooks = ({
  onDelete,
  onDuplicate,
  closeTaskDrawer,
  selectedTask,
}) => {
  const filedInInputReference = useRef(null);
  const dispatch = useDispatch();
  const taskLists = useSelector(taskListsSelector);

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
      openModal('DeleteTask', {
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
    taskLists,
    dispatch,
  };
};

export default initializeTaskDrawerTopSectionHooks;
