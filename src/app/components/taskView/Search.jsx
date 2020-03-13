import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import SearchHeadsupIcon from '../../img/search-headsup.svg';

const StyledTextField = styled(TextField)`
  && {
    background-color: #fff;
    border-radius: 0.25rem;
    color: #00a2e5;
    height: 2.5rem;
    ${props => props.fullWidth && 'width: 100%;'}

    & .MuiInputBase-root {
      border: 0.0625rem solid
        ${props => (props.variant === 'outlined' ? '#e5e9f2' : '#e5e9f200')};
      border-radius: 0;
      height: 100%;
      transition: all 0.25s ease-in-out;
      width: ${props => (props.fullWidth ? '100%' : '6.75rem')};

      &::after,
      &::before {
        border: 0 !important;
      }
    }

    & .MuiInputBase-root.Mui-focused {
      border: 0.0625rem solid #e5e9f2;
      width: ${props => (props.fullWidth ? '100%' : '16.8125rem')};
    }

    & input {
      caret-color: #00a2e5;
      color: #8492a4;
      height: 100%;
      border: none;
      box-shadow: none;
      background: none;
      padding: 0.5rem;
      padding-left: 0;
      font-size: 0.875rem;

      &::placeholder {
        color: #00a2e5;
        font-size: 1rem;
        opacity: 0.8;
        text-transform: uppercase;
      }
    }

    & fieldset {
      border: none;
      top: 0;
    }
  }
`;

const StyledAdornment = withStyles({
  root: {
    height: '1.125rem',
    minHeight: '1.125rem',
    minWidth: '1.125rem',
    pointerEvents: 'none',
    width: '1.125rem',
  },
})(InputAdornment);

const Search = ({
  className,
  onChange,
  initialValue,
  variant,
  autoFocus,
  fullWidth,
  ...otherInputProps
}) => (
  <StyledTextField
    onChange={onChange}
    placeholder="Search"
    className={className}
    fullWidth={fullWidth}
    variant={variant}
    InputProps={{
      startAdornment: (
        <StyledAdornment position="start">
          <img src={SearchHeadsupIcon} alt="Search icon" />
        </StyledAdornment>
      ),
      style: {
        paddingLeft: '0.5rem',
      },
      'aria-label': 'Search',
      type: 'search',
      defaultValue: initialValue,
      autoFocus,
      ...otherInputProps,
    }}
  />
);

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Search;
