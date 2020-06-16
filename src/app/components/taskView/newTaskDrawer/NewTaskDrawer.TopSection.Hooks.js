/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useRef, useState } from 'react';
import useBoolean from 'hooks/useBoolean';

const initializeTaskDrawerTopSectionHooks = ({
  modalActions,
  onDelete,
  onDuplicate,
  closeTaskDrawer,
  selectedTask,
}) => {
  const filedInInputReference = useRef(null);
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
        modalActions.closeModal();
        closeTaskDrawer();
      },
      selectedTask,
    });
  };

  const openDeleteConfirmationModal = () => {
    const modalProps = {
      confirm: () => deleteTask(),
    };
    modalActions.openModal('DeleteTask', modalProps);
  };

  const duplicateTask = async () => {
    await onDuplicate({
      afterDuplicate: () => {
        modalActions.closeModal();
        closeTaskDrawer();
      },
      selectedTask,
    });
  };

  const openDuplicateConfirmationModal = () => {
    const modalProps = {
      confirm: () => duplicateTask(),
    };
    modalActions.openModal('DuplicateTask', modalProps);
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
  };
};

export default initializeTaskDrawerTopSectionHooks;
