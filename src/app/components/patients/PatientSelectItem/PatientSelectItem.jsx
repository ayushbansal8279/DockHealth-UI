import { bool, shape, string } from 'prop-types';
import React, { useLayoutEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
// import prop from 'ramda/src/prop';
// import sortBy from 'ramda/src/sortBy';
// import compose from 'ramda/src/compose';
// import toLower from 'ramda/src/toLower';
import { SuggestionItemContainer, SuggestionText } from './styled';
import Tooltip from '../../common/Tooltip/Tooltip';

const PatientSelectItem = React.forwardRef(
  ({ patient, searchValue, isFocused, header, ...restProps }, reference) => {
    const { name, dob, mrn } = patient;
    // const sortedPatientMetaData = patient?.patientMetaData
    //   ? sortBy(
    //       compose(toLower, prop('customFieldName')),
    //       patient?.patientMetaData,
    //     )
    //   : [];
    const nameRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);
    useLayoutEffect(() => {
      if (nameRef.current) {
        setIsTruncated(
          nameRef.current.scrollWidth > nameRef.current.clientWidth,
        );
      }
    }, [name]);
    return (
      <SuggestionItemContainer
        ref={reference}
        isFocused={isFocused}
        {...restProps}
      >
        <Tooltip placement="top" title={isTruncated ? name : ''}>
          <SuggestionText ref={nameRef}>
            <Highlighter
              highlightStyle={{ fontWeight: 'bold', background: 'none' }}
              searchWords={searchValue?.toLowerCase().split(/\s+/)}
              autoEscape
              textToHighlight={name}
            />
          </SuggestionText>
        </Tooltip>
        <SuggestionText>
          {header ? dob : dob ? moment(dob).format('MMM D, YYYY') : dob}
        </SuggestionText>
        <SuggestionText>
          <Highlighter
            highlightStyle={{ fontWeight: 'bold', background: 'none' }}
            searchWords={searchValue?.toLowerCase().split(/\s+/)}
            autoEscape
            textToHighlight={mrn ?? ''}
          />
        </SuggestionText>
        {/* {sortedPatientMetaData?.map(
          ({ displayName, value, displayOptions }) => (
            <>
              {displayOptions?.includes('PATIENT_SEARCH') && value && (
                <SuggestionText>{displayName || value}</SuggestionText>
              )}
            </>
          ),
        )} */}
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
