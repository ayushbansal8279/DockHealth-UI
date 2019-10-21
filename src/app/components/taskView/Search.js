import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

const StyledTextField = styled(TextField)`
  && {
    width: 226px;
    height: 30px;
    border: solid 1px #aab8c3;
    border-radius: 57px;
  }

  && input {
    height: 28px;
    border: none;
    box-shadow: none;
    background: none;
    /* autocomplete */
    padding: 14px;
    border-top-right-radius: 57px;
    border-bottom-right-radius: 57px;
    font-size: 14px;
  }

  && fieldset {
    border: none;
    top: 0;
  }
`;

const Search = ({ onChange, style }) => (
  <StyledTextField
    onChange={onChange}
    style={style}
    id="search"
    variant="outlined"
    placeholder="Search"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start" style={{ pointerEvents: 'none' }}>
          <SearchIcon style={{ color: '969b9f' }} />
        </InputAdornment>
      ),
      'aria-label': 'Search',
      type: 'search',
    }}
  />
);

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Search;
