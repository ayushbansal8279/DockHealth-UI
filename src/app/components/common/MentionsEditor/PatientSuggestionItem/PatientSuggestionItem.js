import React, { useEffect, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { SuggestionItemContainer, SuggestionText } from './styled';

const PatientSuggestionItem = ({
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

  const { name, mrn, age } = mention;

  return (
    <SuggestionItemContainer
      ref={suggestionItemReference}
      {...parentProps}
      isFocused={isFocused}
    >
      <SuggestionText>
        <Highlighter
          highlightStyle={{ fontWeight: 'bold', background: 'none' }}
          searchWords={searchValue?.toLowerCase().split(/\s+/)}
          autoEscape
          textToHighlight={name}
        />
      </SuggestionText>
      <SuggestionText>{age}</SuggestionText>
      <SuggestionText>{mrn}</SuggestionText>
    </SuggestionItemContainer>
  );
};

export default PatientSuggestionItem;
