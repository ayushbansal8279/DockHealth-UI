import { Grid } from '@material-ui/core';
import moment from 'moment';
import { memoizeWith } from 'ramda';
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

const getTrialPlanPricePerUser = ({
  planIsTrial,
  billingFrequency,
  planPricePerUser,
  planAnnualPricePerUser,
}) => {
  if (planIsTrial) {
    // return 'Free 30 day trial';
    return '';
  }

  return billingFrequency === 'MONTHLY'
    ? `${planPricePerUser}/month`
    : `${planAnnualPricePerUser}/year`;
};

const getAvatarContent = memoizeWith(
  propsObject => Object.values(propsObject).join('-'),
  ({ userIdentifier, profileThumbnailPictureHash }) => {
    if (profileThumbnailPictureHash) {
      return getUserAvatar({ userIdentifier });
    }

    return Promise.resolve(null);
  },
);

export const MemberAvatar = ({
  firstName,
  lastName,
  userIdentifier,
  profileThumbnailPictureHash,
}) => {
  const { loading, value: avatarContent } = useAsync(async () => {
    let downloadedAvatarContent = null;

    try {
      downloadedAvatarContent = await getAvatarContent({
        userIdentifier,
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
  }, [userIdentifier, profileThumbnailPictureHash]);

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
  userStatus,
  orgUserRole,
  profileThumbnailPictureHash,
  userIdentifier,
  registrationDate,
  eulaAcknowledged,
  isUserSelected,
  toggleSelectedUser,
  isSmallScreen,
  showJoined,
  showSubscription,
  openDialog,
  setRemovedUserData,
  subscriptionPlanData,
}) => {
  const derivedOrgUserRole =
    ['ACTIVE', 'INACTIVE'].includes(userStatus) && eulaAcknowledged
      ? orgUserRole
      : '';

  const userType = USER_TYPES[derivedOrgUserRole];

  const checkboxElement = (
    <TaskCheckbox
      checked={isUserSelected({ userIdentifier, email })}
      onChange={event => {
        if (event.target.checked) {
          toggleSelectedUser({ userIdentifier, email })(event);
        } else {
          setRemovedUserData({ userIdentifier, email, orgUserRole });
          openDialog();
        }
      }}
      color="#074A86"
    />
  );

  const registrationMoment = moment(registrationDate);
  const formattedRegistrationDate = registrationMoment.isValid()
    ? registrationMoment.format('LL')
    : '';

  const {
    billingFrequency,
    planPricePerUser,
    planAnnualPricePerUser,
    planIsTrial,
  } = subscriptionPlanData || {};

  const trialPlanPricePerUser = getTrialPlanPricePerUser({
    planIsTrial,
    billingFrequency,
    planPricePerUser,
    planAnnualPricePerUser,
  });

  if (isSmallScreen) {
    return (
      <tr>
        <td>
          <SmallScreenGrid container wrap="nowrap" spacing={2}>
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
                  userIdentifier={userIdentifier}
                  userType={userType}
                  userTypes={USER_TYPES}
                />
                {showJoined && <div>Joined {formattedRegistrationDate}</div>}
              </Grid>
              {showSubscription && (
                <Grid
                  item
                  xs
                  container
                  alignItems="flex-end"
                  justify="flex-end"
                >
                  <div>{trialPlanPricePerUser}</div>
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
          userIdentifier={userIdentifier}
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
          userIdentifier={userIdentifier}
          userType={userType}
          userTypes={USER_TYPES}
        />
      </td>
      {showJoined && <td>{formattedRegistrationDate}</td>}
      {showSubscription && <td>{trialPlanPricePerUser}</td>}
    </tr>
  );
};

export default OrganizationMemberRow;
