import React from 'react';
import { DefaultSuggestionItemContainer, TagType, HintText } from './styled';

const DefaultSuggestionItem = ({ tagType, hint = '' }) => {
  return (
    <DefaultSuggestionItemContainer>
      <TagType>{tagType}</TagType>
      <HintText>{hint}</HintText>
    </DefaultSuggestionItemContainer>
  );
};

export default DefaultSuggestionItem;
