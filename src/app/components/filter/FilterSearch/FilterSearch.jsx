import React, { useState } from 'react';
import SearchClearIcon from 'img/search-clear.svg';
import SearchHeadsUpIcon from 'img/search-headsup.svg';
import {
  FilterSearchContainer,
  FilterSearchInputContainer,
  FilterSearchInput,
  FilterClearIcon,
} from './styled';

const FilterSearch = ({ value, onValueChange }) => {
  const [isInputFocused, setInputFocus] = useState(false);

  return (
    <FilterSearchContainer>
      <img src={SearchHeadsUpIcon} alt="search" />
      <FilterSearchInputContainer>
        <FilterSearchInput
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          onChange={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onValueChange(event.target.value);
          }}
          value={value}
          placeholder="SEARCH"
        />
        <FilterClearIcon
          alt="clear"
          src={SearchClearIcon}
          isInputFocused={isInputFocused}
          onClick={() => {
            onValueChange('');
            setInputFocus(false);
          }}
        />
      </FilterSearchInputContainer>
    </FilterSearchContainer>
  );
};

export default FilterSearch;
