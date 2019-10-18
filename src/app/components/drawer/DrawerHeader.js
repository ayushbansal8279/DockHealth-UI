import ListItem from '@material-ui/core/es/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useRef } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

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

const ProfileLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/userProfile" activeClassName="active" {...props} />
));

const DrawerHeader = ({ user }) => {
  const nameRef = useRef(null);

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <StyledListItem button component={ProfileLink}>
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
          <Name ref={nameRef}>{fullName}</Name>
        </div>
      </ListItemText>
    </StyledListItem>
  );
};

export default DrawerHeader;
