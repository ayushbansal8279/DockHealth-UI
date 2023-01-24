/* eslint-disable import/extensions */
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Popper } from '@material-ui/core';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import * as UserApi from 'api/user-api';
import Spacing from 'components/common/Spacing';
import {
  ActivityStatus,
  getOrgRole,
  getUserActivityStatus,
  isUserGroup as isUserGroupHelper,
  UserStatus,
} from 'helpers/user-helper';
import { getGroupActivityStatus } from 'helpers/user-groups-helper';
import { formatPhoneNumber } from 'helpers/utility-functions';
import moment from 'moment';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import {
  MentionItem,
  UserCardContainer,
  UserImageContainer,
  RoleSection,
  SkeletonLoaderDataContainer,
  SkeletonLoaderRoleSection,
  SkeletonLoaderText,
  Divider,
  Role,
  UserTasksLink,
  ProfileInfoSection,
  ProfileInfoText,
  UserNameText,
  EmailLink,
  Initials,
  AvatarCircle,
  AvatarBorder,
  AvatarImage,
  NameSection,
  StatusIndicatorContainer,
  OnlineIndicator,
  IdleIndicator,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const UserMention = ({ mention, className, children }) => {
  const reference = useRef(null);
  const [userOrGroup, setUserOrGroup] = useState(null);
  const isUserGroup = userOrGroup ? isUserGroupHelper(userOrGroup) : undefined;

  const [cardOpen, openCard, closeCard] = useBooleanWithTimeout();

  const activeUsersList = useSelector(activeUsersListSelector);

  const activityStatus = isUserGroup
    ? getGroupActivityStatus(userOrGroup, activeUsersList)
    : getUserActivityStatus(userOrGroup, activeUsersList);

  useEffect(() => {
    if (cardOpen && !userOrGroup) {
      UserApi.getUserById(mention.identifier)
        .then(fetchedUserOrGroup => {
          setUserOrGroup(fetchedUserOrGroup);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardOpen, userOrGroup]);

  const localTime = !isUserGroup
    ? moment()
        .utc()
        .add(userOrGroup?.timezoneOffset, 'hour')
        .format('hh:mm A')
    : null;

  const isActive =
    isUserGroup ||
    userOrGroup?.userStatus === UserStatus.ACTIVE ||
    userOrGroup?.userStatus === UserStatus.INVITED;

  return (
    <MentionItem
      ref={reference}
      onMouseEnter={openCard}
      onMouseLeave={closeCard}
      className={className}
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={cardOpen && !!mention.identifier}
        placement="bottom-start"
        style={{ zIndex: 2000 }}
      >
        <UserCardContainer
          onClick={event => {
            event.stopPropagation();
          }}
        >
          <UserImageContainer>
            <AvatarCircle color={userOrGroup?.bubbleColor}>
              <AvatarBorder>
                {userOrGroup ? (
                  <>
                    {userOrGroup.profilePictureHash && (
                      <AvatarImage
                        src={`${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userOrGroup.userIdentifier}/${userOrGroup.profilePictureHash}`}
                        alt={userOrGroup.name}
                      />
                    )}
                    <Initials>{userOrGroup.initials?.toLowerCase()}</Initials>
                  </>
                ) : null}
              </AvatarBorder>
            </AvatarCircle>
          </UserImageContainer>

          {userOrGroup ? (
            <>
              <RoleSection isActiveUser={isActive}>
                <Role>
                  {isUserGroup ? (
                    'User group'
                  ) : (
                    <>
                      {isActive
                        ? getOrgRole(userOrGroup.orgUserRole)
                        : 'Deactivated'}
                    </>
                  )}
                </Role>
                {!isUserGroup && (
                  <Link to={`/core/assignedToPerson/${userOrGroup.identifier}`}>
                    <UserTasksLink>view tasks</UserTasksLink>
                  </Link>
                )}
              </RoleSection>
              <ProfileInfoSection>
                <NameSection>
                  <UserNameText>{userOrGroup.name}</UserNameText>
                  <StatusIndicatorContainer>
                    {activityStatus === ActivityStatus.ONLINE && (
                      <>
                        {' '}
                        <OnlineIndicator /> online{' '}
                      </>
                    )}
                    {activityStatus === ActivityStatus.IDLE && (
                      <>
                        {' '}
                        <IdleIndicator /> idle{' '}
                      </>
                    )}
                    {activityStatus === ActivityStatus.OFFLINE && (
                      <> offline </>
                    )}
                  </StatusIndicatorContainer>
                </NameSection>
                {userOrGroup.titles &&
                  userOrGroup.titles.length > 0 &&
                  userOrGroup.titles[0]?.name && (
                    <ProfileInfoText>
                      <>{userOrGroup.titles[0]?.name}</>
                    </ProfileInfoText>
                  )}
                {userOrGroup.email && (
                  <EmailLink
                    href={`mailto:${userOrGroup.email}`}
                    target="_blank"
                  >
                    {userOrGroup.email}
                  </EmailLink>
                )}
                {userOrGroup.accountPhoneNumber && (
                  <ProfileInfoText>
                    {formatPhoneNumber(userOrGroup.accountPhoneNumber)}
                  </ProfileInfoText>
                )}
                {!isUserGroup && (
                  <>
                    <Spacing vertical={2} />
                    <Divider />
                    <Spacing vertical={2} />
                    <ProfileInfoText>Local time {localTime}</ProfileInfoText>
                  </>
                )}
              </ProfileInfoSection>
            </>
          ) : (
            <>
              <SkeletonLoaderRoleSection />
              <SkeletonLoaderDataContainer>
                <SkeletonLoaderText widthPercentage={50} />
                <Spacing vertical={3} />
                <SkeletonLoaderText />
                <Spacing vertical={2} />
                <SkeletonLoaderText />
                <Spacing vertical={2} />
                <SkeletonLoaderText />
                <Spacing vertical={3} />
                <Divider />
                <Spacing vertical={3} />
                <SkeletonLoaderText />
              </SkeletonLoaderDataContainer>
            </>
          )}
        </UserCardContainer>
      </Popper>
    </MentionItem>
  );
};

export default UserMention;
