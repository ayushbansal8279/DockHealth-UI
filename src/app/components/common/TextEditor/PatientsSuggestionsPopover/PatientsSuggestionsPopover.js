import { path } from 'ramda';
import React from 'react';
import { List } from 'react-virtualized';
import DefaultSuggestionItem from '../DefaultSuggestionItem/DefaultSuggestionItem';
import { PopoverContainer, SuggestionsContainer, Spacer } from './styled';

const PatientsSuggestionsPopover = React.forwardRef(
  ({ children, searchValue, customerTypeLabel, ...props }, reference) => {
    const suggestionsToDisplay = React.Children.toArray(children).filter(
      suggestionChild => suggestionChild.props.mention.type !== 'DEFAULT',
    );

    const focusedIndex = suggestionsToDisplay.findIndex(
      path(['props', 'isFocused']),
    );

    const renderPatientRow = ({ key, index, style }) => {
      const child = suggestionsToDisplay[index];
      return (
        <div key={key} style={style}>
          {React.cloneElement(child, child.props)}
        </div>
      );
    };

    return (
      <PopoverContainer {...props} ref={reference}>
        {suggestionsToDisplay.length > 0 && (
          <SuggestionsContainer>
            <List
              scrollToIndex={focusedIndex}
              width={300}
              height={
                suggestionsToDisplay.length > 5
                  ? 208
                  : suggestionsToDisplay.length * 40
              }
              rowHeight={40}
              rowRenderer={renderPatientRow}
              rowCount={suggestionsToDisplay.length}
            />
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
    );
  },
);

export default PatientsSuggestionsPopover;
