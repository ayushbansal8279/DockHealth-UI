import React, { useRef } from 'react';
import { Box } from '@mui/material';
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
  const { value, onChange, focused, setFocused, unsetFocused } = props;
  const inputReference = useRef(null);
  // const [focused, setFocused, unsetFocused] = useBoolean(false);

  const handleClear = () => {
    onChange('');
    inputReference.current.focus();
  };

  return (
    <SearchInputWrapper wide={value || focused}>
      <SearchIcon sx={{ color: palette.coolGrey2 }} />
      <Box mx={0.3} />
      <SearchInput
        ref={inputReference}
        value={value}
        placeholder="Search"
        onChange={(event) => onChange(event.target?.value || '')}
        onFocus={setFocused}
        onBlur={unsetFocused}
      />
      {value && (
        <>
          <Box mx={0.3} />
          <ClearButton type="button" onClick={handleClear}>
            <CancelIcon />
          </ClearButton>
        </>
      )}
    </SearchInputWrapper>
  );
};

export default HeaderSearch;
