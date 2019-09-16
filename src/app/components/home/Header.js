import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { useDispatch } from 'react-redux';
import Members from './Members';
import NotificationsOnIcon from '../../img/notifications-on.svg';
import NotificationsOffIcon from '../../img/notifications-off.svg';
import TaskListAction from '../TaskListAction';
import { toggleListNotifications } from '../../actions/tasklist-actions';

const StyledAppBar = styled(AppBar)`
  && {
    border-bottom: 1px solid #e4e4e4;
    background: #fff;
  }
`;

const StyledToolbar = styled(Toolbar)`
  && {
    padding: 5px 38px 8px 48px;
  }
`;

const StyledTitle = styled(Typography)`
  && {
    font-size: 36px;
    line-height: 49px;
    color:#303538;
  }
`;

const StyledSubtitle = styled(Typography)`
  && {
    font-size: 16px;
    line-height: 26px;
    color: #2e3a43;
    margin-left: 2px; /* visually align with StyledTitle */
  }
`;

const Notifications = ({ value, onClick }) => {
  const notificationProps = {
    icon: value ? NotificationsOnIcon : NotificationsOffIcon,
    alt: value ? 'Disable notifications' : 'Enable notifications',
    children: `Notifications: ${value ? 'on' : 'off'}`,
    onClick,
  };

  return <TaskListAction {...notificationProps} />;
};

const nbsp = '\u00A0'; // Used to preserve line height when there's no subtitle

const Header = ({
  title, taskCount, isFetching, members, taskList,
}) => {
  const taskListId = taskList?.taskListId;
  const notificationsStatus = taskList?.notifications;

  const dispatch = useDispatch();
  const toggleNotifications = useCallback(() => {
    dispatch(toggleListNotifications(taskListId, !notificationsStatus));
  }, [dispatch, notificationsStatus, taskListId]);

  return (
    <StyledAppBar position="sticky" color="default" elevation={0}>
      <StyledToolbar>
        <div style={{ flex: 0.35 }}>
          <StyledTitle variant="h5">{title}</StyledTitle>
          <StyledSubtitle variant="subtitle1">
            {isFetching ? nbsp : `${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}`}
          </StyledSubtitle>
        </div>
        <div style={{
          flex: 0.3,
          display: 'flex',
          justifyContent: 'center',
        }}
        >
          {taskList && <Notifications onClick={toggleNotifications} value={notificationsStatus} />}
        </div>
        <div style={{ flex: 0.35 }}>
          {members && <Members members={members} taskList={taskList} />}
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  taskCount: PropTypes.number.isRequired,
  members: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    profileThumbnailPictureHash: PropTypes.string,
    initials: PropTypes.string,
  })),
  isFetching: PropTypes.bool,
};

Header.defaultProps = {
  isFetching: false,
  members: null, // doesn't show add button
};

export default Header;
