import React from 'react';
import SearchHeadsupIcon from 'img/search-headsup';
import {
  StyledInput,
  GlobalSearchInputWrapper,
  InputIconWrapper,
  ClearButtonWrapper,
  ClearButton,
} from './styled';

const GlobalSearchInput = React.forwardRef(
  ({ value, onValueChange, onClear }, reference) => {
    const clearInput = () => {
      onValueChange('');
      onClear();
    };

    return (
      <GlobalSearchInputWrapper>
        <InputIconWrapper>
          <img src={SearchHeadsupIcon} alt="search" />
        </InputIconWrapper>
        <StyledInput
          ref={reference}
          value={value}
          onChange={event => onValueChange(event?.target?.value)}
          placeholder="Search"
        />
        <ClearButtonWrapper>
          <ClearButton type="button" onClick={clearInput}>
            Clear
          </ClearButton>
        </ClearButtonWrapper>
      </GlobalSearchInputWrapper>
    );
  },
);

export default GlobalSearchInput;
