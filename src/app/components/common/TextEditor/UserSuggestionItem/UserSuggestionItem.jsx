import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
  ActivityStatus,
  getUserActivityStatus,
  isUserGroup,
} from 'helpers/user-helper';
import { getGroupActivityStatus } from 'helpers/user-groups-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { activeUsersListSelector } from 'selectors/active-users-selector';
import {
  SuggestionItemContainer,
  SuggestionText,
  StatusNameSection,
} from './styled';

const UserSuggestionItem = ({
  mention,
  searchValue,
  isFocused,
  ...parentProps
}) => {
  const suggestionItemReference = useRef(null);

  const handleScroll = () => {
    const itemElement = suggestionItemReference.current.parentElement;
    const containerElement =
      suggestionItemReference.current.parentElement.parentElement;
    const { offsetTop: itemOffsetTop, offsetHeight: itemHeight } = itemElement;
    const { scrollTop: containerScrollTop, offsetHeight: containerHeight } =
      containerElement;

    if (itemOffsetTop >= containerScrollTop + containerHeight) {
      containerElement.scrollTop = itemOffsetTop - containerHeight + itemHeight;
    } else if (itemOffsetTop <= containerScrollTop - itemHeight) {
      containerElement.scrollTop = itemOffsetTop;
    }
  };

  const activeUsersList = useSelector(activeUsersListSelector);

  const activityStatus = isUserGroup(mention)
    ? getGroupActivityStatus(mention, activeUsersList)
    : getUserActivityStatus(mention, activeUsersList);

  useEffect(() => {
    if (suggestionItemReference.current && isFocused) {
      handleScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <SuggestionItemContainer
      ref={suggestionItemReference}
      {...parentProps}
      isFocused={isFocused}
    >
      {isUserGroup(mention) ? (
        <GroupAvatar group={mention} hideTooltip />
      ) : (
        <UserAvatar user={mention} hideTooltip />
      )}
      <SuggestionText>
        <Highlighter
          highlightStyle={{ fontWeight: 'bold', background: 'none' }}
          searchWords={searchValue?.toLowerCase().split(/\s+/)}
          autoEscape
          textToHighlight={mention.name}
        />
      </SuggestionText>
      {activityStatus && (
        <StatusNameSection>
          {activityStatus === ActivityStatus.ONLINE && 'online'}
          {activityStatus === ActivityStatus.IDLE && 'idle'}
          {activityStatus === ActivityStatus.OFFLINE && 'offline'}
        </StatusNameSection>
      )}
    </SuggestionItemContainer>
  );
};

export default UserSuggestionItem;
