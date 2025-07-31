import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
import {
  SearchInput,
  SearchInputWrapper,
  CancelIcon,
  ClearButton,
} from './styled';

const HeaderSearch = (props) => {
  const {
    value,
    onChange,
    focused,
    setFocused,
    unsetFocused,
    needEnterToSearch,
  } = props;
  const inputReference = useRef(null);
  const [inputValue, setInputValue] = useState(value || '');
  const [showEnterMessage, setShowEnterMessage] = useState(false);
  // const [focused, setFocused, unsetFocused] = useBoolean(false);

  // Sync internal state with external value prop
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleClear = () => {
    setInputValue('');
    setShowEnterMessage(false);
    onChange('');
    inputReference.current.focus();
  };

  const handleInputChange = (event) => {
    const newValue = event.target?.value || '';
    setInputValue(newValue);
    if (needEnterToSearch) {
      setShowEnterMessage(newValue?.length > 0);
      if (newValue?.length === 0) {
        // to reset search when user clears the input
        onChange(newValue);
      }
    } else {
      onChange(newValue);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setShowEnterMessage(false);
      onChange(inputValue);
    }
  };

  return (
    <Box>
      <SearchInputWrapper wide={inputValue || focused}>
        <SearchIcon sx={{ color: palette.coolGrey2 }} />
        <Box mx={0.3} />
        <SearchInput
          ref={inputReference}
          value={inputValue}
          placeholder="Search"
          onChange={handleInputChange}
          onFocus={setFocused}
          onBlur={unsetFocused}
          onKeyDown={handleKeyDown}
        />
        {inputValue && (
          <>
            <Box mx={0.3} />
            <ClearButton type="button" onClick={handleClear}>
              <CancelIcon />
            </ClearButton>
          </>
        )}
      </SearchInputWrapper>
      {showEnterMessage && (
        <Typography
          variant="caption"
          sx={{
            color: palette.coolGrey2,
            fontSize: '0.75rem',
            mt: 0.5,
            ml: 1,
          }}
        >
          Press Enter to search
        </Typography>
      )}
    </Box>
  );
};

export default HeaderSearch;
