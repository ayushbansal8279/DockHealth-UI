import { bool, shape, string } from 'prop-types';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { SuggestionItemContainer, SuggestionText } from './styled';

const PatientSelectItem = React.forwardRef(
  ({ patient, searchValue, isFocused, ...restProps }, reference) => {
    const { name, dob, mrn } = patient;
    return (
      <SuggestionItemContainer
        ref={reference}
        isFocused={isFocused}
        {...restProps}
      >
        <SuggestionText>
          <Highlighter
            highlightStyle={{ fontWeight: 'bold', background: 'none' }}
            searchWords={searchValue?.toLowerCase().split(/\s+/)}
            autoEscape
            textToHighlight={name}
          />
        </SuggestionText>
        <SuggestionText>{dob}</SuggestionText>
        <SuggestionText>
          <Highlighter
            highlightStyle={{ fontWeight: 'bold', background: 'none' }}
            searchWords={searchValue?.toLowerCase().split(/\s+/)}
            autoEscape
            textToHighlight={mrn ?? ''}
          />
        </SuggestionText>
      </SuggestionItemContainer>
    );
  },
);

PatientSelectItem.propTypes = {
  patient: shape({
    name: string,
    mrn: string,
    age: string,
  }).isRequired,
  searchValue: string,
  isFocused: bool,
};

PatientSelectItem.defaultProps = {
  searchValue: '',
  isFocused: false,
};

export default PatientSelectItem;
