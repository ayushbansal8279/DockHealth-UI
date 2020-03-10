import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { toggleListNotifications } from '../../actions/tasklist-actions';
import { onNotificationsToggled } from '../../helpers/ga-event-helper';
import NotificationsOffIcon from '../../img/notifications-off.svg';
import NotificationsOnIcon from '../../img/notifications-on.svg';
import GenericHeader from '../common/GenericHeader';
import Members from '../members/Members';
import TaskListAction from './TaskListAction';

const StyledTitle = styled(Typography)`
  && {
    font-size: 36px;
    line-height: 49px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const HeaderTitleContainer = styled.div`
  flex: 0.35;
  overflow: hidden;
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

const Header = ({
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

  return (
    <GenericHeader isFetching={isFetching}>
      <HeaderTitleContainer>
        <StyledTitle variant="h5">{title}</StyledTitle>
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
