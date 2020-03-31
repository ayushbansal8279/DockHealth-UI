import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import SearchDark from '../../img/search-dark.svg';
import palette from '../../palette';

const SearchTextField = styled(TextField)`
  && {
    width: 100%;
    height: 48px;
    border-radius: 2px;
    background: ${palette.white};
  }

  && .input-base {
    padding: 0;
  }

  && input {
    height: 100%;
    border: none;
    box-shadow: none;
    background: none;
    background: none;
    padding: 16px 14px;
  }

  && fieldset {
    border: none;
    top: 0;
  }
`;

const Header = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  padding: 0 10px;
  width: 494px;
  height: 73px;
`;

const SearchHeader = ({ handleSearch, handleSearchToggle }) => (
  <Header>
    <SearchTextField
      autoFocus
      onChange={handleSearch}
      id="member-search"
      placeholder="Search"
      variant="outlined"
      InputProps={{
        classes: { root: 'input-base' },
        'aria-label': 'Search',
        type: 'search',
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleSearchToggle} aria-label="Close search">
              <BackIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end" style={{ pointerEvents: 'none' }}>
            <div style={{ margin: '0 12px 0 0', width: 21, height: 22 }}>
              <img src={SearchDark} alt="" />
            </div>
          </InputAdornment>
        ),
      }}
    />
  </Header>
);

SearchHeader.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  handleSearchToggle: PropTypes.func.isRequired,
};

export default SearchHeader;
