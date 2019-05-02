import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { removeUserFromList } from '../../actions/tasklist-actions';

export const ManageButton = ({ remove }) => {
  const [anchor, setAnchor] = useState(null);
  const isOpen = Boolean(anchor);

  const close = () => {
    setAnchor(null);
  };

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
  };

  const handleRemove = useCallback(
    () => {
      remove();
      close();
    }, [close, remove],
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
          <Menu
            id="long-menu"
            anchorEl={anchor}
            open={isOpen}
            onClose={close}
          >
            <MenuItem onClick={handleRemove}>
              Remove user from list
            </MenuItem>
          </Menu>
        </>
  );
};

ManageButton.propTypes = {
  remove: PropTypes.func.isRequired,
  promote: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, { taskListId, userId }) => ({
  remove: () => { removeUserFromList(taskListId, { userId })(dispatch); },
});

const ConnectedManageButton = connect(undefined, mapDispatchToProps)(ManageButton);

ConnectedManageButton.propTypes = {
  taskListId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};

export default ConnectedManageButton;
