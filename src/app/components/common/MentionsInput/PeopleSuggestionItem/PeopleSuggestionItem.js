import Member from 'components/members/Member/Member';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { SuggestionItemContainer, SuggestionText } from './styled';

const PeopleSuggestionItem = ({
  mention,
  searchValue,
  isFocused,
  ...parentProps
}) => {
  return (
    <SuggestionItemContainer {...parentProps} isFocused={isFocused}>
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
