/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo } from 'react';
import { CircleIcon } from 'components/task/styled';
import { Box, IconButton } from '@material-ui/core';
import { Close, MoreHoriz } from '@material-ui/icons';
import { checkIfTemplateTask, TaskStatus } from 'helpers/task-helpers';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { HorizontalLabel, FiledInListName } from '../styled';
import initializeTaskDrawerTopSectionHooks from './hooks';

const TopSection = ({
  onDelete,
  onDuplicate,
  closeTaskDrawer,
  setTourTaskMenuReference,
}) => {
  const {
    selectedTask,
    handleMoveTask,
    openDeleteConfirmationModal,
    openDuplicateConfirmationModal,
    duplicateTaskWithoutConfirmation,
    onCompleteToggle,
    isDependencyEmptyOrCompleted,
    isTaskStatusTogglingDisabled,
    isTemplateTask,
    handleShareTask,
  } = initializeTaskDrawerTopSectionHooks({
    onDelete,
    onDuplicate,
    closeTaskDrawer,
  });

  const options = useMemo(
    () => [
      {
        name: 'Move',
        onClick: handleMoveTask,
      },
      {
        name: 'Duplicate',
        onClick: () => {
          const hasAttachments = !!(
            selectedTask &&
            selectedTask.attachments &&
            selectedTask.attachments.length > 0
          );

          if (hasAttachments) {
            openDuplicateConfirmationModal();
          } else {
            duplicateTaskWithoutConfirmation();
          }
        },
      },
      !isTemplateTask && {
        name: 'Share Task',
        onClick: handleShareTask,
      },
      {
        name: 'Delete',
        color: palette.error,
        onClick: openDeleteConfirmationModal,
      },
    ],
    [
      isTemplateTask,
      duplicateTaskWithoutConfirmation,
      handleMoveTask,
      openDeleteConfirmationModal,
      openDuplicateConfirmationModal,
      selectedTask,
      handleShareTask,
    ],
  );

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box display="flex">
        {selectedTask && !checkIfTemplateTask(selectedTask) && (
          <>
            <HorizontalLabel>Mark Complete : </HorizontalLabel>
            <Spacing horizontal={3} />
            <CircleIcon
              src={
                selectedTask?.status === TaskStatus.COMPLETE
                  ? CircleCompleted
                  : Circle
              }
              isClickable={
                !isTaskStatusTogglingDisabled && isDependencyEmptyOrCompleted
              }
              isCompleted={selectedTask?.status === TaskStatus.COMPLETE}
              onClick={onCompleteToggle}
            />
            <Spacing horizontal={3} />
            <HorizontalLabel>Filed In: </HorizontalLabel>
            <Spacing horizontal={3} />
            <FiledInListName>
              {selectedTask?.taskList?.listName}
            </FiledInListName>
          </>
        )}
      </Box>
      <Box display="flex">
        <OptionsMenu options={options} customButtonComponent={IconButton}>
          <MoreHoriz
            ref={element => {
              if (element) setTourTaskMenuReference(element);
            }}
            color="primary"
          />
        </OptionsMenu>
        <Box mx={0.5} />
        <IconButton
          onClick={() => {
            closeTaskDrawer();
          }}
          size="small"
          color="secondary"
        >
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopSection;
