import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Popper } from '@material-ui/core';
import useCardWithTimeout from 'hooks/use-card-with-timeout';
import * as PeopleApi from 'api/people-api';
import Spacing from 'components/common/Spacing';
import { getOrgRole } from 'helpers/people-helper';
import { formatPhoneNumber } from 'helpers/utility-functions';
import moment from 'moment';
import {
  MentionItem,
  PersonCardContainer,
  PersonImageContainer,
  RoleSection,
  SkeletonLoaderDataContainer,
  SkeletonLoaderRoleSection,
  SkeletonLoaderText,
  Divider,
  Role,
  PersonTasksLink,
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
const PeopleMention = ({ mention, className, children }) => {
  const reference = useRef(null);
  const [personData, setPersonData] = useState(null);

  const { cardOpen, openTrigger, closeTrigger } = useCardWithTimeout();

  const { activeUsersList } = useSelector(store => ({
    activeUsersList: store.activeUsers.activeUsersList,
  }));

  const onlineActiveUser = activeUsersList?.find(({ userIdentifier }) => {
    return userIdentifier === personData?.userIdentifier;
  });

  const isOnline = onlineActiveUser && !onlineActiveUser.idle;
  const isIdle = onlineActiveUser && onlineActiveUser.idle;
  const isOffline = !onlineActiveUser;

  const isActiveUser = !!(
    personData?.userStatus === 'ACTIVE' || personData?.userStatus === 'INVITED'
  );

  useEffect(() => {
    if (cardOpen && !personData) {
      PeopleApi.getUserById(mention.identifier)
        .then(fetchedPerson => {
          setPersonData(fetchedPerson);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardOpen, personData]);

  const localTime = moment()
    .utc()
    .add(personData?.timezoneOffset, 'hour')
    .format('hh:mm A');

  return (
    <MentionItem
      ref={reference}
      onMouseEnter={openTrigger}
      onMouseLeave={closeTrigger}
      className={className}
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={cardOpen && !!mention.identifier}
        placement="bottom-start"
        style={{ zIndex: 2000 }}
      >
        <PersonCardContainer
          onClick={event => {
            event.stopPropagation();
          }}
        >
          <PersonImageContainer>
            <AvatarCircle color={personData?.bubbleColor}>
              <AvatarBorder>
                {personData ? (
                  <>
                    {personData.profilePictureHash && (
                      <AvatarImage
                        src={`${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${personData.userIdentifier}/${personData.profilePictureHash}`}
                        alt={personData.userName}
                      />
                    )}
                    <Initials>{personData.initials?.toLowerCase()}</Initials>
                  </>
                ) : null}
              </AvatarBorder>
            </AvatarCircle>
          </PersonImageContainer>

          {personData ? (
            <>
              <RoleSection isActiveUser={isActiveUser}>
                <Role>
                  {isActiveUser
                    ? getOrgRole(personData.orgUserRole)
                    : 'Deactivated'}
                </Role>
                <Link
                  to={`/core/assignedToPerson/${personData.userIdentifier}`}
                >
                  <PersonTasksLink>view tasks</PersonTasksLink>
                </Link>
              </RoleSection>
              <ProfileInfoSection>
                <NameSection>
                  <UserNameText>{personData.userName}</UserNameText>
                  <StatusIndicatorContainer>
                    {isOnline && (
                      <>
                        {' '}
                        <OnlineIndicator /> online{' '}
                      </>
                    )}
                    {isIdle && (
                      <>
                        {' '}
                        <IdleIndicator /> idle{' '}
                      </>
                    )}
                    {isOffline && <> offline </>}
                  </StatusIndicatorContainer>
                </NameSection>
                {personData.titles &&
                  personData.titles.length > 0 &&
                  personData.titles[0]?.name && (
                    <ProfileInfoText>
                      <>{personData.titles[0]?.name}</>
                    </ProfileInfoText>
                  )}
                {personData.email && (
                  <EmailLink
                    href={`mailto:${personData.email}`}
                    target="_blank"
                  >
                    {personData.email}
                  </EmailLink>
                )}
                {personData.accountPhoneNumber && (
                  <ProfileInfoText>
                    {formatPhoneNumber(personData.accountPhoneNumber)}
                  </ProfileInfoText>
                )}
                <Spacing vertical={2} />
                <Divider />
                <Spacing vertical={2} />
                <ProfileInfoText>Local time {localTime}</ProfileInfoText>
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
        </PersonCardContainer>
      </Popper>
    </MentionItem>
  );
};

export default PeopleMention;
