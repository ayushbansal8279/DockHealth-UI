import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import styled from 'styled-components';
import { toggleListNotifications } from '../../actions/tasklist-actions';
import { onNotificationsToggled } from '../../helpers/ga-event-helper';
import useBoolean from '../../hooks/useBoolean';
import ListSwitchChevron from '../../img/list-switch-chevron.svg';
import NotificationsOffIcon from '../../img/notifications-off.svg';
import NotificationsOnIcon from '../../img/notifications-on.svg';
import GenericHeader from '../common/GenericHeader';
import ListPopover from '../common/ListPopover.tsx';
import Members from '../members/Members';
import TaskListAction from './TaskListAction';

const StyledTitle = styled(Typography)`
  && {
    cursor: pointer;
    filter: brightness(1);
    font-size: 36px;
    line-height: 49px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: filter 0.25s ease-out;
    white-space: nowrap;

    &:hover {
      filter: brightness(1.25);
    }
  }
`;

const HeaderTitleContainer = styled.div`
  flex: 0.35;
  overflow: hidden;
`;

const ListSwitchContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  transition: all 0.25s ease-out;
  transform: scaleY(${props => (props.rotated ? -1 : 1)});
  width: 2rem;
`;

const NotificationToggle = ({ value }) => (
  <span
    style={{
      width: '34px',
      height: '31px',
      background: value ? '#007CAB' : '#303538',
      borderRadius: '4px',
      color: 'white',
      marginLeft: '10px',
      paddingTop: '3px',
    }}
  >
    {value ? 'on' : 'off'}
  </span>
);

const Notifications = ({ value, onClick }) => {
  const notificationProps = {
    icon: value ? NotificationsOnIcon : NotificationsOffIcon,
    alt: value ? 'Disable notifications' : 'Enable notifications',
    // children: `Notifications: ${value ? 'on' : 'off'}`,
    onClick,
  };

  return (
    <TaskListAction {...notificationProps} style={{ paddingRight: '0px' }}>
      <span> Notifications: </span>
      <NotificationToggle value={value} />
    </TaskListAction>
  );
};

const transformTaskList = ({ closeListPopover, taskList }) => ({
  listName,
  taskListIdentifier,
}) => ({
  active: taskListIdentifier === taskList?.taskListIdentifier,
  key: taskListIdentifier,
  label: listName,
  onClick: () => {
    closeListPopover();
    hashHistory.push(`/tasks/${taskListIdentifier}`);
  },
});

const Header = ({
  hasTitle,
  title,
  isFetching,
  isMultiList,
  members,
  membersNotInTaskList,
  taskList,
  resetHeader = () => {},
}) => {
  const taskListIdentifier = taskList?.taskListIdentifier;
  const notificationsStatus = taskList?.notifications;

  const listPopoverReference = useRef(null);

  const [isListPopoverOpen, openListPopover, closeListPopover] = useBoolean(
    false,
  );

  const taskLists = useSelector(store => store.taskListState.tasklist ?? []);

  const dispatch = useDispatch();
  const toggleNotifications = useCallback(() => {
    const newNotificationStatus = !notificationsStatus;
    toggleListNotifications(taskListIdentifier, newNotificationStatus)(
      dispatch,
    ).then(() => {
      onNotificationsToggled(newNotificationStatus);
      resetHeader();
    });
  }, [dispatch, notificationsStatus, resetHeader, taskListIdentifier]);

  const listPopoverItems = [
    ...taskLists.map(transformTaskList({ closeListPopover, taskList })),
    {
      key: 'inbox',
      active: !taskListIdentifier,
      label: 'Inbox',
      onClick: () => {
        closeListPopover();
        hashHistory.push(`/tasks/Inbox`);
      },
    },
  ];

  return (
    <GenericHeader isFetching={isFetching || !hasTitle}>
      <HeaderTitleContainer ref={listPopoverReference}>
        <StyledTitle onClick={openListPopover} variant="h5" component="div">
          <Grid container alignItems="center">
            <div>{title}</div>
            <ListSwitchContainer rotated={isListPopoverOpen}>
              <img src={ListSwitchChevron} alt="List switch" />
            </ListSwitchContainer>
          </Grid>
        </StyledTitle>
      </HeaderTitleContainer>
      <div
        style={{
          flex: 0.3,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {taskList && (
          <Notifications
            onClick={() => {
              toggleNotifications();
            }}
            value={notificationsStatus}
          />
        )}
      </div>
      <div style={{ flex: 0.35, paddingRight: '1rem' }}>
        {members && !isMultiList && (
          <Members
            members={members}
            membersNotInTaskList={membersNotInTaskList}
            taskList={taskList}
          />
        )}
      </div>
      <ListPopover
        anchorEl={listPopoverReference.current}
        open={isListPopoverOpen}
        onClose={closeListPopover}
        items={listPopoverItems}
      />
    </GenericHeader>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      userIdentifier: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      profileThumbnailPictureHash: PropTypes.string,
      initials: PropTypes.string,
    }),
  ),
  isFetching: PropTypes.bool,
  isMultiList: PropTypes.bool,
};

Header.defaultProps = {
  isFetching: false,
  isMultiList: false,
  members: null,
};

export default Header;
