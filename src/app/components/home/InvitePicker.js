import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import MemberInvitationPopup from './MemberInvitationPopup';

const StyledPopover = styled(Popover).attrs({
  classes: { paper: 'paper' },
  anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  transformOrigin: { vertical: 'top', horizontal: 'center' },
})`
  && .paper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 235px;
  }
`;

const InvitePicker = ({
  children: Component, taskList,
}) => {
  const [anchor, setAnchor] = useState(null);
  const open = useCallback(
    (e) => {
      e.stopPropagation();
      setAnchor(e.currentTarget);
    },
  );
  const close = useCallback(
    () => {
      setAnchor(null);
    },
  );

  const captureClicks = useCallback(
    (e) => { e.stopPropagation(); },
  );

  return (
    <React.Fragment>
      <Component open={open} />
      <StyledPopover
        onClick={captureClicks}
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
      >
        <MemberInvitationPopup
          taskList={taskList}
          close={close}
        />
      </StyledPopover>
    </React.Fragment>
  );
};

InvitePicker.propTypes = {
  children: PropTypes.func.isRequired,
  taskList: PropTypes.shape({
    listName: PropTypes.string,
    taskListId: PropTypes.number,
  }).isRequired,
};

export default InvitePicker;
