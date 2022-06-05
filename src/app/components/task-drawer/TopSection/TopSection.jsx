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
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import {
  userHasSendEmailFeatureSelector,
  userHasSendFaxFeatureSelector,
} from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import { HorizontalLabel, FiledInListName } from '../styled';
import initializeTaskDrawerTopSectionHooks from './hooks';

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TopSection = ({
  restrictions,
  onDelete,
  onDuplicate,
  closeTaskDrawer,
  setTourTaskMenuReference,
  hideCloseIcon,
  handleCopyLink,
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
  } = initializeTaskDrawerTopSectionHooks({
    onDelete,
    onDuplicate,
    closeTaskDrawer,
  });
  const dispatch = useDispatch();

  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const sendFaxAvailable = useSelector(userHasSendFaxFeatureSelector);

  const options = useMemo(
    () => [
      {
        name: 'Move',
        onClick: handleMoveTask,
        restriction: restrictions?.move === DISABLED,
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
        restriction: restrictions?.duplicate === DISABLED,
      },
      {
        name: 'Copy task link',
        onClick: handleCopyLink,
      },
      sendEmailAvailable && {
        name: 'Send Email',
        onClick: () => dispatch(openModal('SendEmailFromTask')),
      },
      sendFaxAvailable && {
        name: 'Send FAX',
        onClick: () => dispatch(openModal('SendFaxFromTask')),
      },
      {
        name: 'Delete',
        color: palette.error,
        onClick: openDeleteConfirmationModal,
        restriction: restrictions?.delete === DISABLED,
      },
    ],
    [
      handleMoveTask,
      restrictions,
      handleCopyLink,
      sendEmailAvailable,
      sendFaxAvailable,
      openDeleteConfirmationModal,
      selectedTask,
      openDuplicateConfirmationModal,
      duplicateTaskWithoutConfirmation,
      dispatch,
    ],
  );

  const allowedOptions = useMemo(
    () =>
      options.filter(
        o => o.restriction !== SINGLE_TASK_RESTRICTIONS_OPTIONS.DISABLED,
      ),
    [options],
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
        {allowedOptions.length !== 0 && (
          <OptionsMenu
            options={allowedOptions}
            customButtonComponent={IconButton}
          >
            <MoreHoriz
              ref={element => {
                if (element) setTourTaskMenuReference(element);
              }}
              color="primary"
            />
          </OptionsMenu>
        )}
        <Box mx={0.5} />
        {/* {handleCopyLink && (
          <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={handleCopyLink}
          >
            <FileCopy fontSize="small" color="primary" />
          </Box>
        )} */}
        {!hideCloseIcon && (
          <IconButton
            onClick={() => {
              closeTaskDrawer();
            }}
            size="small"
            color="secondary"
          >
            <Close />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default TopSection;
