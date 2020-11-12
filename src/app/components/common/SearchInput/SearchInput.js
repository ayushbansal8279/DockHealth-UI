import React, { useState } from 'react';
import SearchHeadsupIcon from 'img/search-headsup';
import {
  StyledInput,
  SearchInputWrapper,
  InputIconWrapper,
  ClearButtonWrapper,
  ClearButton,
} from './styled';

const SearchInput = React.forwardRef(
  (
    { value, onValueChange, onClear, onFocus, onBlur, placeholder = null },
    reference,
  ) => {
    const hasValueProps = value !== undefined;

    const [clearVisible, setClearVisible] = useState(value ?? false);

    const clearInput = () => {
      onClear();
      setClearVisible(false);

      // eslint-disable-next-line no-param-reassign
      if (!hasValueProps) reference.current.value = '';
    };

    const onInputChange = event => {
      const inputValue = event?.target?.value;
      if (inputValue && !clearVisible) {
        setClearVisible(true);
      } else if (!inputValue && clearVisible) {
        setClearVisible(false);
      }
      onValueChange(inputValue);
    };

    const inputProps = {
      onChange: onInputChange,
      placeholder: placeholder || 'Search',
      onFocus,
      onBlur,
    };

    if (hasValueProps) inputProps.value = value;

    return (
      <SearchInputWrapper>
        <InputIconWrapper>
          <img src={SearchHeadsupIcon} alt="search" />
        </InputIconWrapper>
        <StyledInput ref={reference} {...inputProps} />
        {clearVisible && (
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
