import React, { useState } from 'react';
import SearchClearIcon from 'img/search-clear.svg';
import SearchHeadsupIcon from 'img/search-headsup.svg';
import {
  MegaFilterSearchContainer,
  MegaFilterSearchInputContainer,
  MegaFilterSearchInput,
  MegaFilterClearIcon,
} from './styled';

const MegaFilterSearch = ({ onSearch, value }) => {
  const [isInputFocused, setInputFocus] = useState(false);
  return (
    <MegaFilterSearchContainer>
      <img src={SearchHeadsupIcon} alt="search" />
      <MegaFilterSearchInputContainer>
        <MegaFilterSearchInput
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          onChange={event => {
            event.preventDefault();
            event.stopPropagation();
            onSearch(event.target.value);
          }}
          value={value}
          placeholder="SEARCH"
        />
        <MegaFilterClearIcon
          alt="clear"
          src={SearchClearIcon}
          isInputFocused={isInputFocused}
          onClick={() => {
            onSearch('');
            setInputFocus(false);
          }}
        />
      </MegaFilterSearchInputContainer>
    </MegaFilterSearchContainer>
  );
};

export default MegaFilterSearch;
