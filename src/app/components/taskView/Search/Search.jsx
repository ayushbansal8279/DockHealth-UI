import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import SearchClearIcon from 'img/search-clear.svg';
import SearchHeadsupIcon from 'img/search-headsup.svg';

import { StyledTextField, StyledAdornment, ClearButton } from './styled';

const Search = ({
  className,
  onChange,
  initialValue,
  variant,
  autoFocus,
  fullWidth,
  noBackground,
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
      noBackground={noBackground}
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
