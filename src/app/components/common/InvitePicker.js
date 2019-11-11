import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import PersonInvite from '../../img/person-invite.svg';
import MemberManagementPopup from '../members/MemberManagementPopup';
import MemberInvitationPopup from '../members/MemberInvitationPopup';

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

const Footer = styled(ButtonBase)`
  && {
    justify-content: flex-start;
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    margin-top: auto;
    align-items: center;
    padding: 0 25px;
    background: #fff;
    height: 75px;
  }
`;

const FooterText = styled.span`
  margin-left: 16px;
  font-size: 14px;
  color: #0ca1c7;
`;

const InvitePickerFooter = ({ onClick }) => (
  <Footer onClick={onClick} focusRipple>
    <img src={PersonInvite} alt="" />
    <FooterText>Invite to list</FooterText>
  </Footer>
);

const InvitePicker = ({ children: Component, taskList, members }) => {
  const [isInviting, setIsInviting] = useState(false);
  const openInvitation = useCallback(() => {
    setIsInviting(true);
  });
  const closeInvitation = useCallback(() => {
    setIsInviting(false);
  });

  const [anchor, setAnchor] = useState(null);
  const open = useCallback(e => {
    e.stopPropagation();
    setAnchor(e.currentTarget);
  });
  const close = useCallback(() => {
    setAnchor(null);
    closeInvitation();
  });

  const captureClicks = useCallback(e => {
    e.stopPropagation();
  });

  return (
    <React.Fragment>
      <Component open={open} />
      <StyledPopover
        onClick={captureClicks}
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
      >
        {isInviting ? (
          <MemberInvitationPopup
            taskList={taskList}
            close={close}
            back={closeInvitation}
          />
        ) : (
          <MemberManagementPopup
            close={close}
            members={members}
            taskList={taskList}
          />
        )}
        {!isInviting && <InvitePickerFooter onClick={openInvitation} />}
      </StyledPopover>
    </React.Fragment>
  );
};

const memberShape = PropTypes.shape({
  memberId: PropTypes.number,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  mrn: PropTypes.string,
});

InvitePicker.propTypes = {
  children: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(memberShape),
  taskList: PropTypes.shape({
    listName: PropTypes.string,
  })
  // .isRequired,
};

InvitePicker.defaultProps = {
  member: null,
  members: null,
};

export default InvitePicker;
