import { InputAdornment, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import SearchClearIcon from '../../img/search-clear.svg';
import SearchHeadsupIcon from '../../img/search-headsup.svg';
import palette, { opacify } from '../../palette';

const ClearButton = styled.div`
  align-items: center;
  display: inline-flex;
  cursor: pointer;

  > img {
    height: 15px;
    max-height: 15px;
    max-width: 15px;
    min-height: 15px;
    min-width: 15px;
    width: 15px;
  }
`;

const StyledTextField = styled(TextField)`
  && {
    background-color: ${palette.white};
    border-radius: 0.25rem;
    color: ${palette.brightBlue};
    height: 2.5rem;
    ${props => props.fullWidth && 'width: 100%;'}

    & .MuiInputBase-root {
      border: 0.0625rem solid
        ${props =>
          props.variant === 'outlined'
            ? palette.coolGrey3
            : opacify(palette.coolGrey3, 0)};
      border-radius: 0;
      height: 100%;
      padding: 0 0.25rem 0 0.5rem;
      transition: all 0.25s ease-in-out;
      width: ${props => (props.fullWidth ? '100%' : '8.75rem')};

      &::after,
      &::before {
        border: 0 !important;
      }
    }

    & .MuiInputBase-root.Mui-focused {
      border: 0.0625rem solid ${palette.coolGrey3};
      width: ${props => (props.fullWidth ? '100%' : '16.8125rem')};
    }

    & input {
      caret-color: ${palette.brightBlue};
      color: ${palette.coolGrey1};
      height: 100%;
      border: none;
      box-shadow: none;
      background: none;
      font-size: 0.875rem;
      padding: 0;

      &::placeholder {
        color: ${palette.brightBlue};
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
    width: '1.125rem',
  },
  positionEnd: {
    margin: '0 0.25rem',
  },
  visible: {
    visibility: 'initial',
  },
  invisible: {
    visibility: 'hidden',
  },
})(({ position, visible = true, classes, ...props }) => {
  const className = clsx(
    classes.root,
    position === 'end' && classes.positionEnd,
    visible ? classes.visible : classes.invisible,
  );

  return (
    <InputAdornment className={className} position={position} {...props} />
  );
});

const Search = ({
  className,
  onChange,
  initialValue,
  variant,
  autoFocus,
  fullWidth,
  value,
  ...otherInputProps
}) => {
  const onClearClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      onChange({ target: { value: '' } });
    },
    [onChange],
  );

  return (
    <StyledTextField
      onChange={onChange}
      placeholder="Search"
      className={className}
      fullWidth={fullWidth}
      variant={variant}
      InputProps={{
        startAdornment: (
          <StyledAdornment position="start" disablePointerEvents>
            <img src={SearchHeadsupIcon} alt="Search icon" />
          </StyledAdornment>
        ),
        endAdornment: (
          <StyledAdornment
            position="end"
            disablePointerEvents={false}
            visible={Boolean(value)}
          >
            <ClearButton onClick={onClearClick}>
              <img alt="clear" src={SearchClearIcon} />
            </ClearButton>
          </StyledAdornment>
        ),
        'aria-label': 'Search',
        type: 'search',
        defaultValue: initialValue,
        autoFocus,
        value,
        ...otherInputProps,
      }}
    />
  );
};

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Search;
