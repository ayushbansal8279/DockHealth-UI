import Member from 'components/members/Member/Member';
import React, { useEffect, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { SuggestionItemContainer, SuggestionText } from './styled';

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
      <Member size={30} member={mention} showTooltip={false} />
      <SuggestionText>
        <Highlighter
          highlightStyle={{ fontWeight: 'bold', background: 'none' }}
          searchWords={searchValue?.toLowerCase().split(/\s+/)}
          autoEscape
          textToHighlight={mention.name}
        />
      </SuggestionText>
    </SuggestionItemContainer>
  );
};

export default PeopleSuggestionItem;
