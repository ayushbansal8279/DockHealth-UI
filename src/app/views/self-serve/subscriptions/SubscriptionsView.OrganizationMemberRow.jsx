import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import memoizeWith from 'ramda/es/memoizeWith';
import React from 'react';
import { useAsync } from 'react-use';
import styled from 'styled-components';
import { getUserAvatar } from '../../../api/people-api';
import Avatar from '../../../components/common/Avatar';
import { AvatarImageContainer } from '../../../components/common/Avatar.styled';
import CubesLoader from '../../../components/common/CubesLoader';
import TaskCheckbox from '../../../components/task/TaskCheckbox';
import { noop } from '../../../helpers/utility-functions';
import MemberTypeLabel from './SubscriptionsView.MemberTypeLabel';

const CubesLoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SmallScreenGrid = styled(Grid)`
  && {
    padding: 1rem;
  }
`;

const USER_TYPES = new Proxy(
  {
    MEMBER: {
      label: 'Team Member',
      selectable: true,
      changeable: true,
    },
    ADMIN: {
      label: 'Administrator',
      selectable: true,
      changeable: true,
    },
    OWNER: {
      label: 'Owner',
    },
    DEFAULT: {
      label: 'Invited',
      invitationModifiable: true,
    },
  },
  {
    get: (object, path) => object[path.toUpperCase()] || object.DEFAULT,
  },
);

const getUserInitials = ({ firstName, lastName }) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase();

const getAvatarContent = memoizeWith(
  propsObject => Object.values(propsObject).join('-'),
  ({ userId, profileThumbnailPictureHash }) => {
    if (profileThumbnailPictureHash) {
      return getUserAvatar({ userId });
    }

    return Promise.resolve(null);
  },
);

export const MemberAvatar = ({
  firstName,
  lastName,
  userId,
  profileThumbnailPictureHash,
}) => {
  const { loading, value: avatarContent } = useAsync(async () => {
    let downloadedAvatarContent = null;

    try {
      downloadedAvatarContent = await getAvatarContent({
        userId,
        profileThumbnailPictureHash,
      });
    } catch {
      noop();
    }

    return downloadedAvatarContent ? (
      <AvatarImageContainer
        src={downloadedAvatarContent}
        alt="User profile picture"
      />
    ) : (
      getUserInitials({ firstName, lastName })
    );
  }, [userId, profileThumbnailPictureHash]);

  return loading ? (
    <CubesLoaderContainer>
      <CubesLoader size={40} />
    </CubesLoaderContainer>
  ) : (
    <Avatar size={55}>{avatarContent}</Avatar>
  );
};

export const EmptyOrganizationMemberRow = () => (
  <tr>
    <td colSpan={6}>
      <Grid container alignItems="center" justify="center">
        No members added
      </Grid>
    </td>
  </tr>
);

const OrganizationMemberRow = ({
  firstName,
  lastName,
  email,
  orgUserRole,
  profileThumbnailPictureHash,
  userId,
  isUserSelected,
  toggleSelectedUser,
  isSmallScreen,
  showJoined,
  showSubscription,
  openDialog,
  setRemovedUserData,
}) => {
  const userType = USER_TYPES[orgUserRole];

  const checkboxElement = (
    <TaskCheckbox
      checked={isUserSelected({ userId, email })}
      onChange={event => {
        if (event.target.checked) {
          toggleSelectedUser({ userId, email })(event);
        } else {
          setRemovedUserData({ userId, email, orgUserRole });
          openDialog();
        }
      }}
      color="#074A86"
    />
  );

  if (isSmallScreen) {
    return (
      <tr>
        <td>
          <SmallScreenGrid container wrap="nowrap" spacing={16}>
            <Grid item xs={1}>
              {checkboxElement}
            </Grid>
            <Grid
              item
              xs={11}
              container
              justify="space-between"
              alignItems="flex-end"
              wrap="nowrap"
            >
              <Grid
                item
                xs
                container
                direction="column"
                alignItems="flex-start"
              >
                <b>{`${firstName} ${lastName}`.trim()}</b>
                {email && <a href={`mailto:${email}`}>{email}</a>}
                <MemberTypeLabel
                  userId={userId}
                  userType={userType}
                  userTypes={USER_TYPES}
                />
                {showJoined && <div>Joined {moment().format('LL')}</div>}
              </Grid>
              {showSubscription && (
                <Grid
                  item
                  xs
                  container
                  alignItems="flex-end"
                  justify="flex-end"
                >
                  <div>$19 / month</div>
                </Grid>
              )}
            </Grid>
          </SmallScreenGrid>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{checkboxElement}</td>
      <td>
        <MemberAvatar
          firstName={firstName}
          lastName={lastName}
          userId={userId}
          profileThumbnailPictureHash={profileThumbnailPictureHash}
        />
      </td>
      <td>
        <Grid container direction="column" justify="center">
          <b>{`${firstName} ${lastName}`.trim()}</b>
          {email && <a href={`mailto:${email}`}>{email}</a>}
        </Grid>
      </td>
      <td>
        <MemberTypeLabel
          email={email}
          userId={userId}
          userType={userType}
          userTypes={USER_TYPES}
        />
      </td>
      {showJoined && <td>{moment().format('LL')}</td>}
      {showSubscription && <td>$19 / month</td>}
    </tr>
  );
};

export default OrganizationMemberRow;
