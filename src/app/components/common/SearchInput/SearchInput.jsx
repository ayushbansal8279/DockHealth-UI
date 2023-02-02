import React, { useRef } from 'react';
import SearchHeadsupIcon from 'img/search-headsup.svg';
import {
  StyledInput,
  SearchInputWrapper,
  InputIconWrapper,
  ClearButtonWrapper,
  ClearButton,
} from './styled';

const SearchInput = React.forwardRef(
  (
    { value, onValueChange, onFocus, onBlur, placeholder = null },
    reference,
  ) => {
    const innerInputReference = useRef(null);
    const inputReference = reference || innerInputReference;

    const clearInput = () => {
      onValueChange('');

      // eslint-disable-next-line no-unused-expressions
      inputReference.current?.focus();
    };

    const onInputChange = (event) => {
      const inputValue = event?.target?.value;
      onValueChange(inputValue);
    };

    const inputProps = {
      value,
      onChange: onInputChange,
      placeholder: placeholder || 'Search',
      onFocus,
      onBlur,
    };

    return (
      <SearchInputWrapper>
        <InputIconWrapper>
          <img src={SearchHeadsupIcon} alt="search" />
        </InputIconWrapper>
        <StyledInput ref={inputReference} {...inputProps} />
        {value && (
          <ClearButtonWrapper>
            <ClearButton type="button" onClick={clearInput}>
              Clear
            </ClearButton>
          </ClearButtonWrapper>
        )}
      </SearchInputWrapper>
    );
  },
);

export default SearchInput;
