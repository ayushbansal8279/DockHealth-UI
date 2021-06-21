import PropTypes, { bool, number, string } from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, omit } from 'ramda';
import palette from 'styles/palette';
import { getMemberStatus } from 'helpers/list-members-helper';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  TooltipName,
  TooltipStatus,
  TooltipContent,
  MemberImage,
  BackgroundContainer,
  AvatarContainer,
  InnerAvatarContainer,
  OnlineIndicator,
  OfflineIndicator,
  IdleIndicator,
} from './styled';

const getThumbnailUrl = (userIdentifier, profileThumbnailPictureHash) =>
  `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userIdentifier}/${profileThumbnailPictureHash}`;

const AvatarFilterMember = React.forwardRef(
  (
    {
      member,
      children,
      color,
      size,
      showTooltip,
      isInactive,
      showOnlineIndicator,
      isSelected,
      onSelectFilters,
      selectedFilters,
      ...props
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const {
      userIdentifier,
      firstName,
      lastName,
      initials,
      profileThumbnailPictureHash,
      userStatus,
      taskListUserRole,
      bubbleColor,
    } = member || {};

    const filterName = 'assignedTo';
    const activeUsersList = useSelector(activeUsersListSelector);

    const avatarContent = useMemo(() => {
      if (profileThumbnailPictureHash) {
        const status = getMemberStatus({ userStatus, taskListUserRole });
        const alt = userIdentifier ? (
          <div>
            <TooltipName>
              {`${firstName} ${lastName}`?.slice(0, 18)}
            </TooltipName>
            {status && <TooltipStatus>{status}</TooltipStatus>}
          </div>
        ) : null;
        return (
          <MemberImage
            src={getThumbnailUrl(userIdentifier, profileThumbnailPictureHash)}
            alt={alt}
          />
        );
      }
      return initials?.toLowerCase();
    }, [
      profileThumbnailPictureHash,
      initials,
      userStatus,
      taskListUserRole,
      userIdentifier,
      firstName,
      lastName,
    ]);

    const onlineActiveUser =
      activeUsersList?.find(({ userIdentifier: id }) => {
        return id === member?.userIdentifier;
      }) || {};

    const isOnline = !isEmpty(onlineActiveUser) && !onlineActiveUser.idle;
    const isIdle = !isEmpty(onlineActiveUser) && onlineActiveUser.idle;
    const isOffline =
      member?.userStatus !== 'INVITED' && isEmpty(onlineActiveUser);
    const isInvited =
      member?.userStatus === 'INVITED' && isEmpty(onlineActiveUser);

    const backgroundColor = bubbleColor || color;
    const toggleSelect = () => {
      if (!isEmpty(selectedFilters)) {
        if (isSelected) {
          const filteredWithoutTheSelectedOne = selectedFilters?.[
            filterName
          ]?.filter(userId => userId !== userIdentifier);
          onSelectFilters({
            ...selectedFilters,
            [filterName]: [...filteredWithoutTheSelectedOne],
          });
        } else if (selectedFilters[filterName]) {
          onSelectFilters({
            ...selectedFilters,
            [filterName]: [...selectedFilters[filterName], userIdentifier],
          });
        } else {
          onSelectFilters({
            ...selectedFilters,
            [filterName]: [userIdentifier],
          });
        }
      } else {
        onSelectFilters({
          [filterName]: [userIdentifier],
        });
      }
    };

    return (
      <>
        <Tooltip
          title={
            <TooltipContent>
              <b>{member?.userName}</b>
              <div>
                {isOnline && 'online'}
                {isIdle && 'idle'}
                {isOffline && 'offline'}
                {isInvited && 'invite pending'}
              </div>
            </TooltipContent>
          }
          placement="bottom"
          hideTooltip={!showTooltip}
        >
          <BackgroundContainer onClick={toggleSelect}>
            <AvatarContainer
              ref={reference}
              size={size}
              color={backgroundColor}
              isInactive={isInactive || isInvited}
              isSelected={isSelected}
              {...omit(['ref'], props)}
            >
              <InnerAvatarContainer
                color={backgroundColor}
                size={size}
                isSelected={isSelected}
              >
                {children || avatarContent}
              </InnerAvatarContainer>
              {showOnlineIndicator && (
                <>
                  {isOnline && <OnlineIndicator />}
                  {isOffline && <OfflineIndicator />}
                  {isIdle && <IdleIndicator />}
                </>
              )}
            </AvatarContainer>
          </BackgroundContainer>
        </Tooltip>
      </>
    );
  },
);

AvatarFilterMember.propTypes = {
  showTooltip: bool,
  showOnlineIndicator: bool,
  size: number,
  member: PropTypes.shape({
    userIdentifier: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    initials: PropTypes.string,
    profileThumbnailPictureHash: PropTypes.string,
  }),
  isSelected: PropTypes.bool,
  color: string,
  onSelectFilters: PropTypes.func.isRequired,
  selectedFilters: PropTypes.objectOf(PropTypes.array).isRequired,
};

AvatarFilterMember.defaultProps = {
  showTooltip: true,
  showOnlineIndicator: true,
  size: 30,
  member: null,
  color: palette.coolGrey2,
  isSelected: false,
};

export default AvatarFilterMember;
