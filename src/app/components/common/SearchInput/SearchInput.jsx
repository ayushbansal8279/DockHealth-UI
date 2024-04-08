import React, { useRef } from 'react';
import SearchHeadsupIcon from 'img/search-headsup.svg';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import {
  StyledInput,
  SearchInputWrapper,
  InputIconWrapper,
  ClearButtonWrapper,
  ClearButton,
} from './styled';
import palette from '../../../styles/palette';
import { CancelIcon } from '../../template/HeaderSearch/styled';
import useBoolean from '@/app/hooks/useBoolean';

const SearchInput = React.forwardRef(
  (
    {
      isPatientSearchInput,
      value,
      onValueChange,
      onFocus,
      onBlur,
      onKeyEnter,
      placeholder = null,
    },
    reference,
  ) => {
    const innerInputReference = useRef(null);
    const inputReference = reference || innerInputReference;
    const [focused, setFocused, unsetFocused] = useBoolean(false);

    const clearInput = () => {
      onValueChange('');

      // eslint-disable-next-line no-unused-expressions
      inputReference.current?.focus();
    };

    const onInputChange = (event) => {
      const inputValue = event?.target?.value;
      onValueChange(inputValue);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Enter') {
        onKeyEnter();
      }
    };

    const inputProps = {
      value,
      onChange: onInputChange,
      placeholder: placeholder || 'Search',
      onFocus,
      onBlur,
      onKeyDown,
    };

    return (
      <SearchInputWrapper
        wide={value || focused}
        isPatientSearchInput={isPatientSearchInput}
      >
        {/* <InputIconWrapper>
          <img src={SearchHeadsupIcon} alt="search" />
        </InputIconWrapper> */}
        <SearchIcon sx={{ color: palette.coolGrey2 }} />
        <Box mx={0.3} />
        <StyledInput
          value={value}
          ref={inputReference}
          {...inputProps}
          onFocus={setFocused}
          onBlur={unsetFocused}
        />

        {value && (
          // <ClearButtonWrapper>
          <>
            <Box mx={0.3} />
            <ClearButton type="button" onClick={clearInput}>
              {/* Clear */}
              <CancelIcon />
            </ClearButton>
          </>
          // </ClearButtonWrapper>
        )}
      </SearchInputWrapper>
    );
  },
);

export default SearchInput;
