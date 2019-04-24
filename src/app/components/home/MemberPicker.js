import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import ButtonBase from '@material-ui/core/ButtonBase';
import PersonInvite from '../../img/person-invite.svg';
import MemberPickerPopup from './MemberPickerPopup';
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

const Footer = styled(ButtonBase)`
  && {
    justify-content: flex-start;
    flex: 0 0;
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

const MemberPickerFooter = ({ onClick }) => (
  <Footer onClick={onClick} focusRipple>
    <img src={PersonInvite} alt="" />
    <FooterText>Invite to list</FooterText>
  </Footer>
);

const MemberPicker = ({
  member, members, assign, children: Component, task,
}) => {
  const [isInviting, setIsInviting] = useState(false);
  const openInvitation = useCallback(
    () => { setIsInviting(true); },
  );
  const closeInvitation = useCallback(
    () => { setIsInviting(false); },
  );

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
      closeInvitation();
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
        {isInviting
          ? (
            <MemberInvitationPopup
              members={members}
              assign={assign}
              task={task}
              close={close}
              back={closeInvitation}
            />
          )
          : (
            <MemberPickerPopup
              close={close}
              member={member}
              members={members}
              assign={assign}
              task={task}
            />
          )}
        {!isInviting && <MemberPickerFooter onClick={openInvitation} />}
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

MemberPicker.propTypes = {
  member: memberShape,
  members: PropTypes.arrayOf(memberShape),
  assign: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  task: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
};

MemberPicker.defaultProps = {
  member: null,
  members: null,
};

export default MemberPicker;
