import React from 'react';
import styled from 'styled-components';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router';
import ListItem from '@material-ui/core/es/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MemberAssignment from './components/home/MemberAssignment';

const StyledListItem = styled(ListItem)`
  && {
    height: 88px;
    background: #007CAB;
    :hover {
      background: #0ca1c7;
    }
  }
  &&.active {
    background: #007CAB;  
  }
`;

const Name = styled.div`
  color: #fff;
  font-size: 21px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ProfileLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/userProfile" activeClassName="active" {...props} />
));

const formatName = ({ firstName, lastName }) => `${firstName || ''} ${lastName ? lastName[0] : '..'}.`;

const DrawerHeader = ({ user }) => (
  <StyledListItem button component={ProfileLink}>
    <ListItemIcon style={{ marginLeft: '-2px' }}>
      <MemberAssignment
        member={user}
        disabled
      />
    </ListItemIcon>
    <ListItemText style={{ padding: 0 }}>
      <div style={{ display: 'flex' }}>
        <Name>{formatName(user)}</Name>
        <ChevronRightIcon
          alt="Open user profile"
          style={{
            color: '#fff',
            marginLeft: 'auto',
          }}
        />
      </div>
    </ListItemText>
  </StyledListItem>
);

export default DrawerHeader;
