import React, { useRef } from 'react';
import { Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useBoolean } from 'hooks/useBoolean';
import {
  SearchInput,
  SearchInputWrapper,
  CancelIcon,
  ClearButton,
} from './styled';

const HeaderSearch = props => {
  const { value, onChange } = props;
  const inputReference = useRef(null);
  const [focused, setFocused, unsetFocused] = useBoolean(false);

  const handleClear = () => {
    onChange('');
    inputReference.current.focus();
  };

  return (
    <SearchInputWrapper wide={value || focused}>
      <SearchIcon />
      <Box mx={0.3} />
      <SearchInput
        ref={inputReference}
        value={value}
        placeholder="Search"
        onChange={event => onChange(event.target?.value || '')}
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
