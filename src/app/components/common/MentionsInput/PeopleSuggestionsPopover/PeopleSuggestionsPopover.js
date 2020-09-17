import React from 'react';
import DefaultSuggestionItem from '../DefaultSuggestionItem/DefaultSuggestionItem';
import { PopoverContainer, SuggestionsContainer, Spacer } from './styled';

const PeopleSuggestionsPopover = React.forwardRef(
  ({ children, ...props }, reference) => {
    const suggestionsToDisplay = React.Children.toArray(children).filter(
      suggestionChild => suggestionChild.props.mention.type !== 'DEFAULT',
    );

    return (
      <div {...props} ref={reference}>
        <PopoverContainer>
          {suggestionsToDisplay.length > 0 && (
            <SuggestionsContainer>
              {suggestionsToDisplay.map(child =>
                React.cloneElement(child, child.props),
              )}
            </SuggestionsContainer>
          )}
          {suggestionsToDisplay.length > 0 && <Spacer />}
          <DefaultSuggestionItem
            tagType="@People"
            hint={
              suggestionsToDisplay.length === 0
                ? `Start typing user's name`
                : ''
            }
          />
        </PopoverContainer>
      </div>
    );
  },
);

export default PeopleSuggestionsPopover;
