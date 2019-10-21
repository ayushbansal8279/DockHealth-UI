import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  && {
    width: 226px;
    height: 37px;
    border: solid 1px #aab8c3;
    border-radius: 57px;
    background: #fff;
  }

  && input {
    height: 28px;
    border: none;
    box-shadow: none;
    background: none;
    /* autocomplete */
    padding: 17px 0 18px 0;
    border-top-right-radius: 57px;
    border-bottom-right-radius: 57px;
    font-size: 16px;
  }
  /**/
  && fieldset {
    border: none;
    top: 0;
  }
`;

const PatientsSearch = ({ onChange, style }) => (
  <StyledTextField
    onChange={onChange}
    style={style}
    id="search"
    variant="outlined"
    placeholder="Search patients"
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

PatientsSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default PatientsSearch;
