import Member from 'components/members/Member/Member';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import { isEmpty } from 'ramda';
import {
  SuggestionItemContainer,
  SuggestionText,
  StatusNameSection,
} from './styled';

const PeopleSuggestionItem = ({
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
    const {
      scrollTop: containerScrollTop,
      offsetHeight: containerHeight,
    } = containerElement;

    if (itemOffsetTop >= containerScrollTop + containerHeight) {
      containerElement.scrollTop = itemOffsetTop - containerHeight + itemHeight;
    } else if (itemOffsetTop <= containerScrollTop - itemHeight) {
      containerElement.scrollTop = itemOffsetTop;
    }
  };

  const { activeUsersList } = useSelector(store => ({
    activeUsersList: store.activeUsers.activeUsersList,
  }));

  const onlineActiveUser =
    activeUsersList?.find(({ userIdentifier }) => {
      return userIdentifier === mention?.userIdentifier;
    }) || {};

  const isOnline = !isEmpty(onlineActiveUser) && !onlineActiveUser.idle;
  const isIdle = !isEmpty(onlineActiveUser) && onlineActiveUser.idle;
  const isOffline = isEmpty(onlineActiveUser);

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
      <Member
        member={mention}
        showTooltip={false}
        isInactive={['PENDING', 'INVITED', 'INACTIVE'].includes(
          mention.userStatus,
        )}
      />
      <SuggestionText>
        <Highlighter
          highlightStyle={{ fontWeight: 'bold', background: 'none' }}
          searchWords={searchValue?.toLowerCase().split(/\s+/)}
          autoEscape
          textToHighlight={mention.name}
        />
      </SuggestionText>
      <StatusNameSection>
        {isOnline && 'online'}
        {isIdle && 'idle'}
        {isOffline && 'offline'}
      </StatusNameSection>
    </SuggestionItemContainer>
  );
};

export default PeopleSuggestionItem;
