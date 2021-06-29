import React from 'react';
import DefaultSuggestionItem from '../DefaultSuggestionItem/DefaultSuggestionItem';
import { PopoverContainer, SuggestionsContainer, Spacer } from './styled';

const PatientsSuggestionsPopover = React.forwardRef(
  ({ children, searchValue, customerTypeLabel, ...props }, reference) => {
    const suggestionsToDisplay = React.Children.toArray(children).filter(
      suggestionChild => suggestionChild.props.mention.type !== 'DEFAULT',
    );

    return (
      <div {...props} ref={reference}>
        <PopoverContainer>
          {suggestionsToDisplay.length > 0 && (
            <SuggestionsContainer>
              {suggestionsToDisplay.map(child => (
                <div key={child.props.mention.id}>
                  {React.cloneElement(child, child.props)}
                </div>
              ))}
            </SuggestionsContainer>
          )}
          {suggestionsToDisplay.length > 0 && <Spacer />}
          <DefaultSuggestionItem
            tagType={`#${customerTypeLabel}s`}
            hint={
              suggestionsToDisplay.length === 0 && !searchValue
                ? `Start typing ${customerTypeLabel} name`.toLowerCase()
                : ''
            }
          />
        </PopoverContainer>
      </div>
    );
  },
);

export default PatientsSuggestionsPopover;
