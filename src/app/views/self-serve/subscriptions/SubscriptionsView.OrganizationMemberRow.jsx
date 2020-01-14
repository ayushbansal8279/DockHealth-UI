import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useMount } from 'react-use';
import styled from 'styled-components';

import { getUserAvatar } from '../../../api/people-api';
import Avatar from '../../../components/common/Avatar';
import { AvatarImageContainer } from '../../../components/common/Avatar.styled';
import CubesLoader from '../../../components/common/CubesLoader';
import TaskCheckbox from '../../../components/task/TaskCheckbox';
import useBoolean from '../../../hooks/useBoolean';

const CubesLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const getUserTypeLabel = ({ orgUserRole }) => {
  switch (orgUserRole) {
    case 'MEMBER':
      return 'Team Member';
    case 'ADMIN':
      return 'Administrator';
    case 'OWNER':
      return 'Owner';
    default:
      return '';
  }
};

const OrganizationMemberRow = ({
  firstName,
  lastName,
  email,
  orgUserRole,
  profileThumbnailPictureHash,
  userId,
  isUserSelected,
  toggleSelectedUser,
}) => {
  const [isFetching, setIsFetching, unsetIsFetching] = useBoolean(false);
  const [userAvatar, setUserAvatar] = useState(null);

  const setAvatarAsInitials = useCallback(() => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`
      .trim()
      .toUpperCase();

    unsetIsFetching();
    setUserAvatar(initials);
  }, [firstName, lastName, unsetIsFetching]);

  useMount(() => {
    if (profileThumbnailPictureHash) {
      setIsFetching();

      getUserAvatar({ userId })
        .then(response => {
          setUserAvatar(
            <AvatarImageContainer src={response} alt="User profile picture" />,
          );
          unsetIsFetching();
        })
        .catch(() => {
          setAvatarAsInitials();
        });
    } else {
      setAvatarAsInitials();
    }
  });

  return (
    <tr>
      <td>
        <TaskCheckbox
          checked={isUserSelected({ userId, email })}
          onChange={toggleSelectedUser({ userId, email })}
          color="#074A86"
        />
      </td>
      <td>
        {isFetching ? (
          <CubesLoaderContainer>
            <CubesLoader size={40} />
          </CubesLoaderContainer>
        ) : (
          <Avatar size={55}>{userAvatar}</Avatar>
        )}
      </td>
      <td>
        <Grid container direction="column" justify="center">
          <b>{`${firstName} ${lastName}`.trim()}</b>
          {email && <a href={`mailto:${email}`}>{email}</a>}
        </Grid>
      </td>
      <td>{getUserTypeLabel({ orgUserRole })}</td>
      <td>{moment().format('LL')}</td>
      <td>$19 / month</td>
    </tr>
  );
};

export default OrganizationMemberRow;
