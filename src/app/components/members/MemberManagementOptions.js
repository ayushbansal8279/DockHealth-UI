import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  removeUserFromList,
  changeUserRoleForList,
  getOrganizationUsersNotInTaskList,
} from '../../actions/tasklist-actions';

const MEMBER_ROLE = 'MEMBER';
const ADMIN_ROLE = 'ADMIN';

export const ManageButton = ({
  remove,
  changeRole,
  member: { taskListUserRole },
}) => {
  const [anchor, setAnchor] = useState(null);
  const isOpen = Boolean(anchor);

  const close = () => {
    setAnchor(null);
  };

  const handleClick = e => {
    setAnchor(e.currentTarget);
  };

  const handleRemove = useCallback(
    () => {
      remove();
      close();
    },
    [close, remove],
  );

  const handleChangeRole = useCallback(
    () => {
      const newRole =
        taskListUserRole === MEMBER_ROLE ? ADMIN_ROLE : MEMBER_ROLE;
      changeRole(newRole);
      close();
    },
    [changeRole, close, taskListUserRole],
  );

  return (
    <>
      <IconButton
        aria-label="More"
        aria-owns={isOpen ? 'long-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu id="long-menu" anchorEl={anchor} open={isOpen} onClose={close}>
        <MenuItem onClick={handleRemove}>Remove user from list</MenuItem>
        {taskListUserRole === MEMBER_ROLE ? (
          <MenuItem onClick={handleChangeRole}>Make admin</MenuItem>
        ) : (
          <MenuItem onClick={handleChangeRole}>Remove admin status</MenuItem>
        )}
      </Menu>
    </>
  );
};

ManageButton.propTypes = {
  remove: PropTypes.func.isRequired,
  changeRole: PropTypes.func.isRequired,
  member: PropTypes.shape({
    taskListUserRole: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = (dispatch, { taskListIdentifier, member: { userIdentifier } }) => ({
  remove: () => {
    removeUserFromList(taskListIdentifier, { userIdentifier })(dispatch).then(() => 
      getOrganizationUsersNotInTaskList(taskListIdentifier, 'ALL')(dispatch)
    );
  },
  changeRole: role => {
    changeUserRoleForList(taskListIdentifier, { userIdentifier }, role)(dispatch).then(() => 
      getOrganizationUsersNotInTaskList(taskListIdentifier, 'ALL')(dispatch)
    );
  },
});

const ConnectedManageButton = connect(
  undefined,
  mapDispatchToProps,
)(ManageButton);

ConnectedManageButton.propTypes = {
  taskListIdentifier: PropTypes.string.isRequired,
  member: PropTypes.shape({
    userIdentifier: PropTypes.string,
    taskListUserRole: PropTypes.string,
  }).isRequired,
};

export default ConnectedManageButton;
