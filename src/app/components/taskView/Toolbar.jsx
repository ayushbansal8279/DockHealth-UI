import { Button, Fade } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleListNotifications } from '../../actions/tasklist-actions';
import { onNotificationsToggled } from '../../helpers/ga-event-helper';
import { showAlert } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import NotificationsCheck from '../../img/toolbar-notifications-check';
import AdornedButton from '../common/AdornedButton.tsx';
import Avatar from '../common/Avatar';
import ListPopover from '../common/ListPopover.tsx';
import RotatableChevron from '../common/RotatableChevron.tsx';
import Spacing from '../common/Spacing.tsx';
import InviteMemberPopover from '../members/InviteMemberPopover';
import { printTaskPdf } from '../task-pdf/TaskPdfDocument';
import Search from './Search';
import {
  SlimViewToggle,
  ToolbarContainer,
  ToolbarLabel,
} from './Toolbar.Styled.tsx';

const onPrintClick = ({
  closeMorePopover,
  tasks,
  completedTasks,
  taskListMembers,
}) => () => {
  closeMorePopover();

  return printTaskPdf({
    tasks: [...tasks, ...completedTasks],
    taskListMembers,
  });
};

const getThumbnailUrl = ({ userIdentifier, profileThumbnailPictureHash }) =>
  `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}/${profileThumbnailPictureHash}`;

const renderMemberAvatar = member => {
  const avatarContent = member?.profileThumbnailPictureHash ? (
    <img src={getThumbnailUrl(member)} alt={member?.initials} />
  ) : (
    member?.initials
  );

  return (
    <React.Fragment key={member?.userIdentifier ?? member?.email}>
      <Spacing horizontal={3} />
      <Avatar size={40}>{avatarContent}</Avatar>
    </React.Fragment>
  );
};

export default ({
  filterButton,
  handleSearch,
  onAddTaskButtonClick,
  openFilterPopover,
  initialSearchValue,
  preferencesInitialized,
  selectedTask,
  showAddTaskButton = true,
  slimView,
  switchSlimView,
  taskDrawerOpen,
  filterPopoverOpen,
  taskList,
  members,
  membersNotInTaskList,
  clearFilter,
  currentFilterDescription,
  printData: { tasks = [], completedTasks = [], taskListMembers = [] },
}) => {
  const [isMorePopoverOpen, openMorePopover, closeMorePopover] = useBoolean(
    false,
  );

  const notificationsEnabled = taskList?.notifications;
  const taskListIdentifier = taskList?.taskListIdentifier;
  const dispatch = useDispatch();

  const toggleNotifications = useCallback(async () => {
    const newNotificationStatus = !notificationsEnabled;

    closeMorePopover();

    try {
      await toggleListNotifications(taskListIdentifier, newNotificationStatus)(
        dispatch,
      );
      onNotificationsToggled(newNotificationStatus);
      toggleAlert(
        `Notifications are now ${
          newNotificationStatus ? 'enabled' : 'disabled'
        }`,
        'success',
      );
    } catch {
      showAlert({
        status: 'error',
        text:
          'Error while changing notifications status, please try again later',
        title: 'Error',
      });
    }
  }, [closeMorePopover, dispatch, notificationsEnabled, taskListIdentifier]);

  const moreButtonReference = useRef(null);

  const moreButtonElement = {
    key: 'filter',
    label: (
      <Button variant="text" onClick={closeMorePopover} size="small">
        <ToolbarLabel variant="body1" component="span">
          MORE
        </ToolbarLabel>
        <Spacing horizontal={3} />
        <RotatableChevron rotated={isMorePopoverOpen} />
      </Button>
    ),
    disableHover: true,
    button: false,
    style: {
      padding: '0.25rem 1.375rem',
    },
  };

  const dividerElement = {
    key: 'divider',
    label: '',
    button: false,
    style: {
      borderBottom: '0.0625rem solid #e5e9f2',
      margin: '0.25rem 0',
      padding: 0,
    },
  };

  const { left: filterButtonX = 0, top: filterButtonY = 0 } =
    moreButtonReference.current?.getBoundingClientRect() || {};

  return (
    <ToolbarContainer>
      <div>
        <Grid container alignItems="center" direction="row" wrap="nowrap">
          <SlimViewToggle
            onClick={switchSlimView}
            slimView={slimView}
            variant="outlined"
          />
          <Spacing horizontal={3} />
          <Button
            variant="text"
            onClick={openFilterPopover}
            ref={filterButton}
            size="small"
          >
            <ToolbarLabel variant="body1" component="span">
              FILTER
            </ToolbarLabel>
            <Spacing horizontal={3} />
            <RotatableChevron rotated={filterPopoverOpen} />
          </Button>
          {currentFilterDescription && (
            <>
              <Spacing horizontal={3} />
              <ToolbarLabel
                variant="body1"
                component="span"
                style={{ color: '#8492a4' }}
              >
                {currentFilterDescription}
              </ToolbarLabel>
              <Spacing horizontal={3} />
              <ToolbarLabel
                variant="body1"
                component="span"
                onClick={clearFilter}
                style={{ cursor: 'pointer' }}
              >
                Clear
              </ToolbarLabel>
            </>
          )}
        </Grid>
      </div>
      <div>
        <Grid
          container
          alignItems="center"
          direction="row"
          wrap="nowrap"
          justify="flex-end"
        >
          {preferencesInitialized && (
            <Search initialValue={initialSearchValue} onChange={handleSearch} />
          )}
          <Spacing horizontal={3} />
          <Button
            variant="text"
            ref={moreButtonReference}
            onClick={openMorePopover}
            size="small"
          >
            <ToolbarLabel variant="body1" component="span">
              MORE
            </ToolbarLabel>
            <Spacing horizontal={3} />
            <RotatableChevron rotated={filterPopoverOpen} />
          </Button>
          {members?.map(renderMemberAvatar)}
          <Spacing horizontal={3} />
          <InviteMemberPopover
            size={40}
            members={members}
            membersNotInTaskList={membersNotInTaskList}
            taskList={taskList}
          />
          {(selectedTask || !taskDrawerOpen) && showAddTaskButton && (
            <>
              <Spacing horizontal={5} />
              <AdornedButton
                adornment={<AddIcon />}
                onClick={onAddTaskButtonClick}
              >
                ADD A TASK
              </AdornedButton>
            </>
          )}
        </Grid>
      </div>
      <ListPopover
        anchorReference="anchorPosition"
        anchorPosition={{
          left: filterButtonX - 23,
          top: filterButtonY - 5.5,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={isMorePopoverOpen}
        onClose={closeMorePopover}
        TransitionComponent={Fade}
        items={[
          moreButtonElement,
          dividerElement,
          {
            key: 'print',
            label: 'Print',
            onClick: onPrintClick({
              closeMorePopover,
              tasks,
              completedTasks,
              taskListMembers,
            }),
          },
          {
            key: 'notifications',
            label: (
              <Grid
                container
                justify="space-between"
                alignItems="center"
                wrap="nowrap"
              >
                <div>Notifications</div>
                <Grid
                  container
                  wrap="nowrap"
                  alignItems="center"
                  justify="flex-end"
                >
                  <NotificationsCheck />
                  <Spacing horizontal={2} />
                  <span>{notificationsEnabled ? 'On' : 'Off'}</span>
                </Grid>
              </Grid>
            ),
            onClick: toggleNotifications,
          },
        ]}
      />
    </ToolbarContainer>
  );
};
