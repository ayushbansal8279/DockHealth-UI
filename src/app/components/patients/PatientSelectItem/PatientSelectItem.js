import { bool, shape, string } from 'prop-types';
import React from 'react';
import Highlighter from 'react-highlight-words';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';
import compose from 'ramda/src/compose';
import toLower from 'ramda/src/toLower';
import { SuggestionItemContainer, SuggestionText } from './styled';

const PatientSelectItem = React.forwardRef(
  ({ patient, searchValue, isFocused, ...restProps }, reference) => {
    const { name, dob, mrn } = patient;
    const sortedPatientMetaData = patient?.patientMetaData
      ? sortBy(
          compose(toLower, prop('customFieldName')),
          patient?.patientMetaData,
        )
      : [];

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
        {sortedPatientMetaData?.map(
          ({ displayName, value, displayOptions }) => (
            <>
              {displayOptions?.includes('PATIENT_SEARCH') && value && (
                <SuggestionText>{displayName || value}</SuggestionText>
              )}
            </>
          ),
        )}
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
