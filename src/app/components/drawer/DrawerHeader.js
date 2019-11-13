import ListItem from '@material-ui/core/es/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';

import Avatar from '../common/Avatar';
import { AvatarImageContainer } from '../common/Avatar.styled';

const StyledListItem = styled(ListItem)`
  && {
    background: #007cab;
    height: 88px;
    min-height: 88px;
    :focus {
      background: #007cab;
    }
    :hover {
      background: #007cab;
    }
  }
  &&.active {
    background: #007cab;
    :hover {
      background: #007cab;
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

  const userProfilePic = useSelector(state => state.userState.userProfilePic);

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  const avatarInitials = user?.initials ?? '';

  const avatarContent = userProfilePic ? (
    <AvatarImageContainer src={userProfilePic} alt="User profile picture" />
  ) : (
    avatarInitials
  );

  return (
    <StyledListItem button component={ProfileLink}>
      <ListItemIcon
        style={{
          marginLeft: '-2px',
        }}
      >
        <Avatar withCursor size={55}>
          {avatarContent}
        </Avatar>
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
