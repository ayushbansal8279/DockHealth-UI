import React from 'react';
import Highlighter from 'react-highlight-words';
import { SuggestionItemContainer, SuggestionText } from './styled';

const PatientSuggestionItem = ({
  mention,
  searchValue,
  isFocused,
  ...parentProps
}) => {
  return (
    <SuggestionItemContainer {...parentProps} isFocused={isFocused}>
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

export default PatientSuggestionItem;
