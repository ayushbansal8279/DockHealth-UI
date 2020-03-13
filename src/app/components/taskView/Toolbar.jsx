import { Button, Popover } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleListNotifications } from '../../actions/tasklist-actions';
import { onNotificationsToggled } from '../../helpers/ga-event-helper';
import { showAlert } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import AdornedButton from '../common/AdornedButton';
import Avatar from '../common/Avatar';
import RotatableChevron from '../common/RotatableChevron';
import Spacing from '../common/Spacing';
import InviteMemberPopover from '../members/InviteMemberPopover';
import NewTaskDrawer from './NewTaskDrawer';
import Search from './Search';
import MorePopover from './Toolbar.MorePopover';
import {
  SlimViewToggle,
  ToolbarContainer,
  ToolbarLabel,
} from './Toolbar.Styled';

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

const useToggleNotifications = ({
  notificationsEnabled,
  closeMorePopover,
  taskListIdentifier,
  dispatch,
}) =>
  useCallback(async () => {
    const newNotificationStatus = !notificationsEnabled;

    closeMorePopover();

    try {
      await toggleListNotifications(
        taskListIdentifier,
        newNotificationStatus,
      )(dispatch);
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

export default ({
  addingNewSubtask,
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
  isInbox,
  closeDrawer,
  markComplete,
  onMarkComplete,
  isSpecificPatient,
  isSpecialList,
  printData: { tasks = [], completedTasks = [], taskListMembers = [] },
}) => {
  const [isMorePopoverOpen, openMorePopover, closeMorePopover] = useBoolean(
    false,
  );

  const notificationsEnabled = taskList?.notifications;
  const taskListIdentifier = taskList?.taskListIdentifier;
  const dispatch = useDispatch();

  const toggleNotifications = useToggleNotifications({
    notificationsEnabled,
    closeMorePopover,
    taskListIdentifier,
    dispatch,
  });

  const moreButtonReference = useRef(null);
  const addTaskButtonReference = useRef(null);

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
          {!isInbox && (
            <>
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
              {!isSpecialList && (
                <>
                  <Spacing horizontal={3} />
                  <InviteMemberPopover
                    size={40}
                    members={members}
                    membersNotInTaskList={membersNotInTaskList}
                    taskList={taskList}
                  />
                </>
              )}
            </>
          )}
          {showAddTaskButton && <Spacing horizontal={5} />}
          <div ref={addTaskButtonReference}>
            {showAddTaskButton && (
              <AdornedButton
                adornment={<AddIcon />}
                onClick={onAddTaskButtonClick}
              >
                ADD A TASK
              </AdornedButton>
            )}
          </div>
        </Grid>
      </div>
      <MorePopover
        moreButtonReference={moreButtonReference}
        closeMorePopover={closeMorePopover}
        isMorePopoverOpen={isMorePopoverOpen}
        tasks={tasks}
        completedTasks={completedTasks}
        taskListMembers={taskListMembers}
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
        isSpecialList={isSpecialList}
      />
      <Popover
        open={
          taskDrawerOpen && !selectedTask?.taskIdentifier && !addingNewSubtask
        }
        anchorEl={addTaskButtonReference.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div
          style={{
            maxWidth: '40vw',
            maxHeight: '75vh',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <NewTaskDrawer
            taskList={taskList}
            isInbox={isInbox}
            closeDrawer={closeDrawer}
            markComplete={markComplete}
            onMarkComplete={onMarkComplete}
            isSpecificPatient={isSpecificPatient}
            isMultiList={false}
            compact
          />
        </div>
      </Popover>
    </ToolbarContainer>
  );
};
