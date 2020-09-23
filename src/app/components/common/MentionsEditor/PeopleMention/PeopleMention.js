import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Popper } from '@material-ui/core';
import * as PeopleApi from 'api/people-api';
import Spacing from 'components/common/Spacing';
import { getOrgRole } from 'helpers/people-helper';
import { formatPhoneNumber } from 'helpers/utility-functions';
import {
  MentionItem,
  PersonCardContainer,
  PersonImageContainer,
  PersonImage,
  RoleSection,
  SkeletonLoaderImage,
  SkeletonLoaderDataContainer,
  SkeletonLoaderRoleSection,
  SkeletonLoaderText,
  // Divider,
  Role,
  PersonTasksLink,
  ProfileInfoSection,
  ProfileInfoText,
  UserNameText,
  EmailLink,
  PersonInitialsContainer,
  Initials,
  InitialsBorder,
} from './styled';

const getPersonAvatar = ({
  userIdentifier,
  profilePictureHash,
  bubbleColor,
  initials,
}) => {
  if (profilePictureHash) {
    return (
      <PersonImage
        url={`${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}/${profilePictureHash}`}
      />
    );
  }

  return (
    <PersonInitialsContainer color={bubbleColor}>
      <InitialsBorder>
        <Initials>{initials.toLowerCase()}</Initials>
      </InitialsBorder>
    </PersonInitialsContainer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PeopleMention = ({ mention, className, children }) => {
  const reference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [personData, setPersonData] = useState(null);

  useEffect(() => {
    if (isHovered && !personData) {
      PeopleApi.getUserById(mention.identifier)
        .then(fetchedPerson => {
          setPersonData(fetchedPerson);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, personData]);

  return (
    <MentionItem
      ref={reference}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={isHovered && !!mention.identifier}
        placement="bottom-start"
        style={{ zIndex: 2000 }}
      >
        <PersonCardContainer
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <PersonImageContainer>
            {personData ? getPersonAvatar(personData) : <SkeletonLoaderImage />}
          </PersonImageContainer>

          {personData ? (
            <>
              <RoleSection>
                <Role>{getOrgRole(personData.orgUserRole)}</Role>
                <Link to={`assignedToPerson/${personData.userIdentifier}`}>
                  <PersonTasksLink>view tasks</PersonTasksLink>
                </Link>
              </RoleSection>
              <ProfileInfoSection>
                <UserNameText>{personData.userName}</UserNameText>
                <ProfileInfoText>
                  {personData.titles[0]?.name || '-'}
                </ProfileInfoText>
                <EmailLink href={`mailto:${personData.email}`} target="_blank">
                  {personData.email}
                </EmailLink>
                <ProfileInfoText>
                  {personData.accountPhoneNumber
                    ? formatPhoneNumber(personData.accountPhoneNumber)
                    : '-'}
                </ProfileInfoText>
                {/* <Spacing vertical={2} />
                <Divider />
                <Spacing vertical={2} />
                <ProfileInfoText>Local time</ProfileInfoText> */}
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
                {/* <Spacing vertical={3} />
                <Divider />
                <Spacing vertical={3} />
                <SkeletonLoaderText /> */}
              </SkeletonLoaderDataContainer>
            </>
          )}
        </PersonCardContainer>
      </Popper>
    </MentionItem>
  );
};

export default PeopleMention;
