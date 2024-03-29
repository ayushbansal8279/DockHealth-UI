/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo, useCallback, useState } from 'react';
import { CircleIcon } from 'components/task/styled';
import { Box, IconButton, Paper } from '@mui/material';
import { Close, MoreHoriz } from '@mui/icons-material';
import { checkIfTemplateTask, TaskStatus } from 'helpers/task-helpers';
import palette from 'styles/palette';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { markTaskAsUnRead } from 'actions/task-actions';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import {
  userHasSendEmailFeatureSelector,
  userHasSendFaxFeatureSelector,
  userHasSendSmsFeatureSelector,
  userHasSendSecureMessageFeatureSelector,
  userHasSendESignFeatureSelector,
  userHasPostEMRNoteFeatureSelector,
  userHasShareTaskFeatureSelector,
  userSubscriptionIsProSelector,
} from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import ShareLinkIcon from 'img/share-link.svg';
import ShareLinkIconActive from 'img/share-link-active.svg';
import EmailIcon from 'img/email-new-icon.svg';
import EmailIconActive from 'img/email-new-icon-active.svg';
import MobileIcon from 'img/mobile-new-icon.svg';
import MobileIconActive from 'img/mobile-new-icon-active.svg';
import Spacing from 'components/common/Spacing';
import { IconContainer, Title, CompletedByTitle, CompleteAge } from './styled';
import initializeTaskDrawerTopSectionHooks from './hooks';
import moment from 'moment';
import Tooltip from 'components/common/Tooltip/Tooltip';

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const TopSection = ({
  restrictions,
  taskListRestrictions,
  onDelete,
  onDuplicate,
  closeTaskDrawer,
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
  const [isSmsActive, setSmsActive] = useState(false);
  const [isEmailActive, setEmailActive] = useState(false);
  const [isShareActive, setShareActive] = useState(false);
  const [isOptionActive, setOptionActive] = useState(false);

  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const sendFaxAvailable = useSelector(userHasSendFaxFeatureSelector);
  const sendSmsAvailable = useSelector(userHasSendSmsFeatureSelector);
  const sendSecureMessageAvailable = useSelector(
    userHasSendSecureMessageFeatureSelector,
  );
  const sendESignAvailable = useSelector(userHasSendESignFeatureSelector);
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);
  const shareTaskAvailable = useSelector(userHasShareTaskFeatureSelector);
  const userSubscriptionIsPro = useSelector(userSubscriptionIsProSelector);

  const handleMarkAsUnRead = useCallback(() => {
    dispatch(markTaskAsUnRead(selectedTask.taskIdentifier));
  }, [dispatch, selectedTask]);

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
        {
          name: 'Mark as unread',
          onClick: handleMarkAsUnRead,
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
        // sendEmailAvailable && {
        //   name: 'Send Email',
        //   onClick: () => dispatch(openModal('SendEmailFromTask')),
        // },
        // sendSmsAvailable && {
        //   name: 'Send SMS',
        //   onClick: () => dispatch(openModal('SendSmsFromTask')),
        // },
        sendSecureMessageAvailable && {
          name: 'Send Patient Message',
          onClick: () => dispatch(openModal('SendSecureMessageFromTask')),
        },
        (userSubscriptionIsPro || sendFaxAvailable) && {
          name: 'Send FAX',
          onClick: () => dispatch(openModal('SendFaxFromTask')),
          disabled: !sendFaxAvailable,
          description: '*Contact Dock Crew',
        },
        (userSubscriptionIsPro || sendESignAvailable) && {
          name: 'Send for ESign',
          onClick: () => dispatch(openModal('SendESignFromTask')),
          disabled: !sendESignAvailable,
          description: '*Contact Dock Crew',
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
      ].filter((o) => typeof o !== 'boolean'),
    [
      handleMoveTask,
      restrictions,
      handleMarkAsUnRead,
      shareTaskAvailable,
      isTemplateTask,
      handleShareTask,
      handleCopyLink,
      userSubscriptionIsPro,
      sendEmailAvailable,
      sendFaxAvailable,
      sendSmsAvailable,
      sendSecureMessageAvailable,
      sendESignAvailable,
      postToEMRAvailable,
      openDeleteConfirmationModal,
      selectedTask,
      openDuplicateConfirmationModal,
      duplicateTaskWithoutConfirmation,
      dispatch,
    ],
  );

  const allowedOptions = useMemo(
    () => options.filter((o) => !o.restriction || o.restriction === false),
    [options],
  );

  const modalProp = {
    setEmailActive: setEmailActive,
    setSmsActive: setSmsActive,
  };

  let daysDifference = '';

  if (selectedTask?.status === TaskStatus.COMPLETE) {
    const completedDate = moment(selectedTask.completedDt);
    const todayDate = moment();

    const units = [
      'years',
      'months',
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
    ];
    const nonZeroUnit = units.find(
      (unit) => todayDate.diff(completedDate, unit) !== 0,
    );

    const dateDifference = todayDate.diff(completedDate, nonZeroUnit);
    daysDifference = ` ${dateDifference} ${nonZeroUnit} ago`;
  }

  return (
    <Paper elevation={3} style={{ width: '800px', height: '60px' }}>
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="60px"
        paddingLeft="30px"
        paddingRight="30px"
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
                  !isTaskStatusTogglingDisabled &&
                  isDependencyEmptyOrCompleted &&
                  taskListRestrictions?.completeTask !== DISABLED
                }
                isCompleted={selectedTask?.status === TaskStatus.COMPLETE}
                onClick={
                  taskListRestrictions?.completeTask !== DISABLED
                    ? onCompleteToggle
                    : () => {}
                }
              />
              <div style={{ display: 'flex' }}>
                {selectedTask?.status === TaskStatus.COMPLETE ? (
                  <>
                    <Title>Completed by</Title>
                    <CompletedByTitle>
                      {selectedTask.completedBy?.name}
                    </CompletedByTitle>
                    <CompleteAge>{daysDifference}</CompleteAge>
                  </>
                ) : (
                  <Title>Complete Task</Title>
                )}
              </div>
            </>
          )}
        </Box>
        <Box display="flex">
          {handleCopyLink && (
            <Tooltip placement="left" title={'Copy Task Link'}>
              <IconContainer
                onClick={() => {
                  handleCopyLink();
                  setShareActive(true);
                  setTimeout(() => {
                    setShareActive(false);
                  }, 2000);
                }}
              >
                <img
                  src={!isShareActive ? ShareLinkIcon : ShareLinkIconActive}
                  fontSize="small"
                  color="primary"
                  alt="Copy the Task link"
                />
              </IconContainer>
            </Tooltip>
          )}
          <Spacing horizontal={5} />
          {sendEmailAvailable && (
            <Tooltip placement="bottom-end" title={'Email Task'}>
              <IconContainer
                onClick={() => {
                  dispatch(openModal('SendEmailFromTask', modalProp));
                  setEmailActive(true);
                }}
              >
                <img
                  src={!isEmailActive ? EmailIcon : EmailIconActive}
                  fontSize="small"
                  color="primary"
                  alt="Copy the Task link"
                />
              </IconContainer>
            </Tooltip>
          )}
          <Spacing horizontal={4} />
          {sendSmsAvailable && (
            <Tooltip placement="bottom-start" title={'Send SMS'}>
              <IconContainer
                onClick={() => {
                  dispatch(openModal('SendSmsFromTask', modalProp));
                  setSmsActive(true);
                }}
              >
                <img
                  src={!isSmsActive ? MobileIcon : MobileIconActive}
                  fontSize="small"
                  color="primary"
                  alt="Copy the Task link"
                />
              </IconContainer>
            </Tooltip>
          )}
          <Spacing horizontal={4} />
          {allowedOptions.length !== 0 &&
            taskListRestrictions?.createTask !== DISABLED && (
              <OptionsMenu
                setOptionActive={setOptionActive}
                options={allowedOptions}
                customButtonComponent={IconButton}
              >
                <Tooltip placement="bottom" title={'More'}>
                  <MoreHoriz
                    color={!isOptionActive ? 'primary' : 'secondary'}
                  />
                </Tooltip>
              </OptionsMenu>
            )}
          {!hideCloseIcon && (
            <Tooltip placement="bottom-end" title={'Close Task Drawer'}>
              <IconButton
                onClick={() => {
                  closeTaskDrawer();
                }}
                size="small"
                color="secondary"
              >
                <Close />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TopSection;
