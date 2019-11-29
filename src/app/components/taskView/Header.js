import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { toggleListNotifications } from '../../actions/tasklist-actions';
import NotificationsOffIcon from '../../img/notifications-off.svg';
import NotificationsOnIcon from '../../img/notifications-on.svg';
import CubesLoader from '../common/CubesLoader';
import Members from '../members/Members';
import TaskListAction from './TaskListAction';

const StyledAppBar = styled(AppBar)`
  && {
    background: #fff;
    border-bottom: 1px solid #e4e4e4;
    box-sizing: content-box;
    height: 100%;
  }
`;

const StyledToolbar = styled(Toolbar)`
  && {
    padding: 5px 38px 8px 48px;
    height: 100%;
  }
`;

const StyledTitle = styled(Typography)`
  && {
    font-size: 36px;
    line-height: 49px;
    color: #303538;
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

const NotificationToggle = ({ value }) => {
  return (
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
};

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

const nbsp = '\u00A0';

const Header = ({
  title,
  taskCount: propTaskCount = 0,
  isFetching,
  members,
  taskList,
  resetHeader = () => {},
}) => {
  const taskListId = taskList?.taskListId;
  const notificationsStatus = taskList?.notifications;

  const dispatch = useDispatch();
  const toggleNotifications = useCallback(() => {
    toggleListNotifications(taskListId, !notificationsStatus)(dispatch).then(
      () => {
        resetHeader();
      },
    );
  }, [dispatch, notificationsStatus, resetHeader, taskListId]);
  const { taskListStats, taskListStatsOk } = useSelector(store => ({
    taskListStats: store.taskListState.taskListStats,
    taskListStatsOk: store.taskListState.taskListStatsOk,
  }));

  let taskCount = propTaskCount;

  if (taskListStatsOk) {
    const key = 'Incomplete_TaskList_Count';
    taskCount =
      taskListStats?.stats?.find?.(({ metricName }) => metricName === key)
        ?.metricValue ?? 0;
  }

  return (
    <StyledAppBar position="sticky" color="default" elevation={0}>
      <StyledToolbar>
        {isFetching ? (
          <Grid container alignItems="center">
            <CubesLoader size={32} />
          </Grid>
        ) : (
          <>
            <div style={{ flex: 0.35 }}>
              <StyledTitle variant="h5">{title}</StyledTitle>
              <StyledSubtitle variant="subtitle1">
                {isFetching
                  ? nbsp
                  : `${taskCount} task${taskCount > 1 ? 's' : ''}`}
              </StyledSubtitle>
            </div>
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
            <div style={{ flex: 0.35 }}>
              {members && <Members members={members} taskList={taskList} />}
            </div>
          </>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  taskCount: PropTypes.number.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      profileThumbnailPictureHash: PropTypes.string,
      initials: PropTypes.string,
    }),
  ),
  isFetching: PropTypes.bool,
};

Header.defaultProps = {
  isFetching: false,
  members: null,
};

export default Header;
