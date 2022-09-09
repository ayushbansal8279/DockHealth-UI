/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo } from 'react';
import { CircleIcon } from 'components/task/styled';
import { Box, IconButton } from '@material-ui/core';
import { Close, MoreHoriz } from '@material-ui/icons';
import { checkIfTemplateTask, TaskStatus } from 'helpers/task-helpers';
import palette from 'styles/palette';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import {
  userHasSendEmailFeatureSelector,
  userHasSendFaxFeatureSelector,
  userHasSendSmsFeatureSelector,
  userHasPostEMRNoteFeatureSelector,
  userHasShareTaskFeatureSelector,
} from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import ShareLinkIcon from 'img/share-link.svg';
import { HorizontalLabel } from '../styled';
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
    isTemplateTask,
    handleShareTask,
  } = initializeTaskDrawerTopSectionHooks({
    onDelete,
    onDuplicate,
    closeTaskDrawer,
  });
  const dispatch = useDispatch();

  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const sendFaxAvailable = useSelector(userHasSendFaxFeatureSelector);
  const sendSmsAvailable = useSelector(userHasSendSmsFeatureSelector);
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);
  const shareTaskAvailable = useSelector(userHasShareTaskFeatureSelector);

  const options = useMemo(
    () =>
      [
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
        shareTaskAvailable &&
          !isTemplateTask && {
            name: 'Share Task',
            onClick: handleShareTask,
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
        sendSmsAvailable && {
          name: 'Send SMS',
          onClick: () => dispatch(openModal('SendSmsFromTask')),
        },
        postToEMRAvailable && {
          name: 'Post Note to EHR',
          onClick: () => dispatch(openModal('SendEmrFromTask')),
        },
        {
          name: 'Delete',
          color: palette.error,
          onClick: openDeleteConfirmationModal,
          restriction: restrictions?.delete === DISABLED,
        },
      ].filter(o => typeof o !== 'boolean'),
    [
      handleMoveTask,
      restrictions,
      shareTaskAvailable,
      isTemplateTask,
      handleShareTask,
      handleCopyLink,
      sendEmailAvailable,
      sendFaxAvailable,
      sendSmsAvailable,
      postToEMRAvailable,
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
            <HorizontalLabel>Complete Task</HorizontalLabel>
          </>
        )}
      </Box>
      <Box display="flex">
        {handleCopyLink && (
          <>
            <Box
              display="flex"
              alignItems="center"
              style={{ cursor: 'pointer' }}
              onClick={handleCopyLink}
            >
              <img
                src={ShareLinkIcon}
                fontSize="small"
                color="primary"
                alt="Copy the Task link"
              />
            </Box>
            <Box mx={0.5} />
          </>
        )}
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
