import React from 'react';
import DefaultSuggestionItem from '../DefaultSuggestionItem/DefaultSuggestionItem';
import {
  PopoverContainer,
  SuggestionsContainer,
  Spacer,
  EmptySuggestions,
} from './styled';

const UsersSuggestionsPopover = React.forwardRef(
  ({ children, searchValue, isFetching, ...props }, reference) => {
    const suggestionsToDisplay = React.Children.toArray(children).filter(
      (suggestionChild) => suggestionChild.props.mention.type !== 'DEFAULT',
    );

    return (
      <PopoverContainer {...props} ref={reference}>
        {suggestionsToDisplay.length > 0 && (
          <SuggestionsContainer>
            {suggestionsToDisplay.map((child) => (
              <div key={child.props.mention.id}>
                {React.cloneElement(child, child.props)}
              </div>
            ))}
          </SuggestionsContainer>
        )}
        {searchValue && suggestionsToDisplay.length === 0 && !isFetching && (
          <EmptySuggestions>{`@${searchValue} is not invited to this list`}</EmptySuggestions>
        )}
        {suggestionsToDisplay.length > 0 && <Spacer />}
        <DefaultSuggestionItem
          tagType="@People"
          hint={
            suggestionsToDisplay.length === 0 && !searchValue
              ? `Start typing user's name`
              : ''
          }
        />
      </PopoverContainer>
    );
  },
);

export default UsersSuggestionsPopover;
