import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchHeadsupIcon from '../../img/search-headsup.svg';

const StyledTextField = styled(TextField)`
  && {
    background-color: #fff;
    border-radius: 0.25rem;
    height: 2rem;
    width: 16.8125rem;

    & input {
      height: 2rem;
      border: none;
      box-shadow: none;
      background: none;
      padding: 0.5rem;
      padding-left: 0;
      font-size: 0.875rem;

      &::placeholder {
        color: #2e3a43;
        opacity: 1;
      }
    }

    & fieldset {
      border: none;
      top: 0;
    }
  }
`;

const Search = ({ onChange }) => (
  <StyledTextField
    onChange={onChange}
    placeholder="Search"
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start" style={{ pointerEvents: 'none' }}>
          <img src={SearchHeadsupIcon} alt="Search icon" />
        </InputAdornment>
      ),
      style: {
        paddingLeft: '0.5rem',
      },
      'aria-label': 'Search',
      type: 'search',
    }}
  />
);

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Search;
