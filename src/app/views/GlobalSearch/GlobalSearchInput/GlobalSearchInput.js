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
    const hasValueProps = value !== undefined;

    const clearInput = () => {
      onValueChange('');
      onClear();

      // eslint-disable-next-line no-param-reassign
      if (!hasValueProps) reference.current.value = '';
    };

    const inputProps = {
      onChange: event => onValueChange(event?.target?.value),
      placeholder: 'Search',
    };

    if (hasValueProps) inputProps.value = value;

    return (
      <GlobalSearchInputWrapper>
        <InputIconWrapper>
          <img src={SearchHeadsupIcon} alt="search" />
        </InputIconWrapper>
        <StyledInput ref={reference} {...inputProps} />
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
