import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItem from '@material-ui/core/es/ListItem/ListItem';
import Grow from '@material-ui/core/Grow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import useBoolean from '../../helpers/useBoolean';
import MemberAssignment from '../home/MemberAssignment';

const StyledListItem = styled(ListItem)`
  && {
    height: 88px;
    background: #007cab;
    :focus {
      background: #007cab;
    }
    :hover {
      background: #5cccec;
    }
  }
  &&.active {
    background: #007cab;
    :hover {
      background: #5cccec;
    }
  }
`;

const Name = styled.div`
  color: #fff;
  font-size: 21px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownPaper = styled(Paper)`
  && {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    left: 5;
    position: absolute;
    width: 100%;
  }
`;

const DropdownMenu = styled(MenuList)`
  && {
    background: #007cab;
    padding: 0;
  }
`;

const DropdownMenuItem = styled(MenuItem)`
  && {
    border-top: 1px solid #0ca1c7;
    color: #fff;
  }
  &&:hover {
    background: #5cccec;
  }
`;

const ProfileLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/userProfile" activeClassName="active" {...props} />
));

const LogoutLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/logout" activeClassName="active" {...props} />
));

const formatName = ({ firstName, lastName, truncate = false }) => (truncate ? `${firstName || ''} ${lastName ? lastName[0] : '..'}.` : `${firstName} ${lastName}`);

const RotatingChevronIcon = styled(ChevronRightIcon)`
  && {
    color: #fff;
    margin-left: auto;
    transition: all 200ms ease-out;
    transform: rotate(${props => (props.dropdownOpen ? 90 : 0)}deg);
  }
`;

let buttonAnchor = React.createRef(null);

const DrawerHeader = ({ open, user, setActiveId }) => {
  const [dropdownOpen, , closeDropdown, toggleDropdown] = useBoolean(false);
  const [formattedName, setFormattedName] = useState();
  const [defaultName, setDefaultName] = useState();
  const nameRef = useRef(null);

  const onCloseDropdown = () => {
    setActiveId('');
    closeDropdown();
  };

  useEffect(
    () => {
      if (user) {
        setDefaultName(formatName(user));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  useEffect(
    () => {
      if (defaultName) {
        const truncate = nameRef.current.scrollWidth > nameRef.current.offsetWidth;

        setFormattedName(formatName({ ...user, truncate }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultName],
  );
  return (
    <>
      <StyledListItem
        button
        buttonRef={(ref) => {
          buttonAnchor = ref;
        }}
        onClick={toggleDropdown}
      >
        <ListItemIcon
          style={{
            marginLeft: '-2px',
          }}
        >
          <MemberAssignment member={user} disabled />
        </ListItemIcon>
        <ListItemText
          style={{
            padding: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <Name ref={nameRef}>{formattedName || defaultName}</Name>
            <RotatingChevronIcon alt="Arrow" dropdownOpen={dropdownOpen} />
          </div>
        </ListItemText>
      </StyledListItem>
      <Popper
        open={open && dropdownOpen}
        anchorEl={buttonAnchor}
        transition
        disablePortal
        placement="bottom left"
        style={{
          zIndex: 1,
          width: '100%',
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{
              transformOrigin: 'center top',
            }}
          >
            <DropdownPaper>
              <ClickAwayListener onClickAway={onCloseDropdown}>
                <DropdownMenu>
                  <DropdownMenuItem onClick={onCloseDropdown} component={ProfileLink}>
                    View and edit profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onCloseDropdown}>Privacy Policy</DropdownMenuItem>
                  <DropdownMenuItem onClick={onCloseDropdown} component={LogoutLink}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenu>
              </ClickAwayListener>
            </DropdownPaper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default DrawerHeader;
