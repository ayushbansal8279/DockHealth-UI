import React, { useState } from 'react';
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

    const [clearVisible, setClearVisible] = useState(value ?? false);

    const clearInput = () => {
      onClear();
      setClearVisible(false);

      // eslint-disable-next-line no-param-reassign
      if (!hasValueProps) reference.current.value = '';
    };

    const onInputChange = event => {
      const inputValue = event?.target?.value;
      if (inputValue) {
        setClearVisible(true);
      } else {
        setClearVisible(false);
      }
      onValueChange(inputValue);
    };

    const inputProps = {
      onChange: onInputChange,
      placeholder: 'Search',
    };

    if (hasValueProps) inputProps.value = value;

    return (
      <GlobalSearchInputWrapper>
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
      </GlobalSearchInputWrapper>
    );
  },
);

export default GlobalSearchInput;
