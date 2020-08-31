import { Grid } from '@material-ui/core';
import moment from 'moment';
import { memoizeWith } from 'ramda';
import React from 'react';
import { useAsync } from 'react-use';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getUserAvatar } from 'api/people-api';
import Avatar from 'components/common/Avatar';
import { AvatarImageContainer } from 'components/common/Avatar.styled';
import Loader from 'components/common/Loader/Loader';
import { noop } from 'helpers/utility-functions';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

import { openModal as openModalAction } from 'modal/actions';
import MemberTypeLabel from './SubscriptionsView.MemberTypeLabel';

const LoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StyledAnchorDiv = styled.div`
  color: ${palette.brightBlue};
  overflow-wrap: anywhere;
  font-size: ${fontSizes.smallPlus};
`;

const MemberTableRow = styled(Grid)`
  margin: 0 !important;
  width: 100% !important;
  padding: ${spacing.regular} 0 !important;

  &:nth-child(even) {
    background-color: ${palette.coolGrey4};
  }
`;

const MemberTableCell = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => props.alignItems || 'flex-start'};
  height: 100%;
  color: ${props => props.isInvited && palette.coolGrey1};
`;

const USER_TYPES = new Proxy(
  {
    OWNER: {
      label: 'Owner',
      selectable: true,
      changeable: true,
      description:
        'Full access to everything including billing and payments and approving new members.',
    },
    MEMBER: {
      label: 'Members',
      selectable: true,
      changeable: true,
      description:
        'Part of your Organization. Can add and invite members who are already part of your organization. Can access all patients and people in the group/practice.',
    },
    GUEST: {
      label: 'Guests',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'Not part of your Organization.  Only have access to this list asks on this list and the patients and people on this list.',
    },
    DEFAULT: {
      label: 'Invited',
      invitationModifiable: true,
    },
  },
  {
    get: (object, path) => object[path?.toUpperCase()] || object.DEFAULT,
  },
);

const USER_STATUS_TYPES = new Proxy(
  {
    INACTIVE: {
      label: 'Inactive',
      changeable: true,
    },
    CANCELLED: {
      label: 'Cancelled',
      invitationModifiable: true,
    },
    DEFAULT: {
      label: 'Invited',
      invitationModifiable: true,
    },
    PENDING: {
      label: 'Approval Pending',
    },
  },
  {
    get: (object, path) => object[path?.toUpperCase()] || object.DEFAULT,
  },
);

const getUserInitials = ({ firstName, lastName }) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase();

const getTrialPlanPricePerUser = ({ planIsTrial, planPricePerUser }) => {
  if (planIsTrial) {
    return '';
  }

  return `${planPricePerUser}/month`;
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
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  ) : (
    <Avatar size={39}>{avatarContent}</Avatar>
  );
};

export const EmptyOrganizationMemberRow = () => (
  <Grid container alignItems="center" justify="center">
    No members are unsubscribed
  </Grid>
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
  showJoined,
  showSubscription,
  subscriptionPlanData,
  openRemoveSubscriptionModal,
  organizationMembers,
  isInvited,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  let userType = null;

  if (['CANCELLED', 'INACTIVE', 'PENDING'].includes(userStatus)) {
    userType = USER_STATUS_TYPES[userStatus];
  } else {
    const derivedOrgUserRole =
      ['ACTIVE', 'INACTIVE'].includes(userStatus) && eulaAcknowledged
        ? orgUserRole
        : '';

    userType = USER_TYPES[derivedOrgUserRole];
  }

  const removeSubscription = () => {
    openRemoveSubscriptionModal({
      userIdentifier,
      email,
      orgUserRole,
      confirm: () =>
        toggleSelectedUser({ userIdentifier, email })({
          target: { checked: false },
        }),
    });
  };

  const addSubscription = () =>
    toggleSelectedUser({ userIdentifier, email })({
      target: { checked: true },
    });

  const ownerCount =
    organizationMembers?.filter(
      ({ orgUserRole: memberUserRole }) => memberUserRole === 'OWNER',
    )?.length ?? 0;

  const hasOneUserRemaining = organizationMembers.length === 1;

  const isDisabledRemovingSubscription =
    hasOneUserRemaining ||
    (ownerCount <= 1 && orgUserRole === 'OWNER') ||
    userIdentifier === sessionStorage.userIdentifier;

  const registrationMoment = moment(registrationDate);
  const formattedRegistrationDate = registrationMoment.isValid()
    ? registrationMoment.format('LL')
    : '';

  const { planPricePerUser, planIsTrial } = subscriptionPlanData || {};

  const trialPlanPricePerUser = getTrialPlanPricePerUser({
    planIsTrial,
    planPricePerUser,
  });

  return (
    <MemberTableRow container spacing={1}>
      <Grid item xs={1}>
        <MemberTableCell alignItems="center">
          <MemberAvatar
            firstName={firstName}
            lastName={lastName}
            userIdentifier={userIdentifier}
            profileThumbnailPictureHash={profileThumbnailPictureHash}
          />
        </MemberTableCell>
      </Grid>
      <Grid item xs={4}>
        <MemberTableCell>
          {`${firstName} ${lastName} ${
            userIdentifier === sessionStorage.userIdentifier ? '(me)' : ''
          }`.trim()}
          {email && <StyledAnchorDiv>{email}</StyledAnchorDiv>}
        </MemberTableCell>
      </Grid>
      <Grid item xs={2}>
        <MemberTableCell>
          <MemberTypeLabel
            email={email}
            userIdentifier={userIdentifier}
            userType={userType}
            userTypes={USER_TYPES}
            removeSubscription={removeSubscription}
            addSubscription={addSubscription}
            orgUserRole={orgUserRole}
            isDisabledRemovingSubscription={isDisabledRemovingSubscription}
            userStatus={userStatus}
            isInvited={isInvited}
            userHasSubscription={
              !!isUserSelected({
                userIdentifier,
                email,
              })
            }
          />
        </MemberTableCell>
      </Grid>
      <Grid item xs={3}>
        <MemberTableCell isInvited={isInvited}>
          {showJoined && formattedRegistrationDate}
          {isInvited && <div>Invitation sent</div>}
        </MemberTableCell>
      </Grid>
      <Grid item xs={2}>
        <MemberTableCell>
          {showSubscription && trialPlanPricePerUser}
        </MemberTableCell>
      </Grid>
    </MemberTableRow>
  );
};

const mapDispatchToProps = {
  openRemoveSubscriptionModal: props =>
    openModalAction('RemoveActiveUser', { ...props }),
};

export default connect(null, mapDispatchToProps)(OrganizationMemberRow);
